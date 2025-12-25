# Complete Restart Instructions

## The Problem:
Expo caches environment variables. Simply reloading the app won't pick up the new API URL.

## ✅ Solution - Complete Restart:

### Step 1: Stop Metro Bundler
In the frontend terminal, press **Ctrl+C** to stop the server.

### Step 2: Clear Expo Cache
```bash
cd frontend
npx expo start --clear
```

### Step 3: On Your Phone
1. **Close Expo Go app completely** (swipe away from recent apps)
2. **Reopen Expo Go**
3. **Scan the QR code again**

---

## Alternative: Hardcode the API URL (Temporary Fix)

If the above doesn't work, we can temporarily hardcode the IP in the API service file:

### Edit `frontend/src/services/api.js`:
Change line 3 from:
```javascript
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
```

To:
```javascript
const API_URL = 'http://10.81.116.224:5000/api';
```

Then reload the app.

---

## Verify Backend is Accessible:

Test from your computer:
```bash
curl http://10.81.116.224:5000/api/auth/me
```

Should return: `{"error":"Unauthorized. Please login."}`

This confirms the backend is accessible at that IP! ✅

---

## If Still Not Working:

### Check Windows Firewall:
1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Find **Node.js** and ensure both **Private** and **Public** are checked
4. If not listed, click **"Allow another app"** and add Node.js

### Check WiFi Network:
- Computer and phone must be on **same WiFi network**
- Some public/guest WiFi networks block device-to-device communication

---

## Quick Test - Use Web Version:

While troubleshooting mobile, you can use the web version:
1. In Metro terminal, press **`w`**
2. Opens at `http://localhost:8081`
3. All features work perfectly!

**Try the complete restart steps above first!** 🔄
