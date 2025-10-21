const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
  otp: {
    type: String,
    required: false // optional until generated
  },
  expiryDate: {
    type: Date,
    required: false
  }
}, { _id: false }); // prevent creating _id for nested otp object

const adminSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone:{
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  otp: otpSchema
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
