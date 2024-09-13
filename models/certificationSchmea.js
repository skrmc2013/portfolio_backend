import mongoose from "mongoose";
const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuingOrganization: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
    default: null,  // if certification doesn't expire, you can set it to null
  },
  credentialID: {
    type: String,
    default: null,
  },
  credentialURL: {
    type: String,
    required: true,  // link to the certificate or the credential verification page
  },
  associatedSkills: {
    type: [String], // Array of skills related to the certification
    default: [],
  },
  logoURL: {
    public_id: {
        type: String,
        required: [true, "Public ID is required"],
    },
    url: {
        type: String,
        required: [true, "Banner URL is required"],
    },
 // URL for the certification logo (if available)
  },
  description: {
    type: String,
    default: null,  // Description or details about the certification
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const Certification = mongoose.model('Certification', certificationSchema);

// module.exports = Certification;
