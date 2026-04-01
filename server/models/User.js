const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  medicalProfile: {
    bloodType: { type: String, default: 'Not Set' },
    height: { type: String, default: '--' },
    weight: { type: String, default: '--' },
    allergies: { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] }
  },
  prescriptions: [{
    medication: { type: String },
    dosage: { type: String },
    frequency: { type: String },
    prescribedDate: { type: Date, default: Date.now },
    notes: { type: String }
  }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
