import axios from "axios";

const TOKEN_KEY = "dol_token";
const USER_KEY = "dol_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authStore = {
  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  hasToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  }
};

export const register = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const me = () => api.get("/auth/me").then((r) => r.data);

export const calculateEmission = (payload) => api.post("/emissions/calculate", payload).then((r) => r.data);
export const fetchAnalytics = () => api.get("/emissions/analytics").then((r) => r.data);
export const getAdvice = (user_activity_data) => api.post("/ai/advice", { user_activity_data }).then((r) => r.data);
export const createOffset = (payload) => api.post("/tree/offset", payload).then((r) => r.data);
export const fetchTreeDashboard = () => api.get("/tree/dashboard").then((r) => r.data);
export const fetchScore = () => api.get("/score").then((r) => r.data);

export const listBlogs = () => api.get("/blogs").then((r) => r.data);
export const getBlog = (id) => api.get(`/blogs/${id}`).then((r) => r.data);
export const createBlog = (payload) => api.post("/blogs", payload).then((r) => r.data);

export const listChallenges = () => api.get("/challenges").then((r) => r.data);
export const createChallenge = (payload) => api.post("/challenges", payload).then((r) => r.data);
export const submitChallenge = (challengeId, payload) => api.post(`/challenges/${challengeId}/submit`, payload).then((r) => r.data);
export const closeChallenge = (challengeId) => api.post(`/challenges/${challengeId}/close`).then((r) => r.data);

export const listPendingSubmissions = () => api.get("/challenges/submissions/pending").then((r) => r.data);
export const verifySubmission = (submissionId, score) =>
  api.patch(`/challenges/submissions/${submissionId}/verify`, { score }).then((r) => r.data);
export const listRewards = () => api.get("/challenges/rewards").then((r) => r.data);
export const dispatchReward = (id, payload) => api.patch(`/challenges/rewards/${id}/dispatch`, payload).then((r) => r.data);

export const listUsers = () => api.get("/social/users").then((r) => r.data);
export const listFeed = () => api.get("/social/feed").then((r) => r.data);
export const listLeaderboard = () => api.get("/social/leaderboard").then((r) => r.data);
export const createPost = (payload) => api.post("/social/posts", payload).then((r) => r.data);
export const followUser = (followingId) => api.post("/social/follow", { followingId }).then((r) => r.data);

export default api;
