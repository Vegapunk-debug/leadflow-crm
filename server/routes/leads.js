const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Discussion = require('../models/Discussion');


//Get all leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        const leadsWithDiscussion = await Promise.all(
            leads.map(async (lead) => {
                const discussions = await Discussion.find({ lead: lead._id }).sort({ createdAt: 1 });
                return { ...lead.toObject(), discussions };
        }));

        console.log('Leads fetched successfully');
        res.json(leadsWithDiscussion);
    } catch (error) {
        console.log('Error fetching leads:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;