const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['Appointment', 'System', 'Patient'], default: 'Appointment' },
  isRead: { type: Boolean, default: false },
  referenceId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
