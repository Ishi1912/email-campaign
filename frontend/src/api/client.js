import axios from "axios";

// The Express backend mounts everything under /api and listens on :3000.
// vite.config.js proxies /api -> http://localhost:3000 in dev.
const client = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("signal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("signal_token");
      localStorage.removeItem("signal_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ---- auth ----
export const authApi = {
  register: (payload) => client.post("/auth/register", payload),
  login: (payload) => client.post("/auth/login", payload),
};

// ---- subscribers ----
export const subscriberApi = {
  list: () => client.get("/subscriber"),
  get: (id) => client.get(`/subscriber/${id}`),
  create: (payload) => client.post("/subscriber", payload),
  update: (id, payload) => client.put(`/subscriber/${id}`, payload),
  remove: (id) => client.delete(`/subscriber/${id}`),
  uploadCsv: (file) => {
    const form = new FormData();
    form.append("file", file);
    return client.post("/subscriber/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ---- campaigns ----
export const campaignApi = {
  list: () => client.get("/campaign"),
  get: (id) => client.get(`/campaign/${id}`),
  create: (payload) => client.post("/campaign", payload),
  update: (id, payload) => client.put(`/campaign/${id}`, payload),
  remove: (id) => client.delete(`/campaign/${id}`),
  send: (id) => client.post(`/campaign/${id}/send`),
};

// ---- AI (backed by /api/ai/generate -> { subject, content }) ----
export const aiApi = {
  generate: (prompt) => client.post("/ai/generate", { prompt }),
};

export default client;
