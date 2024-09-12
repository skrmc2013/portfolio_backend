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






// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Project Name is required"],
//     },
//     description: {
//         type: String,
//         required: [true, "Description is required"],
//     },
//     // summary: {
//     //     type: String,
//     //     required: [true, "Project summary is required"],
//     // },
//     objectives: {
//        type: [String],
//         default: [],
//      },
//     // scope: {
//     //     type: [String],
//     //     default: [],
//     // },
//     // features: [String],
//     seo: {
//         metaTitle: {
//             type: String,
//             required: [true, "Meta Title is required"],
//         },
//         metaDescription: {
//             type: String,
//             required: [true, "Meta Description is required"],
//         },
//         keywords: [String],
//     },
//     visibility: {
//         showOnHomepage: {
//             type: Boolean,
//             default: true,
//         },
//         showOnPortfolio: {
//             type: Boolean,
//             default: true,
//         },
//         showOnCompanySite: {
//             type: Boolean,
//             default: true,
//         },
//     },
//     // resources: {
//     //     type: Map,
//     //     of: String, // Key-value pairs to describe resources (e.g., "devTeam": "Development Team")
//     // },
//     // budget: {
//     //     type: Number,
//     //     required: [true, "Budget is required"],
//     //     default: 0,
//     //     visibleToAdminOnly: { 
//     //         type: Boolean, 
//     //         default: true 
//     //     }, // To control visibility in the UI
//     // },
//     // cost: {
//     //     type: Number,
//     //     required: [true, "Cost is required"],
//     //     default: 0,
//     //     visibleToAdminOnly: { 
//     //         type: Boolean, 
//     //         default: true 
//     //     },
//     // },

//     // milestones: [{
//     //     name: {
//     //         type: String,
//     //         required: [true, "Milestone name is required"]
//     //     },
//     //     description: String,
//     //     deadline: Date,
//     //     completed: {
//     //         type: Boolean,
//     //         default: false,
//     //     },
//     //     status: {
//     //         type: String,
//     //         enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
//     //     },
//     // }],
//     // team: [{
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'TeamMember',
//     // }],
    
//     // categories: [{
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'Category',
//     // }],
    
//     // tags: [String],
//     // attachments: [{
//     //     filename: {
//     //         type: String,
//     //         required: [true, "Filename is required"]
//     //     },
//     //     url: {
//     //         type: String,
//     //         required: [true, "URL is required"]
//     //     },
//     //     type: {
//     //         type: String,
//     //         enum: ['report', 'design', 'screenshot'],
//     //         required: [true, "Attachment type is required"]
//     //     },
//     // }],
//     // backgroundMedia: {
//     //     type: String, // URL of the project's specific background media (image, video, GIF)
//     // },
//     // adminBackgroundOverride: {
//     //     type: Boolean,
//     //     default: false, // Allow admin to override project-specific background
//     // },
//     // overrideBackgroundId: {
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'Settings', // Reference to the settings collection for background options
//     // },
//     // introVideo: {
//     //     url: String,
//     //     thumbnail: String,
//     // },
//     // liveStatus: {
//     //     type: Boolean,
//     //     default: false,
//     // },
    
 
//     deployed: {
//         type: Boolean,
//         default: false, // Indicates if the project is deployed
//     },
//     projectBanner: {
//         public_id: {
//             type: String,
//             required: [true, "Public ID is required"],
//         },
//         url: {
//             type: String,
//             required: [true, "Banner URL is required"],
//         },
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// export const Project = mongoose.model("Project", projectSchema);
