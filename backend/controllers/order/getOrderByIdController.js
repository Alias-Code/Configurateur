import UserOrders from "../../models/UserOrders.js";

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderInformations = await UserOrders.getOrderDetailsById(orderId);

    // console.dir(orderInformations, { depth: null, colors: true });

    res.status(200).json(orderInformations);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};
