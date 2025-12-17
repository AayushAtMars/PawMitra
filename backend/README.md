# PawMitra Backend

Backend API for PawMitra - A hyperlocal smart network for animal welfare & community response.

## Features

- 🔐 **Authentication**: Email/Password, Google OAuth, Facebook OAuth
- 🤖 **AI-Powered**: Gemini AI for incident image analysis and triage
- 📍 **Geospatial**: MongoDB 2dsphere indexes for location-based queries
- ⚡ **Real-time**: Socket.io for live alerts and updates
- ☁️ **Cloud Storage**: Cloudinary for image management
- 🎯 **Gamification**: Karma points and badges for volunteers

## Tech Stack

- Node.js (ES Modules)
- Express.js
- MongoDB Atlas
- Socket.io
- Passport.js
- Gemini AI API
- Cloudinary

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Then fill in your credentials:

```env
# MongoDB Atlas
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth

### Incidents
- `POST /api/incidents` - Report new incident (with AI analysis)
- `GET /api/incidents` - Get all incidents (with filters)
- `GET /api/incidents/nearby` - Get nearby incidents (geospatial)
- `GET /api/incidents/:id` - Get incident details
- `PATCH /api/incidents/:id/status` - Update incident status
- `POST /api/incidents/:id/assign` - Assign volunteer

### Volunteers
- `POST /api/volunteers/register` - Register as volunteer
- `PATCH /api/volunteers/profile` - Update volunteer profile
- `GET /api/volunteers/nearby` - Find nearby volunteers
- `POST /api/volunteers/accept-task` - Accept incident task
- `POST /api/volunteers/complete-task` - Complete task & earn karma
- `GET /api/volunteers/leaderboard` - Get leaderboard
- `GET /api/volunteers/stats` - Get volunteer statistics

### Pets (Adoption)
- `POST /api/pets` - Add pet for adoption
- `GET /api/pets` - Browse adoptable pets
- `GET /api/pets/:id` - Get pet details
- `POST /api/pets/:id/interest` - Express adoption interest
- `POST /api/pets/report-lost-found` - Report lost/found pet
- `GET /api/pets/lost-found` - Get lost/found pets

### Marketplace
- `POST /api/marketplace/services` - Register service provider
- `GET /api/marketplace/services` - Browse services
- `GET /api/marketplace/services/nearby` - Find nearby services
- `GET /api/marketplace/services/:id` - Get service details
- `POST /api/marketplace/services/:id/review` - Add review
- `PATCH /api/marketplace/services/:id` - Update service

## Socket.io Events

### Client → Server
- `join_location_room` - Join location-based room for alerts
- `join_admin_room` - Join admin dashboard room
- `join_incident_room` - Join specific incident room
- `update_location` - Update volunteer location
- `toggle_availability` - Toggle volunteer availability

### Server → Client
- `new_incident_alert` - New incident alert to nearby volunteers
- `new_incident` - New incident for admin dashboard
- `task_assigned` - Task assigned to volunteer
- `task_accepted` - Volunteer accepted task
- `task_completed` - Task completed
- `incident_updated` - Incident status updated
- `adoption_interest` - New adoption interest
- `new_lost_found` - New lost/found pet report

## Database Models

### User
- Authentication (email, password, OAuth IDs)
- Profile (name, avatar, role)
- Location (GeoJSON Point with 2dsphere index)
- Volunteer data (karma points, badges, service radius)
- NGO data (organization details)

### Incident
- Reporter and location (GeoJSON Point)
- Photos (Cloudinary URLs)
- AI analysis results (category, priority, first aid)
- Status tracking and timeline
- Assigned volunteers and NGO

### Pet
- Pet details (species, breed, age, health)
- Photos and description
- Location (GeoJSON Point)
- Adoption status and interested users
- Lost/found functionality

### Marketplace
- Business information and category
- Location (GeoJSON Point)
- Services and operating hours
- Ratings and reviews
- Premium listing status

## Development

```bash
# Run with auto-reload
npm run dev

# Run production
npm start
```

## License

MIT
