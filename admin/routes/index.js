var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")


router.get('/theme', async function (req, res, next) {
  res.render('template', {})
});

router.get('/dd', async function (req, res, next) {
  res.render('form', {})
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  await indexFun.getLotteries(req, res)
});

router.post('/api/get-past-lottories', async function (req, res, next) {
  await indexFun.getPastLotteries(req, res)
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
  await indexFun.updateLottery1(req, res)
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
  res.render('pages/lottery-booking',{url: process.env.URL})
})

router.get('/api/lotteries', async function (req, res, next) {
  await indexFun.getActiveLotteries(req, res)
})

router.get('/api/active-lotteries', async function (req, res, next) {
  await indexFun.getActiveLotteries(req, res)
})

router.get('/api/booking/ticket-charges', async function (req, res, next) {
  await indexFun.getAllTicketCharges(req, res)
});

// router.post('/bookings/api/bookings', async function (req, res, next) {
//   console.log('\n\nArrived in index.js \n');
//   console.log(req.body)
  // await indexFun.saveBooking(req, res)
// })



const PDFDocument = require('pdfkit');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const Booking = require('../model/bookingsSchema');
const path = require('path');
const fs = require('fs');

// router.get('/api/download-receipt/:ticketNumber', async (req, res) => {
//   try {
//     const { ticketNumber } = req.params;
//     const booking = await Booking.findOne({ ticketNumber });
    
//     if (!booking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     // Create PDF with optimized thermal printer dimensions
//     const doc = new PDFDocument({ 
//       margin: 0,
//       size: [226.77, 841.89], // 80mm x 297mm (thermal paper width)
//       info: {
//         Title: `Receipt-${ticketNumber}`,
//         Author: 'Bhutan State Lotteries'
//       }
//     });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=receipt-${ticketNumber}.pdf`);
//     doc.pipe(res);

//     let yPos = 0;
//     const pageWidth = 226.77;
//     const margin = 16;
//     const contentWidth = pageWidth - (margin * 2);

   

//    // Enhanced color palette matching Bhutan Lottery brand colors
// const colors = {
//   primary: '#6A82FB',        // Brand blue (from gradient)
//   primaryDark: '#5A67D8',    // Darker blue
//   primaryLight: '#8FA8FF',   // Lighter blue
//   secondary: '#FF6B6B',      // Brand coral/orange
//   accent: '#45EBA5',         // Brand green
//   background: '#F7F9FF',     // Very light blue tint
//   cardBg: '#FAFBFF',        // Card background with blue tint
//   text: {
//     primary: '#2D3748',      // Dark slate
//     secondary: '#4A5568',    // Medium gray
//     light: '#718096',        // Light gray
//     inverse: '#FFFFFF'       // White
//   },
//   divider: '#E2E8F0',       // Light blue-gray
//   highlight: '#E6FFFA'       // Very light green tint
// };

//     // Typography system
//     const fonts = {
//       brand: { size: 16, weight: 'bold' },
//       title: { size: 14, weight: 'bold' },
//       subtitle: { size: 11, weight: 'bold' },
//       body: { size: 9, weight: 'normal' },
//       bodyBold: { size: 9, weight: 'bold' },
//       caption: { size: 8, weight: 'normal' },
//       small: { size: 7, weight: 'normal' }
//     };

//     // Spacing system (8px base unit)
//     const spacing = {
//       xs: 4,   // 0.5x
//       sm: 8,   // 1x
//       md: 16,  // 2x
//       lg: 24,  // 3x
//       xl: 32,  // 4x
//       xxl: 40  // 5x
//     };

//     // Helper functions with better implementation
//     const centerText = (text, fontSize = fonts.body.size) => {
//       doc.fontSize(fontSize);
//       const textWidth = doc.widthOfString(text);
//       return (pageWidth - textWidth) / 2;
//     };

//     const rightAlignText = (text, fontSize = fonts.body.size, rightMargin = margin) => {
//       doc.fontSize(fontSize);
//       const textWidth = doc.widthOfString(text);
//       return pageWidth - rightMargin - textWidth;
//     };

//     const addSectionDivider = (y, thickness = 0.5) => {
//       doc.rect(margin, y, contentWidth, thickness)
//          .fill(colors.divider);
//       return y + spacing.md;
//     };

