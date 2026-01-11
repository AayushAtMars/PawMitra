import { Platform } from "react-native";

// Production backend URL
const PRODUCTION_API_URL = "https://pawmitra-backend.onrender.com/api";
const PRODUCTION_SOCKET_URL = "https://pawmitra-backend.onrender.com";

// For development/testing
const LOCAL_IP = "10.0.2.2";
const DEV_API_URL = `http://${LOCAL_IP}:5000/api`;
const DEV_SOCKET_URL = `http://${LOCAL_IP}:5000`;

// Use production URLs by default
export const API_URL = PRODUCTION_API_URL;
export const SOCKET_URL = PRODUCTION_SOCKET_URL;

// Uncomment below for local development
// export const API_URL = Platform.OS === "web" ? "http://localhost:5000/api" : DEV_API_URL;
// export const SOCKET_URL = Platform.OS === "web" ? "http://localhost:5000" : DEV_SOCKET_URL;
