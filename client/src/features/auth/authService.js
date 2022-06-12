import axios from "axios";
import { USER_KEY, SERVER_URL } from "../../config/constants";

const AUTH_API_URL = `${SERVER_URL}api/auth`;

// Register user.
const register = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, userData);
  if (response.data.success) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user.
const login = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, userData);
  if (response.data.success) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem(USER_KEY);
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
