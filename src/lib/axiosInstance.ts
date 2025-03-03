// lib/axiosInstance.ts
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = async () => {
  const token = Cookies.get("session-token");
  return token;
};

axiosInstance.interceptors.request.use(
  async (request) => {
    const token = await getAccessToken();
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Error 401: Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
