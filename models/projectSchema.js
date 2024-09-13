import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project Name is required"],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    summary: 
    {
              type: String,
                required: [true, "Project summary is required"],
                default: '',
             },
             objectives: {
                    type: [String],
                default: [],
                },
             features: {
                    type: [String],
                default: [],
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
    visibility: {
        showOnHomepage: {
            type: Boolean,
            default: true,
        },
        showOnPortfolio: {
            type: Boolean,
            default: true,
        },
        showOnCompanySite: {
            type: Boolean,
            default: true,
        },
    },
    deployed: {
        type: Boolean,
        default: false,
    },
    projectBanner: {
        type: {
            type: String, // 'svg' for SVG icons
            enum: ['svg', 'png', 'jpg', 'ico', 'gif', 'webp'],
        },
        public_id: {
            type: String,
            required: [true, "Public ID is required"],
        },
        url: {
            type: String,
            required: [true, "Banner URL is required"],
        },
    },  
    milestones: [{
        name: {
            type: String,
            required: [true, "Milestone name is required"]
        },
        description: String,
        deadline: {
            type: Date,
            required: [true, "Deadline is required"],  // Ensures deadline must be provided
            validate: {
                validator: function(value) {
                    // Ensures the deadline is a valid Date object
                    return !isNaN(Date.parse(value));
                },
                message: props => `${props.value} is not a valid date!`
            }
        },
        completed: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
        },
        showOnPortfolio:{
            type:Boolean,
            default:false,
        },
        showOnHomepage:{
            type:Boolean,
            default:false,
        },
    }],


    technologies: {
        type: [String],
         required: [true, "Technologies are required"],
     },
     progress: {
        percentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        },
    },
    tags: [String],
    
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
    }],
    budget: {
        initial: {
            type: Number,
            required: [true, "Initial budget is required"],
        },
        spent: {
            type: Number,
            default: 0,
        },
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value));
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value));
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    githubLink: {
        type: String,
        required: [true, "Github Link is required"],
    },
    projectLink: { 
        type: String,
        required: [true, "Link is required"],
    },
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);


