# PawMitra Mobile App

React Native Expo mobile application for PawMitra - A hyperlocal smart network for animal welfare & community response.

## Features

- 🔐 **Authentication**: Email/Password login and registration
- 📸 **Incident Reporting**: Report injured animals with camera integration
- 🗺️ **Real-time Maps**: View nearby incidents and volunteers
- 💝 **Volunteer System**: Accept tasks, earn karma points, and badges
- 🐾 **Pet Adoption**: Swipeable Tinder-style pet adoption interface
- 🏪 **Marketplace**: Find nearby pet services and shops
- 🔔 **Push Notifications**: Real-time alerts for volunteers
- 💬 **Real-time Updates**: Socket.io for live incident updates

## Tech Stack

- React Native (Expo SDK 50)
- React Navigation 6
- Expo Camera, Location, Notifications
- React Native Maps
- Socket.io Client
- Axios for API calls
- AsyncStorage for local data
- React Native Paper for UI components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally): `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your backend URL:

```env
# For iOS Simulator
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000

# For Android Emulator
# API_URL=http://10.0.2.2:5000/api
# SOCKET_URL=http://10.0.2.2:5000

# For Physical Device (replace with your computer's IP)
# API_URL=http://192.168.1.100:5000/api
# SOCKET_URL=http://192.168.1.100:5000
```

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You'll see a QR code in the terminal.

### 4. Run on Device/Simulator/Web

#### Web Browser
```bash
npm run web
```
The app will open in your default browser at `http://localhost:19006`

#### iOS Simulator (Mac only)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Physical Device
1. Install Expo Go app from App Store or Play Store
2. Scan the QR code from the terminal
3. Make sure your phone and computer are on the same network

> **Note**: The web version provides the same functionality as the mobile app, making it easy to test and develop without needing a mobile device or emulator.

## Project Structure

```
frontend/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Navigation setup
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── home/
    │   │   └── HomeScreen.js
    │   └── PlaceholderScreens.js
    ├── context/
    │   └── AuthContext.js      # Authentication state
    ├── services/
    │   ├── api.js              # API client
    │   └── socket.js           # Socket.io client
    ├── utils/
    │   └── geolocation.js      # Location utilities
    └── theme/
        └── index.js            # Theme configuration
```

## Key Features Implementation

### Authentication
- Login and registration with email/password
- JWT token storage in AsyncStorage
- Automatic token refresh
- Role-based access (Citizen, Volunteer, NGO)

### Navigation
- Bottom tab navigation for main features
- Stack navigation for auth flow
- Conditional rendering based on auth state
- Dynamic tabs based on user role

### Real-time Features
- Socket.io connection on login
- Real-time incident alerts for volunteers
- Live location tracking
- Push notifications

### Location Services
- Request location permissions
- Get current location
- Watch location changes
- Calculate distances
- Reverse geocoding

## Available Screens

### Implemented
- ✅ Login Screen
- ✅ Register Screen
- ✅ Home Screen

### Placeholder (To be implemented)
- 🚧 Report Incident Screen (Camera + AI analysis)
- 🚧 Volunteer Dashboard (Real-time alerts)
- 🚧 Pet Adoption Screen (Swipeable cards)
- 🚧 Marketplace Screen (Services listing)
- 🚧 Profile Screen (User settings)

## Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## Troubleshooting

### Web Platform
- **Port already in use**: Change port with `PORT=3000 npm run web`
- **Module not found errors**: Clear cache with `expo start -c`
- **Styles not loading**: Refresh browser and clear cache

### Cannot connect to backend
- Make sure backend server is running on `http://localhost:5000`
- For Android Emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use your computer's IP address
- Check firewall settings

### Location permissions not working
- Make sure permissions are configured in `app.json`
- Request permissions before using location features
- Check device settings

### Socket.io not connecting
- Verify SOCKET_URL in `.env`
- Check backend CORS configuration
- Ensure backend Socket.io server is running

## Next Steps

To complete the MVP, implement:

1. **Report Incident Screen**
   - Expo Camera integration
   - Image upload to backend
   - Display AI analysis results
   - Show first aid instructions

2. **Volunteer Dashboard**
   - Real-time incident alerts
   - Task acceptance/completion
   - Karma points display
   - Leaderboard

3. **Pet Adoption Screen**
   - Swipeable card deck
   - Pet details modal
   - Express interest functionality
   - Lost & Found section

4. **Marketplace Screen**
   - Service provider listings
   - Location-based filtering
   - Reviews and ratings
   - Emergency services

5. **Profile Screen**
   - User information
   - Edit profile
   - Settings
   - Logout

## License

MIT
