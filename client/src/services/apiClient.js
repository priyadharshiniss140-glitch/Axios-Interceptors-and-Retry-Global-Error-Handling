import axios from "axios";

// Shared Axios instance. Its base URL is configured in client/.env.development.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: attach the token centrally when one is available.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle global authentication/server failures.
// Keep rejecting errors so TanStack Query retry and component onError handlers work.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = "/login";
    } else if (status >= 500) {
      window.alert("The server encountered an error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
