import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addSkills, deleteSkills, getAllSkills, updateSkills } from "../controller/skillsController.js";

const router = express.Router();

router.post("/createskill", isAuthenticated, addSkills);
router.delete("/deleteskill/:id", isAuthenticated, deleteSkills);
router.put("/updateskill/:id", isAuthenticated, updateSkills);
router.get("/getallskills", getAllSkills);


export default router;