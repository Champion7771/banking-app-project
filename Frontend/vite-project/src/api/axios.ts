import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  // SUCCESS RESPONSE
  (response) => response,

  // ERROR RESPONSE
  async (error) => {
    // TEMPORARY:
    // refresh token logic removed
    // because backend /auth/refresh route does not exist yet

    return Promise.reject(error);
  },
);

export default api;
