import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addTeamMember, deleteTeamMember, getAllTeamMember, updateTeamMember } from "../controller/teamController.js";



const router = express.Router();

router.post("/addmember", isAuthenticated, addTeamMember);
router.delete("/deletemember/:id", isAuthenticated, deleteTeamMember);
router.put("/updatemember/:id", isAuthenticated, updateTeamMember);
router.get("/getallmembers", getAllTeamMember);



export default router;