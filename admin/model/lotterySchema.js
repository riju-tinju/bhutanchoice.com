const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lotterySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Lottery name is required'],
    trim: true
  },
  name2: {
    type: String,
    trim: true
  },
  drawNumber: {
    type: Number,
    required: [true, 'Draw number is required'],
    min: 1
  },
  
  drawDate: {
    type: Date,
    required: [true, 'Draw date is required']
  },
  
  prizes: [{
    rank: {
      type: Number,
      required: true,
      min: 1
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
  }],
  
  winners: [{
    ticketNumber: String,
    prizeRank: Number
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: Date
  
}, { timestamps: true });

const Lottery = mongoose.model('Lottery', lotterySchema);
module.exports = Lottery;