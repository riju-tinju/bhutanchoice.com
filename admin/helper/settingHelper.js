const Lottery = require('../model/lotterySchema'); // Your model
const Admin = require('../model/adminSchema'); // Your model
const bcrypt = require('bcrypt');
const SEO = require('../model/seoSchema');
const settingHelper = {
    getAdminDetails: async (req, res) => {
        try {
            // Fetch admin details from the database
            const adminDetails = await Admin.findOne({});
            if (!adminDetails) {
                return res.status(200).json({
                    success: true,
                    data: {
                        name: '',
                        email: '',
                        phone:'',
                    }
                });

            }
            return res.status(200).json({
                success: true, data: {
                    name: adminDetails.name || '',
                    email: adminDetails.email || '',
                    phone: adminDetails.phone || '',
                }
            });
        } catch (err) {
            console.error("Error fetching admin details:", err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching admin details.' });
        }
    },
    updateAdmin: async (req, res) => {
        try {
            console.log("Admin session found:", req.session.admin.id);
            const adminId = req.session.id;
            const { name, email,phone, currentPassword, newPassword } = req.body;

            if (!adminId) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Admin session not found' });
            }

            const admin = await Admin.findById(req.session.admin.id);
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }

            if(!currentPassword) {
                return res.status(400).json({ success: false, message: 'Current password is required' });
            }

            // Compare currentPassword with stored hashed password
            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }

            // Update fields
            if (name) admin.name = name;
            if (email) admin.email = email;
            if (phone) admin.phone = phone;
            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                admin.password = hashedPassword;
            }

            await admin.save();

            return res.status(200).json({
                success: true,
                message: 'Admin updated successfully',
                data: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone
                }
            });

        } catch (err) {
            console.error('Error in updateAdmin:', err);
            return res.status(500).json({ success: false, message: 'Failed to update admin' });
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