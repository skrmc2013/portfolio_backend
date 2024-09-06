import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from 'cloudinary';
import { Project } from "../models/projectSchema.js";
import slugify from "slugify";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {

    // const {projectBanner} =  req.files;

    const { name, description, summary, objectives, features, seo, visibility, deployed, milestones, technologies, progress, tags,budget, teamMembers, startDate, endDate ,githubLink,projectLink} = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Project Thumbnail is required", 400));
    }
    const { projectBanner } = req.files;


    if (!name) {
        return next(new ErrorHandler("Project name is required", 400));
    }
    else if (!description) {
        return next(new ErrorHandler("Project description is required", 400));
    }
    else if (!summary) {
        return next(new ErrorHandler("Project summmary is required", 400));
    }
    else if (!objectives) {
        return next(new ErrorHandler("Project Objectives are required", 400));
    }
    else if (!features) {
        return next(new ErrorHandler("Project Features are required", 400));
    }
    else if (!seo) {
        return next(new ErrorHandler("Project SEO is required with metaTitle and metaDescription", 400));
    } else if (!visibility) {
        return next(new ErrorHandler("Project Visibility permission are required", 400));
    }
    else if (!milestones) {
        return next(new ErrorHandler("Project milestonses are required", 400));
    }
    else if (!technologies) {
        return next(new ErrorHandler("Technologies are required", 400));
    }
    else if (!progress) {
        return next(new ErrorHandler("Progress is required", 400));
    }

    console.log("Request Body:", req.body);

    let seoData = {};
    let objectivesData;
    let featuresData;
    let milestonesData;
    let technologiesData;
    let progressData;
let tagsData;

    try {
        seoData = JSON.parse(seo);
        if (typeof seoData !== 'object' || Array.isArray(seoData)) {
            throw new Error("Invalid SEO Data format");
        }
        if (typeof objectives === 'string') {
            objectivesData = objectives.split(',').map(e => e.trim());
        } else if (Array.isArray(objectives)) {
            objectivesData = objectives.map(e => e.trim());
        } else {
            throw new Error("Invalid Objectives format");
        }

        if (typeof features === 'string') {
            featuresData = features.split(',').map(e => e.trim());
        } else if (Array.isArray(features)) {
            featuresData = features.map(e => e.trim());
        } else {
            throw new Error("Invalid features format");
        }


        if (milestones) {
            milestonesData = milestones.split('|').map(milestone => {
                try {
                    return JSON.parse(milestone);
                } catch (e) {
                    throw new Error("Invalid Milestones Data format");
                }
            });

            if (milestones.deadline && isNaN(Date.parse(milestones.deadline))) {
                throw new Error("Invalid deadline format");
            }
        }

        if (typeof technologies === 'string') {
            technologiesData = technologies.split(',').map(e => e.trim());
        } else if (Array.isArray(technologies)) {
            technologiesData = technologiesData.map(e => e.trim());
        } else {
            throw new Error("Invalid Technologies format");
        }
        progressData = JSON.parse(progress);
        if (typeof progressData !== 'object' || Array.isArray(progressData)) {
            throw new Error("Invalid Progress Data format");
        }


        if (typeof tags === 'string') {
            tagsData = tags.split(',').map(e => e.trim());
        } else if (Array.isArray(tags)) {
            tagsData = tags.map(e => e.trim());
        } else {
            throw new Error("Invalid Tags format");
        }


    } catch (e) {
        return next(new ErrorHandler(e, 400));

    }

    // Upload project banner to Cloudinary
    let projectBannerData = {};

    if (projectBanner) {
        try {
            const cloudinaryResponseForProjectBanner = await cloudinary.uploader.upload(
                projectBanner.tempFilePath,
                {
                    folder: "PROJECT_THUMBNAIL",
                    allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
                }
            );

            if (!cloudinaryResponseForProjectBanner || cloudinaryResponseForProjectBanner.error) {
                throw new Error("Error uploading to Cloudinary");
            }

            projectBannerData = {
                type: cloudinaryResponseForProjectBanner.format,
                public_id: cloudinaryResponseForProjectBanner.public_id,
                url: cloudinaryResponseForProjectBanner.secure_url,
            };
        } catch (e) {
            console.error("Cloudinary error:", e);
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }
    }

    const teamMembersArray = req.body.teamMembers.split(',').map(id => id.trim());
    const milestonesArray = JSON.parse(req.body.milestones);
    const budgetObject = JSON.parse(req.body.budget);
    const visibilityObject = JSON.parse(req.body.visibility);
    const progressObject = JSON.parse(req.body.progress);
    const slug = slugify(name, { lower: true });
    const projectData = await Project.create({
        name,
        slug,
        description,
        summary,
        objectives: objectivesData,
        features: featuresData,
        seo: seoData,
        // visibility,
        visibility: visibilityObject,
        deployed,
        technologies: technologiesData,
        progress: progressData,
        projectBanner: projectBannerData,
        // milestones: milestonesData,
        milestones: milestonesArray,
        tags:tagsData,
        // budget: {
            // initial: budget?.initial,
            // spent: budget?.spent || 0,
        // },
        budget: budgetObject,
        // teamMembers,
        teamMembers: teamMembersArray,
        startDate,
        endDate,
        githubLink,
        projectLink,
    });

    console.log("Project created successfully:", JSON.stringify(projectData, null, 2));

    res.status(200).json({
        success: true,
        message: "Project Added Successfully",
        projectData,
    });

});



