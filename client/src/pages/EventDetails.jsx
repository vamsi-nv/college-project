import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniUserCircle } from "react-icons/hi2";
import { LuArrowLeft, LuUser, LuUsers } from "react-icons/lu";
import moment from "moment";
import { MdEventAvailable, MdEventBusy, MdLocationOn } from "react-icons/md";
import { useAuth } from "../context/UserContextProvider";
import { FaCalendarDay } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isAttending, setIsAttending] = useState(false);


  const fetchEventDetails = async () => {
    try {
      const response = await axiosInstance.get(api_paths.events.get_event(id));
      const data = response.data;
      if (data.success) {
        setEvent(data.event);
      }
    } catch (error) {
      toast.error("Failed to fetchEvent");
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
        await fetchEventDetails();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "RSVP failed");
    }
    return false;
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  useEffect(() => {
    if (event?.attendees) {
      if (event?.attendees?.includes(user._id)) {
        setIsAttending(true);
      }
    }
  }, [event, user._id]);

  return (
    <div className="w-full h-full">
      <div className="sticky top-0 flex items-center gap-2 p-4 text-gray-800 border-b border-gray-300 max-sm:pt-12 backdrop-blur-2xl bg-gray-50/50">
        {/* <LuArrowLeft onClick={() => navigate("/")} className="size-6 " /> */}
        <p className="text-lg font-medium">Event</p>
      </div>
      <div className="p-4">
        <div className="inline-block">
          <Link to={`/clubs/${event?.club?._id}`}>
            <p className="text-gray-400 hover:underline flex items-center gap-0.5 mx-3 mb-3">
              <LuUsers />
              {event?.club?.name}
            </p>
          </Link>
        </div>
        <div className="flex items-center gap-2 px-2">
          <div className="rounded-full max-w-12 shrink-0">
            {event?.createdBy?.profileImageUrl ? (
              <img
                src={event?.createdBy?.profileImageUrl}
                className="object-cover max-w-full max-h-full rounded-full"
              />
            ) : (
              <HiMiniUserCircle className="text-gray-300 rounded-full size-12" />
            )}
          </div>

          <div>
            <p className="font-medium">
              {event?.createdBy?.name}{" "}
              <span className="text-xs font-normal text-gray-600">
                • {moment(event?.createdAt).fromNow()}
              </span>
            </p>
            <p className="text-sm text-gray-500">{event?.createdBy?.email}</p>
          </div>
        </div>
        <div className="my-4">
          <p className="px-2 text-xl font-semibold text-black/80 max-sm:text-lg">{event?.title}</p>
          <p className="px-2 my-2 text-gray-700 max-sm:text-sm">{event?.description}</p>
          <p className="flex items-center gap-4 px-2 pt-6 text-sm text-gray-600 max-sm">
            <span className="flex items-center gap-1">
              <FaCalendarDay />
              {moment(event?.date).format("MMM Do, YYYY")}
            </span>
            <span className="flex items-center gap-1">
              <FaClock />
              {moment(event?.date).format("hh:mm A")}
            </span>
          </p>
          <p className="flex items-center px-1.5 gap-1 text-gray-600 max-sm text-sm pt-4">
            <MdLocationOn className="size-5" />
            {event?.location}
          </p>
        </div>
        <div className="flex items-center w-full px-1 ">
          {/* <p className="flex items-center gap-2 text-gray-500">
            <span className="p-1 rounded-full bg-primary/10">
              <LuUser className="text-primary" />
            </span>
            {event?.attendees?.length} member(s) attending
          </p> */}
          <button
            onClick={async () => {
              const success = await handleRsvp(event._id);
              if (success) setIsAttending((prev) => !prev);
            }}
            className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
              isAttending
                ? "bg-red-100 text-red-500 border hover:bg-red-200"
                : "bg-primary/10 text-primary border hover:bg-primary/20"
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
    </div>
  );
}

export default EventDetails;
