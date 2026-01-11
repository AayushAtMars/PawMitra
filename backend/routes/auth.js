import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import cloudinaryService from '../services/cloudinaryService.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('role').optional().isIn(['citizen', 'volunteer', 'ngo'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role, phone, location, volunteerData, ngoData } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create user
      const userData = {
        email,
        password,
        name,
        role: role || 'citizen',
        phone,
        location,
        isVolunteer: role === 'volunteer'
      };

      if (role === 'volunteer' && volunteerData) {
        userData.volunteerData = volunteerData;
      }

      if (role === 'ngo' && ngoData) {
        userData.ngoData = ngoData;
      }

      const user = await User.create(userData);

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isVolunteer: user.isVolunteer
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || 'Invalid credentials' });
      }

      // Update last active
      user.lastActive = new Date();
      user.save();

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isVolunteer: user.isVolunteer,
          volunteerData: user.isVolunteer ? user.volunteerData : undefined
        }
      });
    })(req, res, next);
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, uploadSingle, handleUploadError, async (req, res) => {
  try {
    const { name, phone, location, address, volunteerData } = req.body;
    let avatar = req.body.avatar; // In case it's passed as a string (rare)

    const user = await User.findById(req.user._id);

    // Handle file upload
    if (req.file) {
      try {
        const result = await cloudinaryService.uploadImage(req.file.buffer, 'avatars');
        avatar = result.url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({ error: 'Failed to upload profile image' });
      }
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    // Parse location if it comes as stringified JSON from FormData
    if (location) {
      try {
        user.location = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (e) {
        console.error('Error parsing location:', e);
      }
    }

    if (address) user.address = address;

    // Handle volunteerData (might need parsing if sending as JSON string in FormData)
    if (user.isVolunteer && volunteerData) {
      let vData = volunteerData;
      if (typeof volunteerData === 'string') {
        try { vData = JSON.parse(volunteerData); } catch (e) { }
      }
      user.volunteerData = { ...user.volunteerData, ...vData };
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        address: user.address,
        volunteerData: user.volunteerData
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    
    // Get user data
    const userData = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      avatar: req.user.avatar,
      isVolunteer: req.user.isVolunteer,
      volunteerData: req.user.isVolunteer ? req.user.volunteerData : undefined
    };
    
    // Create redirect URLs for different scenarios
    const appSchemeUrl = `pawmitra://auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    // Send HTML with multiple redirect options
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Signing in...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .spinner {
              border: 4px solid rgba(255,255,255,0.3);
              border-radius: 50%;
              border-top: 4px solid white;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .token-display {
              margin-top: 1rem;
              padding: 1rem;
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              word-break: break-all;
              font-size: 0.8rem;
            }
            .copy-btn {
              margin-top: 1rem;
              padding: 0.5rem 1rem;
              background: white;
              color: #667eea;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h2>Success! 🎉</h2>
            <p>You are signed in as <strong>${req.user.email}</strong></p>
            <p>Please close this browser window and return to the app.</p>
            <p><small>The app will automatically receive your login.</small></p>
            <div class="token-display">
              <strong>Token:</strong><br/>
              ${token.substring(0, 20)}...
            </div>
          </div>
          <script>
            // Try app scheme redirect
            window.location.href = '${appSchemeUrl}';
            
            // Auto close after delay
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  }
);


// @route   GET /api/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false
  })
);

// @route   GET /api/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.post('/google/mobile', async (req, res) => {
  try {
    const { email, name, photo, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // User exists, update last active and avatar if needed
      user.lastActive = new Date();
      if (photo && !user.avatar) {
        user.avatar = photo;
      }
      if (googleId && !user.googleId) {
        user.googleId = googleId;
      }
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        avatar: photo,
        role: 'citizen',
        googleId: googleId
      });
    }
    // Generate JWT token
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isVolunteer: user.isVolunteer,
        volunteerData: user.isVolunteer ? user.volunteerData : undefined
      }
    });
  } catch (error) {
    console.error('Google mobile auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
