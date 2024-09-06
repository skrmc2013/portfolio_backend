import mongoose from "mongoose";


const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    roles: {
        type: [String],
        enum: [
            'Developer', 'Designer', 'Project Manager', 'QA Tester', 'Analyst',
            'Technical Writer', 'Content Writer', 'Editor', 'Copywriter',
            'Teacher', 'Instructor', 'Tutor', 'Curriculum Developer', 
            'Researcher', 'Engineer', 'Mechanical Engineer', 'Electrical Engineer',
            'Civil Engineer', 'Software Engineer', 'DevOps Engineer', 'Data Scientist',
            'Data Analyst', 'SEO Specialist', 'Marketing Specialist', 'Product Manager',
            'UI/UX Designer', 'Graphic Designer', 'Consultant', 'Trainer', 'Support Engineer',
            'Network Engineer', 'System Administrator', 'Database Administrator',
            'Security Specialist', 'AI/ML Specialist', 'Blockchain Developer', 'API Developer', 
            'Mobile App Developer','Backend Developer', 'Frontend Developer', 'Full Stack Developer',
             'Web 3 Developer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'React Developer',
              'React Native Developer', 'Flutter Developer', 'MERN Stack Developer', 'MEAN Stack Developer', 'PERN Stack Developer',
            'Business Analyst', 'Operations Manager', 'Sales Manager', 'Customer Service',
            'Human Resources', 'Finance Manager', 'Legal Advisor', 'Other'
        ],
        required: [true, "At least one role is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        // match: [/^\+?[1-9]\d{1,14}$/, "Phone number is invalid"],
    },
    skills: [String],

    profilePicture: {
        type: {
            type: String, 
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
    bio: {
        type: String,
        default: '',
    },
    // team: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Team',
    //     required: [false, "Team is required"],
    // },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    displaySettings: {
        homepage: {
            showName: {
                type: Boolean,
                default: true, // Show name by default on homepage
            },
            showRoles: {
                type: Boolean,
                default: true,
            },
            showEmail: {
                type: Boolean,
                default: false,
            },
            showPhone: {
                type: Boolean,
                default: false,
            },
            showSkills: {
                type: Boolean,
                default: false,
            },
            showProfilePicture: {
                type: Boolean,
                default: true,
            },
            showBio: {
                type: Boolean,
                default: false,
            },
        },
        portfolio: {
            showName: {
                type: Boolean,
                default: true,
            },
            showRoles: {
                type: Boolean,
                default: true,
            },
            showEmail: {
                type: Boolean,
                default: false,
            },
            showPhone: {
                type: Boolean,
                default: false,
            },
            showSkills: {
                type: Boolean,
                default: true,
            },
            showProfilePicture: {
                type: Boolean,
                default: true,
            },
            showBio: {
                type: Boolean,
                default: true,
            },
        },
        companyWebsite: {
            showName: {
                type: Boolean,
                default: true,
            },
            showRoles: {
                type: Boolean,
                default: true,
            },
            showEmail: {
                type: Boolean,
                default: false,
            },
            showPhone: {
                type: Boolean,
                default: false,
            },
            showSkills: {
                type: Boolean,
                default: false,
            },
            showProfilePicture: {
                type: Boolean,
                default: false,
            },
            showBio: {
                type: Boolean,
                default: true,
            },
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
});

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
