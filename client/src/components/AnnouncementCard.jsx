import { LuUsers } from "react-icons/lu";
import { FiClock } from "react-icons/fi";
import moment from "moment";
import { RxDotsHorizontal } from "react-icons/rx";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { HiMiniUserCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import { BsFillPinFill } from "react-icons/bs";

function AnnouncementCard({ announcement, fetchClubAnnouncements }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this announcement?"
      );
      if (!confirmDelete) return;

      const response = await axiosInstance.delete(
        api_paths.announcements.delete_announcement(id)
      );
      const data = response.data;
      if (data.success) {
        toast.success("Announcement deleted");
        fetchClubAnnouncements();
      }
    } catch (error) {
      toast.error("Error deleting Announcement");
      console.log("Error deleting Announcement: ", error.message);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const response = await axiosInstance.patch(
        api_paths.announcements.toggle_pin(id)
      );
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        fetchClubAnnouncements();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="relative flex flex-col p-3 border-b border-gray-200 md:p-4">
      <div
        onClick={() => navigate(`/clubs/${announcement.club._id}`)}
        className="flex items-center gap-1 mb-2 ml-5 text-sm font-medium text-gray-400 cursor-pointer sm:text-base"
      >
        <LuUsers />
        <p>{announcement.club.name}</p>
      </div>
      <div className="flex gap-1">
        <div className="">
          {announcement.postedBy.profileImageUrl ? (
            <img
              src={announcement.postedBy.profileImageUrl}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <HiMiniUserCircle className="text-gray-300 rounded-full size-8" />
          )}
        </div>

        <div className="">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <p className="text-sm sm:text-base font-[600] text-gray-700 flex items-center gap-1">
                {announcement.postedBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {" "}
                • {moment(announcement.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-3">
              <p className="text-sm sm:text-[17px] text-neutral-900">
                {announcement.title}
              </p>
              {/* <div className="text-xs flex items-center justify-center gap-1 text-gray-500 group-hover:text-primary group-hover:bg-primary/10 py-1 px-1.5 rounded-full transition-all duration-300 ">
                <FiClock className="transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  <span>
                    {moment(announcement.date).format("MMM Do, YYYY")}
                  </span>
                  <span className="mx-1">•</span>
                  <span>{moment(announcement.date).format("hh:mm A")}</span>
                </div>
              </div> */}
            </div>
            <p className="text-base text-gray-500 max-sm:text-sm">
              {announcement.content}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute flex items-center justify-center top-4 right-4">
        {announcement.pinned && (
          <div title="Pinned" className="relative p-2 text-gray-500">
            <BsFillPinFill />
          </div>
        )}
        {announcement.postedBy._id === user._id && (
          <div
            role="button"
            tabIndex={0}
            className="relative p-2 rounded-full cursor-pointer group text-md hover:bg-gray-500/10"
          >
            <RxDotsHorizontal />
            <div className="absolute flex-col items-start hidden text-xs bg-gray-100 border border-gray-200 rounded-lg shadow-md group-hover:flex">
              <button
                onClick={() => handleTogglePin(announcement._id)}
                className="w-full px-4 py-3 rounded-t-lg hover:bg-primary/10 hover:text-primary"
              >
                {announcement.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={() => handleDelete(announcement._id)}
                className="px-4 py-3 rounded-b-lg hover:bg-red-500/10 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnouncementCard;
