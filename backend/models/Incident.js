import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  // Reporter information
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },

  // Incident details
  photos: [{
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  description: {
    type: String,
    default: ''
  },

  // AI Analysis Results
  aiAnalysis: {
    category: {
      type: String,
      enum: ['critical_injury', 'deceased', 'low_priority', 'not_animal', 'unclear'],
      default: 'unclear'
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    description: String,
    firstAidInstructions: [String],
    safetyWarnings: [String],
    analyzedAt: Date
  },

  // Status tracking
  status: {
    type: String,
    enum: ['reported', 'volunteer_assigned', 'ngo_assigned', 'in_progress', 'resolved', 'closed'],
    default: 'reported'
  },

  // Assignment
  assignedVolunteers: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: Date,
    acceptedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending'
    }
  }],

  assignedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Timeline
  timeline: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],

  // Resolution
  resolvedAt: Date,
  resolutionNotes: String,
  outcome: {
    type: String,
    enum: ['rescued', 'treated', 'removed', 'false_alarm', 'other']
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ status: 1, createdAt: -1 });
incidentSchema.index({ 'aiAnalysis.priority': 1 });

// Method to add timeline entry
incidentSchema.methods.addTimelineEntry = function (action, userId, notes = '') {
  this.timeline.push({
    action,
    performedBy: userId,
    notes,
    timestamp: new Date()
  });
  return this.save();
};

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
