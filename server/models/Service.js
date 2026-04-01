const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'medical_services' },
  price: { type: Number, required: true },
  iconName: { type: String, default: 'Activity' },
  isActive: { type: Boolean, default: true },
  category: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
