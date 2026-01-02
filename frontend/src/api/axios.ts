import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, // change only if you use cookies later
});

/* ================= REQUEST INTERCEPTOR ================= */
// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
// Handle expired / invalid session globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Clear auth state
      localStorage.removeItem("token");

      // Hard redirect to avoid stale React state
      window.location.href = "/login?session=expired";
    }

    return Promise.reject(error);
  }
);

export default api;
