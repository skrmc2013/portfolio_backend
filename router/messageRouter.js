import express from "express";
import { deleteMessage, getAllMessages, sendMessage } from "../controller/messageControler.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/push", sendMessage)
router.get("/pop", getAllMessages);
router.delete("/remove/:id", isAuthenticated, deleteMessage);

export default router;