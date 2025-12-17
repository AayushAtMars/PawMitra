# PawMitra Setup Guide

## Quick Setup Steps

### 1. Backend Environment Setup

Create a `.env` file in the `backend` directory:

```bash
cd backend
# Copy the example file
cp .env.example .env
```

Then edit `backend/.env` and add your credentials:

**Required for Basic Functionality:**
```env
# MongoDB Atlas - Get from https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pawmitra?retryWrites=true&w=majority

# JWT Secret (use any random string)
JWT_SECRET=your_random_secret_key_here

# Gemini AI - Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary - Get from https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Optional (can add later):**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 2. Frontend Environment Setup

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
# For Web and iOS Simulator
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000

# For Android Emulator, use:
# API_URL=http://10.0.2.2:5000/api
# SOCKET_URL=http://10.0.2.2:5000

# For Physical Device, use your computer's IP:
# API_URL=http://192.168.1.100:5000/api
# SOCKET_URL=http://192.168.1.100:5000
```

### 3. Get Required API Keys

#### MongoDB Atlas (Free Tier)
1. Go to https://cloud.mongodb.com
2. Create account and new cluster
3. Create database user
4. Get connection string
5. Replace `<password>` with your database password

#### Gemini API (Free Tier)
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy the key

#### Cloudinary (Free Tier)
1. Go to https://cloudinary.com
2. Sign up for free account
3. Get Cloud Name, API Key, and API Secret from dashboard

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
# Press 'w' for web browser
```

### 5. Test the Connection

1. Open browser at `http://localhost:19006`
2. Click "Sign Up" to create an account
3. Fill in the registration form
4. If successful, you should be logged in!

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct
- Verify all required environment variables are set
- Check if port 5000 is available

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check API_URL in frontend/.env
- For web, use `http://localhost:5000/api`
- Check browser console for errors

### Database connection failed
- Verify MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

### AI features not working
- Verify Gemini API key is correct
- Check API key has proper permissions
- AI will use mock responses if key is missing (for development)

### Image upload not working
- Verify Cloudinary credentials
- Check if API key is active
- Images will use placeholder URLs if Cloudinary is not configured

## Next Steps

Once everything is running:

1. **Test Authentication:**
   - Register a new account
   - Login with credentials
   - Check if token is stored

2. **Test API Connection:**
   - Open browser console
   - Check Network tab for API calls
   - Verify responses from backend

3. **Implement Remaining Screens:**
   - Report Incident (with camera)
   - Volunteer Dashboard
   - Pet Adoption
   - Marketplace
   - Profile

## Development Workflow

```bash
# Always run both servers during development

# Terminal 1 - Backend (auto-reload enabled)
cd backend && npm run dev

# Terminal 2 - Frontend (hot reload enabled)
cd frontend && npm start

# Access app:
# - Web: http://localhost:19006
# - iOS: Press 'i' in terminal
# - Android: Press 'a' in terminal
```

## Production Deployment

When ready to deploy:

1. Set `NODE_ENV=production` in backend
2. Use strong JWT_SECRET
3. Configure production MongoDB cluster
4. Set up proper CORS origins
5. Enable HTTPS
6. Build frontend: `expo build:web`
7. Deploy backend to cloud service (Heroku, Railway, etc.)
8. Deploy frontend to static hosting (Vercel, Netlify, etc.)

---

**Need help?** Check the README files in backend/ and frontend/ directories for detailed documentation.
