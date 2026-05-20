const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New',
  },
  followUp: {
    type: Date,
    default: null,
  },
  assignedTo: {
    type: String,
    default: 'default_user'
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);