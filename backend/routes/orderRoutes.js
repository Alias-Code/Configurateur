import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";
import { generateInvoice, getInvoices } from "../controllers/invoiceController.js";
import { checkoutOrder } from "../controllers/order/checkoutController.js";
import { getOrders } from "../controllers/order/getOrdersController.js";
import { getOrderById } from "../controllers/order/getOrderByIdController.js";

const router = express.Router();

router.post("/generateinvoice", authenticateToken, generateInvoice);
router.get("/getinvoices", authenticateToken, getInvoices);

router.post("/checkout", authenticateToken, checkoutOrder);
router.get("/getorders", authenticateToken, getOrders);
router.get("/getorder/:id", authenticateToken, getOrderById);

export default router;
