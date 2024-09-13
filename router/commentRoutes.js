import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addComment, addReply,
    deleteCommenta,
    deleteReply,
    //  createComment, createReply, 
     fetchComments } from "../controller/commentsController.js";
// import { deleteComment, deleteReply } from "../controller/comentController.js";

  
  const router = express.Router();
  
  router.get('/comments/:postId', fetchComments);

  // Add a new comment
  router.post('/comments', addComment);
  
  // Delete a comment
  router.delete('/comments/:commentId', isAuthenticated, deleteCommenta);
  
  // Add a reply to a comment
  router.post('/comments/replies', addReply);
  
  // Delete a reply
  router.delete('/comments/replies/:replyId',isAuthenticated,  deleteReply);
export default router;