import User from "../../models/User.js";
import UserOrders from "../../models/UserOrders.js";

export const getOrders = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const orders = await UserOrders.getOrders(userId);

    res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};
