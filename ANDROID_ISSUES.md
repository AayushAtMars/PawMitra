# PawMitra - Running on Web Platform

## ⚠️ Android Emulator Compatibility Issue

The PawMitra mobile app is built with **Expo and React Native Web**, which works best on web browsers. The Android emulator is experiencing native module compatibility issues.

## ✅ Recommended Solution: Use Web Platform

### Run the app in your web browser:

```bash
cd frontend
npm start
# Press 'w' for web browser
```

The app will open at `http://localhost:8082` with full functionality.

---

## Why Web Instead of Android?

1. **Faster Development**: No need to rebuild native Android app
2. **Full Feature Support**: All features work on web (Camera via WebRTC, Location API, etc.)
3. **Cross-Platform**: Works on any device with a browser
4. **No Emulator Issues**: Avoids Android-specific permission and module errors

---

## Features That Work on Web:

✅ **Authentication** - Login/Register
✅ **Incident Reporting** - Camera access via browser
✅ **Pet Adoption** - Swipeable cards
✅ **Marketplace** - Service discovery
✅ **Volunteer Dashboard** - Real-time updates
✅ **Maps** - Leaflet.js integration
✅ **All CRUD operations** - Full backend integration

---

## If You Still Want Android:

### Option 1: Build Native Android App
```bash
cd frontend
npx expo prebuild
npx expo run:android
```

### Option 2: Use Expo Go App
1. Install **Expo Go** from Play Store
2. Scan QR code from `npm start`
3. App runs in Expo Go container

---

## Current Status:

- ✅ **Backend**: Running on port 5000
- ✅ **Frontend (Web)**: Running on port 8082
- ✅ **Dashboard**: Available on port 5173
- ❌ **Android Emulator**: Module compatibility issues

**Recommendation**: Use web platform for testing and development. Build native Android only for production deployment.

---

## Quick Start (Web):

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend  
npm start
# Press 'w' for web

# Terminal 3 - Dashboard (Optional)
cd dashboard
npm run dev
```

Visit `http://localhost:8082` to use the app! 🎉
