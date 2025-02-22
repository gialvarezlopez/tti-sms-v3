// lib/axiosInstance.ts
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Asegúrate de configurar esta variable en tu archivo .env.local
  headers: {
    "Content-Type": "application/json",
  },
});

// Función asincrónica para obtener el token
const getAccessToken = async () => {
  const token = Cookies.get("session-token");
  return token;
};

axiosInstance.interceptors.request.use(
  async (request) => {
    const token = await getAccessToken();
    //console.log("Token obtenido:", token); // Verifica el valor del token
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
