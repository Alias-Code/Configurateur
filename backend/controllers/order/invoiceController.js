import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import User from "../../models/User.js";
import UserAddresses from "../../models/UserAddresses.js";
import { checkAuth } from "../authController.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { S3 } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

// --- COLUMN POSITIONS ---

const columnPositions = {
  index: 34,
  configImage: 50,
  description: 135,
  quantity: 401,
  prixHT: 434,
  total: 477,
  priceInformations: 516,
};

// --- CALCULATION FUNCTIONS ---

const calculateItemTotal = (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const calculateConfigTotal = (config) => {
  if (!config) return 0;
  const facadeTotal = config.facade?.price || 0;
  const categories = ["cylindres", "retros", "prises", "gravures"];

  return (
    categories.reduce((total, category) => {
      config.facades.forEach((facade) => {
        if (facade[category]) total += calculateItemTotal(facade[category]);
      });
      return total;
    }, facadeTotal) * config.quantity
  );
};

function adjustPositionForNumber(number, type) {
  const numberString = Math.floor(number).toString();
  const numberLength = numberString.length;

  let adjustment = 0;

  // --- DECALAGE ---

  if (type === "quantity" && numberLength === 2) {
    adjustment = 3;
  } else if (numberLength === 3) {
    adjustment = 5;
  } else if (numberLength === 4) {
    adjustment = 10;
  } else if (numberLength === 5) {
    adjustment = 15;
  } else {
    adjustment = 0;
  }

  // --- AJUSTEMENT FINAL ---

  if (type === "quantity") {
    return columnPositions.quantity - adjustment;
  } else if (type === "price") {
    return columnPositions.priceInformations - adjustment;
  } else if (type === "prixht") {
    if (numberLength === 3) adjustment -= 2;
    return columnPositions.prixHT - adjustment;
  } else if (type === "total") {
    if (numberLength === 3) adjustment -= 2;
    return columnPositions.total - adjustment;
  } else {
    return null;
  }
}

// --- SAVE INVOICE ---

export const saveInvoice = async (pdfBytes, userId, orderId, invoiceNumber, source) => {
  const s3 = new S3({
    region: "eu-north-1",
    credentials: fromEnv(),
  });

  const params = {
    Bucket: "cg-invoice",
    Key: `invoices/${userId}/Facture_${source === "Commande" ? orderId : invoiceNumber}.pdf`,
    Body: pdfBytes,
    ContentType: "application/pdf",
    ACL: "private",
    Metadata: {
      "x-amz-meta-source": source,
      "x-amz-meta-date": new Date().toISOString(),
      ...(source === "Commande"
        ? { "x-amz-meta-orderid": String(orderId) }
        : { "x-amz-meta-invoicenumber": invoiceNumber }),
    },
  };

  try {
    await s3.putObject(params);
    console.log("Facture uploadée avec succès");
  } catch (err) {
    console.error("Erreur lors de l'upload:", err);
  }
};

// --- GET INVOICES ---

export const getInvoices = async (req, res) => {
  const userId = req.user.userId;

  const isAuthenticated = await checkAuth(userId);

  if (!isAuthenticated) {
    return res.status(401).json({ message: "Vous devez être connecté pour récupérer vos devis." });
  }

  try {
    const s3 = new S3({
      region: "eu-north-1",
      credentials: fromEnv(),
    });

    const params = {
      Bucket: "cg-invoice",
      Prefix: `invoices/${userId}/`,
    };

    const { Contents } = await s3.listObjectsV2(params);

    if (!Contents || Contents.length === 0) {
      return res.status(404).json({ message: "Aucun devis trouvé pour cet utilisateur." });
    }

    // Pour chaque fichier, on récupère les métadonnées et générer l'URL signée
    const invoices = await Promise.all(
      Contents.map(async (file) => {
        // Récupérer les métadonnées
        const headParams = {
          Bucket: "cg-invoice",
          Key: file.Key,
        };
        const headData = await s3.headObject(headParams);

        // Récupérer l'URL signée
        const command = new GetObjectCommand(headParams);
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return {
          key: file.Key,
          lastModified: file.LastModified,
          size: file.Size,
          source: headData.Metadata["x-amz-meta-source"],
          orderId: headData.Metadata["x-amz-meta-orderid"],
          signedUrl,
        };
      })
    );

    res.status(201).json(invoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des devis." });
  }
};

// --- GENERATE INVOICE (FONCTION APPELÉE SOIT PAR APPEL SOIT PAR REQUÊTTE HTTP) ---

export const generateInvoice = async (req, res, params) => {
  const isHttpCall = req && res;

  // --- DETERMINE INPUT VALUES ---

  const userId = isHttpCall ? req.user?.userId : params.userId;
  const cart = isHttpCall ? req.body?.cart : params.cart;
  const configImageSaver = isHttpCall ? req.body?.configImageSaver : params.configImageSaver;

  if (!userId || !cart) {
    throw new Error("Missing required data: userId or cart");
  }

  // --- CHECK AUTH ---

  const isAuthenticated = await checkAuth(userId);

  if (!isAuthenticated) {
    return res.status(401).json({ message: "Vous devez être connecté pour enregistrer un devis." });
  }

  try {
    // --- GENERATE INVOICE NUMBER ---

    const s3 = new S3({
      region: "eu-north-1",
      credentials: fromEnv(),
    });

    const { Contents } = await s3.listObjectsV2({
      Bucket: "cg-invoice",
      Prefix: `invoices/${userId}/`,
    });

    const invoiceNumber = Contents && Contents.length > 0 ? String(Object.keys(Contents).length + 1) : "1";

    // --- LOAD USER AND TEMPLATE ---

    const user = await User.findById(userId);
    const userAddress = await UserAddresses.findUserAddress(userId);

    const selectedAddress =
      userAddress.find((address) => address.alias === "sync") ||
      userAddress.find((address) => address.alias === "unsync-shipping") ||
      null;

    const templatePath = path.join(process.cwd(), "public", "invoice_template.pdf");
    const pdfDoc = await PDFDocument.load(await fs.readFile(templatePath));

    // --- FONT AND STYLE SETTINGS ---

    const [helveticaFont, helveticaBold] = await Promise.all([
      pdfDoc.embedFont(StandardFonts.Helvetica),
      pdfDoc.embedFont(StandardFonts.HelveticaBold),
    ]);

    const globalStyle = { size: 9, font: helveticaFont, color: rgb(0, 0, 0) };
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize();
    const dateFr = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const drawText = (text, options) => page.drawText(text, { ...globalStyle, ...options });

    // --- HEADER ---

    const headerTitle = isHttpCall
      ? `DEVIS ${invoiceNumber.toString().padStart(5, "0")}`
      : `DEVIS COMMANDE N°${params.orderId}`;

    drawText(headerTitle, { font: helveticaBold, size: 12, x: 315, y: height - 70 });
    drawText(dateFr, { font: helveticaBold, size: 12, x: 315, y: height - 85 });
    drawText(
      `${user.lastname.toUpperCase()} ${user.firstname.toUpperCase()} ${
        user.company && `- ${user.company} (${user.siret})`
      }`,
      {
        font: helveticaBold,
        size: 13,
        x: 315,
        y: height - 120,
      }
    );
    drawText(user.phone, { font: helveticaBold, x: 315, y: height - 145 });
    drawText(user.email, { x: 315, y: height - 155 });

    if (!selectedAddress) {
      drawText("Adresse non spécifiée", { font: helveticaBold, x: 315, y: height - 170 });
    } else {
      drawText("Adresse de livraison :", { x: 315, y: height - 175 });
      drawText(selectedAddress.address1, { x: 315, y: height - 190 });
      drawText(selectedAddress.postcode + " " + selectedAddress.city, { x: 315, y: height - 200 });
      drawText(selectedAddress.address2 || "", { x: 315, y: height - 210 });
    }

    // --- CART RENDER ---

    let y = height - 305;
    let totalTTC = 0;

    const cartArray = Object.values(cart);

    for (const [configIndex, config] of Object.entries(cartArray)) {
      // INCREMENTER TOTAL PAR PRIX CONFIG UNITAIRE

      const configTotal = calculateConfigTotal(config);
      totalTTC += configTotal;

      // INDEX

      const indexNumber = parseInt(configIndex, 10) + 1;
      drawText(indexNumber.toString(), { x: columnPositions.index, y });

      // CONFIG IMAGE

      const imageBytes = await fetch(configImageSaver[configIndex])
        .then((res) => {
          if (!res.ok) {
            throw new Error("Image non accessible");
          }
          return res.arrayBuffer();
        })
        .catch((error) => {
          console.error("Erreur de téléchargement de l'image:", error);
          return null;
        });

      const image = await pdfDoc.embedJpg(new Uint8Array(imageBytes));

      page.drawImage(image, {
        x: columnPositions.configImage,
        y: y - 67,
        width: 75,
        height: 75,
      });

      // TITLE OF THE CONFIG
      const facadeName = config.facade?.name || "N/A";
      const couleurName = config.couleur?.name || "N/A";
      drawText(`${facadeName} - ${couleurName}`, { font: helveticaBold, size: 10, x: columnPositions.description, y });

      // QUANTITY
      drawText(config.quantity.toString(), { x: adjustPositionForNumber(config.quantity, "quantity"), y });

      // PRIX HT
      drawText(((config.facade?.price * config.quantity) / 1.2 || 0).toFixed(2), {
        x: adjustPositionForNumber(((config.facade?.price * config.quantity) / 1.2 || 0).toFixed(2), "prixht"),
        y,
      });

      // TOTAL
      drawText((config.facade?.price * config.quantity || 0).toFixed(2), {
        x: adjustPositionForNumber((config.facade?.price * config.quantity || 0).toFixed(2), "total"),
        y,
      });
      y -= 15;

      // DETAILS FACADE
      config.facades.forEach((facade, index) => {
        if (["cylindres", "retros", "prises", "gravures"].some((category) => facade[category]?.length)) {
          // drawText(`Plaque ${index + 1}`, { x: columnPositions.description, y });
          y -= 0;

          ["cylindres", "retros", "prises", "gravures"].forEach((category) => {
            facade[category]?.forEach((item) => {
              drawText(item.name, { x: columnPositions.description, y: y - 0 });
              drawText(item.quantity.toString(), { x: columnPositions.quantity, y });
              drawText(item.price.toFixed(2), { x: columnPositions.prixHT, y });
              drawText((item.price * item.quantity).toFixed(2), { x: columnPositions.total, y });
              y -= 15;
            });
          });

          drawText(`Sous-total pour Facade N°${index + 1}`, {
            size: 9,
            font: helveticaBold,
            x: columnPositions.description,
            y,
          });

          // SOUS TOTAL NUMBER
          drawText(configTotal.toFixed(2), {
            font: helveticaBold,
            x: adjustPositionForNumber(configTotal.toFixed(2), "total"),
            y,
          });
          y -= 20;
        }
      });

      y -= 10;
    }

    // --- TOTALS ---

    const priceHT = totalTTC / 1.2;
    const tvaAmount = totalTTC * 0.2;

    const adjustedPricePosition = adjustPositionForNumber(priceHT, "price");
    const adjustedTvaPosition = adjustPositionForNumber(tvaAmount, "price");
    const adjustedTotalTTCPosition = adjustPositionForNumber(totalTTC, "price");

    drawText(priceHT.toFixed(2), { font: helveticaBold, x: adjustedPricePosition, y: 198 });
    drawText(tvaAmount.toFixed(2), { x: adjustedTvaPosition + 2.5, size: 8, y: 189 });
    drawText(totalTTC.toFixed(2), { font: helveticaBold, x: adjustedTotalTTCPosition, y: 179 });

    // --- MOYEN DE PAIEMENT ---

    drawText("Carte Bancaire", { font: helveticaBold, x: 130, y: 163 });

    // --- SAVE PDF ---

    const pdfBytes = await pdfDoc.save();

    if (res) {
      // IF RES : INVOICE GENERATION WITHOUT ORDER

      await saveInvoice(pdfBytes, userId, null, invoiceNumber, "Génération");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=Facture_${invoiceNumber}.pdf`);
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Expires", "0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Surrogate-Control", "no-store");
      res.send(Buffer.from(pdfBytes));
    } else {
      // IF NOT RES : INVOICE BY ORDER CHECKOUT

      await saveInvoice(pdfBytes, userId, params.orderId, null, "Commande");
    }

    return pdfBytes;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw new Error("Erreur serveur : " + error.message);
  }
};
