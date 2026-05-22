const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Discussion = require('../models/Discussion');

const VALID_STATUSES = Lead.LEAD_STATUSES;

//Get all leads
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        const query = {};
        if (status && VALID_STATUSES.includes(status)) query.status = status;

        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: 'i' };
        }

        const leads = await Lead.find(query).sort({ updatedAt: -1 }).lean();
        
        // Fetch all discussions in a single query to avoid the N+1 problem
        const leadIds = leads.map(lead => lead._id);
        const discussions = await Discussion.find({ lead: { $in: leadIds } }).sort({ createdAt: -1 }).lean();
        
        const leadsWithDiscussion = leads.map(lead => ({
            ...lead,
            discussions: discussions.filter(d => d.lead.toString() === lead._id.toString())
        }));

        console.log('Leads fetched successfully');
        res.json(leadsWithDiscussion);
    } catch (error) {
        console.log('Error fetching leads:', error.message);
        res.status(500).json({ message: 'Internal server error' });
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

//Update a lead
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, phone, status, followUp } = req.body;

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const lead = await Lead.findByIdAndUpdate(id, 
            { name, company, phone, status, followUp },
            { new: true, runValidators: true }
        );
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        console.log('Lead updated successfully');
        res.json(lead);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid lead ID format' });
        }
        console.log('Error updating lead:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Delete lead
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByIdAndDelete(id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        await Discussion.deleteMany({ lead: id });
        console.log('Lead deleted successfully');
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid lead ID format' });
        }
        console.log('Error deleting lead:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;