import mongoose from 'mongoose';

// Schema for guest author (for guest blog posts)
const guestAuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    picture: {
        type: {
            type: String, // 'svg' for SVG icons
            enum: ['svg', 'png', 'jpg', 'ico', 'gif', 'webp'],
        },
        public_id: {
            type: String,
            required: [true, "Public ID is required"],
        },
        url: {
            type: String,
            required: [true, "Banner URL is required"],
        },
    },
    displayOnWebsite:{
        type: Boolean,
        default:false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
},{
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
});

// Schema for replies to comments
const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    guestAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuestAuthor',
    },
    parentReply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply', // Reference to another Reply
        default: null, // Default is null for top-level replies
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    adminResponse: {
        type: Boolean,
        default: false,
    },
});

// Schema for comments
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    guestAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuestAuthor',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    replies: [replySchema], // Embedded replies for each comment
});

// Schema for blog posts
const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // For admin and registered users
    },
    guestAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuestAuthor', // For guest users
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        maxlength: 200,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    tags: [{
        type: String,
    }],
    coverImage: {
        type: {
            type: String, // 'svg' for SVG icons
            enum: ['svg', 'png', 'jpg', 'ico', 'gif', 'webp'],
        },
        public_id: {
            type: String,
            required: [true, "Public ID is required"],
        },
        url: {
            type: String,
            required: [true, "Banner URL is required"],
        },
    },
    published: {
        type: Boolean,
        default: false,
    },
    publishedAt: {
        type: Date,
    },
    seo: {
        metaTitle: {
            type: String,
            maxlength: 60,
        },
        metaDescription: {
            type: String,
            maxlength: 160,
        },
        metaKeywords: [{
            type: String,
        }],
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    likes: {
         type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'pending', 'pending-update', 'pending-deletion'],
        default: 'draft',
    },
    lastModified: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
guestAuthorSchema.pre('remove', async function (next) {
    await this.model('BlogPost').deleteMany({ guestAuthor: this._id });
    next();
});

// Virtual populate for blog posts
guestAuthorSchema.virtual('blogposts', {
    ref: 'BlogPost', // The model to use
    localField: '_id', // Find blog posts where `localField`
    foreignField: 'guestAuthor', // is equal to `foreignField`
});
export const GuestAuthor = mongoose.model('GuestAuthor', guestAuthorSchema);
export const Reply = mongoose.model('Reply', replySchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
