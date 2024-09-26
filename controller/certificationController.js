import ErrorHandler from "../middlewares/error.js";
import { Certification } from "../models/certificationSchmea.js";
import cloudinary from 'cloudinary'; 
// Create a new certification
export const createCertification = async (req, res, next) => {
  try {
    const { title, issuingOrganization, issueDate, expirationDate, credentialID, credentialURL, associatedSkills, description } = req.body;

const {logoURL} = req.files;
let logoCertificationData ={};
if (logoURL) {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            logoURL.tempFilePath,
            {
                folder: "CERTIFICATIONS",
                allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
            }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            throw new Error(error);
        }

        logoCertificationData = {
            // type: cloudinaryResponseForProjectBanner.format,
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    } catch (e) {
        console.error("Cloudinary error:", e);
        return next(new ErrorHandler(e, 500));
    }
}
const splitSkills={};
// Check if associatedSkills is a string before splitting
if (typeof associatedSkills === 'string') {
     splitSkills = associatedSkills.split(',').map(skill => skill.trim());
  
} else {
    console.error("associatedSkills is not a string, received:", associatedSkills);
}

    const newCertification = await Certification.create({
      title,
      issuingOrganization,
      issueDate,
      expirationDate,
      credentialID,
      credentialURL,
      associatedSkills:splitSkills,
      description,
      logoURL:logoCertificationData,
    });

    // const savedCertification = await newCertification.save();
    res.status(201).json({
        success: true,
        message:"Certification added successfully",
        newCertification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating certification', error: error.message });
  }
};

// Get all certifications
export const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certifications', error: error.message });
  }
};

// Get a single certification by ID
// exports.getCertificationById = async (req, res) => {
//   try {
//     const certification = await Certification.findById(req.params.id);
//     if (!certification) return res.status(404).json({ message: 'Certification not found' });
//     res.status(200).json(certification);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching certification', error: error.message });
//   }
// };



// Update certification
export const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });

    const updatedData = req.body;
    
    const {logoURL} = req.file;
    let logoCertificationData ={};
    if (logoURL) {
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(
                logoURL.tempFilePath,
                {
                    folder: "CERTIFICATIONS",
                    allowed_formats: ["svg", "png", "jpg", "ico", "gif", "webp"]
                }
            );
    
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                throw new Error("Error uploading to Cloudinary");
            }
    
            logoCertificationData = {
                // type: cloudinaryResponseForProjectBanner.format,
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        } catch (e) {
            console.error("Cloudinary error:", e);
            return next(new ErrorHandler("Error uploading to Cloudinary", 500));
        }
    }

    const updatedCertification = await Certification.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json(updatedCertification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating certification', error: error.message });
  }
};

// Delete a certification
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });

    // Delete logo from Cloudinary if it exists
    if (certification.logoURL) {
      const publicId = certification.logoURL.public_id;
      await cloudinary.uploader.destroy(`certification-logos/${publicId}`);
    }

    await certification.deleteOne();
    res.status(200).json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certification', error: error.message });
  }
};
