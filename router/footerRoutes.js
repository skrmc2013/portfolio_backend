import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";




const router = express.Router();

router.post("/addfooter", isAuthenticated, );
router.delete("/deletefooter/:id", isAuthenticated,);
router.get("/getfooter",);
router.put("/updatefooter/:id", isAuthenticated,  );

export default router;