//     // Generate barcode function
//     const generateBarcode = (text) => {
//       try {
//         const canvas = createCanvas(180, 50);
//         JsBarcode(canvas, text, {
//           format: "CODE128",
//           width: 1.2,
//           height: 40,
//           displayValue: false,
//           background: "#ffffff",
//           lineColor: "#000000",
//           margin: 0
//         });
//         return canvas.toBuffer();
//       } catch (error) {
//         console.error('Barcode generation failed:', error);
//         return null;
//       }
//     };

//     // Load logo function - using local file
//     const loadLogo = () => {
//       try {
//         // Try multiple possible logo locations
//         const possiblePaths = [
//           './logo.jpg',
//           './logo.png', 
//           './assets/logo.jpg',
//           './assets/logo.png',
//           './public/logo.jpg',
//           './public/logo.png',
//           path.join(__dirname, 'logo.jpg'),
//           path.join(__dirname, 'logo.png'),
//           path.join(__dirname, '..', 'logo.jpg'),
//           path.join(__dirname, '..', 'logo.png')
//         ];

//         for (const logoPath of possiblePaths) {
//           if (fs.existsSync(logoPath)) {
//             return fs.readFileSync(logoPath);
//           }
//         }
        
//         console.log('Logo file not found in any of the expected locations');
//         return null;
//       } catch (error) {
//         console.log('Logo loading failed:', error);
//         return null;
//       }
//     };

//     // --- HEADER SECTION ---
//     // Main header background with gradient effect
//     doc.rect(0, yPos, pageWidth, 100)
//        .fill(colors.primary);

//     yPos += spacing.md;

//     // Logo and brand section
//     const logoBuffer = loadLogo();
//     if (logoBuffer) {
//       try {
//         doc.image(logoBuffer, margin, yPos, { 
//           width: 32, 
//           height: 32,
//           fit: [32, 32]
//         });
//       } catch (error) {
//         console.log('Error displaying logo, using fallback');
//         // Fallback to circle if logo display fails
//         doc.circle(margin + 16, yPos + 16, 16)
//            .stroke(colors.text.inverse)
//            .lineWidth(2);
//       }
//     } else {
//       // Fallback circle logo with Bhutanese-style design
//       doc.circle(margin + 16, yPos + 16, 16)
//          .stroke(colors.text.inverse)
//          .lineWidth(2);
      
//       // Add dharma wheel-like design
//       const centerX = margin + 16;
//       const centerY = yPos + 16;
//       const radius = 12;
      
//       // Draw spokes
//       for (let i = 0; i < 8; i++) {
//         const angle = (i * Math.PI) / 4;
//         const x1 = centerX + Math.cos(angle) * 6;
//         const y1 = centerY + Math.sin(angle) * 6;
//         const x2 = centerX + Math.cos(angle) * radius;
//         const y2 = centerY + Math.sin(angle) * radius;
        
//         doc.moveTo(x1, y1)
//            .lineTo(x2, y2)
//            .stroke(colors.text.inverse)
//            .lineWidth(1);
//       }
//     }

//     // Brand text with proper hierarchy
//     doc.fontSize(fonts.brand.size)
//        .fillColor(colors.text.inverse)
//        .text('BHUTAN STATE LOTTERIES', margin + 44, yPos + 2);

//     doc.fontSize(fonts.caption.size)
//        .fillColor(colors.text.inverse)
//        .text('Official Lottery Booking Receipt', margin + 44, yPos + 40);//


//     yPos = 100 + spacing.md;

//     // --- RECEIPT INFO SECTION ---
//     const receiptDate = new Date(booking.booking.date).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit', 
//       year: 'numeric'
//     });
//     const receiptTime = new Date(booking.booking.date).toLocaleTimeString('en-GB', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false
//     });

//     // Date and receipt info with improved layout
//     doc.fontSize(fonts.body.size)
//        .fillColor(colors.text.secondary)
//        .text('Date: ', margin, yPos);
    
//     doc.fontSize(fonts.bodyBold.size)
//        .fillColor(colors.text.primary)
//        .text(receiptDate, margin + doc.widthOfString('Date: '), yPos);

//     doc.fontSize(fonts.body.size)
//        .fillColor(colors.text.secondary)
//        .text('Time: ', margin, yPos + spacing.sm + 2);
    
