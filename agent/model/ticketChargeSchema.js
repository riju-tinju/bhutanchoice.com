const mongoose = require('mongoose');
const { Schema } = mongoose;

// Recommended schema
const ticketChargeSchema = new Schema({
  ticketType: {type: Number, required: true, min: 1, unique: true},
  chargeAmount: {type: Number, required: true, min: 0},        
}, { timestamps: true });

const ticketCharge = mongoose.model('ticketCharge', ticketChargeSchema);
module.exports = ticketCharge;
