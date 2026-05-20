const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  followUp: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);