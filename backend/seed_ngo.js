import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedNGO = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawmitra');
    console.log('Connected to MongoDB');

    const ngoEmail = 'ngo@pawmitra.com';
    const ngoPassword = 'password123';

    // Check if NGO already exists
    const existingNGO = await User.findOne({ email: ngoEmail });

    if (existingNGO) {
      console.log('Test NGO account already exists:');
      console.log('Email:', ngoEmail);
      console.log('Password:', ngoPassword);
    } else {
      // Create NGO user
      const ngoUser = await User.create({
        name: 'Paw Care Foundation',
        email: ngoEmail,
        password: ngoPassword,
        role: 'ngo',
        phone: '9876543210',
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // New Delhi coordinates
        },
        address: 'New Delhi, India',
        ngoData: {
          organizationName: 'Paw Care Foundation',
          registrationNumber: 'NGO-123456',
          contactNumber: '9876543210',
          ambulanceCount: 2,
          serviceArea: 'Delhi NCR'
        }
      });

      console.log('✅ Test NGO account created successfully:');
      console.log('Email:', ngoEmail);
      console.log('Password:', ngoPassword);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding NGO:', error);
    process.exit(1);
  }
};

seedNGO();
