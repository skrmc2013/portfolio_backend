import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      svg:{
        type: {
            type: String, // 'svg' for SVG icons
            enum: ['svg', 'png', 'jpg', 'ico', 'gif', 'webp'],
        },
        public_id:{
            type:String,
            required: true,
        },
        url:{
            type:String,
            required: true,
        },

    },
      proficiencyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true,
      },
      experience: {
        type: Number, // Years of experience
        required: true,
      },
      category: {
        type: String,
        enum: ['Programming Languages', 'Frameworks', 'Tools', 'Databases', 'Other'],
        required: true,
      },
      description: {
        type: String,
      },
      icon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appsicons', // Reference to an icon in the icons collection
      },
      displaySettings: {
        showOnResume: {
          type: Boolean,
          default: true,
        },
        showOnWebsite: {
          type: Boolean,
          default: true,
        },
        showOnPortfolio: {
          type: Boolean,
          default: true,
        },
      },
      seo: {
        metaTitle: {
            type: String,
            required: [true, "Meta Title is required"],
        },
        metaDescription: {
            type: String,
            required: [true, "Meta Description is required"],
        },
        keywords: [String],
    },
     
}, {timestamps:true});

export const Skills = mongoose.model("skills", skillSchema);