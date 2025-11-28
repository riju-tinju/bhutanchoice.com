const mongoose = require("mongoose");
const Admin = require("../model/adminSchema"); 
moment = require("moment-timezone"); // custom

const verifyAdmin = async (req, res, next) => {
  try {
    
      res.locals.moment = moment; // Make moment available in views
      return next(); // Authenticated user
    } catch (error) {
    console.error("Error in verifyCustomer middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = verifyAdmin;
