import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { useAuth } from "../context/UserContextProvider";
import { LuTrash2 } from "react-icons/lu";

function Notifications() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { fetchUnreadCount } = useAuth();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        api_paths.notifications.get_all_notifications
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      toast.error("error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this notification?"
      );
      if (!confirm) {
        return;
      }

      const response = await axiosInstance.delete(
        api_paths.notifications.delete_notification(id)
      );

      if (response.data.success) {
        toast.success("Notification deleted");
        fetchNotifications();
      }
    } catch (error) {
      toast.error("Error deleting notification");
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete all?");
      if (!confirm) {
        return;
      }

      const response = await axiosInstance.delete(
        api_paths.notifications.delete_all_notifications
      );

      if (response.data.success) {
        toast.success("Notifications Deleted");
        fetchNotifications();
      }
    } catch (error) {
      toast.error("Error deleting  notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  if (loading) return <Loader />;
  
  return (
    <div className="w-full min-h-screen">
      <div className="flex items-center justify-between w-full p-6 border-b border-gray-300 pt-[52px] sm:pt-5">
        <p className="font-medium text-gray-800">Notifications</p>
        <button
          disabled={notifications.length === 0}
          onClick={handleDeleteAllNotifications}
          className="px-3 py-1 text-xs transition-all duration-300 border rounded-full text-red-500/90 hover:text-red-500 hover:bg-red-500/10"
        >
          Delete All
        </button>
      </div>
      <div className="flex flex-col items-start max-sm:mt-[51px]">
        {notifications.length < 1 && <p className="text-gray-500 mx-auto mt-10">No notifications yet.</p>}
        {notifications.map((notification) => (
          <div
            key={notification?._id}
            className="relative flex items-center w-full px-6 py-8 border-b border-gray-300"
          >
            <div className="self-start px-2 text-primary">
              <FaUserGroup className="size-6" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{notification?.title}</p>
              <Link
                to={`/clubs/${notification?.relatedClub?.name}/events/${notification?.relatedEvent?._id}`}
              >
                <p className="text-gray-500">
                  {notification?.relatedEvent?.title}
                </p>
              </Link>

              <button
                onClick={() => handleDeleteNotification(notification._id)}
                className="absolute text-gray-500 top-4 right-4"
              >
                <LuTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
