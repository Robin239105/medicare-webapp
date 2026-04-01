const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
