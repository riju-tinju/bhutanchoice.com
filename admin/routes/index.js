var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")


router.get('/theme', async function (req, res, next) {
  res.render('template', {})
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
  res.render('pages/lottery-booking')
})



router.get('/api/lotteries', async function (req, res, next) {
  await indexFun.getLotteriesForApi(req, res)
})

router.get('/api/booking/ticket-charges', async function (req, res, next) {
  await indexFun.getAllTicketCharges(req, res)
});

router.post('/api/bookings', async function (req, res, next) {
  console.log(req.body)

  await indexFun.saveBooking(req, res)
})



// const PDFDocument = require('pdfkit');
// const Booking = require('../model/bookingsSchema');
// const path = require('path');

// router.get('/api/download-receipt/:ticketNumber', async (req, res) => {
//   try {
//     const { ticketNumber } = req.params;
//     const booking = await Booking.findOne({ ticketNumber });

//     if (!booking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     // Create PDF with proper settings
//     const doc = new PDFDocument({ 
//       margin: 40,
//       size: 'A4'
//     });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=receipt-${ticketNumber}.pdf`);
//     doc.pipe(res);

//     // Define colors
//     const colors = {
//       primary: '#2563eb',
//       accent: '#10b981', 
//       dark: '#1f2937',
//       gray: '#6b7280',
//       lightGray: '#f9fafb',
//       border: '#e5e7eb'
//     };

//     let yPos = 50;

//     // --- HEADER SECTION ---
//     // Header background
//     doc.rect(40, yPos - 10, 515, 80)
//        .fill(colors.primary);

//     // Company info
//     doc.fontSize(22)
//        .fillColor('#ffffff')
//        .text('BHUTAN STATE LOTTERIES', 60, yPos + 10)
//        .fontSize(12)
//        .text('Official Lottery Booking Receipt', 60, yPos + 35);

//     // Receipt info (right side)
//     const receiptDate = new Date(booking.booking.date).toLocaleDateString('en-GB');
//     const receiptTime = new Date(booking.booking.date).toLocaleTimeString('en-GB', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });

//     doc.fontSize(11)
//        .fillColor('#ffffff')
//        .text(`Date: ${receiptDate}`, 400, yPos + 25)
//        .text(`Time: ${receiptTime}`, 400, yPos + 40)
//        .text(`Receipt: ${ticketNumber}`, 400, yPos + 10)

//     yPos += 100;

//     // --- CUSTOMER SECTION ---
//     // Section header
//     doc.fontSize(14)
//        .fillColor(colors.dark)
//        .text('CUSTOMER INFORMATION', 40, yPos);

//     yPos += 25;

//     // Customer box
//     doc.rect(40, yPos, 515, 60)
//        .strokeColor(colors.border)
//        .stroke();

//     // Customer details
//     doc.fontSize(11)
//        .fillColor(colors.dark)
//        .text(`Name: ${booking.customer.name}`, 60, yPos + 15)
//        .text(`Phone: ${booking.customer.phone}`, 300, yPos + 15)
//        .text(`Agent: ${booking.agent.name}`, 60, yPos + 35)
//        .text(`Role: ${booking.agent.role.join(', ').toUpperCase()}`, 300, yPos + 35);

//     yPos += 80;

//     // --- TICKETS SECTION ---
//     doc.fontSize(14)
//        .fillColor(colors.dark)
//        .text('LOTTERY TICKETS', 40, yPos);

//     yPos += 25;

//     // Group tickets by lottery and draw time
//     const groupedTickets = {};
//     booking.tickets.forEach(ticket => {
//       const key = `${ticket.lottery.id}_${ticket.lottery.timeId}`;
//       if (!groupedTickets[key]) {
//         groupedTickets[key] = {
//           lottery: ticket.lottery,
//           tickets: []
//         };
//       }
//       groupedTickets[key].tickets.push(ticket);
//     });

//     // Display each lottery group
//     Object.values(groupedTickets).forEach((group, groupIndex) => {
//       // Format draw time properly
//       const drawDate = new Date(group.lottery.drawDate);
//       const drawTime = drawDate.toLocaleDateString('en-GB') + ' ' + 
//                       drawDate.toLocaleTimeString('en-GB', {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         timeZone: 'Asia/Dubai'
//                       });

