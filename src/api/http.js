import axios from "axios";
import { useAuthStore } from "../store/authStore";

const http = axios.create({
  baseURL: "http://localhost:8080",
});

http.interceptors.request.use((config) => {
  const auth = useAuthStore();
  const token = auth.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;
