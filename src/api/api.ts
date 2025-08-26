import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_URL,
});

export default api;
