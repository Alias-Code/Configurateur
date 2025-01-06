import express from "express";

import { getUserAddress, createAddress, deleteAddress } from "../controllers/addressController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createuseraddress", authenticateToken, createAddress);
router.post("/deleteuseraddress", authenticateToken, deleteAddress);
router.get("/getuseraddress", authenticateToken, getUserAddress);

export default router;
