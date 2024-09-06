import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import { BlogPost, GuestAuthor } from '../models/BlogPostSchema.js';
import cloudinary from 'cloudinary';

export const createBlogPost = catchAsyncErrors(async (req, res, next) => {
    const { title, slug, content, excerpt, categories, tags, published, seo, status, guestAuthorId } = req.body;
    const { coverImage } = req.files;

    // Validation checks
    if (!title) return next(new ErrorHandler("Title is required", 400));
    if (!slug) return next(new ErrorHandler("Slug is required", 400));
    if (!content) return next(new ErrorHandler("Content is required", 400));
    if (!excerpt) return next(new ErrorHandler("Excerpt is required", 400));
    if (!status) return next(new ErrorHandler("Status is required", 400));
    // if (typeof published !== 'boolean') return next(new ErrorHandler("Published status is required", 400));

   
    let seoData = {};
    let tagsData = [];
    let coverImageData = {};
    // Upload cover image if provided
    if (coverImage) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            coverImage.tempFilePath,
            {
                folder: "BLOG_BANNERS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        coverImageData = {
            type: cloudinaryResponse.format,
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    // Parse SEO data if provided
    try {
        seoData = JSON.parse(seo);
        if (typeof seoData !== 'object' || Array.isArray(seoData)) {
            throw new Error("Invalid SEO Data format");
        }
    } catch (e) {
        return next(new ErrorHandler("Invalid SEO format", 400));
    }

    // Handle tags
    try {
        if (typeof tags === 'string') {
            tagsData = tags.split(',').map(tag => tag.trim());
        } else if (Array.isArray(tags)) {
            tagsData = tags.map(tag => tag.trim());
        } else {
            throw new Error("Invalid Tags format");
        }
    } catch (e) {
        return next(new ErrorHandler("Invalid Tags format", 400));
    }

    // Determine whether it's an admin/registered user or a guest author
    let authorData = {};
    if (req.user) {
        authorData = { author: req.user._id, guestAuthor: null };
    } else if (req.body.guestAuthorId) {
        authorData = { author: null, guestAuthor: req.body.guestAuthorId };
    } else {
        return next(new ErrorHandler("Author or Guest Author is required", 400));
    }

    // Create blog post
    const blogpost = await BlogPost.create({
        title,
        slug,
        content,
        excerpt,
        categories,
        tags: tagsData,
        published,
        seo: seoData,
        status,
        coverImage: coverImageData,
        ...authorData,
    });

    res.status(200).json({
        success: true,
        message: "Blog added successfully",
        blogpost,
    });
});

// Update a blog post
export const updateBlogPost = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { title, slug, content, excerpt, categories, tags, published, seo, status, guestAuthorId } = req.body;
    const { coverImage } = req.files;

    // Find the blog post by ID
    const blogpost = await BlogPost.findById(id);

    if (!blogpost) {
        return next(new ErrorHandler("Blog post not found", 404));
    }

    // Validation checks
    if (!title) return next(new ErrorHandler("Title is required", 400));
    if (!slug) return next(new ErrorHandler("Slug is required", 400));
    if (!content) return next(new ErrorHandler("Content is required", 400));
    if (!excerpt) return next(new ErrorHandler("Excerpt is required", 400));
    if (!status) return next(new ErrorHandler("Status is required", 400));
    // if (typeof published !== 'boolean') return next(new ErrorHandler("Published status is required", 400));

    let seoData = {};
    let tagsData = [];
    let coverImageData = blogpost.coverImage; // Keep existing cover image if not updated

    // Upload cover image if provided
    if (coverImage) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            coverImage.tempFilePath,
            {
                folder: "BLOG_BANNERS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        // Delete the previous cover image from Cloudinary
        if (blogpost.coverImage && blogpost.coverImage.public_id) {
            await cloudinary.uploader.destroy(blogpost.coverImage.public_id);
        }

        coverImageData = {
            type: cloudinaryResponse.format,
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    // Parse SEO data if provided
    try {
        seoData = JSON.parse(seo);
        if (typeof seoData !== 'object' || Array.isArray(seoData)) {
            throw new Error("Invalid SEO Data format");
        }
    } catch (e) {
        return next(new ErrorHandler("Invalid SEO format", 400));
    }

    // Handle tags
    try {
        if (typeof tags === 'string') {
            tagsData = tags.split(',').map(tag => tag.trim());
        } else if (Array.isArray(tags)) {
            tagsData = tags.map(tag => tag.trim());
        } else {
            throw new Error("Invalid Tags format");
        }
    } catch (e) {
        return next(new ErrorHandler("Invalid Tags format", 400));
    }

    // Determine whether it's an admin/registered user or a guest author
    let authorData = {};
    if (req.user) {
        authorData = { author: req.user._id, guestAuthor: null };
    } else if (req.body.guestAuthorId) {
        authorData = { author: null, guestAuthor: req.body.guestAuthorId };
    } else {
        return next(new ErrorHandler("Author or Guest Author is required", 400));
    }

    // Update blog post fields
    blogpost.title = title;
    blogpost.slug = slug;
    blogpost.content = content;
    blogpost.excerpt = excerpt;
    blogpost.categories = categories;
    blogpost.tags = tagsData;
    blogpost.published = published;
    blogpost.seo = seoData;
    blogpost.status = status;
    blogpost.coverImage = coverImageData;
    blogpost.author = authorData.author;
    blogpost.guestAuthor = authorData.guestAuthor;

    // Save the updated blog post
    await blogpost.save();

    res.status(200).json({
        success: true,
        message: "Blog post updated successfully",
        blogpost,
    });
});

// export const updateBlogView = catchAsyncErrors(async(req, res, next)=>{
// const {id} = req.params;
// const {views} = req.body;

// const blogpost = await BlogPost.findById(id);
// if (!blogpost) {
//     return next(new ErrorHandler("Blog post not found", 404));
// }
// blogpost.views = views;
// await blogpost.save();

// res.status(200).json({
//     success: true,
//     message: "view updated successfully",
//     blogpost,
// });


// })

export const updateBlogView = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the blog post by ID
    const blogpost = await BlogPost.findById(id);
    if (!blogpost) {
        return next(new ErrorHandler("Blog post not found", 404));
    }

    // Increment the view count
    blogpost.views = (blogpost.views || 0) + 1;
    await blogpost.save();

    res.status(200).json({
        success: true,
        message: "View count updated successfully",
        blogpost,
    });
});
export const updateBlogLike = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the blog post by ID
    const blogpost = await BlogPost.findById(id);
    if (!blogpost) {
        return next(new ErrorHandler("Blog post not found", 404));
    }

    // Increment the view count
    blogpost.likes = (blogpost.likes || 0) + 1;
    await blogpost.save();

    res.status(200).json({
        success: true,
        message: "Like count updated successfully",
        blogpost,
    });
});

