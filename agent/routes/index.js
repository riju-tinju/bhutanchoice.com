var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")




router.get('/theme', async function (req, res, next) {
  res.render('template',{})
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  await indexFun.getLotteries(req, res)
});

router.post('/api/get-past-lottories', async function (req, res, next) {
  await indexFun.getPastLotteries(req, res)
});


router.get('/create-dummy-lottories', async function (req, res, next) {
  try {
    let savedLotteries = await startFun.saveDummyLotteries(req, res);
  } catch (err) {
    console.error("ERROR FROM 'startFun.saveDummyLotteries(req,res)' Function : \n", err);
  }
});

router.get('/api/lottery-autocomplete', async function (req, res, next) {
  let response = {
    "success": true,
    "data": {
      "suggestedName": "",
      "nextDrawNumber": '',
      "suggestedDate": "",
      "dayName": "Tuesday",
      "lastLottery": {
        "name": "",
        "drawNumber": 6,
        "drawDate": ""
      }
    }
  }
  res.json(response);
})

router.post('/api/lottery', async function (req, res, next) {

  await indexFun.createLottery(req, res)

})

router.put('/api/lottery/:id', async function (req, res, next) {

  await indexFun.updateLottery(req, res)

})
router.get('/api/lottery/:id', async function (req, res, next) {
  await indexFun.getLottery(req, res)
})
router.delete('/api/lottery/:id', async function (req, res, next) {
  await indexFun.deleteLottery(req, res)
})

router.get('/admin-login', function (req, res, next) {
  res.render('pages/Auth/admin-login',)
});

router.get('/api/ticket-charges', async function (req, res, next) {
  await indexFun.getAllCharges(req, res);
});

router.post('/api/ticket-charges', async function (req, res, next) {
  await indexFun.createCharge(req, res)
});
router.put('/api/ticket-charges/:chargeId', async function (req, res, next) {
  await indexFun.updateCharge(req, res)
});

router.delete('/api/ticket-charges/:chargeId', async function (req, res, next) {
  await indexFun.deleteCharge(req, res)
});

router.get('/booking', async function (req, res, next) {
  res.render('pages/lottery-bookingAdmin',{url: process.env.URL})
})



router.get('/api/lotteries', async function (req, res, next) {
  await indexFun.getLotteriesForApi(req, res)
})

router.get('/api/booking/ticket-charges', async function (req, res, next) {
  await indexFun.getAllTicketCharges(req, res)
});

// router.post('/api/bookings', async function (req, res, next) {
//   console.log(req.body)
  
//  await indexFun.saveBooking(req, res)
// })

