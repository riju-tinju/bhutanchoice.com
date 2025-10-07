const Lottery = require("../model/lotterySchema");
const Charge = require("../model/ticketChargeSchema");
const Booking = require("../model/bookingsSchema");
const Agent = require("../model/agentSchema");
mongoose = require("mongoose");
const moment = require("moment-timezone");

const agentHelper = {
  getAgents: async (req, res) => {
    try {
      // Extract query parameters
      const {
        status,
        search,
        page = 1,
        limit = 12,
        sort = 'name_asc'
      } = req.query;

      // Build filter object
      const filter = {};

      // Status filter
      if (status) {
        if (status === 'active') {
          filter.isActive = true;
        } else if (status === 'inactive') {
          filter.isActive = false;
        }
      }

      // Search filter (search in name, email, or phone)
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ];
      }

      // Parse pagination parameters
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Parse sort parameter
      let sortOption = {};
      switch (sort) {
        case 'name_asc':
          sortOption = { name: 1 };
          break;
        case 'name_desc':
          sortOption = { name: -1 };
          break;
        case 'created_asc':
          sortOption = { createdAt: 1 };
          break;
        case 'created_desc':
          sortOption = { createdAt: -1 };
          break;
        case 'updated_asc':
          sortOption = { updatedAt: 1 };
          break;
        case 'updated_desc':
          sortOption = { updatedAt: -1 };
          break;
        case 'lastLogin_asc':
          sortOption = { lastLogin: 1 };
          break;
        case 'lastLogin_desc':
          sortOption = { lastLogin: -1 };
          break;
        default:
          sortOption = { name: 1 };
      }

      // Execute query with pagination and sorting
      const agents = await Agent.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('-otp') // Exclude OTP field for security
        .lean();

      // Get total count for pagination info
      const totalAgents = await Agent.countDocuments(filter);
      const totalPages = Math.ceil(totalAgents / limitNum);

      // Prepare response data in the correct format
      const response = {
        success: true,
        agents: agents, // Changed from 'data' to 'agents'
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalItems: totalAgents, // Changed from 'totalAgents' to 'totalItems'
          itemsPerPage: limitNum   // Added 'itemsPerPage'
        }
      };

      res.status(200).json(response);

    } catch (error) {
      console.error('Error fetching agents:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  createAgent: async (req, res) => {
    try {
      const { name, email, phone, avatar, admin_saved, isActive } = req.body;

      // Check if agent with email already exists
      const existingAgent = await Agent.findOne({ email: email.toLowerCase() });
      if (existingAgent) {
        return res.status(400).json({
          success: false,
          message: 'Agent with this email already exists'
        });
      }

      // Create new agent
      const newAgent = new Agent({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : undefined,
        avatar: avatar || '',
        admin_saved: admin_saved || false,
        isActive: isActive !== undefined ? isActive : true
      });

      const savedAgent = await newAgent.save();

      // Remove sensitive data from response
      const agentResponse = savedAgent.toObject();
      delete agentResponse.otp;

      res.status(201).json({
        success: true,
        message: 'Agent created successfully',
        agent: agentResponse
      });

    } catch (error) {
      console.error('Error creating agent:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  updateAgent: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, avatar, admin_saved, isActive } = req.body;

      // Check if agent exists
      const existingAgent = await Agent.findById(id);
      if (!existingAgent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      // Check if email is being changed and if it already exists
      if (email && email !== existingAgent.email) {
        const agentWithEmail = await Agent.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: id }
        });
        if (agentWithEmail) {
          return res.status(400).json({
            success: false,
            message: 'Another agent with this email already exists'
          });
        }
      }

      // Prepare update data
      const updateData = {
        updatedAt: new Date()
      };

      if (name) updateData.name = name.trim();
      if (email) updateData.email = email.toLowerCase().trim();
      if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (admin_saved !== undefined) updateData.admin_saved = admin_saved;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Update agent
      const updatedAgent = await Agent.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-otp');

      if (!updatedAgent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found after update attempt'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Agent updated successfully',
        agent: updatedAgent
      });

    } catch (error) {
      console.error('Error updating agent:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.message
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid agent ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  deleteAgent: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if agent exists
      const agent = await Agent.findById(id);
      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      // Delete the agent
      await Agent.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Agent deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting agent:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid agent ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  getAgentById: async (req, res) => {
    try {
      const { id } = req.params;

      const agent = await Agent.findById(id).select('-otp');
      
      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      res.status(200).json({
        success: true,
        agent: agent
      });

    } catch (error) {
      console.error('Error fetching agent:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid agent ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = agentHelper;