//     doc.fontSize(fonts.bodyBold.size)
//        .fillColor(colors.text.primary)
//        .text(receiptTime, margin + doc.widthOfString('Time: '), yPos + spacing.sm + 2);

//     // Receipt number - right aligned
//     doc.fontSize(fonts.body.size)
//        .fillColor(colors.text.secondary)
//        .text('Receipt: ', rightAlignText(`Receipt: BSL-${ticketNumber}`, fonts.body.size) - doc.widthOfString(ticketNumber), yPos);
    
//     doc.fontSize(fonts.bodyBold.size)
//        .fillColor(colors.primary)
//        .text(ticketNumber, rightAlignText(ticketNumber, fonts.bodyBold.size), yPos);

//     yPos += spacing.xl;
//     yPos = addSectionDivider(yPos);

//     // --- CUSTOMER INFORMATION SECTION ---
//     // Section header with modern design
//     doc.rect(margin, yPos, contentWidth, 24)
//        .fill(colors.primary);
    
//     doc.fontSize(fonts.subtitle.size)
//        .fillColor(colors.text.inverse)
//        .text('CUSTOMER INFORMATION', margin + spacing.sm, yPos + 6);
    
//     yPos += 32;

//     // Customer details with consistent formatting
//     const customerFields = [
//       { label: 'Name', value: booking.customer.name },
//       { label: 'Address', value: booking.customer.address || 'Thimphu, Bhutan' },
//       { label: 'Contact', value: booking.customer.phone }
//     ];

//     customerFields.forEach(field => {
//       doc.fontSize(fonts.body.size)
//          .fillColor(colors.text.secondary)
//          .text(`${field.label}:`, margin, yPos);
      
//       // Handle long text wrapping
//       const labelWidth = doc.widthOfString(`${field.label}: `);
//       const maxWidth = contentWidth - labelWidth;
      
//       doc.fontSize(fonts.bodyBold.size)
//          .fillColor(colors.text.primary)
//          .text(field.value, margin + labelWidth, yPos, {
//            width: maxWidth,
//            ellipsis: true
//          });
      
//       yPos += spacing.sm + 4;
//     });

//     yPos += spacing.sm;
//     yPos = addSectionDivider(yPos);

//     // --- LOTTERY TICKETS SECTION ---
//     // Section header
//     doc.rect(margin, yPos, contentWidth, 24)
//        .fill(colors.primary);
    
//     doc.fontSize(fonts.subtitle.size)
//        .fillColor(colors.text.inverse)
//        .text('YOUR LOTTERY TICKETS', margin + spacing.sm, yPos + 6);
    
//     yPos += 32;

//     // Group tickets by lottery for better organization
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

//     // Display each lottery group with improved design
//     Object.values(groupedTickets).forEach((group, groupIndex) => {
//       const sectionHeight = 40 + (group.tickets.length * 14);
      
//       // Lottery section background
//       doc.rect(margin, yPos, contentWidth, sectionHeight)
//          .fill(colors.cardBg);

//       yPos += spacing.sm;
      
//       // Lottery name with emphasis
//       doc.fontSize(fonts.subtitle.size)
//          .fillColor(colors.primary)
//          .text(group.lottery.name, margin + spacing.xs, yPos);
      
//       yPos += spacing.md;

//       // Draw info in smaller, secondary text
//       const drawDate = new Date(group.lottery.drawDate);
//       const drawInfo = `${drawDate.toLocaleDateString('en-GB')} • Draw #${group.lottery.drawNumber}`;
      
//       doc.fontSize(fonts.caption.size)
//          .fillColor(colors.text.secondary)
//          .text(drawInfo, margin + spacing.xs, yPos);
      
//       yPos += spacing.md;

//       // Ticket list with clean formatting - BOLD ticket numbers as requested
//       group.tickets.forEach((ticket, index) => {
//         // Bold ticket numbers for better readability
//         doc.fontSize(fonts.bodyBold.size)
//            .fillColor(colors.text.primary)
//            .text(String(ticket.number).padStart(5, '0'), margin + spacing.xs, yPos);
        
