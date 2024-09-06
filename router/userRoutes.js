import express from "express";
import { forgotPassword, getUser, getUserForPortfolio, login, logout, register, resetPassword, updatePassword, updateProfile } from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/create/profile/user/onlyauthrizedadmins", isAuthenticated, register);
router.post("/signin", login);
// router.post("/signout",isAuthenticated, logout);
router.get("/signout",isAuthenticated, logout);

router.get("/user", isAuthenticated, getUser);
router.put("/update/userprofile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.get("/get/user/portfolio",  getUserForPortfolio);
// router.get("/pop", getAllMessages);
router.post("/forgot/password", forgotPassword);
router.put("/reset/password/:token", resetPassword);
export default router;