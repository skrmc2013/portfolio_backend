import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addIntro, getIntro, updateIntro } from "../controller/introController.js";




const router = express.Router();

router.post("/addintro", isAuthenticated,addIntro );
// router.delete("/deleteinto/:id", isAuthenticated, );
router.get("/getintro", getIntro);
router.put("/updateintro/:id", isAuthenticated, updateIntro );

export default router;