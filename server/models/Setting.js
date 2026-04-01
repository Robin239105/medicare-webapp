const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  clinicName: { type: String, default: 'MediCare Clinic Sanctuary' },
  contactEmail: { type: String, default: 'admin@medicare-sanctuary.com' },
  physicalAddress: { type: String, default: '742 Evergreen Terrace, Medical District' },
  primaryPhone: { type: String, default: '+1 (555) 000-1234' },
  websiteUrl: { type: String, default: 'www.medicare-sanctuary.com' },
  openingHours: {
    weekdays: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' } },
    saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '14:00' } },
  },
  slotDuration: { type: Number, default: 30 },
  emailAlerts: { type: Boolean, default: true },
  isMaintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
