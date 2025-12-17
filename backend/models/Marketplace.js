import mongoose from 'mongoose';

const marketplaceSchema = new mongoose.Schema({
  // Business Information
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['veterinary', 'grooming', 'pet_shop', 'training', 'boarding', 'emergency']
  },
  
  // Owner/Manager
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Contact Information
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: String,
    website: String
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  
  // Business Details
  description: {
    type: String,
    required: true
  },
  services: [{
    name: String,
    description: String,
    price: Number,
    duration: String // e.g., "30 minutes", "1 hour"
  }],
  
  // Photos
  photos: [{
    url: String,
    publicId: String
  }],
  logo: {
    url: String,
    publicId: String
  },
  
  // Operating Hours
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  
  // Emergency Services
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  emergency24x7: {
    type: Boolean,
    default: false
  },
  
  // Premium Listing
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: Date,
  
  // Ratings & Reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    photos: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
    response: {
      text: String,
      respondedAt: Date
    }
  }],
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
marketplaceSchema.index({ location: '2dsphere' });
marketplaceSchema.index({ category: 1, status: 1 });
marketplaceSchema.index({ isPremium: -1, 'ratings.average': -1 });

// Method to update average rating
marketplaceSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings.average = sum / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
  return this.save();
};

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

export default Marketplace;
