import mongoose from "mongoose";

// Define the schema for personal introduction
const personalIntroSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
    },
    titles: [{
        type: String,
        required: [true, "At least one title is required"],
    }],
    biography: {
        type: String,
        required: [true, "Biography is required"],
    },
    skills: [String],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
    education: [{
        degree: String,
        institution: String,
        year: Number,
    }],
    certifications: [{
        name: {
            type: String,
            required: [true, "Certification name is required"],
        },
        institution: {
            type: String,
            required: [true, "Certification institution is required"],
        },
        year: {
            type: Number,
            required: [true, "Certification year is required"],
        },
    }],
    experience: [{
        role: String,
        company: String,
        duration: String,
        responsibilities: [String],
    }],
    achievements: [String],
    professionalSummary: {
        type: String,
    },
    contactInfo: {
        email: String,
        phone: String,
        linkedIn: String,
    },
    personalStatement: {
        type: String,
    },
    portfolioURL: {
        type: String,
    },
    socialMedia: [{
        platform: String,
        url: String,
    }],
    languages: [String],
    volunteerExperience: [{
        role: String,
        organization: String,
        duration: String,
    }],
    hobbies: [String],
    testimonials: [{
        author: String,
        text: String,
    }],
});

// Create and export the model
export const PersonalIntro = mongoose.model("PersonalIntro", personalIntroSchema);
