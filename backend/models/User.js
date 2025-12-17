import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.facebookId;
    }
  },
  phone: {
    type: String,
    sparse: true,
    unique: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  
  // OAuth IDs
  googleId: String,
  facebookId: String,
  
  // Profile
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/avatar-placeholder.png'
  },
  
  // Role
  role: {
    type: String,
    enum: ['citizen', 'volunteer', 'ngo', 'admin'],
    default: 'citizen'
  },
  
  // Location (for geospatial queries)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  address: {
    type: String,
    default: ''
  },
  
  // Volunteer-specific fields
  isVolunteer: {
    type: Boolean,
    default: false
  },
  volunteerData: {
    serviceRadius: {
      type: Number,
      default: 2000, // in meters (2km)
      min: 500,
      max: 10000
    },
    karmaPoints: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      icon: String,
      earnedAt: Date
    }],
    tasksCompleted: {
      type: Number,
      default: 0
    },
    availability: {
      type: Boolean,
      default: true
    }
  },
  
  // NGO-specific fields
  ngoData: {
    organizationName: String,
    registrationNumber: String,
    contactNumber: String,
    ambulanceCount: Number,
    serviceArea: String
  },
  
  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update karma points and award badges
userSchema.methods.addKarmaPoints = function(points) {
  this.volunteerData.karmaPoints += points;
  
  // Award badges based on karma points
  const badges = [
    { threshold: 10, name: 'Beginner Helper', icon: '🌱' },
    { threshold: 50, name: 'Animal Friend', icon: '🐾' },
    { threshold: 100, name: 'Rescue Hero', icon: '⭐' },
    { threshold: 250, name: 'Guardian Angel', icon: '👼' },
    { threshold: 500, name: 'Legend', icon: '🏆' }
  ];
  
  badges.forEach(badge => {
    if (this.volunteerData.karmaPoints >= badge.threshold) {
      const hasBadge = this.volunteerData.badges.some(b => b.name === badge.name);
      if (!hasBadge) {
        this.volunteerData.badges.push({
          name: badge.name,
          icon: badge.icon,
          earnedAt: new Date()
        });
      }
    }
  });
  
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
