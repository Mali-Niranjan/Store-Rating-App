// frontend/src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

export const loginAPI = (data) => API.post("/auth/login", data);
export const signupAPI = (data) => API.post("/auth/signup", data);

export default API;
