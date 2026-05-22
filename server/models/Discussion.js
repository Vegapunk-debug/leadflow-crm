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
    trim: true,
  },
  followUp: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

discussionSchema.index({ lead: 1 });

module.exports = mongoose.model('Discussion', discussionSchema);