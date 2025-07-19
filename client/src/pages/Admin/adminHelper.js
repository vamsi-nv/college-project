import axiosInstance from "../../utils/axiosInstance";
import { api_paths } from "../../utils/apiPaths";
import toast from "react-hot-toast";

export const fetchAllClubs = async () => {
  try {
    const response = await axiosInstance.get(api_paths.clubs.get_all_clubs);
    const data = response.data;

    if (data.success) {
      return data.clubs;
    }
  } catch (error) {
    toast.error("Error fetching clubs");
    return null;
  }
};

export const fetchAllEvents = async () => {
  try {
    const response = await axiosInstance.get(api_paths.events.get_all_events());
    const data = response.data;
    if (data.success) {
      return data.events;
    }
  } catch (error) {
    toast.error("Error fetching events");
    return null;
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get(api_paths.admin.get_all_users);
    const data = response.data;
    if (data.success) {
      return data.users;
    }
  } catch (error) {
    toast.error("Error fetching users");
    return null;
  }
};
