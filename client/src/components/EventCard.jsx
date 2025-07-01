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
import { MdEventAvailable, MdEventBusy } from "react-icons/md";
import { useEffect, useState } from "react";

function EventCard({ event }) {
  const [isAttending, setIsAttending] = useState();
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

  const handleRsvp = async (id) => {
    try {
      const response = await axiosInstance.patch(
        api_paths.events.rsvp_event(id)
      );
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "RSVP failed");
    }
    return false;
  };

  useEffect(() => {
    if (event.attendees && Array.isArray(event.attendees)) {
      setIsAttending(event.attendees.includes(user._id));
    }
  }, [event.attendees, user._id]);

  return (
    <div className="relative flex flex-col p-3 border-b border-gray-300 md:p-4 ">
      <div
        onClick={() => navigate(`/clubs/${event.club._id}`)}
        className="flex items-center gap-1 mb-2 ml-5 text-sm font-medium text-gray-400 cursor-pointer sm:text-base"
      >
        <LuUsers />
        <p className="hover:underline underline-offset-1">{event.club.name}</p>
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
              {/* <div className="text-xs flex items-center justify-center gap-1 text-gray-500 group-hover:text-primary group-hover:bg-primary/10 py-1 px-1.5 rounded-full transition-all duration-300 ">
                <FiClock className="transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                <div className="transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  <span>{moment(event.date).format("MMM Do, YYYY")}</span>
                  <span className="mx-1">•</span>
                  <span>{moment(event.date).format("hh:mm A")}</span>
                </div>
              </div> */}
            </div>
            <p className="text-base text-gray-500 max-sm:text-sm">
              {event.description}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex items-center  gap-1">
        <div className="group text-xs flex items-center justify-center gap-1 text-gray-500 hover:text-primary hover:bg-primary/10 py-1 px-1.5 rounded-full transition-all duration-300 ">
          <FiClock className="size-4" />
          <div className="block group-hover:block whitespace-nowrap">
            <span>{moment(event.date).format("MMM Do, YYYY")}</span>
            <span className="mx-1">•</span>
            <span>{moment(event.date).format("hh:mm A")}</span>
          </div>
        </div>
        {event.createdBy._id === user._id && (
          <button
            onClick={() => handleDelete(event._id)}
            title="Delete Event"
            className="flex items-center justify-center gap-1 p-2 rounded-full cursor-pointer  text-md hover:bg-red-500/10 hover:text-red-500"
          >
            <LuTrash2 />
          </button>
        )}
      </div>

      <div className="flex items-center px-1 w-full">
        <button
          onClick={async () => {
            const success = await handleRsvp(event._id);
            if (success) setIsAttending((prev) => !prev);
          }}
          className={`ml-auto p-1 hover:${
            isAttending ? "bg-red-500/10" : "bg-primary/10"
          } hover:px-1 hover:rounded-full text-gray-500 relative group flex items-center gap-0.5`}
        >
          {isAttending ? (
            <MdEventBusy className="size-5 text-red-500" />
          ) : (
            <MdEventAvailable className="size-5 group-hover:text-primary" />
          )}

          {/* <span
            className={`text-xs hidden group-hover:block ${
              isAttending ? "text-red-500" : "text-primary"
            }`}
          >
            {isAttending ? "Cancel RSVP" : "Attend Event"}
          </span> */}
          <span
            className={`absolute top-full left-1/2 translate-x-[-50%] mt-1 px-2 py-0.5 rounded text-xs bg-gray-50 shadow-md ${
              isAttending ? "text-red-500" : "text-primary"
            } hidden group-hover:block whitespace-nowrap`}
          >
            {isAttending ? "Cancel RSVP" : "Confirm RSVP"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default EventCard;
