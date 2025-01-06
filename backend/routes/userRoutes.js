import express from "express";

import { getUserDetails, updatePassword, deleteAccount } from "../controllers/userController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/deleteaccount", authenticateToken, deleteAccount);
router.post("/updatepassword", authenticateToken, updatePassword);
router.get("/getuserdetails", authenticateToken, getUserDetails);

export default router;
