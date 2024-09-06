import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from 'cloudinary';
import { TeamMember } from "../models/teamMemberSchema.js";


export const addTeamMember = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Files are required", 400));
    }

    const { profilePicture } = req.files;
    const { name, email, phone, bio, projects, isActive, roles, skills, seo } = req.body;
let { displaySettings} = req.body;
    // Parse roles to array if it is a string
    let parsedRoles = roles;
    if (typeof roles === 'string') {
        parsedRoles = roles.split(',').map(role => role.trim());
    }

    let parsedSkills = skills;
    if (typeof skills === 'string') {
        parsedSkills = skills.split(',').map(skill => skill.trim());
    }

    if (typeof displaySettings === 'string') {
        displaySettings = JSON.parse(displaySettings);
    }

    let seoData;
    try {
        seoData = typeof seo === 'string' ? JSON.parse(seo) : seo;
        if (typeof seoData !== 'object' || Array.isArray(seoData)) {
            throw new Error("Invalid SEO Data format");
        }
    } catch (e) {
        return next(new ErrorHandler(e.message, 400));
    }

    if (!name) {
        return next(new ErrorHandler("Name is required", 400));
    }
    if (!parsedRoles || !Array.isArray(parsedRoles) || parsedRoles.length === 0) {
        return next(new ErrorHandler("At least one role is required", 400));
    }
    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }
    if (!phone) {
        return next(new ErrorHandler("Phone number is required", 400));
    }
    if (!parsedSkills || parsedSkills.length === 0) {
        return next(new ErrorHandler("At least one skill is required", 400));
    }
    if (!bio) {
        return next(new ErrorHandler("Bio is required", 400));
    }
    if (isActive === undefined || isActive === null) {
        return next(new ErrorHandler("Active status is required", 400));
    }
    if (!displaySettings) {
        return next(new ErrorHandler("Display settings are required", 400));
    }

    let profilePictureData = {};
    if (profilePicture) {
        try {
            const cloudinaryResponseForProfilePicture = await cloudinary.uploader.upload(
                profilePicture.tempFilePath,
                {
                    folder: "TEAM_PROFILE_PICTURE",
                    allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
                }
            );

            if (!cloudinaryResponseForProfilePicture || cloudinaryResponseForProfilePicture.error) {
                throw new Error(cloudinaryResponseForProfilePicture.error || "Unknown Cloudinary error");
            }

            profilePictureData = {
                type: cloudinaryResponseForProfilePicture.format,
                public_id: cloudinaryResponseForProfilePicture.public_id,
                url: cloudinaryResponseForProfilePicture.secure_url,
            };
        } catch (error) {
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }
    }

    const teamMemberData = await TeamMember.create({
        name,
        roles: parsedRoles,
        email,
        phone,
        skills: parsedSkills,
        bio,
        projects: projects ? projects.split(',').map(pro => pro.trim()) : [],
        isActive,
        displaySettings,
        profilePicture: profilePictureData,
        seo: seoData,
    });

    res.status(200).json({
        success: true,
        message: "Team Member added successfully",
        teamMemberData,
    });
});


export const deleteTeamMember = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

   
    if (!id || id.trim().length === 0) {
        return next(new ErrorHandler("ID is required", 400));
    }

    
    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
        return next(new ErrorHandler("Member not found", 404));
    }

    await TeamMember.findByIdAndDelete(id);

    
    res.status(200).json({
        success: true,
        message: "Member deleted successfully",
        deletedMember: teamMember,  
    });
});
// export const getTeamMember = catchAsyncErrors(async(req, res, next)=>{

