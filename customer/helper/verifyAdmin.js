const mongoose = require("mongoose");
const Admin = require("../model/adminSchema"); 

const verifyAdmin = async (req, res, next) => {
  try {
    console.log(req.session.admin);
    //  req.session.admin= {
    //   id:'68ab64780b19334de3cec460'
    // }
    // req.session.admin={id:'685dbdec92ae3669fbfb7b01'}// For testing purposes, remove this line in production
    if (req.session.admin && req.session.admin.id) {
      
      return next(); // Authenticated user
    }

    // Either not logged in or guest
    return res.redirect("/not-found");

  } catch (error) {
    console.error("Error in verifyCustomer middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = verifyAdmin;
