// import jwt from 'jsonwebtoken';
// import passport from 'passport';

// // Middleware to verify JWT token
// export const authenticate = (req, res, next) => {
//   console.log('Auth middleware - Headers:', req.headers.authorization);
  
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) {
//       console.error('Auth error:', err);
//       return res.status(500).json({ error: 'Authentication error' });
//     }
    
//     if (!user) {
//       console.log('No user found. Info:', info);
//       return res.status(401).json({ error: 'Unauthorized. Please login.' });
//     }
    
//     console.log('User authenticated:', user.email);
//     req.user = user;
//     next();
//   })(req, res, next);
// };

// // Middleware to check if user has specific role
// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
    
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ 
//         error: 'Forbidden. You do not have permission to access this resource.' 
//       });
//     }
    
//     next();
//   };
// };

// // Middleware to check if user is a volunteer
// export const isVolunteer = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
  
//   if (!req.user.isVolunteer && req.user.role !== 'volunteer') {
//     return res.status(403).json({ 
//       error: 'This feature is only available for volunteers.' 
//     });
//   }
  
//   next();
// };

// // Optional authentication (doesn't fail if no token)
// export const optionalAuth = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user) => {
//     if (user) {
//       req.user = user;
//     }
//     next();
//   })(req, res, next);
// };

// // Generate JWT token
// export const generateToken = (userId) => {
//   return jwt.sign(
//     { id: userId },
//     process.env.JWT_SECRET || 'your-secret-key',
//     { expiresIn: process.env.JWT_EXPIRE || '7d' }
//   );
// };

// // Verify JWT token
// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//   } catch (error) {
//     return null;
//   }
// };

import jwt from "jsonwebtoken";
import passport from "passport";

// Middleware to verify JWT token
export const authenticate = (req, res, next) => {
  // console.log('Auth middleware - Headers:', req.headers.authorization); // Optional logging

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return res.status(500).json({ error: "Authentication error" });
    }

    if (!user) {
      // console.log('No user found. Info:', info);
      return res.status(401).json({ error: "Unauthorized. Please login." });
    }

    // console.log('User authenticated:', user.email);
    req.user = user;
    next();
  })(req, res, next);
};

// --- FIX IS HERE: Alias 'authenticate' as 'protect' ---
// This allows other files to import { protect } without errors
export const protect = authenticate;

// Middleware to check if user has specific role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden. You do not have permission to access this resource.",
      });
    }

    next();
  };
};

// Middleware to check if user is a volunteer
export const isVolunteer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.user.isVolunteer && req.user.role !== "volunteer") {
    return res.status(403).json({
      error: "This feature is only available for volunteers.",
    });
  }

  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
};