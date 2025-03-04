import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function generateEmailHTML(cart, orderData, userAddressInformations, userInformations, configImageSaver) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <style>
        td {
          background: white !important;
          padding: 0;
        }
      </style>
    </head>
      <body>
        <div
          style="
      background-color: #ffffff;
      width: 650px;
      margin: auto;
      font-family: 'Open-sans', sans-serif;
      color: #555454;
      font-size: 13px;
      line-height: 18px;
    "
          bgcolor="#ffffff"
          width="650">
          <table class="m_-8398259371414921749table" style="width: 100%; margin-top: 10px" width="100%">
            <tbody>
              <tr>
                <td style="width: 20px" width="20">&nbsp;</td>
                <td align="center">
                  <table class="m_-8398259371414921749table" bgcolor="#ffffff" style="width: 100%" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" class="m_-8398259371414921749logo" style="border-bottom: 4px solid #333333">
                          <a
                            title="Lumicrea"
                            href="https://lumicrea.fr/"
                            style="color: #337ff1"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://lumicrea.fr/&amp;source=gmail&amp;ust=1732703655010000&amp;usg=AOvVaw3aY8yKgCXYNF-fUDXNbzgP">
                            <img
                              src="https://lumicrea.fr/img/cms/lumicrea_animate.gif"
                              alt=""
                              style="width: 100%; margin-bottom: 5px; border-radius: 5px" />
                          </a>
                        </td>
                      </tr>

                      <tr>
                        <td class="m_-8398259371414921749space_footer" style="padding: 0 !important">&nbsp;</td>
                      </tr>

                      <tr>
                        <td align="center" class="m_-8398259371414921749titleblock">
                          <font size="2" face="Open-sans, sans-serif" color="#555454">
                            <span
                              class="m_-8398259371414921749title"
                              style="font-weight: 500; font-size: 28px; text-transform: uppercase; line-height: 33px; padding-top: 25px; padding-bottom: 5px"
                              >Bonjour Alias Becili,</span
                            ><br />
                            <span
                              class="m_-8398259371414921749subtitle"
                              style="font-weight: 500; font-size: 16px; text-transform: uppercase; line-height: 25px"
                              >Merci d'avoir effectué vos achats sur Lumicrea !</span
                            >
                          </font>
                        </td>
                      </tr>
                      <tr>
                        <td class="m_-8398259371414921749space_footer" style="padding: 0 !important">&nbsp;</td>
                      </tr>
                      <tr>
                        <td
                          class="m_-8398259371414921749box"
                          bgcolor="#f8f8f8">
                          <table class="m_-8398259371414921749table" style="width: 100%" width="100%">
                            <tbody>
                              <tr>
                                <td>
                                  <font size="2" face="Open-sans, sans-serif" color="#555454">
                                    <p
                                      style="
                                  margin: 3px 5px 0px 0px;
                                  text-transform: uppercase;
                                  font-weight: 500;
                                  font-size: 18px;
                                  padding-bottom: 10px;
                                  margin-bottom: 10px;
                                  color: black !important;
                                  border-bottom: 1px solid black;
                                ">
                                      DÉTAILS DE LA COMMANDE
                                    </p>

                                    <span style="color: #777777;">
                                      <span style="color: #333333;"><strong>Commande :</strong></span>
                                      # ${orderData.order_number} passée le ${formatDate()}<br /><br />
                                      <span style="color: #333333"><strong>Status :</strong></span> ${
                                        orderData.payment_method === "Carte Bancaire"
                                          ? "Confirmée"
                                          : "Attente De Virement"
                                      }
                                    </span>
                                  </font>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- RENDER -->

                      <div style="color: white; font-family: Arial, sans-serif;">
                      <p style="font-size: 18px; color: black !important">RÉSUMÉ DE LA COMMANDE</p>

                        ${Object.entries(cart)
                          .map(
                            ([configKey, config], index) => `
                          <div style="display: flex; align-items: center !important; gap: 1rem !important; margin-bottom: 1rem;">

                            <img style="margin-top: 0.5rem; margin-right: 0.75rem; width: 9rem; height: 9rem; " src="${
                              configImageSaver[index]
                            }" alt"Aperçu de la configuration"/>

                            <div style="width: 100%; color: black !important;">
                              <hr style="margin-bottom: 0.5rem; border: 0.5px solid black;" />

                              <!-- Configuration Header -->
                              <p style="font-size: 0.6rem; font-weight: bold; margin: 0px !important; text-decoration: underline; margin-bottom: 0.2rem;">Facade</p>
                              <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                  <p style="font-size: 0.6rem; margin: 0;">${
                                    config.facade.name.split(" ")[1]
                                  } - ${config.couleur.name.replace("Couleur ", "")}</p> 
                                </div>
                                <div style="margin-left: auto;">
                                  <p style="font-size: 0.6rem; margin: 0;">${config.facade.price.toFixed(2)} €</p>
                                </div>
                              </div>

                              <!-- Mécanismes -->
                              
                              ${["Mécanisme(s)", "gravures"]
                                .map((category) => {
                                  let items = [];
                                  if (category === "Mécanisme(s)") {
                                    items = config.facades.flatMap((facade) => [
                                      ...facade.cylindres,
                                      ...facade.retros,
                                      ...facade.prises,
                                      ...facade.variateurs,
                                      ...facade.liseuses,
                                    ]);
                                  } else if (category === "gravures") {
                                    items = config.facades.flatMap((facade) => facade.gravures);
                                    console.log(category, items.length);
                                  }

                                  return items.length > 0
                                    ? `
                                      <div style="color: black !important;">
                                        <p style="font-size: 0.6rem; font-weight: bold; margin: 0px !important; text-decoration: underline;">${
                                          category.charAt(0).toUpperCase() + category.slice(1)
                                        }</p>
                                        ${items
                                          .map(
                                            (item) => `
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 0px !important; ">
                                            <div>
                                              <p style="display: inline; font-size: 0.55rem; margin: 0;">- ${
                                                item.name
                                              }</p>
                                              </div>
                                              <div style="margin-left: auto;">
                                              <p style="display: inline; font-size: 0.55rem; margin: 0;">x${
                                                item.quantity || 1
                                              } - ${(item.price * (item.quantity || 1)).toFixed(2)} €</p>
                                            </div>
                                            </div>
                                          `
                                          )
                                          .join("")}
                                      </div>
                                    `
                                    : "";
                                })
                                .join("")}

                              <hr style="margin-top: 0.5rem; border: 0.5px solid black;" />
                            </div>
                          </div>
                          `
                          )
                          .join("")}
                      </div>

                      <!-- PRIX -->

                      <div style="text-align: right;">
                        <p style="margin: 0px !important;"><strong>TOTAL TTC : ${orderData.total_amount.toFixed(
                          2
                        )}€</strong></p>
                          <p style="margin: 0px !important; font-size: 11px;">Dont TVA 20% : ${(
                            orderData.total_amount -
                            orderData.total_amount / 1.2
                          ).toFixed(2)}€</p>
                      </div>

                      <!-- LIVRAISON -->

                      <tr>
                        <td class="m_-8398259371414921749space_footer" style="padding: 0 !important">&nbsp;</td>
                      </tr>
                      <tr>
                        <td
                          class="m_-8398259371414921749box"
                          bgcolor="#f8f8f8">
                          <table class="m_-8398259371414921749table" style="width: 100%" width="100%">
                            <tbody>
                              <tr>
                                
                                <td>
                                  <font size="2" face="Open-sans, sans-serif" color="#555454">
                                    <p
                                      style="
                                  margin: 3px 0 7px 0;
                                  text-transform: uppercase;
                                  font-weight: 500;
                                  color: black !important;
                                  font-size: 18px;
                                  padding-bottom: 10px;
                                  border-bottom: 1px solid black;
                                ">
                                      Livraison
                                    </p>

                                    <span style="color: #777777">
                                      <span style="color: #333333"><strong>Livraison :</strong></span> ${
                                        orderData.shipping_method
                                      } <br /><br />
                                      <span style="color: #333333"><strong>Paiement :</strong></span> ${
                                        orderData.payment_method
                                      }
                                    </span>
                                  </font>
                                </td>
                                
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="m_-8398259371414921749space_footer" style="padding: 0 !important">&nbsp;</td>
                      </tr>

                      <tr>
                        <td class="m_-8398259371414921749space_footer" style="padding: 0 !important">&nbsp;</td>
                      </tr>

                      <tr>
                        <td class="m_-8398259371414921749space_footer" style="padding: 0 !important">&nbsp;</td>
                      </tr>

                      <tr>
                        <td class="m_-8398259371414921749linkbelow">
                          <font size="2" face="Open-sans, sans-serif" color="#555454">
                            <span>
                              Suivez votre commande et téléchargez votre facture sur notre site, rendez-vous dans la
                              section
                              <a
                                href="https://configurateur.lumicrea.fr/profil/commandes"
                                style="color: #337ff1"
                                target="_blank"
                                data-saferedirecturl="https://www.google.com/url?q=https://lumicrea.fr/historique-des-commandes&amp;source=gmail&amp;ust=1732703655010000&amp;usg=AOvVaw3Ztdli6HgUYPfvIp00ikmP"
                                >Historique et détails de mes commandes</a
                              >
                              de votre compte client.
                            </span>
                          </font>
                        </td>
                      </tr>

                      <tr>
                        <td class="m_-8398259371414921749linkbelow">
                          <font size="2" face="Open-sans, sans-serif" color="#555454">
                            <span>
                              <strong>Merci d'avoir utilisé notre configurateur !</strong>
                            </span>
                          </font>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td id="m_-8398259371414921749footer-right" style="width: 20px" width="20">&nbsp;</td>
              </tr>
            </tbody>
          </table>
          <div class="yj6qo"></div>
          <div class="adL"></div>
        </div>
      </body>
    </html>
  `;
}

function formatDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export async function sendCheckoutMail(
  cart,
  orderData,
  userAddressInformations,
  userInformations,
  pdfBytes,
  configImageSaver
) {
  console.log(userAddressInformations);

  const htmlContent = generateEmailHTML(cart, orderData, userAddressInformations, userInformations, configImageSaver);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `Lumicrea <${process.env.SMTP_USER}>`,
      to: `${process.env.SMTP_USER}`,
      subject: "[Lumicrea] Confirmation de commande",
      html: htmlContent,
      // attachments: [
      //   {
      //     filename: `Facture_${orderData.order_number}.pdf`,
      //     content: pdfBytes,
      //     encoding: "base64",
      //   },
      // ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
}

sendCheckoutMail().catch(console.error);
