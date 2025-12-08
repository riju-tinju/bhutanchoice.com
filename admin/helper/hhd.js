db.tickets.insertOne({
  ticketNumber: "TEST-003",
  customer: {
    name: "Paid Winner",
    phone: "4444444444"
  },
  agent: {
    name: "Test Agent",
    id: ObjectId("507f1f77bcf86cd799439011"),
    phone: "2222222222",
    role: ["agent"]
  },
  tickets: [{
    lottery: {
      id: ObjectId("69368301eeef8d503f81c171"),
      name: "Test Lottery",
      drawNumber: 1,
      drawDate: new Date("2025-12-08T20:00:00Z"),
      timeId: "evening-draw"
    },
    numberId: "NUM-003",
    number: "55555",
    type: 1,
    quantity: 1,
    chargeAmount: 100,
    status: "PAID",
    isWon: false
  }],
  financial: {
    quantity: 1,
    subtotal: 100,
    tax: 0,
    totalAmount: 100,
    currency: "NU"
  },
  payment: {
    method: "cash",
    status: "paid",
    reference: "REF-003"
  },
  booking: {
    date: new Date(),
    status: "active"
  }
})