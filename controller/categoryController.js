import { Category } from "../models/categoriesSchema.js";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import mongoose from "mongoose";

export const addCategory = catchAsyncErrors(async (req, res, next) => {
    const { main, subcategories } = req.body;

    if (!main) {
        return next(new ErrorHandler("Main category is required", 400));
    } else if (!subcategories) {
        return next(new ErrorHandler("Subcategories are required", 400));
    }

    const categoriesOption = await Category.create({
        main,
        subcategories,
    });

    res.status(200).json({
        success: true,
        message: "Categories added successfully",
        categoriesOption,
    });
});

export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid or missing category ID", 400));
    }

    const categoryToDelete = await Category.findById(id);

    if (!categoryToDelete) {
        return next(new ErrorHandler("Category not found", 404));
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        category: categoryToDelete, // Return the deleted category data if needed
    });
});
export const updateCategory = catchAsyncErrors(async(req, res, next)=>{
const {id} = req.params;
const { main, subcategories } = req.body;

if (!main) {
    return next(new ErrorHandler("Main category is required", 400));
} else if (!subcategories) {
    return next(new ErrorHandler("Subcategories are required", 400));
}

if (!subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
    return next(new ErrorHandler("Subcategories are required and must be a non-empty array", 400));
}


const categoriesOption = await Category.findByIdAndUpdate(id, {
    main,
    subcategories,
}, { new: true });

if(!categoriesOption){
    return next(new ErrorHandler("Category not found", 404));
}

res.status(200).json({
    success: true,
    message: "Categories updated successfully",
    categoriesOption,
});

});

export const getCategory = catchAsyncErrors(async(req, res, next)=>{

    const categorydata = await Category.find();
    res.status(200).json({
        success: true,
        message: "Categories Fetched successfully",
        categorydata,
    });

});