//       // Lottery header box
//       doc.rect(40, yPos, 515, 30)
//          .fill(colors.accent);

//       doc.fontSize(12)
//          .fillColor('#ffffff')
//          .text(`${group.lottery.name} - Draw #${group.lottery.drawNumber}`, 50, yPos + 8)
//          .text(`Draw Time: ${drawTime}`, 350, yPos + 8);

//       yPos += 35;

//       // Tickets table header
//       doc.rect(40, yPos, 515, 20)
//          .fill(colors.lightGray);

//       doc.fontSize(10)
//          .fillColor(colors.dark)
//          .text('Ticket Number', 50, yPos + 6)
//          .text('Type', 200, yPos + 6)
//          .text('Amount', 480, yPos + 6);

//       yPos += 25;

//       // Individual tickets
//       group.tickets.forEach((ticket, index) => {
//         // Alternating row colors
//         if (index % 2 === 0) {
//           doc.rect(40, yPos - 2, 515, 22)
//              .fill('#fafafa');
//         }

//         doc.fontSize(11)
//            .fillColor(colors.dark)
//            .text(ticket.number, 50, yPos + 4)
//            .text(`Type ${ticket.type}`, 200, yPos + 4)
//            .text(`Nu ${ticket.chargeAmount.toFixed(2)}`, 450, yPos + 4);

//         yPos += 22;
//       });

//       // Add border around tickets table
//       const tableHeight = (group.tickets.length * 22) + 45;
//       doc.rect(40, yPos - tableHeight, 515, tableHeight)
//          .strokeColor(colors.border)
//          .stroke();

//       yPos += 20;
//     });

//     // --- SUMMARY SECTION ---
//     yPos += 10;

//     doc.fontSize(14)
//        .fillColor(colors.dark)
//        .text('PAYMENT SUMMARY', 40, yPos);

//     yPos += 25;

//     // Summary box
//     doc.rect(40, yPos, 515, 80)
//        .strokeColor(colors.border)
//        .stroke();

//     // Summary details
//     doc.fontSize(11)
//        .fillColor(colors.dark)
//        .text('Total Tickets:', 60, yPos + 15)
//        .text(booking.financial.quantity.toString(), 480, yPos + 15)
//        .text('Subtotal:', 60, yPos + 35)
//        .text(`Nu ${booking.financial.subtotal.toFixed(2)}`, 450, yPos + 35)
//        .text('Tax:', 60, yPos + 55)
//        .text(`Nu ${(booking.financial.tax || 0).toFixed(2)}`, 450, yPos + 55);

//     yPos += 85;

//     // Total amount box
//     doc.rect(40, yPos, 515, 30)
//        .fill(colors.primary);

//     doc.fontSize(14)
//        .fillColor('#ffffff')
//        .text('TOTAL AMOUNT:', 60, yPos + 8)
//        .fontSize(16)
//        .text(`Nu ${booking.financial.totalAmount.toFixed(2)}`, 450, yPos + 6);

//     yPos += 50;

//     // --- PAYMENT INFO ---
//     doc.fontSize(11)
//        .fillColor(colors.gray)
//        .text(`Payment Method: ${booking.payment.method.replace('_', ' ').toUpperCase()}`, 40, yPos)
//        .text(`Payment Status: ${booking.payment.status.toUpperCase()}`, 300, yPos);

//     if (booking.payment.reference) {
//       yPos += 20;
//       doc.text(`Payment Reference: ${booking.payment.reference}`, 40, yPos);
//     }

//     // --- FOOTER ---
//     yPos += 40;

//     doc.rect(40, yPos, 515, 60)
//        .fill(colors.lightGray);

//     doc.fontSize(12)
//        .fillColor(colors.dark)
//        .text('Thank you for choosing Bhutan State Lotteries!', 60, yPos + 15)
//        .fontSize(10)
//        .fillColor(colors.gray)
//        .text('Keep this receipt safe. Present it for prize claims if you win.', 60, yPos + 35);

