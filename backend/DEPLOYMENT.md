# PawMitra Backend

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_characters

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=5000
NODE_ENV=production

# Optional: OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

## Deployment to Render.com

1. Push code to GitHub
2. Go to render.com
3. New → Web Service
4. Connect your repository
5. Configure:
   - **Name:** pawmitra-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables from above
7. Deploy!

## Health Check

Your backend will be available at: `https://pawmitra-backend.onrender.com`

Test it:
```bash
curl https://pawmitra-backend.onrender.com/api/health
```