export const updateProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, summary, objectives, features, seo, visibility, deployed, milestones, technologies, progress, tags } = req.body;

    let seoData = {};
    let objectivesData;
    let featuresData;
    let milestonesData;
    let technologiesData;
    let progressData;
    let tagsData;

    try {
        seoData = JSON.parse(seo);
        if (typeof seoData !== 'object' || Array.isArray(seoData)) {
            throw new Error("Invalid SEO Data format");
        }
        if (typeof objectives === 'string') {
            objectivesData = objectives.split(',').map(e => e.trim());
        } else if (Array.isArray(objectives)) {
            objectivesData = objectives.map(e => e.trim());
        } else {
            throw new Error("Invalid Objectives format");
        }

        if (typeof features === 'string') {
            featuresData = features.split(',').map(e => e.trim());
        } else if (Array.isArray(features)) {
            featuresData = features.map(e => e.trim());
        } else {
            throw new Error("Invalid Features format");
        }

        if (milestones) {
            milestonesData = milestones.split('|').map(milestone => {
                try {
                    return JSON.parse(milestone);
                } catch (e) {
                    throw new Error("Invalid Milestones Data format");
                }
            });

            if (milestones.deadline && isNaN(Date.parse(milestones.deadline))) {
                throw new Error("Invalid deadline format");
            }
        }

        if (typeof technologies === 'string') {
            technologiesData = technologies.split(',').map(e => e.trim());
        } else if (Array.isArray(technologies)) {
            technologiesData = technologies.map(e => e.trim());
        } else {
            throw new Error("Invalid Technologies format");
        }

        progressData = JSON.parse(progress);
        if (typeof progressData !== 'object' || Array.isArray(progressData)) {
            throw new Error("Invalid Progress Data format");
        }

        if (typeof tags === 'string') {
            tagsData = tags.split(',').map(e => e.trim());
        } else if (Array.isArray(tags)) {
            tagsData = tags.map(e => e.trim());
        } else {
            throw new Error("Invalid Technologies format");
        }

    } catch (e) {
        return next(new ErrorHandler(e, 400));
    }


    // Update project banner if provided
    let projectBannerData = {};

    if (req.files && req.files.projectBanner) {
        const { projectBanner } = req.files;
        try {
            const cloudinaryResponseForProjectBanner = await cloudinary.uploader.upload(
                projectBanner.tempFilePath,
                {
                    folder: "PROJECT_THUMBNAIL",
                    allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
                }
            );

            if (!cloudinaryResponseForProjectBanner || cloudinaryResponseForProjectBanner.error) {
                throw new Error("Error uploading to Cloudinary");
            }

            projectBannerData = {
                type: cloudinaryResponseForProjectBanner.format,
                public_id: cloudinaryResponseForProjectBanner.public_id,
                url: cloudinaryResponseForProjectBanner.secure_url,
            };
        } catch (e) {
            console.error("Cloudinary error:", e);
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }
    }

    const updatedProjectData = {
        name,
        description,
        summary,
        objectives: objectivesData,
        features: featuresData,
        seo: seoData,
        visibility,
        deployed,
        technologies: technologiesData,
        progress: progressData,
        milestones: milestonesData,
        tags:tagsData
    };

    if (Object.keys(projectBannerData).length > 0) {
        updatedProjectData.projectBanner = projectBannerData;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updatedProjectData, {
        new: true,
        // runValidators: true
    });


    if (!updatedProject) {
        return next(new ErrorHandler("Project not found", 404));
    }

    console.log("Project updated successfully:", JSON.stringify(updatedProject, null, 2));

    res.status(200).json({
        success: true,
        message: "Project Updated Successfully",
        updatedProject,
    });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Project I'd is required", 400));
    }
    const deleteproject = await Project.findById(id);
    if (!deleteproject) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (deleteproject.projectBanner && deleteproject.projectBanner.public_id) {
        try {

            await cloudinary.uploader.destroy(deleteproject.projectBanner.public_id);
        } catch (error) {
            return next(new ErrorHandler("Error deleting thumbnail from Cloudinary", 500));
        }
    }


    await Project.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Project deleted successfully"
    });

});

export const getAllProject = catchAsyncErrors(async (req, res, next) => {

    const projectsdata = await Project.find().populate({
        path: 'teamMembers',
        strictPopulate: false,
    });
    res.status(200).json({
        success: true,
        message: "Projects Fetched Successfully",
        projectsdata,
    });

});

export const getSingleProject = catchAsyncErrors(async (req, res, next) => {

    // const { id } = req.params;
    const { slug } = req.params;

    // if (!id) {
    //     return next(new ErrorHandler("Project I'd is required", 400));
    // }
    if (!slug) {
        return next(new ErrorHandler("Slug is required", 400));
    }

    // const getproject = await Project.findById(id);
    
    const getproject = await Project.findOne({ slug })
    .populate({
        path: 'teamMembers',
        strictPopulate: false,
    });
    if (!getproject) {
        return next(new ErrorHandler("Project not found", 404));
    }
    // await Project.findById(id);
    await Project.findOne({slug});
    res.status(200).json({
        success: true,
        message: "Project get successfully",
        getproject,
    });

});



// // let {
//     name, description, summary, objectives, scope, features, seo, visibility, resources,
//     budget, cost, progress, milestones,  team, comments, activityLogs, categories, githubLink, tags,
//     attachments, backgroundMedia, adminBackgroundOverride, overrideBackgroundId,  introVideo,liveStatus, technologies,
//     deployed, projectLink  } = req.body;