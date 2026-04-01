const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Service = require('./models/Service');

const seedData = async () => {
  try {
    const doctorCount = await Doctor.countDocuments();
    const serviceCount = await Service.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });

    if (adminCount === 0) {
      console.log('🌱 Seeding Admin User...');
      const adminUser = new User({
        name: 'Master Admin',
        email: 'admin@medicare.com',
        password: 'test',
        role: 'admin'
      });
      await adminUser.save();
    }

    const defaultWeekdaySchedule = [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', location: 'Main Wing' }
    ];

    if (doctorCount === 0) {
      console.log('🌱 Seeding Exact Stitch Doctors...');
      await Doctor.insertMany([
        { name: 'Dr. Sarah Jenkins', specialization: 'Senior Cardiologist', bio: 'Advanced heart health diagnostics and personalized care plans for cardiovascular wellness.', image: 'https://images.unsplash.com/photo-1623854766464-c3645e6841d8?q=80&w=1000&auto=format&fit=crop', schedule: defaultWeekdaySchedule },
        { name: 'Dr. Michael Chen', specialization: 'Neurology Specialist', bio: 'Comprehensive neurological evaluations and treatment for brain and nervous system health.', image: 'https://images.unsplash.com/photo-1647866965225-1ed2b0c0a5cc?q=80&w=1000&auto=format&fit=crop', schedule: defaultWeekdaySchedule },
        { name: 'Dr. Elena Rodriguez', specialization: 'Lead Pediatrician', bio: 'Gentle and expert medical care tailored for infants, children, and adolescents.', image: 'https://images.unsplash.com/photo-1706565029539-d09af5896340?q=80&w=1000&auto=format&fit=crop', schedule: defaultWeekdaySchedule }
      ]);
    }

    if (serviceCount === 0) {
      console.log('🌱 Seeding Exact Stitch Services...');
      await Service.insertMany([
        { title: 'Cardiology', description: 'Advanced heart health diagnostics and personalized care plans.', price: 150 },
        { title: 'Neurology', description: 'Comprehensive neurological evaluations and specialized treatment.', price: 180 },
        { title: 'Orthopedics', description: 'Specialized care for bone, joint, and muscle health.', price: 140 },
        { title: 'Pediatrics', description: 'Expert medical care tailored for infants and children.', price: 90 },
        { title: 'Dermatology', description: 'Expert skin care treatments and diagnostic services.', price: 120 },
        { title: 'Emergency', description: '24/7 rapid response medical care for critical needs.', price: 200 }
      ]);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is MISSING in environment variables!');
    throw new Error('MONGODB_URI is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000
    };
    
    console.log('📡 Attempting to connect to MongoDB Atlas...');
    cached.promise = mongoose.connect(uri, opts).then(async (m) => {
      console.log('✅ Connected to MongoDB Sanctuary');
      return m;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
