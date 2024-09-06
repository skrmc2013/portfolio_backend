import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Icon } from "../models/iconSchema.js";

export const addIcon = catchAsyncErrors(async (req, res, next) => {
    const {
        name,
        type,
        libraryType,
        iconClassName,
        iconName,
        icon,
        file,
        other,
        completeTag,
        svgData,
        lottieFilesData,
        size,
        color,
        className,
        homepage,
        skillsSection,
        projectSection,
        footer,
         packageName,
        importPath,
        componentPath,
        componentName,
    } = req.body;

    if (!name) {
        return next(new ErrorHandler("Missing required field: name", 400));
    }
    if (!type) {
        return next(new ErrorHandler("Missing required field: type", 400));
    }
    if (!libraryType) {
        return next(new ErrorHandler("Missing required field: libraryType", 400));
    }

    const newIcon = await Icon.create({
        name,
        type,
        libraryType,
        properties: { iconClassName, iconName, icon, file, other, completeTag },
        svgData,
        lottieFilesData,
        packageName,
        importPath,
        styles: { size, color, className },
        displayLocations: { homepage, skillsSection, projectSection, footer },
        component: {componentName, componentPath },
    });

    console.log("Submitted data is", newIcon);

    res.status(201).json({
        success: true,
        message: "Icon added successfully",
        data: newIcon
    });
});

// Update an existing icon
export const updateIcon = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const {
        name,
        type,
        libraryType,
        iconClassName,
        iconName,
        icon,
        file,
        other,
        completeTag,
        svgData,
        lottieFilesData,
        size,
        color,
        className,
        homepage,
        skillsSection,
        projectSection,
        footer,
        packageName,
        importPath,
        componentPath,
        componentName,
    } = req.body;

    if (!name) {
        return next(new ErrorHandler("Missing required field: name", 400));
    }
    if (!type) {
        return next(new ErrorHandler("Missing required field: type", 400));
    }
    if (!libraryType) {
        return next(new ErrorHandler("Missing required field: libraryType", 400));
    }

    const updatedIcon = await Icon.findByIdAndUpdate(
        id,
        {
            name,
            type,
            libraryType,
            properties: { iconClassName, iconName, icon, file, other, completeTag },
            svgData,
            lottieFilesData,
            packageName,
            importPath,
            styles: { size, color, className },
            displayLocations: { homepage, skillsSection, projectSection, footer },
            component: {componentName, componentPath },
        },
        { new: true, runValidators: true } // Ensures the returned document is the updated one and validators are run
    );

    if (!updatedIcon) {
        return next(new ErrorHandler("Icon not found", 404));
    }

    console.log("Updated data is", updatedIcon);

    res.status(200).json({
        success: true,
        message: "Icon updated successfully",
        data: updatedIcon
    });
});

// Delete an icon
export const deleteIcon = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const icon = await Icon.findByIdAndDelete(id);

    if (!icon) {
        return next(new ErrorHandler("Icon not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Icon deleted successfully",
        data: icon
    });
});

// Get a single icon
export const getSingleIcon = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const icon = await Icon.findById(id);

    if (!icon) {
        return next(new ErrorHandler("Icon not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Icon fetched successfully",
        data: icon
    });
});

// Get all icons
export const getAllIcons = catchAsyncErrors(async (req, res, next) => {
    const iconsData = await Icon.find();

    res.status(200).json({
        success: true,
        message: "Icons fetched successfully",
        data: iconsData
    });
});

// export const updateIcons =catchAsyncErrors(async (req, res, next)=>{
//     const {id} = req.params;

//     const {
//         name,
//         type,
//         libraryType,
//         properties,
//         svgData,
//         lottieFilesData,
//         styles,
//         displayLocations,
//         visibility
//     } = req.body;
//     console.log("Provided data is",req.body);
//     // Validate required fields
//     if (!name || !type || !libraryType) {
//         return next(new ErrorHandler("Missing required fields", 400));
//     }
//     let parsedVisibility;
//     try {
//         parsedVisibility = typeof visibility === 'string' ? JSON.parse(visibility) : visibility;
//     } catch (error) {
//         return next(new ErrorHandler("Invalid visibility format", 400));
//     }

//     if (typeof parsedVisibility !== 'object' || Array.isArray(parsedVisibility)) {
//         return next(new ErrorHandler("Visibility must be an object", 400));
//     }
//     const newIcon = await Icon.findByIdAndUpdate(id,{
//         name,
//         type,
//         libraryType,
//         properties,
//         svgData,
//         lottieFilesData,
//         styles,
//         displayLocations,
//         // visibility: new Map(Object.entries(parsedVisibility))
//     });
//     console.log("Submitted data is", newIcon);

//     // await newIcon.save();

//     res.status(201).json({
//         success: true,
//         message: "Icon added successfully",
//         data: newIcon
//     });

// });


