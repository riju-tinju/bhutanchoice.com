const Lottery = require('../model/lotterySchema'); // Your model
const Admin = require('../model/adminSchema'); // Your model
const Agent = require('../model/agentSchema');
const bcrypt = require('bcrypt');
const SEO = require('../model/seoSchema');



const settingHelper = {
    getAgentDetails: async (req, res) => {
        try {
            // Fetch admin details from the database
            const agentDetails = await Agent.findOne({_id: req.session.agent.id});
            if (!agentDetails) {
                return res.status(200).json({
                    success: true,
                    data: {
                        name: '',
                        email: '',
                    }
                });

            }
            return res.status(200).json({
                success: true, data: {
                    name: agentDetails.name || '',
                    email: agentDetails.email || '',
                }
            });
        } catch (err) {
            console.error("Error fetching admin details:", err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching admin details.' });
        }
    },
    updateAgent: async (req, res) => {
        try {
            console.log("agent session found:", req.session.agent.id);
            const agentId =req.session.agent.id;
            const { name, email, currentPassword, newPassword } = req.body;

            if (!agentId) {
                return res.status(401).json({ success: false, message: 'Unauthorized: agent session not found' });
            }

            const agent = await Agent.findById(req.session.agent.id);
            if (!agent) {
                return res.status(404).json({ success: false, message: 'agent not found' });
            }

            if(!currentPassword) {
                return res.status(400).json({ success: false, message: 'Current password is required' });
            }

            // Compare currentPassword with stored hashed password
            const isMatch = await bcrypt.compare(currentPassword, agent.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }

            // Update fields
            if (name) agent.name = name;
            if (email) agent.email = email;
            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                agent.password = hashedPassword;
            }

            await agent.save();

            return res.status(200).json({
                success: true,
                message: 'agent updated successfully',
                data: {
                    _id: agent._id,
                    name: agent.name,
                    email: agent.email
                }
            });

        } catch (err) {
            console.error('Error in updateagent:', err);
            return res.status(500).json({ success: false, message: 'Failed to update agent' });
        }
    },
    getWebsiteDetails: async (req, res) => {
        try {
            const seoData = await SEO.findOne({});

            if (!seoData) {
                return res.status(200).json({
                    "success": true,
                    "message": "Website settings updated successfully",
                    "data": {
                        "seoTitle": "",
                        "metaDescription": "",
                        "websiteUrl": "",
                        'logo': "https://example.com/logo.png"
                    }
                });
            }

            return res.status(200).json({
                success: true,
                data: seoData
            });

        } catch (err) {
            console.error('Error in getSeoDetails:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch SEO details' });
        }
    },
    updateWebsiteDetails: async (req, res) => {
        try {
            const { seoTitle, metaDescription, logo, websiteUrl } = req.body;

            const updateData = {};
            if (seoTitle) updateData.seoTitle = seoTitle;
            if (metaDescription) updateData.metaDescription = metaDescription;
            if (logo) updateData.logo = logo;
            if (websiteUrl) updateData.websiteUrl = websiteUrl;

            const updatedSeo = await SEO.findOneAndUpdate(
                {}, // Singleton SEO document
                { $set: updateData },
                { new: true, upsert: true, runValidators: true }
            );

            return res.status(200).json({
                success: true,
                message: 'SEO details updated successfully',
                data: updatedSeo
            });

        } catch (err) {
            console.error('Error in updateSeoDetails:', err);
            return res.status(500).json({ success: false, message: 'Failed to update SEO details' });
        }
    },
}

module.exports = settingHelper;