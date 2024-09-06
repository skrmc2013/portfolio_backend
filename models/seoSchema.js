const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  pageType: String,
  pageId: mongoose.Schema.Types.ObjectId,
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  canonicalUrl: String,
  structuredData: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('SEO', seoSchema);
