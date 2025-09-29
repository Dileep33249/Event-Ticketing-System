import axios from "axios";
import { base_url } from "../../Hunter";

const api = axios.create({
  baseURL: base_url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("API Interceptor - Token from localStorage:", token ? "Token present" : "No token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("API Interceptor - Authorization header set:", config.headers.Authorization);
  }
  console.log("API Interceptor - Request config:", config);
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingRequests = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("Refresh token from localStorage:", refreshToken ? "Present" : "Not found");
        if (!refreshToken) throw new Error("No refresh token");
        console.log("Attempting to refresh token...");
        const { data } = await axios.post(`${base_url}/auth/refresh`, { refreshToken });
        console.log("Refresh response:", data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
          processQueue(null, data.token);
          return api(originalRequest);
        }
        throw new Error("No token in refresh response");
      } catch (err) {
        console.log("Refresh token failed:", err.message);
        processQueue(err, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loggedInUser");
        window.location.assign("/Login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;


