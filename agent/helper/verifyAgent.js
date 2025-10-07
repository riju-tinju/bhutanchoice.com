const mongoose = require("mongoose");
const Agent = require("../model/agentSchema"); 

const verifyAgent = async (req, res, next) => {
  try {
    //  req.session.agent= {
    //   id:'68ab64780b19334de3cec460'
    // }
    // req.session.agent={id:'68de240883882f81bbc40a5d'}// For testing purposes, remove this line in production
    if (req.session.agent && req.session.agent.id) {
      let agent= await Agent.findOne({_id: req.session.agent.id});
      if (!agent) {
        console.log("Agent not found in database");
        return res.redirect("/not-found");
      }

      // Check if the agent is active
      if (!agent.isActive) {
        console.log("Agent is not active");
        return res.redirect("/not-found");
      }
      req.session.agent.name = agent.name; 
      req.session.agent.email = agent.email;
      console.log("Agent session found:", req.session.agent);
      return next(); // Authenticated user
    }

    // Either not logged in or guest
    return res.redirect("/login");

  } catch (error) {
    console.error("Error in verifyCustomer middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = verifyAgent;
