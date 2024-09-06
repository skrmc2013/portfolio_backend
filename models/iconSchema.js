import mongoose from "mongoose";

const iconSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Icon name is required"],
        trim: true,
    },
    type: {
        type: String,
        enum: ['className', 'svg', 'iconName', 'icon', 'file', 'tag', 'other'],
        required: [true, "Icon type is required"],
    },
    libraryType: {
        type: String,
        enum: ['FontAwesome', 'Google', 'MaterialIcons', 'LottieFiles', 'Custom','reactLucide', 'iconify', 'Others'],
        required: [true, "Library type is required"],
    },
    packageName:String,
    importPath:String,
    properties: {
        iconClassName: String,
        iconName: String,
        icon: String,
        file: String,
        other: String,
        completeTag:String,

    },
    svgData: {
        type: String,
        trim: true,
    },
    lottieFilesData: {
        type: String,
        trim: true,
    },
    styles: {
        size: {
            type: String,
            default: '16px', // Size in CSS format
        },
        color: {
            type: String,
            default: '#000000', // Default color in hex format
        },
        className: {
            type: String,
            default: '',
        },
      
    },
    displayLocations: {
        homepage: { type: Boolean, required: true },
        skillsSection: { type: Boolean, required: true },
        projectSection: { type: Boolean, required: true },
        footer: { type: Boolean, required: true },
      },
    visibility: {
        type: Map,
        of: Boolean,
        default: {},
         // Dynamically add websites as keys with visibility status as values
    
    },component: {
        componentName: {
            type: String,
            // required: [true, "Component name is required"],
            trim: true,
        },
        componentPath: {
            type: String,
            // required: [true, "Component path is required"],
            trim: true,
        },
    
    },
}, {timestamps:true} );

export const Icon = mongoose.model("Icon", iconSchema);
