# Environment Configuration Guide

## ✅ Proper Environment Variable Setup

The app now uses **expo-constants** to read configuration from `app.json` instead of hardcoded values.

---

## 📝 How to Configure API URLs:

### 1. Edit `app.json`

Find the `extra` section and update the URLs:

```json
"extra": {
    "apiUrl": "http://YOUR_IP_HERE:5000/api",
    "socketUrl": "http://YOUR_IP_HERE:5000",
    "eas": {
        "projectId": "your-project-id-here"
    }
}
```

### 2. Get Your Computer's IP:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address"
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" address
```

### 3. Update the URLs:

Replace `YOUR_IP_HERE` with your actual IP address.

**Example:**
```json
"extra": {
    "apiUrl": "http://192.168.1.100:5000/api",
    "socketUrl": "http://192.168.1.100:5000"
}
```

### 4. Restart Expo:

```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

---

## 🔧 Configuration for Different Environments:

### For Local Development (Web):
```json
"apiUrl": "http://localhost:5000/api",
"socketUrl": "http://localhost:5000"
```

### For Android Emulator:
```json
"apiUrl": "http://10.0.2.2:5000/api",
"socketUrl": "http://10.0.2.2:5000"
```

### For Physical Device (Same WiFi):
```json
"apiUrl": "http://YOUR_COMPUTER_IP:5000/api",
"socketUrl": "http://YOUR_COMPUTER_IP:5000"
```

### For Production:
```json
"apiUrl": "https://your-api-domain.com/api",
"socketUrl": "https://your-api-domain.com"
```

---

## 📱 Current Configuration:

Your `app.json` is currently set to:
```json
"apiUrl": "http://10.81.116.224:5000/api",
"socketUrl": "http://10.81.116.224:5000"
```

This works for your current network. If your IP changes, just update `app.json` and restart Expo!

---

## ✅ Benefits of This Approach:

1. **No Hardcoding** - URLs are configurable
2. **Environment-Specific** - Easy to switch between dev/prod
3. **Expo Standard** - Uses official Expo Constants API
4. **Single Source** - All config in `app.json`
5. **Version Control Safe** - Can commit `app.json` with placeholders

---

## 🔄 To Change URLs in Future:

1. Edit `app.json` → `extra` section
2. Update `apiUrl` and `socketUrl`
3. Restart: `npx expo start --clear`
4. Reload app on device

**No code changes needed!** ✅
