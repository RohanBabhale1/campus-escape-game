import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(
      localStorage.getItem("escape-room-game-state") || "{}",
    );
    const token = stored?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (_) {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("escape-room-game-state");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const gameAPI = {
  getOrCreateSession: () => api.get("/game/session"),
  restartSession: () => api.post("/game/session/restart"),
  getProgress: () => api.get("/game/progress"),
  savePuzzleState: (data) => api.put("/game/progress/puzzle", data),
};

export const roomAPI = {
  getRooms: () => api.get("/rooms"),
  completeRoom: (slug, data) => api.post(`/rooms/${slug}/complete`, data),
  trackAttempt: (slug) => api.post(`/rooms/${slug}/attempt`),
};

export const leaderboardAPI = {
  getLeaderboard: (params) => api.get("/leaderboard", { params }),
  submitScore: (data) => api.post("/leaderboard", data),
  getMyRank: () => api.get("/leaderboard/me"),
};

export default api;
