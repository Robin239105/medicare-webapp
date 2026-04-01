const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=1000&auto=format&fit=crop' },
  schedule: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      location: { type: String, default: 'Main Clinic' }
    }
  ],
  bio: { type: String },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
