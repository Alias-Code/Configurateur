import UserOrders from "../../models/UserOrders.js";
import User from "../../models/User.js";
import UserAddresses from "../../models/UserAddresses.js";
import dotenv from "dotenv";
import { S3 } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { sendCheckoutMail } from "../mailController.js";
import { generateInvoice } from "../invoiceController.js";

dotenv.config();

// --- CONFIG UTILS ---

const calculateItemTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * (item.quantity || 1);
  }, 0);
};

const calculateConfigTotal = (config) => {
  if (!config) return 0;

  let total = config.facade?.price || 0;

  // Calculate total for each category
  const categories = ["cylindres", "retros", "prises", "gravures"];
  categories.forEach((category) => {
    config.facades.forEach((facade) => {
      if (facade[category]) {
        total += calculateItemTotal(facade[category]);
      }
    });
  });

  return total * config.quantity;
};

// --- SAVE IMAGE ---

export const saveImage = async (userId, base64Image) => {
  const s3 = new S3({
    region: "eu-north-1",
    credentials: fromEnv(),
  });

  const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const key = `images/${userId}-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;

  const params = {
    Bucket: "cg-configpreview",
    Key: key,
    Body: buffer,
    ContentType: "image/png",
    ACL: "public-read",
  };

  try {
    await s3.putObject(params);

    const region = await s3.config.region();
    const link = `https://${params.Bucket}.s3.${region}.amazonaws.com/${key}`;

    return link;
  } catch (err) {
    console.error("Erreur lors de l'upload:", err);
    throw err;
  }
};

// --- CHECKOUT ORDER ---

export const checkoutOrder = async (req, res) => {
  const { note, formAddress, selectedDelivery, selectedPayment, selectedRelayPoint, cart } = req.body;
  const userId = req.user.userId;

  try {
    // --- VERIFICATIONS ---

    const { passwd, ...user } = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (!selectedDelivery) {
      return res.status(400).json({ message: "Méthode d'expédition requise." });
    }

    if (!selectedPayment) {
      return res.status(400).json({ message: "Méthode de paiement requise." });
    }

    if (selectedDelivery === "Point Relai - Mondial Relay" && !selectedRelayPoint) {
      return res.status(400).json({ message: "Point relais non sélectionné." });
    }

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ message: "Le panier est vide." });
    }

    // --- CALCUL DU MONTANT TOTAL ---

    let totalAmount = 0;
    const configurations = []; // Liste des configurations pour `cg_order_configurations`
    const orderItems = []; // Liste des articles pour `cg_order_items`

    for (const [key, config] of Object.entries(cart)) {
      // Utilisation de `calculateConfigTotal` pour calculer le montant total pour cette configuration
      totalAmount += calculateConfigTotal(config);

      // Préparer les configurations
      configurations.push({
        configReference: key,
        configQuantity: config.quantity,
        configColor: config.couleur.name,
        configFacade: config.facade.name,
        configImage: config.image,
        items: config.facades.flatMap((facade, index) => {
          const items = [];

          // Parcourir les catégories pour récupérer les items
          ["cylindres", "retros", "prises", "variateurs", "liseuses", "gravures"].forEach((category) => {
            facade[category]?.forEach((item) => {
              // Ajouter les informations de chaque item pour cette catégorie
              items.push({
                reference: item.id,
                quantity: item.quantity, // Quantité spécifique pour chaque item
                unit_price: item.price,
                facade_number: index + 1,
                category: category, // Ajout de la catégorie pour traçabilité
              });
            });
          });

          return items; // Retourne tous les items pour cette façade
        }),
      });
    }

    // --- INSERTION DE LA COMMANDE ---

    const orderNumber = await UserOrders.getOrderNumber();

    const orderData = {
      id_customer: userId,
      total_amount: totalAmount,
      shipping_method: selectedDelivery,
      payment_method: selectedPayment,
      order_number: orderNumber,
      note,
    };

    const orderId = await UserOrders.createOrder(orderData);

    const configImageSaver = [];

    // --- INSERTION DES CONFIGURATIONS ET ARTICLES ---

    for (const configuration of configurations) {
      const { configReference, configQuantity, configColor, configFacade, configImage, items } = configuration;

      // POUR LA BOUCLE ON SAUVEGARDE A CHAQUE FOIS L'IMAGE ET PUSH LE RÉSULTAT (LIEN) DANS UN TABLEAU

      const configImageLink = await saveImage(userId, configImage);

      configImageSaver.push(configImageLink);

      // Ajouter la configuration à `cg_order_configurations`
      const configId = await UserOrders.createOrderConfiguration(
        orderId,
        configReference,
        configQuantity,
        configColor,
        configFacade,
        configImageLink
      );

      // Ajouter les articles à `cg_order_items`
      for (const item of items) {
        await UserOrders.createOrderItem(orderId, configId, item);
      }
    }

    const userAddressInformations = formAddress.address ? formAddress : UserAddresses.findUserAddress(userId);
    const userInformations = await User.findById(userId);

    // --- GENERATE & SAVE INVOICE ---

    const pdfBytes = await generateInvoice(null, null, {
      userId: user.id_customer,
      orderId: orderNumber,
      configImageSaver,
      cart,
    });

    // --- SEND MAIL ---

    await sendCheckoutMail(cart, orderData, userAddressInformations, userInformations, pdfBytes, configImageSaver);

    return res.status(201).json({ message: "Commande créée avec succès.", orderNumber });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Erreur serveur. ${error.message}`, error: error.message });
  }
};
