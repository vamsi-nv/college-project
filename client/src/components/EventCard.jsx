import { LuTrash2, LuUsers } from "react-icons/lu";
import { FiClock } from "react-icons/fi";
import moment from "moment";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniUserCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import { MdEventAvailable, MdEventBusy } from "react-icons/md";
import { useEffect, useState } from "react";

function EventCard({ event }) {
  const [isAttending, setIsAttending] = useState(false);
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
    if (event?.attendees) {
      if (event?.attendees?.includes(user._id)) {
        setIsAttending(true);
      }
    }
  }, [event, user._id]);

  return (
    <div className="relative flex flex-col p-3 border-b border-gray-300 md:p-4 ">
      <div
        onClick={() => navigate(`/clubs/${event.club._id}`)}
        className="flex w-fit items-center gap-1 mb-3 text-sm text-gray-400 cursor-pointer sm:text-base"
      >
        <LuUsers />
        <p className="hover:underline underline-offset-1">{event.club.name}</p>
      </div>
      <div className="flex items-start gap-1">
        <div className="shrink-0">
          {event.createdBy.profileImageUrl ? (
            <img
              src={event.createdBy.profileImageUrl}
              className="object-cover h-8 rounded-full aspect-square-8 s"
            />
          ) : (
            <HiMiniUserCircle className="text-gray-300 rounded-full size-8" />
          )}
        </div>
        <div className="">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1 text-sm font-semibold sm:text-base text-black/80">
                {event.createdBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {" "}
                • {moment(event.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <Link to={`/clubs/${event.club.name}/events/${event._id}`}>
            <div className="">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-black/75">{event.title}</p>
              </div>
              <p className="text-base text-gray-700 max-sm:text-sm">
                {event.description}
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="absolute flex items-center gap-1 max-sm:hidden top-4 right-4">
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
            className="flex items-center justify-center gap-1 p-2 rounded-full cursor-pointer text-md hover:bg-red-500/10 hover:text-red-500"
          >
            <LuTrash2 />
          </button>
        )}
      </div>

      <div className="flex items-center w-full px-1">
        <button
          onClick={async () => {
            const success = await handleRsvp(event._id);
            if (success) setIsAttending((prev) => !prev);
          }}
          className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
            isAttending
              ? "bg-red-100 text-red-500 hover:bg-red-200"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isAttending ? (
            <MdEventBusy className="size-4" />
          ) : (
            <MdEventAvailable className="size-4" />
          )}
          <span className="text-xs sm:text-sm">
            {isAttending ? "Cancel RSVP" : "RSVP"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default EventCard;