//     // Page border
//     doc.rect(30, 30, 535, 762)
//        .strokeColor(colors.border)
//        .lineWidth(1)
//        .stroke();

//     doc.end();

//   } catch (err) {
//     console.error("Error generating receipt:", err);
//     res.status(500).json({ success: false, message: "Failed to generate receipt" });
//   }
// });

// const PDFDocument = require('pdfkit');
// const Booking = require('../model/bookingsSchema');
// const path = require('path');

// router.get('/api/download-receipt/:ticketNumber', async (req, res) => {
//   try {
//     const { ticketNumber } = req.params;
//     const booking = await Booking.findOne({ ticketNumber });

//     if (!booking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     // Create PDF with thermal printer dimensions (80mm width)
//     const doc = new PDFDocument({ 
//       margin: 15,
//       size: [226.77, 841.89], // 80mm x 297mm (thermal paper width)
//       info: {
//         Title: `Receipt-${ticketNumber}`,
//         Author: 'Bhutan State Lotteries'
//       }
//     });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=receipt-${ticketNumber}.pdf`);
//     doc.pipe(res);

//     let yPos = 20;
//     const pageWidth = 226.77;
//     const contentWidth = pageWidth - 30; // Account for margins

//     // Helper function to center text
//     const centerText = (text, fontSize) => {
//       const textWidth = doc.widthOfString(text);
//       return (pageWidth - textWidth) / 2;
//     };

//     // Helper function to create dashed line
//     const createDashedLine = (y) => {
//       const dashLength = 3;
//       const spaceLength = 2;
//       let x = 15;

//       while (x < pageWidth - 15) {
//         doc.rect(x, y, dashLength, 0.5).fill('#000000');
//         x += dashLength + spaceLength;
//       }
//     };

//     // Helper function for right-aligned text
//     const rightAlignText = (text, x, y, fontSize) => {
//       const textWidth = doc.widthOfString(text);
//       return pageWidth - 15 - textWidth;
//     };

//     // --- HEADER ---
//     doc.fontSize(16)
//        .fillColor('#000000')
//        .text('BHUTAN STATE', centerText('BHUTAN STATE', 16), yPos);

//     yPos += 18;
//     doc.fontSize(16)
//        .text('LOTTERIES', centerText('LOTTERIES', 16), yPos);

//     yPos += 20;
//     doc.fontSize(10)
//        .text('Official Lottery Receipt', centerText('Official Lottery Receipt', 10), yPos);

//     yPos += 15;
//     createDashedLine(yPos);
//     yPos += 10;

//     // --- RECEIPT INFO ---
//     const receiptDate = new Date(booking.booking.date).toLocaleDateString('en-GB');
//     const receiptTime = new Date(booking.booking.date).toLocaleTimeString('en-GB', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });

//     doc.fontSize(9)
//        .text(`Receipt: ${ticketNumber}`, 15, yPos);
//     yPos += 12;

//     doc.text(`Date: ${receiptDate}${' '.repeat(8)}Time: ${receiptTime}`, 15, yPos);
//     yPos += 15;

//     createDashedLine(yPos);
//     yPos += 10;

//     // --- CUSTOMER INFO ---
//     doc.fontSize(11)
//        .text('CUSTOMER INFO', centerText('CUSTOMER INFO', 11), yPos);
//     yPos += 15;

//     doc.fontSize(9)
//        .text(`Name: ${booking.customer.name}`, 15, yPos);
//     yPos += 12;

//     doc.text(`Phone: ${booking.customer.phone}`, 15, yPos);
//     yPos += 12;

//     doc.text(`Agent: ${booking.agent.name}`, 15, yPos);
//     yPos += 15;

//     createDashedLine(yPos);
//     yPos += 10;

//     // --- TICKETS SECTION ---
//     doc.fontSize(11)
//        .text('TICKETS', centerText('TICKETS', 11), yPos);
//     yPos += 15;

