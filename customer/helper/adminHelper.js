const Lottery = require('../model/lotterySchema'); // Your model
const bcrypt = require('bcrypt');
const Admin = require('../model/adminSchema'); // Your admin model

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jadhugd@gmail.com',
    pass: 'vocx eblx dvou rxyu'
  }
});

const adminHelper = {
  createAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.params;

      if (!name || !email || !password)
         return res.json({ success: false, message: 'Please input all feilds.' }); 

      // Check if admin with this email already exists
      const existingAdmin = await Admin.findOne({  });
      if (existingAdmin) {
        return res.json({ success: false, message: 'Admin already exists.' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create admin
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword
      });

      await newAdmin.save();
      return res.json({ success: true, message: 'Admin created successfully.' });

    } catch (err) {
      console.error('Error creating admin:', err);
      return res.status(500).json({ success: false, message: 'Server error while creating admin.' });
    }
  },
  loginAdmin: async (req, res) => {
    try {
      const {email, password } = req.body;

      // Check if admin with this name exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid name or password.' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid name or password.' });
      }

      // Set session
      req.session.admin = { id: admin._id };
      let mailed=await adminHelper.sendOtpEmail(admin.name, admin.email);
      return res.json({ success: true, message: 'Login successful.' });

    } catch (err) {
      console.error('Error during admin login:', err);
      return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  },
  sendOtpEmail: async (name, email) => {
  try {
    const subject = "Admin Dashboard Login Alert";

    const text = ``;

    const html = `
      <p>Hello <b>${name}</b>,</p>
      <p>This is to inform you that someone has just logged into your admin dashboard.</p>
      <p>If this wasn't you, please take immediate action to secure your account.</p>
    `;

    const mailOptions = {
      from: `"${process.env.BRAND_NAME}" <${process.env.EMAIL}>`,
      to: email,
      subject,
      text,
      html
    };

    let mailed=await transporter.sendMail(mailOptions);
    if (!mailed) {
      return false;}
    
    return true;
  } catch (err) {
    console.error("Failed to send admin login alert email:", err);
    throw new Error("Email sending failed");
  }
},

  
};

module.exports = adminHelper;
