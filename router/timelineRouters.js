import express from "express";
import { deleteTimeline, getAllTimeline, postTimeline } from "../controller/timelineController.js";
import { isAuthenticated } from "../middlewares/auth.js";



const router = express.Router();

router.post("/addtimeline", isAuthenticated, postTimeline);
router.delete("/deletetimeline/:id", isAuthenticated, deleteTimeline);
router.get("/getalltimeline", getAllTimeline);


export default router;