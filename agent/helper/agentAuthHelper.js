const Lottery = require('../model/lotterySchema'); // Your model
const bcrypt = require('bcrypt');
const Admin = require('../model/adminSchema'); // Your admin model
const Agent = require('../model/agentSchema'); 

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jadhugd@gmail.com',
    pass: 'vocx eblx dvou rxyu'
  }
});

const agentHelper = {
  loginAgent: async (req, res) => {
    try {
      const {email, password } = req.body;

      // Check if admin with this name exists
      const agent = await Agent.findOne({ email });
      if (!agent) {
        return res.status(401).json({ success: false, message: 'Invalid name or password.' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, agent.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid name or password.' });
      }

      // Set session
      req.session.agent = { id: agent._id };
      // let mailed=await agentHelper.sendOtpEmail(agent.name, agent.email);
      return res.json({ success: true, message: 'Login successful.' });

    } catch (err) {
      console.error('Error during agent login:', err);
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

module.exports = agentHelper;
