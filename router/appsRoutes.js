import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addApps, deleteApps, getAllApps, getUpdateApps } from "../controller/appsController.js";
import { addIcon, deleteIcon, getAllIcons, getSingleIcon, updateIcon} from "../controller/iconsController.js";



const router = express.Router();

router.post("/addapps", isAuthenticated, addApps);
router.delete("/deleteapps/:id", isAuthenticated, deleteApps);
router.get("/getallapps", getAllApps);
router.put("/getupdateapps/:id", isAuthenticated, getUpdateApps );

router.post("/addicon", isAuthenticated, addIcon);
router.put("/updateicon/:id", isAuthenticated, updateIcon);
router.delete("/deleteicon/:id", isAuthenticated, deleteIcon);
router.get("/geticon/:id",  getSingleIcon);
router.get("/getallicons/", getAllIcons);


export default router;