// Delete a blog post
export const deleteBlogPost = async (req, res) => {
    try {
        const { id} = req.params;
        const blogPost = await BlogPost.findByIdAndDelete(id);
        if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
        res.json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single blog post
export const getBlogPosta = async (req, res) => {
    try {
        const { id } = req.params;
        // const blogPostBeforePopulate = await BlogPost.findById(id);
        // console.log('Before populate:', blogPostBeforePopulate);
        // Find the blog post by ID and populate both author and guestAuthor fields
        const blogPost = await BlogPost.findById(id)
        
            .populate('author') // Populate the author field
            .populate('guestAuthor') // Populate the guestAuthor field
            .populate('comments'); // Populate the comments if needed
            console.log(blogPost.guestAuthor); 
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.json(blogPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get a single blog post


// Get all blog posts
// export const getAllBlogPosts = async (req, res) => {
//     try {
//         const blogPosts = await BlogPost.find().populate('author').populate('comments');
//         res.json(blogPosts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 


 
export const getBlogPost = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the blog post by ID and populate fields
        const blogPost = await BlogPost.findById(id)
            .populate({
                path: 'author',
                select: 'fullName avatar',
            })
            .populate({
                path: 'guestAuthor',
                select: 'picture name',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'guestAuthor',
                    select: 'name picture',
                }
            });

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        if (blogPost.guestAuthor === null) {
            console.warn('Guest Author reference is null. check guest author exist?');
        }
        console.log('Populated Blog Post:', blogPost);
        res.json(blogPost);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: error.message });
    }
});
export const getBlogPostWithSlug = catchAsyncErrors(async (req, res, next) => {
    console.log("Route hit: ", req.params.slug); // Check if the route is hit

    try {
        const { slug } = req.params;

        const blogPost = await BlogPost.findOne({ slug })
            .populate({
                path: 'author',
                select: 'fullName avatar titles',
            })
            .populate({
                path: 'categories',
                
            })
            .populate({
                path: 'guestAuthor',
                select: 'picture name',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'guestAuthor',
                    select: 'name picture',
                }
            });

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        console.log('Populated Blog Post:', blogPost);
        res.json(blogPost);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: error.message });
    }
});

 
export const getAllBlogPosts = catchAsyncErrors(async (req, res, next) => {
    const blogPosts = await BlogPost.find()
    .populate({
        path: 'author',
        select: 'fullName avatar', // Select only the fullName and avatar fields
    })  .populate({
        path: 'guestAuthor',
        select: ' picture name', // Select only the fullName and avatar fields
    });

    if (!blogPosts) {
        return next(new ErrorHandler('No blog posts found', 404));
    }

    res.status(200).json({
        success: true,
        blogPosts,
    });
});

 