//         // Amount right-aligned
//         doc.fontSize(fonts.body.size)
//            .fillColor(colors.text.primary)
//            .text(`Nu. ${ticket.chargeAmount.toFixed(2)}`, 
//                  rightAlignText(`Nu. ${ticket.chargeAmount.toFixed(2)}`, fonts.body.size, margin + spacing.xs), yPos);
        
//         yPos += 12;
//       });

//       yPos += spacing.xs;
//     });

//     yPos += spacing.sm;
//     yPos = addSectionDivider(yPos);

//     // --- SUMMARY SECTION ---
//     const summaryItems = [
//       { label: 'Total Tickets', value: booking.financial.quantity.toString() },
//       { label: 'Subtotal', value: `Nu. ${booking.financial.subtotal.toFixed(2)}` }
//     ];

//     if (booking.financial.tax && booking.financial.tax > 0) {
//       summaryItems.push({ label: 'Tax', value: `Nu. ${booking.financial.tax.toFixed(2)}` });
//     }

//     // Summary items with proper spacing
//     summaryItems.forEach(item => {
//       doc.fontSize(fonts.body.size)
//          .fillColor(colors.text.secondary)
//          .text(item.label + ':', margin, yPos);
      
//       doc.fontSize(fonts.bodyBold.size)
//          .fillColor(colors.text.primary)
//          .text(item.value, rightAlignText(item.value, fonts.bodyBold.size), yPos);
      
//       yPos += spacing.sm + 2;
//     });

//     yPos += spacing.xs;

//     // Total amount with emphasis
//     doc.rect(margin, yPos, contentWidth, 20)
//        .fill(colors.primary);
    
//     doc.fontSize(fonts.subtitle.size)
//        .fillColor(colors.text.inverse)
//        .text('TOTAL AMOUNT:', margin + spacing.xs, yPos + 4);
    
//     doc.fontSize(fonts.title.size)
//        .fillColor(colors.text.inverse)
//        .text(`Nu. ${booking.financial.totalAmount.toFixed(2)}`, 
//              rightAlignText(`Nu. ${booking.financial.totalAmount.toFixed(2)}`, fonts.title.size, margin + spacing.xs), yPos + 3);

//     yPos += 32;

//     // --- FOOTER SECTION ---

//     doc.fontSize(fonts.caption.size)
//        .fillColor(colors.text.secondary);
    
//     const keepSafeText = 'Keep this receipt safe - it\'s your winning ticket to dreams!';
//     doc.text(keepSafeText, centerText(keepSafeText, fonts.caption.size), yPos);
    
//     yPos += spacing.lg;

//     // --- BARCODE SECTION ---
//     const barcodeBuffer = generateBarcode(ticketNumber);
//     if (barcodeBuffer) {
//       try {
//         doc.image(barcodeBuffer, centerText('', 0) - 90, yPos, { 
//           width: 180, 
//           height: 30 
//         });
//         yPos += 35;
        
//         // Barcode number
//         doc.fontSize(fonts.small.size)
//            .fillColor(colors.text.light)
//            .text(ticketNumber, centerText(ticketNumber, fonts.small.size), yPos);
        
//       } catch (error) {
//         // Fallback
//         doc.fontSize(fonts.caption.size)
//            .fillColor(colors.text.secondary)
//            .text(`Receipt ID: ${ticketNumber}`, centerText(`Receipt ID: ${ticketNumber}`, fonts.caption.size), yPos);
//       }
//     } else {
//       doc.fontSize(fonts.caption.size)
//          .fillColor(colors.text.secondary)
//          .text(`Receipt ID: ${ticketNumber}`, centerText(`Receipt ID: ${ticketNumber}`, fonts.caption.size), yPos);
//     }

//     yPos += spacing.lg;

//     // Final touch - bottom accent
//     doc.rect(margin, yPos, contentWidth, 2)
//        .fill(colors.primary);

//     doc.end();

//   } catch (err) {
//     console.error("Error generating receipt:", err);
//     res.status(500).json({ success: false, message: "Failed to generate receipt" });
//   }
// });



router.get('/receipt/:ticketNumber', async (req, res)=>{
    const { ticketNumber } = req.params;
    const booking = await Booking.findOne({ ticketNumber }); 
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.render('pages/receipt', { ticketNumber: req.params.ticketNumber, booking });
})

module.exports = router;
