const mongoose = require('mongoose');

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: LEAD_STATUSES,
    default: 'New',
  },
  followUp: {
    type: Date,
    default: null,
  },
  assignedTo: {
    type: String,
    default: 'default_user',
    trim: true,
  }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
Lead.LEAD_STATUSES = LEAD_STATUSES;

module.exports = Lead;