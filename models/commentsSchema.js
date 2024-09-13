// import mongoose from "mongoose";


// // GuestAuthor Schema for managing guest users
// const guestUserSchema = new mongoose.Schema({
//   displayName: { type: String, required: true }, // Changed from 'name'
//   emailAddress: { type: String, required: true }, // Changed from 'email'
//   profilePicture: { type: String }, // Optional profile picture
// });

// // Reply Schema for nested replies
// const nestedReplySchema = new mongoose.Schema({
//   replyContent: { type: String, required: true }, // Changed from 'content'
//   guestUser: { type: guestUserSchema }, // Nested replies by guest users
//   registeredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Registered users
//   subReplies: [this], // Nested replies
//   createdOn: { type: Date, default: Date.now },
// });

// // Comment Schema
// const blogCommentSchema = new mongoose.Schema({
//   blogPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true }, // Reference to the blog post
//   commentText: { type: String, required: true }, // Changed from 'content'
//   guestUser: { type: guestUserSchema }, // For guest users who comment
//   registeredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For registered users who comment
//   replyThread: [nestedReplySchema], // Replies array
//   commentedOn: { type: Date, default: Date.now },
// });

// // Comment Model
//  export const BlogComment = mongoose.model('BlogComment', blogCommentSchema);


import mongoose from "mongoose";

// GuestAuthor Schema for managing guest users
const guestUserSchema = new mongoose.Schema({
  displayName: { type: String, required: true }, // Guest user's display name
  emailAddress: { type: String, required: true }, // Guest user's email address
  profilePicture: { type: String }, // Optional profile picture for guest users
});

// Nested Reply Schema for managing replies and sub-replies
const nestedReplySchema = new mongoose.Schema({
  replyContent: {
    type: String,
    required: true,
  },
  guestUser: {
    type: mongoose.Schema.Types.Mixed, // Adjust as necessary
    default: null,
  },
  registeredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  parentReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NestedReply',
    default: null,
  },
});

// Comment Schema for managing comments on blog posts
const blogCommentSchema = new mongoose.Schema({
  blogPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true }, // Reference to the blog post
  commentText: { type: String, required: true }, // Comment content
  guestUser: { type: guestUserSchema }, // For guest users who comment
  registeredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For registered users who comment
  replyThread: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NestedReply' }], // Replies to the comment
  commentedOn: { type: Date, default: Date.now }, // Timestamp for when the comment was created
});

// Comment Model
export const BlogComment = mongoose.model('BlogComment', blogCommentSchema);

// Reply Model for nested replies
export const NestedReply = mongoose.model('NestedReply', nestedReplySchema);
