// Add this to your existing auth.js file, before the logout route

// @route   POST /api/auth/google/mobile
// @desc    Google OAuth for mobile (accepts user data from Expo Google Sign-In)
// @access  Public
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
