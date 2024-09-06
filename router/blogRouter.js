import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

import { createBlogPost, deleteBlogPost, getAllBlogPosts, getBlogPost, getBlogPostWithSlug, updateBlogLike, updateBlogPost, updateBlogView } from "../controller/blogPostController.js";
import { createOrFindGuestAuthor, deleteGuestAuthor, getAllGuestAuthorsWithBlogs, getSingleGuestAuthorWithBlogs, updateGuestAuthor } from "../controller/GuestAuthorController.js";
import { addComment, addReply, deleteComment, deleteReply, updateComment, updateReply } from "../controller/comentController.js";



const router = express.Router();

router.post("/addblogpost",  createBlogPost);
router.get("/getallblogs",  getAllBlogPosts);
router.put("/updateblogpost/:id",  updateBlogPost);
router.put("/updateblogview/:id", updateBlogView);
router.put("/updatebloglike/:id", updateBlogLike);
router.delete("/deleteblogpost/:id",  deleteBlogPost);
router.get("/getblogpost/:id",  getBlogPost);
router.get("/getsingleblogwithslug/:slug",getBlogPostWithSlug  );

// router.delete("/deleteapps/:id", isAuthenticated, deleteApps);
// router.get("/getallapps", getAllApps);
// router.put("/getupdateapps/:id", isAuthenticated, getUpdateApps );

router.post("/addguest",  createOrFindGuestAuthor);
router.put("/updateguest/",  updateGuestAuthor);
router.get("/getallguest/",  getAllBlogPosts);
router.delete("/deleteguest/:id", deleteGuestAuthor );
router.get("/getallguestwithblogs/", isAuthenticated,  getAllGuestAuthorsWithBlogs );
router.get("/getsingleguestwithblogs/:id",   getSingleGuestAuthorWithBlogs);


// router for comment
router.post("/addcomment/:id",  addComment); 
router.put("/updatecomment/:id",  updateComment); 
router.delete("/deletecomment/:id",  deleteComment); 

// router for reply 

router.post("/addreply/:commentId",  addReply); 
router.put("/updatereply/:replyId",  updateReply); 
router.delete("/deletereply/:commentId/:replyId",  deleteReply); 

export default router