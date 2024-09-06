import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";




const router = express.Router();

router.post("/addcategory", isAuthenticated);
router.delete("/deletecategory/:id", isAuthenticated);
router.get("/getcategory");
router.put("/updatecategory/:id", isAuthenticated);

export default router;