const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
  keywords: [String],
  metaTitle: String,
  metaDescription: String,
  canonicalUrl: String,
  structuredData: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('Service', serviceSchema);
