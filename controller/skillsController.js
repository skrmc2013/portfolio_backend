import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from 'cloudinary';
import { Skills } from "../models/skillSchema.js";

export const addSkills = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Skills icons are required", 400));
    }

    const { svg } = req.files; // Extracting SVG file from request
    const { name, proficiencyLevel, experience, category, description, icon, 
        // displaySettings 
        showOnPortfolio,
        showOnWebsite,
        showOnResume,
    } = req.body;
//  let {seo} = req.body;
let {metaTitle, metaDescription, keywords} = req.body;
// Parse keywords if it's coming as a JSON string
if (typeof keywords === 'string') {
    try {
        keywords = JSON.parse(keywords);
    } catch (e) {
        return next(new ErrorHandler("Invalid keywords format", 400));
    }
}
    // Validate required fields
    if (!name) {
        return next(new ErrorHandler("Skill Name is required", 400));
    } else if (!proficiencyLevel) {
        return next(new ErrorHandler("Proficiency Level is required", 400));
    } else if (!experience) {
        return next(new ErrorHandler("Experience is required", 400));
    } else if (!category) {
        return next(new ErrorHandler("Category is required", 400));
    } else if (!description) {
        return next(new ErrorHandler("Description is required", 400));
    } else if (!icon) {
        return next(new ErrorHandler("Icon is required", 400));
    } 
    // else if (!displaySettings) {
    //     return next(new ErrorHandler("DisplaySettings are required", 400));
    // }

    // let seoData;
    // try{
    //     seoData = JSON.parse(seo);
    //     if (typeof seoData !== 'object' || Array.isArray(seoData)) {
    //         throw new Error("Invalid SEO Data format");
    //     }
    // }catch(e){
    //     return next(new ErrorHandler(e, 400));
    // }


    // Handle different types of icons
    let svgData = {};

    // let displaySettingData;
    // try {
    //     displaySettingData = JSON.parse(displaySettings);
    //     if (typeof displaySettingData !== 'object' || Array.isArray(displaySettingData)) {
    //         throw new Error("Invalid displaySettings format");
    //     }
    // } catch (e) {
    //     return next(new ErrorHandler(e, 400));

    // }
    if (svg) {
        // Upload to Cloudinary
        const cloudinaryResponseForSkills = await cloudinary.uploader.upload(
            svg.tempFilePath,
            {
                folder: "SKILLS_ICONS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponseForSkills || cloudinaryResponseForSkills.error) {
            console.error("Cloudinary error: ", cloudinaryResponseForSkills.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        svgData = {
            type: cloudinaryResponseForSkills.format,
            public_id: cloudinaryResponseForSkills.public_id,
            url: cloudinaryResponseForSkills.secure_url,
        };
    }

    const skillsdata = await Skills.create({
        name,
        proficiencyLevel,
        experience,
        category,
        description,
        icon,
        displaySettings: { showOnPortfolio,
            showOnWebsite,
            showOnResume},
        // displaySettings: displaySettingData,
        svg: svgData,
        seo: {metaTitle, metaDescription, keywords},
        // seo: seoData,

    });
    console.log("skills data", skillsdata);
    res.status(200).json({
        success: true,
        message: "Skill Added successfully",
        data: skillsdata,

    })
});



export const deleteSkills = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Skill I'd is required", 400));
    }
    const skillicon = await Skills.findById(id);
    if (!skillicon) {
        return next(new ErrorHandler("Skill Icon not found", 404));
    }

    if (skillicon.svg && skillicon.svg.public_id) {
        try {

            await cloudinary.uploader.destroy(skillicon.svg.public_id);
        } catch (error) {
            return next(new ErrorHandler("Error deleting icon from Cloudinary", 500));
        }
    }


    await Skills.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Skill deleted successfully"
    });
});






export const updateSkills = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, proficiencyLevel, experience, category, description, icon, displaySettings } = req.body;
let {seo} =  req.body;
    
    if (!id) {
        return next(new ErrorHandler("Skill I'd is required", 400));
    }

    if (!name) {
        return next(new ErrorHandler("Skill Name is required", 400));
    } else if (!proficiencyLevel) {
        return next(new ErrorHandler("Proficiency Level is required", 400));
    } else if (!experience) {
        return next(new ErrorHandler("Experience is required", 400));
    } else if (!category) {
        return next(new ErrorHandler("Category is required", 400));
    } else if (!description) {
        return next(new ErrorHandler("Description is required", 400));
    } else if (!icon) {
        return next(new ErrorHandler("Icon is required", 400));
    } else if (!displaySettings) {
        return next(new ErrorHandler("DisplaySettings are required", 400));
    }
    let displaySettingData;
    try {
        displaySettingData = JSON.parse(displaySettings);
        if (typeof displaySettingData !== 'object' || Array.isArray(displaySettingData)) {
            throw new Error("Invalid displaySettings format");
        }
    } catch (e) {
        return next(new ErrorHandler(e, 404));

    }
    let seoData;
    try{
        seoData = JSON.parse(seo);
        if (typeof seoData !== 'object' || Array.isArray(seoData)) {
            throw new Error("Invalid SEO Data format");
        }
    }catch(e){
        return next(new ErrorHandler(e, 400));
    }

    // Handling SVG update (if needed)
    let svgData = {};
    if (req.files && req.files.svg) {
        // Assuming the new SVG file is uploaded
        const svgFile = req.files.svg;
        try {
            const cloudinaryResponseForSkills = await cloudinary.uploader.upload(svgFile.tempFilePath, {
                folder: "SKILLS_ICONS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            });

            if (!cloudinaryResponseForSkills || cloudinaryResponseForSkills.error) {
                return next(new ErrorHandler("Error uploading to Cloudinary", 500));
            }

            svgData = {
                type: cloudinaryResponseForSkills.format,
                public_id: cloudinaryResponseForSkills.public_id,
                url: cloudinaryResponseForSkills.secure_url,
            };
        } catch (error) {
            return next(new ErrorHandler("Failed to update SVG icon", 500));
        }
    }

    // Update the skill
    const skillUpdate = await Skills.findByIdAndUpdate(id, {
        name,
        proficiencyLevel,
        experience,
        category,
        description,
        icon,
        displaySettings: displaySettingData,
        ...(Object.keys(svgData).length && { svg: svgData }), // Only update svg if it's provided
        seo:seoData,
    }, {
        new: true,
    });

    if (!skillUpdate) {
        return next(new ErrorHandler("Skill not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Skill Updated Successfully",
        skillUpdate,
    });

});





export const getAllSkills = catchAsyncErrors(async (req, res, next) => {

    const skillsdata = await Skills.find().populate('icon');

    res.status(200).json({
        success: true,
        message: "Skills Fetched Successfully",
        skillsdata,
    });
});

