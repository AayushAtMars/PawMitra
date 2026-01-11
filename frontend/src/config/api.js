import { Platform } from "react-native";

// For Android Emulator: 10.0.2.2 is the special alias to access host machine's localhost
// For Physical Device: Replace with your computer's IP (e.g., 192.168.1.100)
// Make sure both devices are on the same WiFi network when using physical device
const LOCAL_IP = "10.0.2.2";

export const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : `http://${LOCAL_IP}:5000/api`;

export const SOCKET_URL =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : `http://${LOCAL_IP}:5000`;
