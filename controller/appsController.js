import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from 'cloudinary'; // Make sure to import cloudinary correctly
import { appsIcons } from "../models/appSchema.js"; // Ensure the correct path to your schema

export const addApps = catchAsyncErrors(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("App icons are required", 400));
    }

    const { svg } = req.files; // Extracting SVG file from request
    const { title, library, iconType, fa, custom, displayLocations } = req.body;
    console.log("request body data:", req.body);
    console.log("request files data:", req.files);
    // Validate required fields
    // if (!title) {
    //     return next(new ErrorHandler("Application title is required", 400));
    // }
    if (!library || !iconType || !displayLocations) {
        return next(new ErrorHandler("Library, icon type, and display locations are required", 400));
    }

    // Handle different types of icons
    let svgData = {};
    if (svg) {
        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            svg.tempFilePath,
            {
                folder: "APP_ICONS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary error: ", cloudinaryResponse.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        svgData = {
            type: cloudinaryResponse.format,
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    // Parse fa and custom fields
    const faData = fa ? JSON.parse(fa) : {};
    const customData = custom ? JSON.parse(custom) : {};
console.log("request body data:", req.body);

    // Create app icon entry
    const appsicon = await appsIcons.create({
        title,
        library,
        iconType,
        svg: svgData,
        fa: faData,
        custom: customData,
        displayLocations: JSON.parse(displayLocations), // Changed to plural form
    });

    console.log("Submitted data:", appsicon);

    res.status(201).json({
        success: true,
        message: "Icons Added successfully",
        data: appsicon,
        
    });
});

export const deleteApps = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ErrorHandler("App icon ID is required", 400));
    }

    const appsicon = await appsIcons.findById(id);

    if (!appsicon) {
        return next(new ErrorHandler("App icon not found", 404));
    }

    // Delete the icon from Cloudinary
    if (appsicon.svg && appsicon.svg.public_id) {
        await cloudinary.uploader.destroy(appsicon.svg.public_id);
    }

    // Delete the icon from the database
    await appsIcons.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "App icon deleted successfully"
    });
});

export const getAllApps = catchAsyncErrors(async (req, res, next) => {
    const appsicons = await appsIcons.find();

    res.status(200).json({
        success: true,
        message: "App Icon Fetched succesfully",
     appsicons,
    });
});



export const getUpdateApps = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // Assuming the ID is passed in the URL parameters
    const { title, library, iconType, fa, custom, displayLocations } = req.body;

    // Validate required fields
    if (!id) {
        return next(new ErrorHandler("App ID is required", 400));
    }
    if (!title || !library || !iconType || !displayLocations) {
        return next(new ErrorHandler("Title, library, icon type, and display locations are required", 400));
    }

    // Ensure displayLocations is an object
    let displayLocationsData;
    try {
        displayLocationsData = JSON.parse(displayLocations);
        if (typeof displayLocationsData !== 'object' || Array.isArray(displayLocationsData)) {
            throw new Error();
        }
    } catch (error) {
        return next(new ErrorHandler("Invalid displayLocations format", 400));
    }

    // Update the app icon entry
    const updatedApp = await appsIcons.findByIdAndUpdate(
        id,
        {
            title,
            library,
            iconType,
            fa: fa ? JSON.parse(fa) : {},
            custom: custom ? JSON.parse(custom) : {},
            displayLocations: displayLocationsData
        },
        { new: true } // Return the updated document
    );

    if (!updatedApp) {
        return next(new ErrorHandler("App icon not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "App icon Updated succesfully",
        data: updatedApp,
    });
});
