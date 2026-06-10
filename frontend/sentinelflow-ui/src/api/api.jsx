import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const predictTransaction = (data) =>
  API.post("/predict", data);

export const getMetrics = () =>
  API.get("/metrics");

export const getHistory = (limit = 50) =>
  API.get(`/history?limit=${limit}`);