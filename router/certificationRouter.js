import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createCertification, deleteCertification, getAllCertifications } from "../controller/certificationController.js";


const router = express.Router();

router.post("/addcertification", isAuthenticated,createCertification );
router.delete("/delete/:id", isAuthenticated, deleteCertification);
router.get("/getallcertification", getAllCertifications );
router.put("/getupdateapps/:id", isAuthenticated,  );




export default router;