import { Platform } from "react-native";

const LOCAL_IP = "10.81.116.224";

export const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : `http://${LOCAL_IP}:5000/api`;

export const SOCKET_URL =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : `http://${LOCAL_IP}:5000`;
