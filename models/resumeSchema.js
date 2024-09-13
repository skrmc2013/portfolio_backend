import mongoose from 'mongoose';

// Theme Schema
const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  colors: {
    primary: { type: String, required: true },
    secondary: { type: String },
    background: { type: String },
    text: { type: String }
  },
  font: { type: String, default: 'Arial' }, // Default font if not specified
  layout: {
    type: String,
    enum: ['single-column', 'two-column', 'mixed'],
    default: 'single-column'
  },
  styling: { type: mongoose.Schema.Types.Mixed }, // Custom CSS or styling options
  template: {
    type: String, 
    enum: ['template1', 'template2', 'template3'], // Predefined template keys, can be expanded
    default: 'template1'
  }
});

// Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', required: true }, // Reference to Theme
  template: { 
    type: String, 
    enum: ['template1', 'template2', 'template3'], // This connects to the theme template options
    default: 'template1' 
  },
  personalInfo: {
    name: { type: String, required: true },
    title: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    profilePicture: { type: String } // Path to profile image
  },
  summary: { type: String }, // Personal summary or introduction
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationDate: Date
  }],
  skills: [String], // List of skills
  languages: [{
    name: String,
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent'] }
  }],
  certificates: [{
    name: String,
    issuer: String,
    date: Date
  }],
  customSections: [{
    title: { type: String, required: true }, // Name of the custom section
    sectionType: { 
      type: String, 
      enum: ['text', 'list', 'rich-text', 'media'], // Custom section type: plain text, list, rich content, or media
      required: true 
    },
    content: mongoose.Schema.Types.Mixed // Flexible to store various content types (text, list, HTML)
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to auto-update `updatedAt` field before each save
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Theme = mongoose.model('Theme', themeSchema);
export const Resume = mongoose.model('Resume', resumeSchema);


