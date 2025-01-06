import { dbPool } from "../server.js";

class User {
  // --- FIND BY EMAIL ---
  static async findByEmail(email) {
    try {
      const [results] = await dbPool.query("SELECT * FROM ps_customer WHERE email = ?", [email]);
      return results[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // --- FIND BY ID ---
  static async findById(id) {
    try {
      const [results] = await dbPool.query("SELECT * FROM ps_customer WHERE id_customer = ?", [id]);
      return results[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // --- UPDATE PASSWORD ---
  static async updatePassword(id, newPassword) {
    try {
      const [results] = await dbPool.query("UPDATE ps_customer SET passwd = ? WHERE id_customer = ?", [
        newPassword,
        id,
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // --- DELETE ACCOUNT ---
  static async deleteAccount(id) {
    try {
      const [results] = await dbPool.query("DELETE FROM ps_customer WHERE id_customer = ?", [id]);
      return results.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // --- CREATE USER ---
  static async createUser(newUser) {
    try {
      const query = `
        INSERT INTO ps_customer (
          id_shop_group, id_shop, id_gender, id_default_group, id_lang, id_risk, 
          company, siret, ape, firstname, lastname, email, phone, profession, passwd, last_passwd_gen,
          birthday, newsletter, ip_registration_newsletter, newsletter_date_add, optin, website, 
          outstanding_allow_amount, show_public_prices, max_payment_days, secure_key, 
          note, active, is_guest, deleted, date_add, date_upd, reset_password_token, reset_password_validity
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const values = [
        newUser.id_shop_group,
        newUser.id_shop,
        newUser.id_gender,
        newUser.id_default_group,
        newUser.id_lang,
        newUser.id_risk,
        newUser.company,
        newUser.siret,
        newUser.ape,
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.phone,
        newUser.profession,
        newUser.passwd,
        newUser.last_passwd_gen,
        newUser.birthday,
        newUser.newsletter,
        newUser.ip_registration_newsletter,
        newUser.newsletter_date_add,
        newUser.optin,
        newUser.website,
        newUser.outstanding_allow_amount,
        newUser.show_public_prices,
        newUser.max_payment_days,
        newUser.secure_key,
        newUser.note,
        newUser.active,
        newUser.is_guest,
        newUser.deleted,
        newUser.date_add,
        newUser.date_upd,
        newUser.reset_password_token,
        newUser.reset_password_validity,
      ];

      const [results] = await dbPool.query(query, values);
      return {
        message: "Utilisateur créé avec succès.",
        id_customer: results.insertId,
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
}

export default User;
