const mongoose = require("mongoose");
const Admin = require("../model/adminSchema");
const moment = require("moment-timezone");

const verifyAdmin = async (req, res, next) => {
  try {
    console.log(req.session.admin);
    // req.session.admin = {
    //   id: '68f73081f178cb613258b21e',
    //   name: 'Riju',
    //   email: 'riju@gmail.com',
    //   phone: '+975111112345',
    //   roll: 'admin'
    // }// For testing purposes, remove this line in production
    if (req.session.admin && req.session.admin.id) {
      let admin = await Admin.findById(req.session.admin.id);
      if (!admin) {
        return res.redirect("/not-found");
      }
      req.session.admin.name= admin.name || 'NA'
      req.session.admin.email= admin.email || 'NA'
      req.session.admin.phone= admin.phone || 'NA'
      console.log(req.session.admin)
      res.locals.moment = moment;
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
