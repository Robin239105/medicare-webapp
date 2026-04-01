const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
try { require('dotenv').config(); } catch (e) { /* Vercel provides env vars natively */ }

const app = express();

if (process.env.VERCEL) {
  app.set('trust proxy', 1);
}

const corsOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim())
  : '*';

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/api', (req, res) => res.json({ message: 'MediCare Clinical Sanctuary API is ONLINE!', status: 'HEALTHY' }));
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    database: dbStatus === 1 ? 'Connected' : 'Disconnected',
    readyState: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Routes
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');
const Setting = require('./models/Setting');
const Notification = require('./models/Notification');

// --- Auth Middleware ---
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No sanctuary token provided.' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clinical_sanctuary_secret_Key_2024');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid sanctuary token.' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Administrative clearance required.' });
  }
};

// --- API Endpoints ---

// Get all Doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Doctor
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Doctor
app.post('/api/doctors', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const saved = await doctor.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Doctor
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Doctor
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all Services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Service
app.post('/api/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Service
app.put('/api/services/:id', async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Service
app.delete('/api/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book Appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { patientName, email, phone, doctor, service, date, time } = req.body;

    if (!patientName?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: 'Name, email, and phone are required.' });
    }
    if (!doctor || !service || !date || !time) {
      return res.status(400).json({ message: 'Doctor, service, date, and time are required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(doctor) || !mongoose.Types.ObjectId.isValid(service)) {
      return res.status(400).json({ message: 'Invalid doctor or service selected.' });
    }

    const [docExists, svcExists] = await Promise.all([
      Doctor.findById(doctor),
      Service.findById(service)
    ]);
    if (!docExists || !svcExists) {
      return res.status(400).json({ message: 'Selected doctor or service was not found.' });
    }

    let existingUser = await User.findOne({ email: email.trim() });
    if (!existingUser) {
      const secureRandomPassword = Math.random().toString(36).slice(-8) + 'X1!';
      existingUser = await User.create({
        name: patientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: secureRandomPassword,
        role: 'user'
      });
    }

    const appointment = new Appointment({
      patientName: patientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      doctor,
      service,
      date,
      time,
      user: existingUser._id
    });
    const savedAppointment = await appointment.save();
    
    // Create Admin Notification
    await Notification.create({
      message: `New sanctuary appointment from ${patientName.trim()} for ${time}`,
      type: 'Appointment',
      referenceId: savedAppointment._id
    });
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Appointments (Admin)
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor')
      .populate('service')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('doctor')
      .populate('service');
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed Initial Data (Helper)
app.post('/api/seed', async (req, res) => {
  try {
    const existingCount = await Doctor.countDocuments();
    const existingServiceCount = await Service.countDocuments();
    
    if (existingCount > 0 && existingServiceCount > 0) {
      return res.status(200).json({ message: "Database already contains data, skipping seed." });
    }

    const defaultWeekdaySchedule = [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' }
    ];

    const doctors = await Doctor.insertMany([
      { name: 'Dr. Sarah Jenkins', specialization: 'Senior Cardiologist', bio: 'Advanced heart health diagnostics and personalized care plans for cardiovascular wellness.', image: 'https://images.unsplash.com/photo-1623854766464-c3645e6841d8?q=80&w=1000&auto=format&fit=crop', schedule: defaultWeekdaySchedule },
      { name: 'Dr. Michael Chen', specialization: 'Neurology Specialist', bio: 'Comprehensive neurological evaluations and treatment for brain and nervous system health.', image: 'https://images.unsplash.com/photo-1647866965225-1ed2b0c0a5cc?q=80&w=1000&auto=format&fit=crop', schedule: defaultWeekdaySchedule },
      { name: 'Dr. Elena Rodriguez', specialization: 'Lead Pediatrician', bio: 'Gentle and expert medical care tailored for infants, children, and adolescents.', image: 'https://images.unsplash.com/photo-1706565029539-d09af5896340?q=80&w=1000&auto=format&fit=crop', schedule: defaultWeekdaySchedule }
    ]);

    const services = await Service.insertMany([
      { title: 'Cardiology', description: 'Advanced heart health diagnostics and personalized care plans.', price: 150 },
      { title: 'Neurology', description: 'Comprehensive neurological evaluations and specialized treatment.', price: 180 },
      { title: 'Orthopedics', description: 'Specialized care for bone, joint, and muscle health.', price: 140 },
      { title: 'Pediatrics', description: 'Expert medical care tailored for infants and children.', price: 90 },
      { title: 'Dermatology', description: 'Expert skin care treatments and diagnostic services.', price: 120 },
      { title: 'Emergency', description: '24/7 rapid response medical care for critical needs.', price: 200 }
    ]);

    res.status(200).json({ message: 'Success! 3 doctors & 6 services seeded.', doctors, services });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- Auth API ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Identity already registered in the sanctuary.' });
    
    // First user is Admin for testing
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';
    
    const user = await User.create({ name, email, password, phone, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'clinical_sanctuary_secret_Key_2024', { expiresIn: '30d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'clinical_sanctuary_secret_Key_2024', { expiresIn: '30d' });
      res.json({ user, token });
    } else {
      res.status(401).json({ message: 'Invalid sanctuary credentials.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/me', protect, (req, res) => {
  res.json(req.user);
});

// --- Patient Profile API ---
app.get('/api/user/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor')
      .populate('service')
      .sort({ date: -1 });
    
    res.json({ user, appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/user/profile', protect, async (req, res) => {
  try {
    const { name, phone, medicalProfile } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (medicalProfile) {
      user.medicalProfile = { ...user.medicalProfile.toObject(), ...medicalProfile };
    }
    
    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin Profile & Notifications
app.put('/api/admin/profile', protect, admin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Admin not found.' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'Sanctuary profile updated.', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/admin/notifications', protect, admin, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/admin/notifications/:id/read', protect, admin, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    const totalPatients = await User.countDocuments({ role: 'user' });
    const totalDoctors = await Doctor.countDocuments();
    const revenue = completedAppointments * 150; // Dynamic revenue based on completions
    res.json({ totalAppointments, completedAppointments, totalPatients, totalDoctors, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Patient (Admin)
app.post('/api/admin/patients', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, phone, role: 'user' });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Patient
app.put('/api/admin/patients/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Patient
app.delete('/api/admin/patients/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Settings API
app.get('/api/admin/settings', async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/settings', async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (setting) {
      setting = await Setting.findOneAndUpdate({}, req.body, { new: true });
    } else {
      setting = await Setting.create(req.body);
    }
    res.json(setting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = app;
