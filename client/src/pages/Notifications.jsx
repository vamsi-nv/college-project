import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { FaUserGroup, FaBell } from "react-icons/fa6";
import { useAuth } from "../context/UserContextProvider";
import { LuTrash2 } from "react-icons/lu";

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  return date.toLocaleDateString();
};

const NotificationItem = ({ notification, onDelete }) => {
  const handleDelete = useCallback(() => {
    onDelete(notification._id);
  }, [notification._id, onDelete]);

  return (
    <div className="relative flex items-start w-full px-6 py-6 transition-colors duration-200 border-b border-gray-300 hover:bg-gray-50">
      <div className="flex-shrink-0 px-2 text-primary">
        <FaUserGroup className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium leading-5 text-gray-700">
          {notification?.title}
        </p>
        {notification?.relatedEvent && (
          <Link
            to={`/clubs/${notification?.relatedClub?.name}/events/${notification?.relatedEvent?._id}`}
            className="block mt-1"
          >
            <p className="text-sm text-gray-600 truncate">
              {notification?.relatedEvent?.title}
            </p>
          </Link>
        )}
        <p className="mt-2 text-xs text-gray-400">
          {formatRelativeTime(notification?.createdAt)}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-2 ml-2 text-gray-400 transition-all duration-200 rounded-md hover:text-red-500 hover:bg-red-50"
        aria-label="Delete notification"
      >
        <LuTrash2 className="size-4" />
      </button>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center px-6 py-16">
    <div className="p-4 mb-4 bg-gray-100 rounded-full">
      <FaBell className="text-gray-400 size-8" />
    </div>
    <h3 className="mb-2 text-lg font-medium text-gray-700">
      No notifications yet
    </h3>
    <p className="max-w-sm text-center text-gray-500">
      When you receive notifications about events and club activities, they'll
      appear here.
    </p>
  </div>
);

function Notifications() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const { fetchUnreadCount } = useAuth();

  const notificationCount = useMemo(
    () => notifications.length,
    [notifications.length]
  );
  const hasNotifications = notificationCount > 0;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        api_paths.notifications.get_all_notifications
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      toast.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteNotification = useCallback(
    async (id) => {
      try {
        const confirm = window.confirm(
          "Are you sure you want to delete this notification?"
        );
        if (!confirm) return;

        setDeleting(true);
        const response = await axiosInstance.delete(
          api_paths.notifications.delete_notification(id)
        );

        if (response.data.success) {
          toast.success("Notification deleted");
          setNotifications((prev) =>
            prev.filter((notification) => notification._id !== id)
          );
          fetchUnreadCount();
        }
      } catch (error) {
        toast.error("Error deleting notification");
      } finally {
        setDeleting(false);
      }
    },
    [fetchUnreadCount]
  );

  const handleDeleteAllNotifications = useCallback(async () => {
    try {
      const confirm = window.confirm(
        `Are you sure you want to delete all ${notificationCount} notifications?`
      );
      if (!confirm) return;

      setDeleting(true);
      const response = await axiosInstance.delete(
        api_paths.notifications.delete_all_notifications
      );

      if (response.data.success) {
        toast.success("All notifications deleted");
        setNotifications([]);
        fetchUnreadCount();
      }
    } catch (error) {
      toast.error("Error deleting notifications");
    } finally {
      setDeleting(false);
    }
  }, [notificationCount, fetchUnreadCount]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex items-center justify-between w-full p-6 border-b border-gray-300 pt-[52px] sm:pt-5 bg-white sticky top-0 z-10">
        <div className="flex flex-col items-start gap-1">
          <p className="font-medium text-gray-800">Notifications</p>
          {hasNotifications && (
            <p className="text-xs font-medium text-gray-500 rounded-full">
              <span>{notificationCount}</span> notifications
            </p>
          )}
        </div>
        <button
          disabled={!hasNotifications || deleting}
          onClick={handleDeleteAllNotifications}
          className="px-3 py-1 text-xs transition-all duration-300 border rounded-full text-red-500/90 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          {deleting ? "Deleting..." : "Delete All"}
        </button>
      </div>

      <div className="flex flex-col">
        {!hasNotifications ? (
          <EmptyState />
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onDelete={handleDeleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
