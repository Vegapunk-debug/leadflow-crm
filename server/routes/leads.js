const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Discussion = require('../models/Discussion');

const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

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

//Create a new lead
router.post('/', async (req, res) => {
    try {
        const { name, company, phone, status, followUp, assignedTo } = req.body;

        if (!name) return res.status(400).json({ message: 'Name is required' });

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const lead = await Lead.create({ name, company, phone, status, followUp, assignedTo });
        console.log('Lead created successfully');
        res.status(201).json(lead);
    } catch (error) {
        console.log('Error creating lead:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;