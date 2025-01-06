import { dbPool } from "../server.js";

class UserAddresses {
  // --- CREATE ADDRESS ---
  static async createAddress(newAddress) {
    const query = `
      INSERT INTO ps_address (
        id_country, id_state, id_customer, id_manufacturer, id_supplier, id_warehouse, alias, company, lastname, firstname, address1, address2, postcode, city, other, phone, phone_mobile, vat_number, dni, date_add, date_upd, active, deleted
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
      newAddress.id_country,
      newAddress.id_state,
      newAddress.id_customer,
      newAddress.id_manufacturer,
      newAddress.id_supplier,
      newAddress.id_warehouse,
      newAddress.alias,
      newAddress.company,
      newAddress.lastname,
      newAddress.firstname,
      newAddress.address1,
      newAddress.address2,
      newAddress.postcode,
      newAddress.city,
      newAddress.other,
      newAddress.phone,
      newAddress.phone_mobile,
      newAddress.vat_number,
      newAddress.dni,
      newAddress.date_add,
      newAddress.date_upd,
      newAddress.active,
      newAddress.deleted,
    ];

    try {
      const [results] = await dbPool.query(query, values);
      return {
        message: "Adresse créée avec succès !",
        id_customer: results.insertId,
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }

  // --- DELETE ADDRESS ---
  static async deleteAddress(id, type) {
    const isSync = !type.includes("unsync") ? "sync" : type;

    try {
      const [results] = await dbPool.query("SELECT * FROM ps_address WHERE id_customer = ? AND alias = ?", [
        id,
        isSync,
      ]);

      if (results.length === 0) {
        throw new Error("Adresse non trouvée");
      }

      const address = results[0];

      if (address.alias === "sync") {
        // --- DELETE SYNC ---
        const addressToDelete = type === "sync-shipping" ? "unsync-billing" : "unsync-shipping";

        const [updateResults] = await dbPool.query("UPDATE ps_address SET alias = ? WHERE id_address = ?", [
          addressToDelete,
          address.id_address,
        ]);
        return updateResults;
      } else {
        // --- DELETE ADDRESS ---
        const [deleteResults] = await dbPool.query("DELETE FROM ps_address WHERE id_customer = ? AND alias = ?", [
          id,
          type,
        ]);
        return deleteResults;
      }
    } catch (error) {
      throw error;
    }
  }

  // --- FIND USER ADDRESS ---
  static async findUserAddress(id) {
    try {
      const [results] = await dbPool.query("SELECT * FROM ps_address WHERE id_customer = ?", [id]);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

export default UserAddresses;
