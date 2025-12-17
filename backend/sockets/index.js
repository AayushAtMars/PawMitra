import { verifyToken } from '../middleware/auth.js';

const setupSocketIO = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        socket.userId = decoded.id;
        return next();
      }
    }
    
    // Allow unauthenticated connections for public features
    next();
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
      console.log(`User ${socket.userId} joined their room`);
    }

    // Join location-based rooms for volunteer alerts
    socket.on('join_location_room', (data) => {
      const { latitude, longitude } = data;
      if (latitude && longitude) {
        // Create a room based on approximate location (e.g., grid cell)
        const lat = Math.floor(latitude * 100) / 100;
        const lng = Math.floor(longitude * 100) / 100;
        const locationRoom = `location_${lat}_${lng}`;
        
        socket.join(locationRoom);
        socket.locationRoom = locationRoom;
        console.log(`Socket joined location room: ${locationRoom}`);
      }
    });

    // Join admin room (for NGOs and admins)
    socket.on('join_admin_room', () => {
      if (socket.userId) {
        socket.join('admin_room');
        console.log(`User ${socket.userId} joined admin room`);
      }
    });

    // Join lost & found room
    socket.on('join_lost_found_room', () => {
      socket.join('lost_found_room');
      console.log(`Socket joined lost & found room`);
    });

    // Join specific incident room for updates
    socket.on('join_incident_room', (incidentId) => {
      socket.join(`incident_${incidentId}`);
      console.log(`Socket joined incident room: ${incidentId}`);
    });

    // Leave incident room
    socket.on('leave_incident_room', (incidentId) => {
      socket.leave(`incident_${incidentId}`);
      console.log(`Socket left incident room: ${incidentId}`);
    });

    // Update volunteer location (for real-time tracking)
    socket.on('update_location', (data) => {
      const { latitude, longitude } = data;
      
      if (socket.userId && latitude && longitude) {
        // Leave old location room
        if (socket.locationRoom) {
          socket.leave(socket.locationRoom);
        }
        
        // Join new location room
        const lat = Math.floor(latitude * 100) / 100;
        const lng = Math.floor(longitude * 100) / 100;
        const locationRoom = `location_${lat}_${lng}`;
        
        socket.join(locationRoom);
        socket.locationRoom = locationRoom;
        
        // Broadcast location update to admin dashboard
        io.to('admin_room').emit('volunteer_location_update', {
          volunteerId: socket.userId,
          location: { latitude, longitude }
        });
      }
    });

    // Volunteer availability toggle
    socket.on('toggle_availability', (isAvailable) => {
      if (socket.userId) {
        io.to('admin_room').emit('volunteer_availability_changed', {
          volunteerId: socket.userId,
          isAvailable
        });
      }
    });

    // Send message in incident chat
    socket.on('send_incident_message', (data) => {
      const { incidentId, message } = data;
      
      io.to(`incident_${incidentId}`).emit('new_incident_message', {
        incidentId,
        message,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { incidentId } = data;
      socket.to(`incident_${incidentId}`).emit('user_typing', {
        userId: socket.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
      
      // Notify admin dashboard if volunteer goes offline
      if (socket.userId) {
        io.to('admin_room').emit('volunteer_offline', {
          volunteerId: socket.userId
        });
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('✅ Socket.IO event handlers configured');
};

export default setupSocketIO;
