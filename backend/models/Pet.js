import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    default: 'Mixed'
  },
  age: {
    value: Number,
    unit: {
      type: String,
      enum: ['months', 'years'],
      default: 'months'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  
  // Health Information
  healthStatus: {
    vaccinated: {
      type: Boolean,
      default: false
    },
    neutered: {
      type: Boolean,
      default: false
    },
    medicalConditions: [String],
    specialNeeds: String
  },
  
  // Photos
  photos: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Description
  description: {
    type: String,
    required: true
  },
  personality: [String], // e.g., ['friendly', 'playful', 'calm']
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  address: String,
  
  // Shelter/Foster Information
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shelterName: String,
  contactInfo: {
    phone: String,
    email: String
  },
  
  // Adoption Status
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted', 'unavailable'],
    default: 'available'
  },
  
  // Interested Users
  interestedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expressedAt: {
      type: Date,
      default: Date.now
    },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Adoption Details
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adoptedAt: Date,
  
  // Lost & Found
  isLostFound: {
    type: Boolean,
    default: false
  },
  lostFoundType: {
    type: String,
    enum: ['lost', 'found'],
  },
  lastSeenDate: Date,
  
  // Stats
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
petSchema.index({ location: '2dsphere' });
petSchema.index({ status: 1, species: 1 });
petSchema.index({ isLostFound: 1, lostFoundType: 1 });

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
