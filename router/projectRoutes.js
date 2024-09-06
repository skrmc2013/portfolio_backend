import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addNewProject, deleteProject, getAllProject, getSingleProject, updateProject } from "../controller/projectController.js";
import { addCategory, updateCategory, getCategory, deleteCategory } from "../controller/categoryController.js";



const router = express.Router();

router.post("/addproject", isAuthenticated,addNewProject);
router.delete("/deleteproject/:id", isAuthenticated, deleteProject);
router.put("/updateproject/:id", isAuthenticated, updateProject);
router.get("/getallprojects", getAllProject );
// router.get("/getsingleproject/:id",  getSingleProject);
router.get("/getsingleproject/:slug",  getSingleProject);

// project categories
router.post("/addcategory", isAuthenticated, addCategory);
router.delete("/deletecategory/:id", isAuthenticated,deleteCategory);
router.get("/getallcategories", getCategory);
router.put("/updatecategory/:id", isAuthenticated, updateCategory);
export default router;