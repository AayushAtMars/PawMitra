import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Remove '/api' from the end to get the base URL
const SOCKET_URL = API_URL.replace('/api', '');

let socket;

export const initSocket = () => {
  const token = localStorage.getItem('adminToken');
  
  if (!socket && token) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      auth: {
        token: token
      }
    });
    console.log('Socket initialized connecting to:', SOCKET_URL);
    
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
      // Join admin room immediately upon connection
      socket.emit('join_admin_room');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
