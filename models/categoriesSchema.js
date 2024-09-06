import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    main: {
        type: String,
        required: true,
        unique: true, // Ensures each main category is unique
    },
    subcategories: {
        type: [String],
        required: true,
        validate: {
            validator: function(arr) {
                return arr.length > 0;
            },
            message: 'At least one subcategory is required'
        }
    }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);
