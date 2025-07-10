const Lottery = require('../model/lotterySchema'); // Your model
const bcrypt = require('bcrypt');
const Admin = require('../model/adminSchema'); // Your admin model

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

      return res.json({ success: true, message: 'Login successful.' });

    } catch (err) {
      console.error('Error during admin login:', err);
      return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  },
  
};

module.exports = adminHelper;