//     // Group tickets by lottery and draw time
//     const groupedTickets = {};
//     booking.tickets.forEach(ticket => {
//       const key = `${ticket.lottery.id}_${ticket.lottery.timeId}`;
//       if (!groupedTickets[key]) {
//         groupedTickets[key] = {
//           lottery: ticket.lottery,
//           tickets: []
//         };
//       }
//       groupedTickets[key].tickets.push(ticket);
//     });

//     // Display each lottery group
//     Object.values(groupedTickets).forEach((group, groupIndex) => {
//       // Lottery name and draw info
//       doc.fontSize(10)
//          .text(`${group.lottery.name}`, 15, yPos);
//       yPos += 12;

//       const drawDate = new Date(group.lottery.drawDate);
//       const drawTime = drawDate.toLocaleDateString('en-GB') + ' ' + 
//                       drawDate.toLocaleTimeString('en-GB', {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       });

//       doc.fontSize(8)
//          .text(`Draw #${group.lottery.drawNumber}`, 15, yPos);
//       yPos += 10;

//       doc.text(`${drawTime}`, 15, yPos);
//       yPos += 12;

//       // Tickets header
//       doc.fontSize(8)
//          .text('Ticket No.', 15, yPos)
//          .text('Type', 100, yPos)
//          .text('Amount', rightAlignText('Amount', 0, yPos, 8), yPos);
//       yPos += 2;

//       // Create line under header
//       doc.rect(15, yPos, contentWidth, 0.5).fill('#000000');
//       yPos += 8;

//       // Individual tickets
//       group.tickets.forEach(ticket => {
//         doc.fontSize(8)
//            .text(ticket.number, 15, yPos)
//            .text(`T${ticket.type}`, 100, yPos)
//            .text(`${ticket.chargeAmount.toFixed(2)}`, rightAlignText(`${ticket.chargeAmount.toFixed(2)}`, 0, yPos, 8), yPos);
//         yPos += 10;
//       });

//       yPos += 5;
//     });

//     createDashedLine(yPos);
//     yPos += 10;

//     // --- SUMMARY ---
//     doc.fontSize(11)
//        .text('SUMMARY', centerText('SUMMARY', 11), yPos);
//     yPos += 15;

//     // Summary details
//     doc.fontSize(9)
//        .text('Total Tickets:', 15, yPos)
//        .text(booking.financial.quantity.toString(), rightAlignText(booking.financial.quantity.toString(), 0, yPos, 9), yPos);
//     yPos += 12;

//     doc.text('Subtotal:', 15, yPos)
//        .text(`Nu ${booking.financial.subtotal.toFixed(2)}`, rightAlignText(`Nu ${booking.financial.subtotal.toFixed(2)}`, 0, yPos, 9), yPos);
//     yPos += 12;

//     if (booking.financial.tax && booking.financial.tax > 0) {
//       doc.text('Tax:', 15, yPos)
//          .text(`Nu ${booking.financial.tax.toFixed(2)}`, rightAlignText(`Nu ${booking.financial.tax.toFixed(2)}`, 0, yPos, 9), yPos);
//       yPos += 12;
//     }

//     // Create line before total
//     doc.rect(15, yPos, contentWidth, 0.5).fill('#000000');
//     yPos += 8;

//     // Total amount
//     doc.fontSize(11)
//        .text('TOTAL:', 15, yPos);

//     doc.fontSize(12)
//        .text(`Nu ${booking.financial.totalAmount.toFixed(2)}`, rightAlignText(`Nu ${booking.financial.totalAmount.toFixed(2)}`, 0, yPos, 12), yPos);
//     yPos += 20;

//     createDashedLine(yPos);
//     yPos += 10;

//     // --- PAYMENT INFO ---
//     doc.fontSize(9)
//        .text('PAYMENT INFO', centerText('PAYMENT INFO', 9), yPos);
//     yPos += 12;

//     doc.fontSize(8)
//        .text(`Method: ${booking.payment.method.replace('_', ' ').toUpperCase()}`, 15, yPos);
//     yPos += 10;

//     doc.text(`Status: ${booking.payment.status.toUpperCase()}`, 15, yPos);
//     yPos += 10;

