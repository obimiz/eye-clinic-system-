import API from "./api.js";
 
const authService = {
  // Login
  login: async (email, password) => {
    const response = await API.post("/users/login", { email, password });
    return response.data;
  },
 
  // Logout
  logout: async () => {
    const response = await API.post("/users/logout");
    return response.data;
  },
 
  // Forgot password
  forgotPassword: async (email) => {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  },
 
  // Reset password
  resetPassword: async (token, password) => {
    const response = await API.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
 
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await API.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
 
  // Get profile
  getProfile: async () => {
    const response = await API.get("/users/profile");
    return response.data;
  },
};
 
export default authService;
 