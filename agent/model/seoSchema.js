const mongoose = require('mongoose');
const { Schema } = mongoose;

const seoSchema = new Schema({
  seoTitle: {
    type: String,
    // required: [true, 'SEO Title is required'],
    trim: true,
  },
  metaDescription: {
    type: String,
    // required: [true, 'Meta description is required'],
    trim: true,
  },
  logo: {
    type: String,
    required: false, // Optional: URL or path to the logo
    trim: true,
  },
  websiteUrl: {
    type: String,
    // required: [true, 'Website URL is required'],
    trim: true,
    lowercase: true
  }
}, { timestamps: true });

const SEO = mongoose.model('SEO', seoSchema);
module.exports = SEO;