//     if (booking.payment.reference) {
//       doc.text(`Ref: ${booking.payment.reference}`, 15, yPos);
//       yPos += 15;
//     } else {
//       yPos += 10;
//     }

//     createDashedLine(yPos);
//     yPos += 15;

//     // --- FOOTER MESSAGE ---
//     doc.fontSize(10)
//        .text('Thank You!', centerText('Thank You!', 10), yPos);
//     yPos += 15;

//     doc.fontSize(8)
//        .text('Keep this receipt safe.', centerText('Keep this receipt safe.', 8), yPos);
//     yPos += 10;

//     doc.text('Present for prize claims.', centerText('Present for prize claims.', 8), yPos);
//     yPos += 15;

//     doc.fontSize(7)
//        .text('Bhutan State Lotteries', centerText('Bhutan State Lotteries', 7), yPos);
//     yPos += 10;

//     doc.text('Official Receipt', centerText('Official Receipt', 7), yPos);
//     yPos += 20;

//     // QR Code placeholder (optional)
//     doc.fontSize(6)
//        .text(`ID: ${ticketNumber}`, centerText(`ID: ${ticketNumber}`, 6), yPos);

//     doc.end();

//   } catch (err) {
//     console.error("Error generating receipt:", err);
//     res.status(500).json({ success: false, message: "Failed to generate receipt" });
//   }
// });

const PDFDocument = require('pdfkit');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const Booking = require('../model/bookingsSchema');
const path = require('path');
const fs = require('fs');

