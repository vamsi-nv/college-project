import { LuTrash2, LuUsers } from "react-icons/lu";
import { FiClock } from "react-icons/fi";
import moment from "moment";
import { RxDotsHorizontal } from "react-icons/rx";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { HiMiniUserCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
function EventCard({ event }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmDelete) return;

      const response = await axiosInstance.delete(
        api_paths.events.delete_event(id)
      );
      const data = response.data;
      if (data.success) {
        toast.success("Event deleted");
      }
    } catch (error) {
      toast.error("Error deleting event");
      console.log("Error deleting event: ", error.message);
    }
  };

  return (
    <div className="relative flex flex-col p-3 border-b border-gray-200 md:p-4 group">
      <div
        onClick={() => navigate(`/clubs/${event.club._id}`)}
        className="flex items-center gap-1 mb-2 ml-5 text-sm font-medium text-gray-400 cursor-pointer sm:text-base"
      >
        <LuUsers />
        <p>{event.club.name}</p>
      </div>
      <div className="flex gap-1">
        <div className="">
          {event.createdBy.profileImageUrl ? (
            <img
              src={event.createdBy.profileImageUrl}
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
                {event.createdBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {" "}
                • {moment(event.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-3">
              <p className="text-sm sm:text-[17px] text-neutral-900">
                {event.title}
              </p>
              <div className="text-xs flex items-center justify-center gap-1 text-gray-500 group-hover:text-primary group-hover:bg-primary/10 py-1 px-1.5 rounded-full transition-all duration-300 ">
                <FiClock className="transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  <span>{moment(event.date).format("MMM Do, YYYY")}</span>
                  <span className="mx-1">•</span>
                  <span>{moment(event.date).format("hh:mm A")}</span>
                </div>
              </div>
            </div>
            <p className="text-base text-gray-500 max-sm:text-sm">
              {event.description}
            </p>
          </div>
        </div>
      </div>
      {event.createdBy._id === user._id && (
        <div
          onClick={() => handleDelete(event._id)}
          title="Delete Event"
          className="absolute flex items-center justify-center gap-1 p-2 rounded-full cursor-pointer top-4 right-4 text-md hover:bg-red-500/10 hover:text-red-500"
        >
          <LuTrash2 />
        </div>
      )}
    </div>
  );
}

export default EventCard;
