// Add this updated Google callback handler to your auth.js file
// Replace the existing /google/callback route (around line 219-227)

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
    
    // Redirect to mobile app with token and user data
    const redirectUrl = `com.pawmitra.app://auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    // Send HTML that will redirect to the app
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h2>Success! 🎉</h2>
            <p>Redirecting to PawMitra...</p>
            <p><small>If you're not redirected, <a href="${redirectUrl}" style="color: white;">click here</a></small></p>
          </div>
          <script>
            window.location.href = '${redirectUrl}';
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `);
  }
);
