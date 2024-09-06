const mongoose = require('mongoose');

const companyIntroSchema = new mongoose.Schema({
  name: String,
  description: String,
  logo: String,
  metaTitle: String,
  metaDescription: String,
  canonicalUrl: String,
  structuredData: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('CompanyIntro', companyIntroSchema);