// const PDFDocument = require('pdfkit');
// const Booking = require('../model/bookingsSchema');
// router.get('/api/download-receipt/:ticketNumber', async (req, res) => {
//   try {
//     const { ticketNumber } = req.params;
//     const booking = await Booking.findOne({ ticketNumber });
//     if (!booking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     const doc = new PDFDocument();
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=receipt-${ticketNumber}.pdf`);

//     doc.pipe(res);

//     // Add receipt content
//     doc.fontSize(18).text("Booking Receipt", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(12).text(`Ticket Number: ${booking.ticketNumber}`);
//     doc.text(`Customer: ${booking.customer.name}`);
//     doc.text(`Phone: ${booking.customer.phone}`);
//     doc.moveDown();

//     booking.tickets.forEach((t, i) => {
//       doc.text(`Ticket ${i + 1}: ${t.number} (${t.lottery.name}) - $${t.chargeAmount}`);
//     });

//     doc.moveDown();
//     doc.text(`Total: ${booking.financial.totalAmount}`);

//     doc.end();
//   } catch (err) {
//     console.error("Error generating receipt:", err);
//     res.status(500).json({ success: false, message: "Failed to generate receipt" });
//   }
// });

const PDFDocument = require('pdfkit');
const Booking = require('../model/bookingsSchema');
const path = require('path');

router.get('/api/download-receipt/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const booking = await Booking.findOne({ ticketNumber });
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Create PDF with proper settings
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4'
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt-${ticketNumber}.pdf`);
    doc.pipe(res);

    // Define colors
    const colors = {
      primary: '#2563eb',
      accent: '#10b981', 
      dark: '#1f2937',
      gray: '#6b7280',
      lightGray: '#f9fafb',
      border: '#e5e7eb'
    };

    let yPos = 50;

    // --- HEADER SECTION ---
    // Header background
    doc.rect(40, yPos - 10, 515, 80)
       .fill(colors.primary);

    // Company info
    doc.fontSize(22)
       .fillColor('#ffffff')
       .text('BHUTAN STATE LOTTERIES', 60, yPos + 10)
       .fontSize(12)
       .text('Official Lottery Booking Receipt', 60, yPos + 35);

    // Receipt info (right side)
    const receiptDate = new Date(booking.booking.date).toLocaleDateString('en-GB');
    const receiptTime = new Date(booking.booking.date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    doc.fontSize(11)
       .fillColor('#ffffff')
       .text(`Date: ${receiptDate}`, 400, yPos + 25)
       .text(`Time: ${receiptTime}`, 400, yPos + 40)
       .text(`Receipt: ${ticketNumber}`, 400, yPos + 10)

    yPos += 100;

    // --- CUSTOMER SECTION ---
    // Section header
    doc.fontSize(14)
       .fillColor(colors.dark)
       .text('CUSTOMER INFORMATION', 40, yPos);

    yPos += 25;

    // Customer box
    doc.rect(40, yPos, 515, 60)
       .strokeColor(colors.border)
       .stroke();

    // Customer details
    doc.fontSize(11)
       .fillColor(colors.dark)
       .text(`Name: ${booking.customer.name}`, 60, yPos + 15)
       .text(`Phone: ${booking.customer.phone}`, 300, yPos + 15)
       .text(`Agent: ${booking.agent.name}`, 60, yPos + 35)
       .text(`Role: ${booking.agent.role.join(', ').toUpperCase()}`, 300, yPos + 35);

    yPos += 80;

    // --- TICKETS SECTION ---
    doc.fontSize(14)
       .fillColor(colors.dark)
       .text('LOTTERY TICKETS', 40, yPos);

    yPos += 25;

    // Group tickets by lottery and draw time
    const groupedTickets = {};
    booking.tickets.forEach(ticket => {
      const key = `${ticket.lottery.id}_${ticket.lottery.timeId}`;
      if (!groupedTickets[key]) {
        groupedTickets[key] = {
          lottery: ticket.lottery,
          tickets: []
        };
      }
      groupedTickets[key].tickets.push(ticket);
    });

    // Display each lottery group
    Object.values(groupedTickets).forEach((group, groupIndex) => {
      // Format draw time properly
      const drawDate = new Date(group.lottery.drawDate);
      const drawTime = drawDate.toLocaleDateString('en-GB') + ' ' + 
                      drawDate.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Dubai'
                      });

      // Lottery header box
      doc.rect(40, yPos, 515, 30)
         .fill(colors.accent);

      doc.fontSize(12)
         .fillColor('#ffffff')
         .text(`${group.lottery.name} - Draw #${group.lottery.drawNumber}`, 50, yPos + 8)
         .text(`Draw Time: ${drawTime}`, 350, yPos + 8);

      yPos += 35;

      // Tickets table header
      doc.rect(40, yPos, 515, 20)
         .fill(colors.lightGray);

      doc.fontSize(10)
         .fillColor(colors.dark)
         .text('Ticket Number', 50, yPos + 6)
         .text('Type', 200, yPos + 6)
         .text('Amount', 480, yPos + 6);

      yPos += 25;

      // Individual tickets
      group.tickets.forEach((ticket, index) => {
        // Alternating row colors
        if (index % 2 === 0) {
          doc.rect(40, yPos - 2, 515, 22)
             .fill('#fafafa');
        }

        doc.fontSize(11)
           .fillColor(colors.dark)
           .text(ticket.number, 50, yPos + 4)
           .text(`Type ${ticket.type}`, 200, yPos + 4)
           .text(`Nu. ${ticket.chargeAmount.toFixed(2)}`, 450, yPos + 4);

        yPos += 22;
      });

      // Add border around tickets table
      const tableHeight = (group.tickets.length * 22) + 45;
      doc.rect(40, yPos - tableHeight, 515, tableHeight)
         .strokeColor(colors.border)
         .stroke();

      yPos += 20;
    });

    // --- SUMMARY SECTION ---
    yPos += 10;
    
    doc.fontSize(14)
       .fillColor(colors.dark)
       .text('PAYMENT SUMMARY', 40, yPos);

    yPos += 25;

    // Summary box
    doc.rect(40, yPos, 515, 80)
       .strokeColor(colors.border)
       .stroke();

    // Summary details
    doc.fontSize(11)
       .fillColor(colors.dark)
       .text('Total Tickets:', 60, yPos + 15)
       .text(booking.financial.quantity.toString(), 480, yPos + 15)
       .text('Subtotal:', 60, yPos + 35)
       .text(`Nu. ${booking.financial.subtotal.toFixed(2)}`, 450, yPos + 35)
       .text('Tax:', 60, yPos + 55)
       .text(`Nu. ${(booking.financial.tax || 0).toFixed(2)}`, 450, yPos + 55);

    yPos += 85;

    // Total amount box
    doc.rect(40, yPos, 515, 30)
       .fill(colors.primary);

    doc.fontSize(14)
       .fillColor('#ffffff')
       .text('TOTAL AMOUNT:', 60, yPos + 8)
       .fontSize(16)
       .text(`Nu. ${booking.financial.totalAmount.toFixed(2)}`, 450, yPos + 6);

    yPos += 50;

    // --- PAYMENT INFO ---
    doc.fontSize(11)
       .fillColor(colors.gray)
       .text(`Payment Method: ${booking.payment.method.replace('_', ' ').toUpperCase()}`, 40, yPos)
       .text(`Payment Status: ${booking.payment.status.toUpperCase()}`, 300, yPos);

    if (booking.payment.reference) {
      yPos += 20;
      doc.text(`Payment Reference: ${booking.payment.reference}`, 40, yPos);
    }

    // --- FOOTER ---
    yPos += 40;
    
    doc.rect(40, yPos, 515, 60)
       .fill(colors.lightGray);

    doc.fontSize(12)
       .fillColor(colors.dark)
       .text('Thank you for choosing Bhutan State Lotteries!', 60, yPos + 15)
       .fontSize(10)
       .fillColor(colors.gray)
       .text('Keep this receipt safe. Present it for prize claims if you win.', 60, yPos + 35);

    // Page border
    doc.rect(30, 30, 535, 762)
       .strokeColor(colors.border)
       .lineWidth(1)
       .stroke();

    doc.end();

  } catch (err) {
    console.error("Error generating receipt:", err);
    res.status(500).json({ success: false, message: "Failed to generate receipt" });
  }
});






module.exports = router;
