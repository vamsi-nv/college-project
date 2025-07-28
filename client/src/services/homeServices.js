import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import toast from "react-hot-toast";

class HomeService {
  static async fetchEvents() {
    try {
      const response = await axiosInstance.get(
        api_paths.events.get_user_club_events
      );
      const data = response.data;
      if (data.success) {
        return data.events || [];
      } else {
        toast.error("Failed to fetch events");
        return [];
      }
    } catch (error) {
      console.error("Error fetching events: ", error);
      toast.error("Error fetching events");
      return [];
    }
  }

  static async fetchAnnouncements() {
    try {
      const response = await axiosInstance.get(
        api_paths.announcements.get_user_club_announcements
      );
      const data = response.data;

      if (data.success) {
        return data.announcements || [];
      }

      toast.error("Failed to fetch announcements");
      return [];
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Error fetching announcements");
      return [];
    }
  }

  static async fetchAllData() {
    try {
      const [events, announcements] = await Promise.all([
        this.fetchEvents(),
        this.fetchAnnouncements(),
      ]);

      return { events, announcements };
    } catch (error) {
      console.error("Error fetching all data:", error);
      return { events: [], announcements: [] };
    }
  }

  static createMergedFeed(events, announcements) {
    const eventItems = events.map((event) => ({ ...event, type: "event" }));
    const announcementItems = announcements.map((announcement) => ({
      ...announcement,
      type: "announcement",
    }));

    return [...eventItems, ...announcementItems].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
}

export default HomeService;
