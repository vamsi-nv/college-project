import toast from "react-hot-toast";
import { api_paths } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const fetchUserClubs = async () => {
  try {
    const response = await axiosInstance(api_paths.clubs.get_user_clubs);
    if (response.data.success) {
      return response.data.clubs;
    }
  } catch (error) {
    console.error(
      "Error fetching clubs:",
      error.response?.data?.message || error.message
    );
    toast.error("Failed to fetch Clubs");
    return null;
  }
};
