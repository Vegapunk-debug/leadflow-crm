const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const Lead = require('../models/Lead');

router.post('/:leadId', async (req, res) => {
    try {
        const { leadId } = req.params;
        const { note, followUp } = req.body;

        if (!note || !note.trim()) {
            return res.status(400).json({ message: 'Note is required' });
        }

        const lead = await Lead.findById(leadId);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        const discussion = await Discussion.create({
            lead: leadId,
            note: note.trim(),
            followUp: followUp ? new Date(followUp) : null,
        });

        lead.followUp = followUp ? new Date(followUp) : null;
        await lead.save();

        console.log('Discussion created successfully');
        res.status(201).json({ discussion, lead: lead.toObject() });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid lead ID' });
        }
        console.log('Error creating discussion:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;