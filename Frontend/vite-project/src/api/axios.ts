import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
