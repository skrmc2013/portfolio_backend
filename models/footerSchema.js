import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
    contact: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    socialLinks: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      github: {
        type: String,
      },
      instagram: {
        type: String,
      },
      // Add more social platforms as needed
    },
    navigation: {
      // Optional: Add navigation links for quick access to important pages
      home: {
        type: String,
      },
      about: {
        type: String,
      },
      portfolio: {
        type: String,
      },
      blog: {
        type: String,
      },
      contact: {
        type: String,
      },
    },
    copyright: {
      text: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        default: new Date().getFullYear(),
      },
    },
    newsletterSignup: {
      // Optional: Include a newsletter signup form
      text: {
        type: String,
        default: "Subscribe to our newsletter",
      },
    },
    legal: {
      // Optional: Add links to legal pages
      privacyPolicy: {
        type: String,
      },
      termsOfService: {
        type: String,
      },
      cookiePolicy: {
        type: String,
      },
    },
    additionalInfo: {
      // Optional: Additional information or disclaimers
      text: {
        type: String,
      },
    },
    logo: {
      // Optional: Logo or branding element
      url: {
        type: String,
      },
      altText: {
        type: String,
      },
    },
    design: {
      // Optional: Design-related properties (e.g., background color)
      backgroundColor: {
        type: String,
      },
      textColor: {
        type: String,
      },
    },
  });
  
  export const Footer = mongoose.model("Footer", footerSchema);
  