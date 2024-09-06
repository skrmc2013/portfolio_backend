const mongoose = require('mongoose');

const homepageFooterSchema = new mongoose.Schema({
  contactInfo: String,
  socialLinks: [String],
  metaTitle: String,
  metaDescription: String,
  canonicalUrl: String,
  structuredData: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('HomepageFooter', homepageFooterSchema);
