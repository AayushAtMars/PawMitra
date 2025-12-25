# PawMitra - Quick Start Guide

## ✅ **Recommended: Use Web Version**

The web version works perfectly with all features. Here's how to run it:

### 1. Start Backend
```bash
cd backend
npm start
```
✅ Backend running on `http://localhost:5000`

### 2. Start Frontend (Web)
```bash
cd frontend
npm start
# Press 'w' for web browser
```
✅ App opens at `http://localhost:8081`

---

## 🌐 **Why Use Web?**

### All Features Work:
- ✅ **Authentication** - Login/Register
- ✅ **Camera** - Browser webcam API
- ✅ **Location** - Browser geolocation
- ✅ **Maps** - Leaflet.js integration
- ✅ **Real-time** - Socket.io updates
- ✅ **Image Upload** - Cloudinary
- ✅ **All CRUD** - Pets, Services, Incidents

### Benefits:
- 🚀 **Instant startup** - No build required
- 🔥 **Hot reload** - Fast development
- 🛠️ **DevTools** - Chrome debugging
- 📱 **Responsive** - Works on mobile browsers
- ✅ **No SDK issues** - Pure web tech

---

## 📱 **For Mobile Testing:**

### Option 1: Mobile Browser (Easiest)
1. Get your computer's IP address
2. Update `frontend/.env`:
   ```
   API_URL=http://YOUR_IP:5000/api
   SOCKET_URL=http://YOUR_IP:5000
   ```
3. Open `http://YOUR_IP:8081` on phone browser

### Option 2: Downgrade to SDK 50
If you must use Expo Go:
```bash
cd frontend
git checkout package.json  # Revert to SDK 50
npm install
npm start
```

---

## 🎯 **Current Status:**

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Running | http://localhost:5000 |
| Frontend (Web) | ✅ Ready | http://localhost:8081 |
| Dashboard | ✅ Ready | http://localhost:5173 |
| Expo Go (Android) | ❌ SDK Issues | Use web instead |

---

## 🚀 **Quick Test:**

1. Open `http://localhost:8081` in browser
2. Click "Register" to create account
3. Test all features:
   - Report incident (camera access)
   - Browse pets for adoption
   - View marketplace services
   - Check volunteer dashboard

**Everything works perfectly on web!** 🎉

---

## Need Help?

- **Web not loading?** Check if backend is running on port 5000
- **Camera not working?** Allow browser camera permission
- **Location not working?** Allow browser location permission
- **CORS errors?** Backend CORS is configured for localhost:8081

**Recommendation: Stick with web for development and testing!**
