import jwt from "jsonwebtoken"; 
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies || {};

    if (!token) {
        return next(new ErrorHandler(" authorization denied.", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token.", 401));
    }
});
// export const isAuthenticated = catchAsyncErrors(async( res, req, next)=>{
//     const {token} = req.cookies;
//     if(!token){
//         return next(new ErrorHandler("User not Authenticated", 400));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     next();
// });
