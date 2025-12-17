# PawMitra - Animal Welfare Platform

A hyperlocal smart network for animal welfare & community response, featuring AI-powered incident reporting, volunteer network, real-time alerts, and community adoption system.

## 🌟 Features

### Core Features
- **AI-Powered Incident Reporting**: Report injured animals with automatic AI triage using Gemini API
- **Volunteer Network**: Community-first responder model with karma points and gamification
- **Real-time Alerts**: Socket.io powered notifications for nearby incidents
- **Pet Adoption**: Tinder-style swipeable interface for pet adoption
- **Lost & Found**: Community watch for lost and found pets
- **Marketplace**: Pet services directory with location-based search
- **Geospatial Queries**: Find volunteers and incidents within 2km radius

### Technology Stack
- **Mobile App**: React Native Expo (iOS & Android & Web)
- **Backend**: Node.js + Express + MongoDB Atlas
- **Real-time**: Socket.io
- **AI**: Google Gemini 1.5 Flash API
- **Maps**: React Native Maps (mobile), Leaflet.js (web dashboard)
- **Storage**: Cloudinary
- **Authentication**: JWT + Passport.js (Email/Password, OAuth)

## 📁 Project Structure

```
PawMitra/
├── backend/                    # Node.js Express API
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── controllers/           # Business logic
│   ├── services/              # External services (Gemini, Cloudinary)
│   ├── middleware/            # Auth, upload middleware
│   ├── sockets/               # Socket.io handlers
│   ├── config/                # Configuration files
│   ├── server.js              # Main server file
│   └── package.json
├── frontend/                   # React Native Expo mobile app
│   ├── src/
│   │   ├── navigation/        # React Navigation setup
│   │   ├── screens/           # App screens
│   │   ├── context/           # React Context (Auth, etc.)
│   │   ├── services/          # API and Socket.io clients
│   │   ├── utils/             # Utility functions
│   │   └── theme/             # Design system
│   ├── App.js
│   ├── app.json               # Expo configuration
│   └── package.json
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Gemini API key
- Cloudinary account
- Expo CLI: `npm install -g expo-cli`

### 1. Clone and Install

```bash
# Clone the repository
cd PawMitra

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# MongoDB Atlas
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
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
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
# For iOS Simulator
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000

# For Android Emulator, use:
# API_URL=http://10.0.2.2:5000/api
# SOCKET_URL=http://10.0.2.2:5000

# For Physical Device, use your computer's IP:
# API_URL=http://192.168.1.100:5000/api
# SOCKET_URL=http://192.168.1.100:5000
```

### 3. Run the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

#### Start Mobile App
```bash
cd frontend
npm start
```

Then:
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## 📱 Mobile App Features

### Implemented
- ✅ Authentication (Login/Register)
- ✅ Home Screen with Quick Actions
- ✅ Navigation Structure
- ✅ API Integration
- ✅ Socket.io Real-time Connection
- ✅ Location Services
- ✅ Theme System

### To Be Implemented
- 🚧 Incident Reporting with Camera
- 🚧 Volunteer Dashboard
- 🚧 Pet Adoption Swipe Interface
- 🚧 Marketplace Listings
- 🚧 Profile & Settings
- 🚧 Push Notifications

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Incidents
- `POST /api/incidents` - Report incident (with AI analysis)
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/nearby` - Get nearby incidents
- `PATCH /api/incidents/:id/status` - Update status

### Volunteers
- `POST /api/volunteers/register` - Register as volunteer
- `POST /api/volunteers/accept-task` - Accept task
- `POST /api/volunteers/complete-task` - Complete task & earn karma
- `GET /api/volunteers/leaderboard` - Get leaderboard

### Pets
- `POST /api/pets` - Add pet for adoption
- `GET /api/pets` - Browse pets
- `POST /api/pets/:id/interest` - Express interest
- `POST /api/pets/report-lost-found` - Report lost/found pet

### Marketplace
- `POST /api/marketplace/services` - Register service
- `GET /api/marketplace/services/nearby` - Find nearby services
- `POST /api/marketplace/services/:id/review` - Add review

## 🧪 Testing

### Test Backend
```bash
cd backend
npm run dev
```

Visit `http://localhost:5000/health` to check server status

### Test Mobile App
1. Start backend server
2. Start Expo dev server
3. Run on simulator/device
4. Test authentication flow
5. Verify API connectivity

## 📚 Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [Frontend README](frontend/README.md) - Mobile app documentation
- [Implementation Plan](implementation_plan.md) - Full technical specification

## 🎯 Roadmap

### Phase 1 (MVP) - Current
- ✅ Backend API with all endpoints
- ✅ Authentication system
- ✅ MongoDB models with geospatial indexing
- ✅ AI integration (Gemini)
- ✅ Socket.io real-time features
- ✅ Mobile app foundation
- 🚧 Complete all mobile screens

### Phase 2
- Push notifications
- Advanced search and filters
- Analytics dashboard
- Payment integration for marketplace
- Chat system for adoption inquiries

### Phase 3
- Web dashboard for NGOs/Admins
- Municipal SaaS features
- Advanced AI features
- Multi-language support
- Offline mode

## 🤝 Contributing

This is an MVP project. To contribute:

1. Complete the remaining mobile screens
2. Add comprehensive error handling
3. Implement unit and integration tests
4. Add loading states and animations
5. Optimize performance

## 📄 License

MIT

## 🙏 Acknowledgments

- Google Gemini AI for image analysis
- Cloudinary for image storage
- MongoDB Atlas for database
- Expo for mobile development platform

---

**Built with ❤️ for animal welfare**
