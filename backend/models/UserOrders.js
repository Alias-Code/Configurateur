import { dbPool } from "../server.js";

class UserOrders {
  // --- CREATE ORDER ---

  static async createOrder(orderData) {
    try {
      const status =
        orderData.payment_method === "Virement Bancaire"
          ? "Attente de Virement Bancaire"
          : orderData.payment_method === "Carte Bancaire"
          ? "Confirmée"
          : "Erreur";

      const query = `
        INSERT INTO cg_orders (id_customer, order_date, total_amount, status, shipping_method, payment_method, order_number, note)
        VALUES (?, NOW(), ?, ?, ?, ?, ?, ?);
      `;

      const values = [
        orderData.id_customer,
        orderData.total_amount,
        status,
        orderData.shipping_method,
        orderData.payment_method,
        orderData.order_number,
        orderData.note,
      ];

      const [results] = await dbPool.query(query, values);
      return results.insertId;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
    }
  }

  // --- CREATE ORDER CONFIGURATION ---

  static async createOrderConfiguration(
    orderId,
    configReference,
    configQuantity,
    configColor,
    configFacade,
    configImageLink
  ) {
    try {
      const query = `
        INSERT INTO cg_order_configurations (order_id, config_reference, config_quantity, config_color, config_facade, config_image)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      const values = [orderId, configReference, configQuantity, configColor, configFacade, configImageLink];

      const [results] = await dbPool.query(query, values);
      return results.insertId;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la configuration de la commande: ${error.message}`);
    }
  }

  // --- GET ORDER NUMBER ---

  static async getOrderNumber() {
    try {
      const currentDate = new Date();
      const yearSuffix = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

      const query = `
        SELECT COUNT(*) AS count 
        FROM cg_orders 
        WHERE YEAR(order_date) = YEAR(CURDATE())
      `;

      const [results] = await dbPool.query(query);
      const orderIndex = (results[0].count + 1).toString().padStart(2, "0");
      const orderNumber = `${yearSuffix}${month}${orderIndex}`;

      return orderNumber;
    } catch (error) {
      throw error;
    }
  }

  // --- CREATE ORDER ITEM ---

  static async createOrderItem(orderId, configId, item) {
    try {
      const query = `
        INSERT INTO cg_order_items (order_id, config_id, reference, quantity, unit_price, facade_number)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      const values = [orderId, configId, item.reference, item.quantity, item.unit_price, item.facade_number];

      const [results] = await dbPool.query(query, values);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // --- GET ORDERS ---

  static async getOrders(id) {
    try {
      const [results] = await dbPool.query("SELECT * FROM cg_orders WHERE id_customer = ?", [id]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // --- GET ORDER BY ID ---

  static async getOrderDetailsById(id) {
    try {
      const configQuery = `SELECT * FROM cg_order_configurations WHERE order_id = ?;`;
      const itemsQuery = `SELECT * FROM cg_order_items WHERE order_id = ?;`;

      const [configResults] = await dbPool.query(configQuery, [id]);
      const [itemsResults] = await dbPool.query(itemsQuery, [id]);

      const configurations = {};

      configResults.forEach((config, index) => {
        const configKey = `config${index + 1}`;
        const facades = [1, 2, 3].map((num) => ({
          id: num,
          cylindres: [],
          retros: [],
          prises: [],
          gravures: [],
        }));

        itemsResults
          .filter((item) => item.config_id === config.id_configuration)
          .forEach((item) => {
            const facade = facades[item.facade_number - 1];

            // Ajouter l'item au bon type dans la façade
            if (item.reference.startsWith("P-")) {
              facade.prises.push({
                id: item.reference,
                name: `Prise ${item.reference}`,
                price: item.unit_price,
                quantity: item.quantity,
              });
            } else if (item.reference.startsWith("G-")) {
              facade.gravures.push({
                id: item.reference,
                name: `Gravure ${item.reference}`,
                price: item.unit_price,
                quantity: item.quantity,
              });
            } else if (item.reference.startsWith("R-")) {
              facade.retros.push({
                id: item.reference,
                name: `Rétro ${item.reference}`,
                price: item.unit_price,
                type: "TEST",
                quantity: item.quantity,
              });
            } else if (item.reference.startsWith("C-")) {
              facade.cylindres.push({
                id: item.reference,
                name: `Cylindre ${item.reference}`,
                price: item.unit_price,
                type: "TEST",
                quantity: item.quantity,
              });
            }
          });

        configurations[configKey] = {
          quantity: config.config_quantity,
          couleur: {
            id: "CL-N", // ID fictif à adapter
            name: config.config_color,
            value: 0,
          },
          facade: {
            id: `N-${index + 1}`, // Facade ID à ajuster
            name: config.config_facade,
            price: index === 0 ? 60 : 120,
          },
          image: config.config_image,
          facades: facades,
        };
      });

      return configurations;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des détails de la commande: ${error.message}`);
    }
  }
}

export default UserOrders;
