import {BlogPost, GuestAuthor} from '../models/BlogPostSchema.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import cloudinary from 'cloudinary';

export const createOrFindGuestAuthor = catchAsyncErrors(async (req, res, next) => {
    const { name, email, displayOnWebsite } = req.body;
   

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    let existingGuestAuthor = await GuestAuthor.findOne({ email });

    if (existingGuestAuthor) {
        return res.status(200).json({
            success: true,
            message: "Guest Author exists",
            guestAuthor: existingGuestAuthor
        });
    } 

    if (!name ) {
        return next(new ErrorHandler("Name is required for a new Guest Author", 400));
    }
    const { picture } = req.files;

    if (!picture) {
        return next(new ErrorHandler(" picture required for a new Guest Author", 400));
    }
   
    let pictureData = {};
    
    if (picture) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            picture.tempFilePath,
            {
                folder: "GUEST_AUTHORS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        pictureData = {
            type: cloudinaryResponse.format,
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    const newGuestAuthor = await GuestAuthor.create({ name, email, picture: pictureData , displayOnWebsite});

    res.status(200).json({
        success: true,
        message: "Guest Author created successfully",
        guestAuthor: newGuestAuthor
    });
});
export const updateGuestAuthor = catchAsyncErrors(async (req, res, next) => {
    const { name, email, displayOnWebsite } = req.body;
   

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    let guestAuthor = await GuestAuthor.findOne({ email });

    if (!guestAuthor) {
        return next(new ErrorHandler("Guest Author not found", 404));
    }

    if (name) {
        guestAuthor.name = name;
    }
    const { picture } = req.files;

    if (picture) {
        // Upload new picture to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            picture.tempFilePath,
            {
                folder: "GUEST_AUTHORS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        guestAuthor.picture = {
            type: cloudinaryResponse.format,
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }
    if(displayOnWebsite){
        guestAuthor.displayOnWebsite = displayOnWebsite;
    }

    await guestAuthor.save();

    res.status(200).json({
        success: true,
        message: "Guest Author updated successfully",
        guestAuthor
    });
});

export const getAllGuestAuthors = catchAsyncErrors(async (req, res, next) => {
    const guestAuthors = await GuestAuthor.find();

    res.status(200).json({
        success: true,
        guestAuthors
    });
});
export const deleteGuestAuthor = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const guestAuthor = await GuestAuthor.findById(id);

    if (!guestAuthor) {
        return next(new ErrorHandler("Guest Author not found", 404));
    }

    // Directly delete the document using findByIdAndDelete
    await BlogPost.deleteMany({ guestAuthor: id });

    // Then delete the guest author
    await GuestAuthor.findByIdAndDelete(id);


    res.status(200).json({
        success: true,
        message: "Guest Author and associated blog posts deleted successfully",
    });
});
// export const getAllGuestAuthorsWithBlogs = catchAsyncErrors(async (req, res, next) => {
//     const guestAuthors = await GuestAuthor.find().populate({
//         path: 'blogPosts',
//         model: 'BlogPost',
//         populate: {
//             path: 'guestAuthor',
//             select: 'name email',  // Select specific fields if needed
//         },
//     });

//     res.status(200).json({
//         success: true,
//         guestAuthors,
//     });
// });
export const getAllGuestAuthorsWithBlogs = catchAsyncErrors(async (req, res, next) => {
    const guestAuthors = await GuestAuthor.find()
        .populate({
            path: 'blogposts',
            select: 'title slug content createdAt', // Specify which fields you want to include from BlogPost
        });

    res.status(200).json({
        success: true,
        guestAuthors,
    });
});
// export const getSingleGuestAuthorWithBlogs = catchAsyncErrors(async (req, res, next) => {
//     const { id } = req.params;

//     const guestAuthor = await GuestAuthor.findById(id).populate({
//         path: 'blogPosts',
//         model: 'BlogPost',
//         populate: {
//             path: 'guestAuthor',
//             select: 'name email',  // Select specific fields if needed
//         },
//     });

//     if (!guestAuthor) {
//         return next(new ErrorHandler("Guest Author not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         guestAuthor,
//     });
// });

export const getSingleGuestAuthorWithBlogs = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const guestAuthor = await GuestAuthor.findById(id)
        .populate({
            path: 'blogposts',
            select: 'title content createdAt', // Customize which fields to retrieve
        });

    if (!guestAuthor) {
        return next(new ErrorHandler("Guest Author not found", 404));
    }

    res.status(200).json({
        success: true,
        guestAuthor,
    });
});



// import GuestAuthor from '../models/GuestAuthor.js';
// import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
// import ErrorHandler from '../middlewares/error.js';

// // Create or find a guest author
// export const createOrFindGuestAuthor = catchAsyncErrors(async (req, res, next) => {
//     const { name, email } = req.body;
// const {picture} = req.files;

//     if (!name || !email) {
//         return next(new ErrorHandler("Name and email are required", 400));
//     }
//     if (!picture) {
//         return next(new ErrorHandler("Picture is required", 400));
//     }

//     let pictureData = {};
//     // Upload cover image if provided
   

//     // Check if guest author already exists
//     // let guestAuthor = await GuestAuthor.findOne({ email });

//     let existingGuestAuthor = await GuestAuthor.findOne({ email });
    
//     if (existingGuestAuthor) {
//         return existingGuestAuthor;
//     }


//     if (!existingGuestAuthor) {

//         if (picture) {
//             const cloudinaryResponse = await cloudinary.uploader.upload(
//                 picture.tempFilePath,
//                 {
//                     folder: "GUEST_AUTHORS",
//                     allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
//                 }
//             );
    
//             if (!cloudinaryResponse || cloudinaryResponse.error) {
//                 return next(new ErrorHandler("Error uploading to Cloudinary", 500));
//             }
    
//             pictureData = {
//                 type: cloudinaryResponse.format,
//                 public_id: cloudinaryResponse.public_id,
//                 url: cloudinaryResponse.secure_url,
//             };
//         }
//         // Create new guest author
//         const newGuestAuthor = await GuestAuthor.create({ name, email, picture:pictureData });
//     }

//     res.status(200).json({
//         success: true,
//         message: "Guest Author created successfully",
//         guestAuthor,
//     });
// });