router.get('/api/download-receipt/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const booking = await Booking.findOne({ ticketNumber });
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Create PDF with optimized thermal printer dimensions
    const doc = new PDFDocument({ 
      margin: 0,
      size: [226.77, 841.89], // 80mm x 297mm (thermal paper width)
      info: {
        Title: `Receipt-${ticketNumber}`,
        Author: 'Bhutan State Lotteries'
      }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt-${ticketNumber}.pdf`);
    doc.pipe(res);

    let yPos = 0;
    const pageWidth = 226.77;
    const margin = 16;
    const contentWidth = pageWidth - (margin * 2);

    // // Enhanced color palette with better contrast ratios
    // const colors = {
    //   primary: '#E67E22',      // Warm orange
    //   primaryDark: '#D35400',  // Darker orange
    //   primaryLight: '#F39C12', // Lighter orange
    //   accent: '#2ECC71',       // Success green
    //   background: '#FDF6F0',   // Very light orange
    //   cardBg: '#FEF9F3',      // Card background
    //   text: {
    //     primary: '#2C3E50',    // Dark blue-gray
    //     secondary: '#5D6D7E',  // Medium gray
    //     light: '#85929E',      // Light gray
    //     inverse: '#FFFFFF'     // White
    //   },
    //   divider: '#E8E8E8'
    // };

   // Enhanced color palette matching Bhutan Lottery brand colors
const colors = {
  primary: '#6A82FB',        // Brand blue (from gradient)
  primaryDark: '#5A67D8',    // Darker blue
  primaryLight: '#8FA8FF',   // Lighter blue
  secondary: '#FF6B6B',      // Brand coral/orange
  accent: '#45EBA5',         // Brand green
  background: '#F7F9FF',     // Very light blue tint
  cardBg: '#FAFBFF',        // Card background with blue tint
  text: {
    primary: '#2D3748',      // Dark slate
    secondary: '#4A5568',    // Medium gray
    light: '#718096',        // Light gray
    inverse: '#FFFFFF'       // White
  },
  divider: '#E2E8F0',       // Light blue-gray
  highlight: '#E6FFFA'       // Very light green tint
};

    // Typography system
    const fonts = {
      brand: { size: 16, weight: 'bold' },
      title: { size: 14, weight: 'bold' },
      subtitle: { size: 11, weight: 'bold' },
      body: { size: 9, weight: 'normal' },
      bodyBold: { size: 9, weight: 'bold' },
      caption: { size: 8, weight: 'normal' },
      small: { size: 7, weight: 'normal' }
    };

    // Spacing system (8px base unit)
    const spacing = {
      xs: 4,   // 0.5x
      sm: 8,   // 1x
      md: 16,  // 2x
      lg: 24,  // 3x
      xl: 32,  // 4x
      xxl: 40  // 5x
    };

    // Helper functions with better implementation
    const centerText = (text, fontSize = fonts.body.size) => {
      doc.fontSize(fontSize);
      const textWidth = doc.widthOfString(text);
      return (pageWidth - textWidth) / 2;
    };

    const rightAlignText = (text, fontSize = fonts.body.size, rightMargin = margin) => {
      doc.fontSize(fontSize);
      const textWidth = doc.widthOfString(text);
      return pageWidth - rightMargin - textWidth;
    };

    const addSectionDivider = (y, thickness = 0.5) => {
      doc.rect(margin, y, contentWidth, thickness)
         .fill(colors.divider);
      return y + spacing.md;
    };

    // Generate barcode function
    const generateBarcode = (text) => {
      try {
        const canvas = createCanvas(180, 50);
        JsBarcode(canvas, text, {
          format: "CODE128",
          width: 1.2,
          height: 40,
          displayValue: false,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 0
        });
        return canvas.toBuffer();
      } catch (error) {
        console.error('Barcode generation failed:', error);
        return null;
      }
    };

    // Load logo function - using local file
    const loadLogo = () => {
      try {
        // Try multiple possible logo locations
        const possiblePaths = [
          './logo.jpg',
          './logo.png', 
          './assets/logo.jpg',
          './assets/logo.png',
          './public/logo.jpg',
          './public/logo.png',
          path.join(__dirname, 'logo.jpg'),
          path.join(__dirname, 'logo.png'),
          path.join(__dirname, '..', 'logo.jpg'),
          path.join(__dirname, '..', 'logo.png')
        ];

        for (const logoPath of possiblePaths) {
          if (fs.existsSync(logoPath)) {
            return fs.readFileSync(logoPath);
          }
        }
        
        console.log('Logo file not found in any of the expected locations');
        return null;
      } catch (error) {
        console.log('Logo loading failed:', error);
        return null;
      }
    };

    // --- HEADER SECTION ---
    // Main header background with gradient effect
    doc.rect(0, yPos, pageWidth, 100)
       .fill(colors.primary);

    yPos += spacing.md;

    // Logo and brand section
    const logoBuffer = loadLogo();
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, margin, yPos, { 
          width: 32, 
          height: 32,
          fit: [32, 32]
        });
      } catch (error) {
        console.log('Error displaying logo, using fallback');
        // Fallback to circle if logo display fails
        doc.circle(margin + 16, yPos + 16, 16)
           .stroke(colors.text.inverse)
           .lineWidth(2);
      }
    } else {
      // Fallback circle logo with Bhutanese-style design
      doc.circle(margin + 16, yPos + 16, 16)
         .stroke(colors.text.inverse)
         .lineWidth(2);
      
      // Add dharma wheel-like design
      const centerX = margin + 16;
      const centerY = yPos + 16;
      const radius = 12;
      
      // Draw spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = centerX + Math.cos(angle) * 6;
        const y1 = centerY + Math.sin(angle) * 6;
        const x2 = centerX + Math.cos(angle) * radius;
        const y2 = centerY + Math.sin(angle) * radius;
        
        doc.moveTo(x1, y1)
           .lineTo(x2, y2)
           .stroke(colors.text.inverse)
           .lineWidth(1);
      }
    }

    // Brand text with proper hierarchy
    doc.fontSize(fonts.brand.size)
       .fillColor(colors.text.inverse)
       .text('BHUTAN STATE LOTTERIES', margin + 44, yPos + 2);

    doc.fontSize(fonts.caption.size)
       .fillColor(colors.text.inverse)
       .text('Official Lottery Booking Receipt', margin + 44, yPos + 40);//


    yPos = 100 + spacing.md;

    // --- RECEIPT INFO SECTION ---
    const receiptDate = new Date(booking.booking.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    const receiptTime = new Date(booking.booking.date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Date and receipt info with improved layout
    doc.fontSize(fonts.body.size)
       .fillColor(colors.text.secondary)
       .text('Date: ', margin, yPos);
    
    doc.fontSize(fonts.bodyBold.size)
       .fillColor(colors.text.primary)
       .text(receiptDate, margin + doc.widthOfString('Date: '), yPos);

    doc.fontSize(fonts.body.size)
       .fillColor(colors.text.secondary)
       .text('Time: ', margin, yPos + spacing.sm + 2);
    
    doc.fontSize(fonts.bodyBold.size)
       .fillColor(colors.text.primary)
       .text(receiptTime, margin + doc.widthOfString('Time: '), yPos + spacing.sm + 2);

    // Receipt number - right aligned
    doc.fontSize(fonts.body.size)
       .fillColor(colors.text.secondary)
       .text('Receipt: ', rightAlignText(`Receipt: BSL-${ticketNumber}`, fonts.body.size) - doc.widthOfString(ticketNumber), yPos);
    
    doc.fontSize(fonts.bodyBold.size)
       .fillColor(colors.primary)
       .text(ticketNumber, rightAlignText(ticketNumber, fonts.bodyBold.size), yPos);

    yPos += spacing.xl;
    yPos = addSectionDivider(yPos);

    // --- CUSTOMER INFORMATION SECTION ---
    // Section header with modern design
    doc.rect(margin, yPos, contentWidth, 24)
       .fill(colors.primary);
    
    doc.fontSize(fonts.subtitle.size)
       .fillColor(colors.text.inverse)
       .text('CUSTOMER INFORMATION', margin + spacing.sm, yPos + 6);
    
    yPos += 32;

    // Customer details with consistent formatting
    const customerFields = [
      { label: 'Name', value: booking.customer.name },
      { label: 'Address', value: booking.customer.address || 'Thimphu, Bhutan' },
      { label: 'Contact', value: booking.customer.phone }
    ];

    customerFields.forEach(field => {
      doc.fontSize(fonts.body.size)
         .fillColor(colors.text.secondary)
         .text(`${field.label}:`, margin, yPos);
      
      // Handle long text wrapping
      const labelWidth = doc.widthOfString(`${field.label}: `);
      const maxWidth = contentWidth - labelWidth;
      
      doc.fontSize(fonts.bodyBold.size)
         .fillColor(colors.text.primary)
         .text(field.value, margin + labelWidth, yPos, {
           width: maxWidth,
           ellipsis: true
         });
      
      yPos += spacing.sm + 4;
    });

    yPos += spacing.sm;
    yPos = addSectionDivider(yPos);

    // --- LOTTERY TICKETS SECTION ---
    // Section header
    doc.rect(margin, yPos, contentWidth, 24)
       .fill(colors.primary);
    
    doc.fontSize(fonts.subtitle.size)
       .fillColor(colors.text.inverse)
       .text('YOUR LOTTERY TICKETS', margin + spacing.sm, yPos + 6);
    
    yPos += 32;

    // Group tickets by lottery for better organization
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

    // Display each lottery group with improved design
    Object.values(groupedTickets).forEach((group, groupIndex) => {
      const sectionHeight = 40 + (group.tickets.length * 14);
      
      // Lottery section background
      doc.rect(margin, yPos, contentWidth, sectionHeight)
         .fill(colors.cardBg);

      yPos += spacing.sm;
      
      // Lottery name with emphasis
      doc.fontSize(fonts.subtitle.size)
         .fillColor(colors.primary)
         .text(group.lottery.name, margin + spacing.xs, yPos);
      
      yPos += spacing.md;

      // Draw info in smaller, secondary text
      const drawDate = new Date(group.lottery.drawDate);
      const drawInfo = `${drawDate.toLocaleDateString('en-GB')} • Draw #${group.lottery.drawNumber}`;
      
      doc.fontSize(fonts.caption.size)
         .fillColor(colors.text.secondary)
         .text(drawInfo, margin + spacing.xs, yPos);
      
      yPos += spacing.md;

      // Ticket list with clean formatting - BOLD ticket numbers as requested
      group.tickets.forEach((ticket, index) => {
        // Bold ticket numbers for better readability
        doc.fontSize(fonts.bodyBold.size)
           .fillColor(colors.text.primary)
           .text(String(ticket.number).padStart(5, '0'), margin + spacing.xs, yPos);
        
        // Amount right-aligned
        doc.fontSize(fonts.body.size)
           .fillColor(colors.text.primary)
           .text(`Nu ${ticket.chargeAmount.toFixed(2)}`, 
                 rightAlignText(`Nu ${ticket.chargeAmount.toFixed(2)}`, fonts.body.size, margin + spacing.xs), yPos);
        
        yPos += 12;
      });

      yPos += spacing.xs;
    });

    yPos += spacing.sm;
    yPos = addSectionDivider(yPos);

    // --- SUMMARY SECTION ---
    const summaryItems = [
      { label: 'Total Tickets', value: booking.financial.quantity.toString() },
      { label: 'Subtotal', value: `Nu ${booking.financial.subtotal.toFixed(2)}` }
    ];

    if (booking.financial.tax && booking.financial.tax > 0) {
      summaryItems.push({ label: 'Tax', value: `Nu ${booking.financial.tax.toFixed(2)}` });
    }

    // Summary items with proper spacing
    summaryItems.forEach(item => {
      doc.fontSize(fonts.body.size)
         .fillColor(colors.text.secondary)
         .text(item.label + ':', margin, yPos);
      
      doc.fontSize(fonts.bodyBold.size)
         .fillColor(colors.text.primary)
         .text(item.value, rightAlignText(item.value, fonts.bodyBold.size), yPos);
      
      yPos += spacing.sm + 2;
    });

    yPos += spacing.xs;

    // Total amount with emphasis
    doc.rect(margin, yPos, contentWidth, 20)
       .fill(colors.primary);
    
    doc.fontSize(fonts.subtitle.size)
       .fillColor(colors.text.inverse)
       .text('TOTAL AMOUNT:', margin + spacing.xs, yPos + 4);
    
    doc.fontSize(fonts.title.size)
       .fillColor(colors.text.inverse)
       .text(`Nu ${booking.financial.totalAmount.toFixed(2)}`, 
             rightAlignText(`Nu ${booking.financial.totalAmount.toFixed(2)}`, fonts.title.size, margin + spacing.xs), yPos + 3);

    yPos += 32;

    // --- FOOTER SECTION ---

    doc.fontSize(fonts.caption.size)
       .fillColor(colors.text.secondary);
    
    const keepSafeText = 'Keep this receipt safe - it\'s your winning ticket to dreams!';
    doc.text(keepSafeText, centerText(keepSafeText, fonts.caption.size), yPos);
    
    yPos += spacing.lg;

    // --- BARCODE SECTION ---
    const barcodeBuffer = generateBarcode(ticketNumber);
    if (barcodeBuffer) {
      try {
        doc.image(barcodeBuffer, centerText('', 0) - 90, yPos, { 
          width: 180, 
          height: 30 
        });
        yPos += 35;
        
        // Barcode number
        doc.fontSize(fonts.small.size)
           .fillColor(colors.text.light)
           .text(ticketNumber, centerText(ticketNumber, fonts.small.size), yPos);
        
      } catch (error) {
        // Fallback
        doc.fontSize(fonts.caption.size)
           .fillColor(colors.text.secondary)
           .text(`Receipt ID: ${ticketNumber}`, centerText(`Receipt ID: ${ticketNumber}`, fonts.caption.size), yPos);
      }
    } else {
      doc.fontSize(fonts.caption.size)
         .fillColor(colors.text.secondary)
         .text(`Receipt ID: ${ticketNumber}`, centerText(`Receipt ID: ${ticketNumber}`, fonts.caption.size), yPos);
    }

    yPos += spacing.lg;

    // Final touch - bottom accent
    doc.rect(margin, yPos, contentWidth, 2)
       .fill(colors.primary);

    doc.end();

  } catch (err) {
    console.error("Error generating receipt:", err);
    res.status(500).json({ success: false, message: "Failed to generate receipt" });
  }
});


module.exports = router;
