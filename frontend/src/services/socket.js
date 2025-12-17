import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  async connect() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      this.socket = io(SOCKET_URL, {
        auth: {
          token: token || ''
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      return this.socket;
    } catch (error) {
      console.error('Error connecting socket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join rooms
  joinLocationRoom(latitude, longitude) {
    if (this.socket) {
      this.socket.emit('join_location_room', { latitude, longitude });
    }
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('join_admin_room');
    }
  }

  joinIncidentRoom(incidentId) {
    if (this.socket) {
      this.socket.emit('join_incident_room', incidentId);
    }
  }

  leaveIncidentRoom(incidentId) {
    if (this.socket) {
      this.socket.emit('leave_incident_room', incidentId);
    }
  }

  joinLostFoundRoom() {
    if (this.socket) {
      this.socket.emit('join_lost_found_room');
    }
  }

  // Update location
  updateLocation(latitude, longitude) {
    if (this.socket) {
      this.socket.emit('update_location', { latitude, longitude });
    }
  }

  // Toggle availability
  toggleAvailability(isAvailable) {
    if (this.socket) {
      this.socket.emit('toggle_availability', isAvailable);
    }
  }

  // Listen to events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
