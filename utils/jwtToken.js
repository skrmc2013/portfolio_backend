// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import ErrorHandler from "../middlewares/error.js";
// import { User } from "../models/userSchema.js";

export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();

    res.status(statusCode)
        .cookie("token", token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000), // Set expiry time properly
            httpOnly: true,
            // Other cookie options like secure, sameSite, etc. can be added here if needed
        })
        .json({
            success: true,
            message,
            token,
            user,
        });
};


