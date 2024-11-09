import axios from "axios";
import { getToken } from "../helper/tokenHelper";

const { VITE_BACKEND_PORT_DEVELOPMENT } = import.meta.env;

export const apiBaseURL = VITE_BACKEND_PORT_DEVELOPMENT;

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const LoginUser = async ({ email, password }) => {
  const response = await axiosInstance.post(`/user/login`, {
    email,
    password,
  });
  return response.data;
};

export const RegisterUser = async ({ username, password, email }) => {
  const response = await axiosInstance.post(`/user/register`, {
    username,
    password,
    email,
  });
  return response.data;
};

export const verifyMFA = async ({ userId, mfaToken }) => {
  const response = await axiosInstance.post(`/user/verify-mfa`, {
    userId,
    mfaToken,
  });
  return response.data;
};

export const fetchActivityLogss = async () => {
  try {
    const response = await axiosInstance.get(`/activity/logs`);
    // console.log("response from fetchActivityLogs", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs", error);
    throw new Error("Unable to fetch activity logs.");
  }
};

//friends api's
export const fetchFriendList = async (userId) => {
  try {
    const response = await axiosInstance.get(`/friends/list/${userId}`);
    // console.log("response from fetchFriendList", response);
    return response;
  } catch (error) {
    console.error("Error fetching activity logs", error);
    throw new Error("Unable to fetch activity logs.");
  }
};

export const fetchProfileData = async () => {
  try {
    const response = await axiosInstance.get(`/user/profile`);
    // console.log("response from fetchProfileData", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs", error);
    throw new Error("Unable to fetch activity logs.");
  }
};

export const updateUserProfile = async (formData, userId) => {
  try {
    const response = await axiosInstance.put(`/user/profile/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response from updateUserProfile", response);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};
export default axiosInstance;
