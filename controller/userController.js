import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";


export const register = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar and Resume are Required", 400))
    }

    const { avatar } = req.files;
    console.log("AVATAR", avatar);
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder: "AVATARS"
        }
    );

    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
        console.error("cloudinary error: ", cloudinaryResponseForAvatar.error || "unknown cloudinary error");

    }

    const { resume } = req.files;
    console.log("RESUME", resume);

    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
            folder: "RESUME"
        }
    );

    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
        console.error("cloudinary error: ", cloudinaryResponseForResume.error || "unknown cloudinary error");

    };

    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioUrl,
        githubURL,
        facebookURL,
        whatsappURL,
        linkedInURL,
        instagramURL,
        twitterURL,
        replitURL,
        telegramURL,
       stackoverflowURL,

    } = req.body;


    const user = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioUrl,
        githubURL,
        facebookURL,
        whatsappURL,
        linkedInURL,
        instagramURL,
        twitterURL,
        replitURL,
        telegramURL,
       stackoverflowURL,
        avatar: {
            public_id: cloudinaryResponseForAvatar.public_id,
            url: cloudinaryResponseForAvatar.secure_url,
        },
        resume: {
            public_id: cloudinaryResponseForResume.public_id,
            url: cloudinaryResponseForResume.secure_url,
        }
    });

    // res.status(200).json({
    //     success: true,
    //     message :"User Registered Sucessfully"
    // });
    generateToken(user, "User Registered", 201, res);

});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email and Password are Required!", 400));
    }

    const user = await User.findOne({ email }).select("+password"); // Add `+` to include the password in the query
    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password", 401));
    }

    generateToken(user, "Logged In", 200, res);
});


export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        httpOnly:true,
        expires: new Date(Date.now()),
        sameSite:"None",
        secure: true,
    })
        .json({
            success: true,
            message: "Logout Sucessfully",
        });
})


export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200)
        .json({
            success: true,
            user,
        });
});


export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newDataOfUser = {
        fullName: req.body.fullName,
        // titles:req.body.titles,
        titles:JSON.parse(req.body.titles),
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        portfolioUrl: req.body.portfolioUrl,
        githubURL: req.body.githubURL,
        facebookURL: req.body.facebookURL,
        whatsappURL: req.body.whatsappURL,
        linkedInURL: req.body.linkedInURL,
        instagramURL:req.body.instagramURL,
        twitterURL: req.body.twitterURL,
        replitURL:req.body.replitURL,
        telegramURL : req.body.telegramURL,
        youtubeURL:req.body.youtubeURL,
       stackoverflowURL : req.body.stackoverflowURL,
       experience: req.body.experience,
       support   : req.body.support ,

    };
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = await User.findById(req.user.id);
        const profileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {
                folder: "AVATARS"
            }
        );

        newDataOfUser.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        };


    }




    if (req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = await User.findById(req.user.id);
        const profileResumeId = user.resume.public_id;
        await cloudinary.uploader.destroy(profileResumeId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            {
                folder: "RESUME"
            }
        );

        newDataOfUser.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        };
    };


    const user = await User.findByIdAndUpdate(req.user.id, newDataOfUser, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        user,
    });



});


export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check if all fields are provided as required
    if (!currentPassword) {
        return next(new ErrorHandler("Please Enter your Current Password", 400));
    }
    if (!newPassword) {
        return next(new ErrorHandler("Please Enter New Password", 400));
    }
    if (!confirmNewPassword) {
        return next(new ErrorHandler("Please Confirm your New Password", 400));
    }

    // Check if new and confirm passwords match
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New Password and Confirm Password do not match", 400));
    }

    // Find the user and verify the current password
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect Current Password", 400));
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});



export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
    const id = "66a695f162093cc42e2abe82";
    const user = await User.findById(id);
    res.status(200).json({
        success: true,
        user,

    });
})



export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 400));
    };

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

    const message = `Your Reset Password Link is : \n\n\n${resetPasswordURL}\n\n\n If you've not requested for this please igonre it.`;

    try {

        await sendEmail({
            email: user.email,
            subject: "Password Recovery Request for Portfolio",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully!`,
        })
    } catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();
        return next(new ErrorHandler(error.message, 500));

    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    // console.log("Received token:", token);

    const resetPasswordToken = crypto.createHash("sha512").update(token).digest("hex");
    // console.log("Hashed token:", resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        console.error("No user found or token expired.");
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    generateToken(user, "Reset Password Successfully", 200, res);
});