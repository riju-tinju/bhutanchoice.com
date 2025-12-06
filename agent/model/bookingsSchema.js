const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticketSchema = new Schema({
  // Ticket Identification
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Customer Information Group
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Agent Information Group
  agent: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    role: [
      {
        type: String,
        enum: ["agent", "admin", "supervisor"],
        required: true
      }
    ]
  },

  // Booking Information Group
  booking: {
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["active", "cancelled",],
      default: "active"
    }
  },

  // Ticket Details Group (array of tickets)
  tickets: [
    {
      lottery: {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Lottery",
          required: true
        },
        name: {
          type: String,
          required: true,
          trim: true
        },
        drawNumber: {
          type: Number,
          required: true
        },
        drawDate: {
          type: Date,
          required: true
        },
        timeId: {
          type: String,
          required: true
        }
      },
      numberId:{
        type:String,
        required:true,
      },
      isWon: {
        type: Boolean,
        default: false
      },
      number: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      quantity:{
        type: Number,
        required: true,
        min: 1
      },
      chargeAmount: {
        type: Number,
        required: true,
        min: 0
      },
      status: {
        type: String,
        enum: ["UNPAID", "NOT_WINNER", "IN_AGENT", "PAID"],
        default: "NOT_WINNER"
      }
    }
  ],

  // Financial Information Group
  financial: {
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "NU",
      enum: ["NU", "EUR", "GBP", "INR", "LKR"],
      uppercase: true,
      trim: true
    }
  },

  // Payment Information Group
  payment: {
    method: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "mobile_money"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "failed", "refunded"],
      default: "pending"
    },
    reference: {
      type: String,
      trim: true
    }
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

// Virtual for formatted ticket display
ticketSchema.virtual("displayId").get(function () {
  return `TKT-${this.ticketNumber}`;
});

// Pre-save hook: auto-calculate quantity, subtotal, and totalAmount
ticketSchema.pre("save", function (next) {
  if (this.tickets && this.tickets.length > 0) {
    // Sum of all ticket quantities, not just count of ticket entries
    this.financial.quantity = this.tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
    this.financial.subtotal = this.tickets.reduce((sum, t) => sum + (t.chargeAmount || 0), 0);
    this.financial.totalAmount = this.financial.subtotal + (this.financial.tax || 0);
  }
  next();
});

// Indexes for better query performance
ticketSchema.index({ "customer.phone": 1 });
ticketSchema.index({ "agent.id": 1 });
ticketSchema.index({ "booking.date": -1 });
ticketSchema.index({ "tickets.lottery.drawDate": 1 });
ticketSchema.index({ "payment.status": 1 });
ticketSchema.index({ "booking.status": 1 });

module.exports = mongoose.model("Ticket", ticketSchema);