// });
export const updateTeamMember = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;  // Extract ID from params

    // Validate ID
    if (!id || id.trim().length === 0) {
        return next(new ErrorHandler("ID is required", 400));
    }

    // Validate and handle file uploads
    let profilePictureData = {};
    if (req.files && req.files.profilePicture) {
        const { profilePicture } = req.files;

        // Upload to Cloudinary
        const cloudinaryResponseForProfilePicture = await cloudinary.uploader.upload(
            profilePicture.tempFilePath,
            {
                folder: "TEAM_PROFILE_PICTURE",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (cloudinaryResponseForProfilePicture.error) {
            console.error("Cloudinary error: ", cloudinaryResponseForProfilePicture.error);
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        profilePictureData = {
            type: cloudinaryResponseForProfilePicture.format,
            public_id: cloudinaryResponseForProfilePicture.public_id,
            url: cloudinaryResponseForProfilePicture.secure_url,
        };
    }

    // Extract and validate the required fields
    let { name, roles, email, phone, skills, bio, projects, isActive, displaySettings , seo} = req.body;

    if (!name) {
        return next(new ErrorHandler("Name is required", 400));
    } else if (!roles || roles.length === 0) {
        return next(new ErrorHandler("At least one role is required", 400));
    } else if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    } else if (!phone) {
        return next(new ErrorHandler("Phone number is required", 400));
    } else if (!skills || skills.length === 0) {
        return next(new ErrorHandler("At least one skill is required", 400));
    } else if (!bio) {
        return next(new ErrorHandler("Bio is required", 400));
    } else if (isActive === undefined || isActive === null) {
        return next(new ErrorHandler("Active status is required", 400));
    } else if (!displaySettings) {
        return next(new ErrorHandler("Display settings are required", 400));
    }

    // Parse roles and projects to arrays if they are strings
    if (typeof roles === 'string') {
        roles = roles.split(',').map(role => role.trim());
    }

    if (typeof projects === 'string') {
        projects = projects.split(',').map(pro => pro.trim());
    }

    if (typeof skills === 'string') {
        skills = skills.split(',').map(skill => skill.trim());
    }

    if (typeof displaySettings === 'string') {
        displaySettings = JSON.parse(displaySettings);
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

    console.log("Skills are: ", skills);
    console.log('Roles received:', roles);

    // Update the team member
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(id, {
        name,
        roles,
        email,
        phone,
        skills,
        bio,
        projects,
        isActive,
        displaySettings,
        profilePicture: profilePictureData,
        seo: seoData,
    }, {
        new: true
    });

    if (!updatedTeamMember) {
        return next(new ErrorHandler("Member not found", 404));
    }

    // Send response
    res.status(200).json({
        success: true,
        message: "Member updated successfully",
        teamMember: updatedTeamMember
    });
});



export const getAllTeamMember = catchAsyncErrors(async(req, res, next)=>{
const getallmembers = await TeamMember.find().populate('projects');
res.status(200).json({
    success: true,
    message: "Fecthed member successfully",
    getallmembers,
})
});



/**
 *
 
export const addTeamMember = catchAsyncErrors(async(req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Files are required", 400));
    }

    const { profilePicture } = req.files;
    const { name, email, phone, bio, projects, isActive, displaySettings } = req.body;
    
    // Parse roles to array if it is a string
    let {roles, projectArray,skills, seo} = req.body.roles;

    if (typeof roles === 'string') {
        roles = roles.split(',').map(role => role.trim());
    }

     projectArray = projects.split(',').map(pro=>pro.trim());
    if(typeof roles === 'String'){
        skills = skills.split(',').map(skill=>skill.trim());
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

    let profilePictureData = {};
    console.log("Skills are : ", skills);

    console.log('Roles received:', roles);

    // Validate input fields
    if (!name) {
        return next(new ErrorHandler("Name is required", 400));
    } else if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return next(new ErrorHandler("At least one role is required", 400));
    }

    // const validRoles = [
    //     'Developer', 'Designer', 'Project Manager', 'QA Tester', 'Analyst',
    //     'Technical Writer', 'Content Writer', 'Editor', 'Copywriter',
    //     'Teacher', 'Instructor', 'Tutor', 'Curriculum Developer',
    //     'Researcher', 'Engineer', 'Mechanical Engineer', 'Electrical Engineer',
    //     'Civil Engineer', 'Software Engineer', 'DevOps Engineer', 'Data Scientist',
    //     'Data Analyst', 'SEO Specialist', 'Marketing Specialist', 'Product Manager',
    //     'UI/UX Designer', 'Graphic Designer', 'Consultant', 'Trainer', 'Support Engineer',
    //     'Network Engineer', 'System Administrator', 'Database Administrator',
    //     'Security Specialist', 'AI/ML Specialist', 'Blockchain Developer',
    //     'Business Analyst', 'Operations Manager', 'Sales Manager', 'Customer Service',
    //     'Human Resources', 'Finance Manager', 'Legal Advisor', 'Other'
    // ];
    // const invalidRoles = roles.filter(role => !validRoles.includes(role));
    // if (invalidRoles.length > 0) {
    //     console.log("Invalid roles found:", invalidRoles);
    //     return res.status(400).json({
    //         success: false,
    //         message: `Invalid roles: ${invalidRoles.join(', ')}`
    //     });
    // }

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    } else if (!phone) {
        return next(new ErrorHandler("Phone number is required", 400));
    } else if (!skills || skills.length === 0) {
        return next(new ErrorHandler("At least one skill is required", 400));
    } else if (!bio) {
        return next(new ErrorHandler("Bio is required", 400));
    } else if (isActive === undefined || isActive === null) {
        return next(new ErrorHandler("Active status is required", 400));
    } else if (!displaySettings) {
        return next(new ErrorHandler("Display settings are required", 400));
    }
console.log(" Skills Data: ", skills);
console.log("Project Data: ", projects);
    if (profilePicture) {
        // Upload to Cloudinary
        const cloudinaryResponseForProfilePicture = await cloudinary.uploader.upload(
            profilePicture.tempFilePath,
            {
                folder: "TEAM_PROFILE_PICTURE",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponseForProfilePicture || cloudinaryResponseForProfilePicture.error) {
            console.error("Cloudinary error: ", cloudinaryResponseForProfilePicture.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }

        profilePictureData = {
            type: cloudinaryResponseForProfilePicture.format,
            public_id: cloudinaryResponseForProfilePicture.public_id,
            url: cloudinaryResponseForProfilePicture.secure_url,
        };
    }

    
    const teammemberdata = await TeamMember.create({
        ...req.body,
        name,
        roles,
        email,
        phone,
        skills,
        bio,
        projects: projectArray,
        isActive,
        displaySettings,
        profilePicture: profilePictureData,
        seo: seoData,
    });

    res.status(200).json({
        success: true,
        message: "Team Member added successfully",
        teammemberdata,
    });

});

 */