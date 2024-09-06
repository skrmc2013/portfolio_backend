import mongoose from "mongoose";

const appsSchema = new mongoose.Schema({
    
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
    title: {
        type: String,
        // required: true,
    },
    library: {
        type: String,
        enum: ['react-icons', 'font-awesome', 'tailwind', 'bootstrap', 'lottie', 'custom-svg'],
        required: true,
    },
    iconType: {
        type: String,
        required: true,
    },
  
    fa: {
        icon: String, // FontAwesome icon class
        style: {
            color: String, // CSS color style
            size: String, // FontAwesome size
        },
    },
    custom: {
        className: String, // Custom class for styling
        path: String, // Path to the icon file if needed
    },
    displayLocations: {
        type: Map, // A map of locations with their visibility status
        of: Boolean, // true for visible, false for hidden
        default: {
            homepage: true,
            skillsSection: true,
            portfolio: true,
            services: true,
            tools: true,
        },
    },

});

export const appsIcons = mongoose.model("appsicons", appsSchema);