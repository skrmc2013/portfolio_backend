import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { BlogPost } from "../models/BlogPostSchema.js";
import { BlogComment, NestedReply,} from "../models/commentsSchema.js";

// commentController.js
// const Comment = require('../models/commentModel');
export const fetchComments = async (req, res, next) => {
    try {
      const comments = await BlogComment.find({ blogPostId: req.params.postId })
        .populate('registeredUser', 'name')
        .populate('replyThread');
      res.json({ comments });
    } catch (error) {
        console.log(error.message);
      next(error);
    }
  };
  
  // Add a new comment
  export const addComment = async (req, res, next) => {
    try {
      const { content, blogPostId, guestInfo } = req.body;
      const commentData = {
        commentText: content,
        blogPostId: blogPostId,
        guestUser: guestInfo ? guestInfo : null,
        registeredUser: req.user ? req.user._id : null,
      };
  
      const newComment = await BlogComment.create(commentData);
      res.status(201).json({ comment: newComment });
    } catch (error) {
        console.log(error.message);
      next(error);
    }
  };
  
  // Delete a comment and its replies
  export const deleteCommenta = async (req, res, next) => {
    const { commentId } = req.params;
    console.log("Request params:", req.params); // Log the entire params object
    console.log("Comment ID received:", commentId); // Log the commentId specifically
    try {
      const comment = await BlogComment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      await NestedReply.deleteMany({ _id: { $in: comment.replyThread } });
      await comment.deleteOne();
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
  
  
  
  // Add a reply to a comment
//   export const addReply = async (req, res, next) => {
//     try {
//       const { content, commentId, guestInfo } = req.body;
//       const replyData = {
//         replyContent: content,
//         guestUser: guestInfo ? guestInfo : null,
//         registeredUser: req.user ? req.user._id : null,
//       };
  
//       const newReply = await NestedReply.create(replyData);
  
//       // Add reply to the parent comment
//       await BlogComment.findByIdAndUpdate(commentId, {
//         $push: { replyThread: newReply._id },
//       });
  
//       res.status(201).json({ reply: newReply });
//     } catch (error) {
//       next(error);
//     }
//   };
export const addReply = async (req, res, next) => {
    try {
      const { content, commentId, guestInfo, parentReplyId } = req.body;
  
      if (!content || !commentId) {
        return res.status(400).json({ error: 'Content and commentId are required' });
      }
  
      const guestUser = guestInfo || null;
  
      const replyData = {
        replyContent: content,
        guestUser,
        registeredUser: req.user ? req.user._id : null,
        parentReply: parentReplyId || null,
      };
  
      const newReply = await NestedReply.create(replyData);
  
      await BlogComment.findByIdAndUpdate(commentId, {
        $push: { replyThread: newReply._id },
      });
  
      res.status(201).json({ reply: newReply });
    } catch (error) {
      console.error('Error adding reply:', error.message);
      next(error);
    }
  };
  
  // Delete a reply and its sub-replies
  export const deleteReply = async (req, res, next) => {
    try {
      // Find and delete the reply
      const reply = await NestedReply.findById(req.params.replyId);
      if (!reply) {
        return res.status(404).json({ message: 'Reply not found' });
      }
  
      // Delete all sub-replies
      await NestedReply.deleteMany({ _id: { $in: reply.subReplies } });
  
      // Remove reply from the parent comment
      await BlogComment.updateMany(
        { replyThread: reply._id },
        { $pull: { replyThread: reply._id } }
      );
  
      // Delete the reply
      await reply.deleteOne();
      res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
// Add a new comment
// export const createComment = async (req, res) => {
//     try {
//       const { blogPostId, commentText, guestUser } = req.body;
  
//       if (!blogPostId || !commentText) {
//         return res.status(400).json({ success: false, message: 'Blog post ID and comment text are required' });
//       }
  
//       const newComment = await BlogComment.create({
//         blogPostId,
//         commentText,
//         guestUser: guestUser ? guestUser : undefined, // If guest user is posting
//         registeredUser: req.user ? req.user._id : undefined, // If registered user
//       });
  
//       res.status(201).json({
//         success: true,
//         comment: newComment,
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   };
  
//   // Add a reply to a comment (nested replies supported)
//   export const createReply = async (req, res) => {
//     try {
//       const { commentId, replyContent, guestUser, parentReplyId } = req.body;
  
//       if (!commentId || !replyContent) {
//         return res.status(400).json({ success: false, message: 'Comment ID and reply content are required' });
//       }
  
//       const comment = await BlogComment.findById(commentId);
  
//       if (!comment) {
//         return res.status(404).json({ success: false, message: 'Comment not found' });
//       }
  
//       if (parentReplyId) {
//         const parentReply = findNestedReply(comment.replyThread, parentReplyId);
  
//         if (!parentReply) {
//           return res.status(404).json({ success: false, message: 'Parent reply not found' });
//         }
  
//         // Add nested reply
//         parentReply.subReplies.push({
//           replyContent,
//           guestUser: guestUser ? guestUser : undefined,
//           registeredUser: req.user ? req.user._id : undefined,
//         });
//       } else {
//         // Add a reply to the main comment
//         comment.replyThread.push({
//           replyContent,
//           guestUser: guestUser ? guestUser : undefined,
//           registeredUser: req.user ? req.user._id : undefined,
//         });
//       }
  
//       await comment.save();
  
//       res.status(200).json({ success: true, message: 'Reply added', comment });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   };
  
//   // Find a nested reply recursively
//   const findNestedReply = (replies, replyId) => {
//     for (let reply of replies) {
//       if (reply._id.toString() === replyId) {
//         return reply;
//       }
//       const nestedReply = findNestedReply(reply.subReplies, replyId);
//       if (nestedReply) return nestedReply;
//     }
//     return null;
//   };
  
//   // Delete a comment (and all nested replies)
//   export const deleteComment = async (req, res) => {
//     try {
//       const { commentId } = req.params;
  
//       const comment = await BlogComment.findById(commentId);
  
//       if (!comment) {
//         return res.status(404).json({ success: false, message: 'Comment not found' });
//       }
  
//       await comment.remove();
  
//       res.status(200).json({ success: true, message: 'Comment and its replies deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   };
  
//   // Delete a reply (and its sub-replies)
//   export const deleteReply = async (req, res) => {
//     try {
//       const { commentId, replyId } = req.params;
  
//       const comment = await BlogComment.findById(commentId);
  
//       if (!comment) {
//         return res.status(404).json({ success: false, message: 'Comment not found' });
//       }
  
//       comment.replyThread = comment.replyThread.filter((reply) => reply._id.toString() !== replyId);
  
//       await comment.save();
  
//       res.status(200).json({ success: true, message: 'Reply deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   };

//   export const getComments = async (req, res, next) => {
//     try {
//       const comments = await BlogComment.find({ blogPostId: req.params.postId }).populate('registeredUser', 'name').exec();
//       res.json({ comments });
//     } catch (error) {
//       next(error);
//     }
//   };
  