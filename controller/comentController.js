import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { BlogPost, Comment, Reply } from "../models/BlogPostSchema.js";

export const addComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { id } = req.params;

        // Determine whether it's an admin/registered user or a guest author
        let authorData = {};
        if (req.user) {
            authorData = { author: req.user._id, guestAuthor: null };
        } else if (req.body.guestAuthor) {
            authorData = { author: null, guestAuthor: req.body.guestAuthor };
        } else {
            return next(new ErrorHandler("Author or Guest Author is required", 400));
        }

        // Create a new comment with the determined author data
        const newComment = new Comment({
            content,
            ...authorData,
        });

        const savedComment = await newComment.save();

        // Add the comment ID to the blog post's comments array
        const blogPost = await BlogPost.findById(id);
        if (!blogPost) {
            return next(new ErrorHandler("Blog post not found", 404));
        }
        blogPost.comments.push(savedComment._id);
        await blogPost.save();

        res.status(201).json({
            success: true,
            data: savedComment,
        });
    } catch (error) {
        return next(new ErrorHandler('Failed to add comment', 500));
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { id } = req.params;

        // Find the comment by ID and update the content
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content },
            { new: true, runValidators: true }
        );
        console.log(content)

        if (!updatedComment) {
            return next(new ErrorHandler("Comment not found", 404));
        }

        res.status(200).json({
            success: true,
            data: updatedComment,
        });
    } catch (error) {
        return next(new ErrorHandler('Failed to update comment', 500));
    }
};
export const deleteComment = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the comment by ID
        const comment = await Comment.findById(id);
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }

        // Recursive function to delete replies and their sub-replies
        const deleteReplies = async (replies) => {
            for (const reply of replies) {
                if (reply.replies && reply.replies.length > 0) {
                    await deleteReplies(reply.replies);
                }
                await Comment.findByIdAndDelete(reply._id); // Delete the reply
            }
        };

        // Delete all replies associated with this comment
        if (comment.replies && comment.replies.length > 0) {
            await deleteReplies(comment.replies);
        }

        // Delete the main comment
        await Comment.findByIdAndDelete(id);

        // Optionally, remove the comment reference from the blog post
        await BlogPost.updateOne(
            { comments: id },
            { $pull: { comments: id } }
        );

        res.status(200).json({
            success: true,
            message: "Comment and its replies deleted successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to delete comment', 500));
    }
});


// export const deleteComment = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         // Find the comment by ID
//         const comment = await Comment.findByIdAndDelete(id);
//         if (!comment) {
//             return next(new ErrorHandler("Comment not found", 404));
//         }



//         // Optionally, you might want to remove the comment reference from the blog post
//         await BlogPost.updateOne(
//             { comments: id },
//             { $pull: { comments: id } }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Comment deleted successfully",
//         });
//     } catch (error) {
//         return next(new ErrorHandler(error, 500));
//     }
// });

// Assuming you have a catchAsyncErrors function for handling async errors
export const addReply = catchAsyncErrors(async (req, res, next) => {
    try {
        const { commentId } = req.params; // Assuming the comment ID is passed in the URL
        const { content, guestAuthor, parentReply } = req.body; // Data for the new reply

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }

        // Create the reply object
        const newReply = {
            content,
            guestAuthor,
            parentReply: parentReply || null,
        };

        // Add the new reply to the comment's replies array
        comment.replies.push(newReply);

        // Save the comment with the new reply
        await comment.save();

        res.status(200).json({
            success: true,
            message: "Reply added",
            data: comment,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Failed to add reply", 500));
    }
});



// export const addReply = async (req, res, next) => {

//     try {
//         // console.log('Request Body:', req.body);
//         const { content } = req.body;
//         const { commentId } = req.params;
//         // console.log('Extracted Content:', content);
//         if (!content) {
//             return next(new ErrorHandler("Content is required for the reply", 400));
//         }
        
//         // Find the comment by ID
//         const comment = await Comment.findById(commentId);
//         if (!comment) {
//             return next(new ErrorHandler("Comment not found", 404));
//         }

//         // Determine whether it's an admin/registered user or a guest author
//         let authorData = {};
//         if (req.user) {
//             authorData = { author: req.user._id, guestAuthor: null };
//         } else if (req.body.guestAuthorId) {
//             authorData = { author: null, guestAuthor: req.body.guestAuthorId };
//         } else {
//             return next(new ErrorHandler("Author or Guest Author is required", 400));
//         }

//         // Create the reply
//         const newReply = new Reply({
//             content,
//             ...authorData,
//         });

//         // Save the reply and add it to the comment
//         comment.replies.push(newReply);
//         await comment.save();
//         await newReply.save();

//         res.status(201).json({
//             success: true,
//             data: newReply,
//         });
//     } catch (error) {
//         return next(new ErrorHandler('Failed to add reply', 500));
//     }
// };

export const updateReply = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { replyId } = req.params;

        // Find the reply by ID
        const reply = await Reply.findById(replyId);
        if (!reply) {
            return next(new ErrorHandler("Reply not found", 404));
        }

        // Update the reply content
        if (content) {
            reply.content = content;
        }

        // Save the updated reply
        const updatedReply = await reply.save();

        res.status(200).json({
            success: true,
            // message: "Reply Updated successfully",
            data: updatedReply,
        });
    } catch (error) {
        return next(new ErrorHandler('Failed to update reply', 500));
    }
};


export const deleteReply = async (req, res, next) => {
    try {
        const { commentId, replyId } = req.params;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }

        // Find and remove the reply from the comment's replies array
        const replyIndex = comment.replies.findIndex(r => r._id.toString() === replyId);
        if (replyIndex === -1) {
            return next(new ErrorHandler("Reply not found", 404));
        }

        comment.replies.splice(replyIndex, 1);
        await comment.save();

        // Delete the reply from the database
        await Reply.findByIdAndDelete(replyId);

        res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
        });
    } catch (error) {
        return next(new ErrorHandler('Failed to delete reply', 500));
    }
};
