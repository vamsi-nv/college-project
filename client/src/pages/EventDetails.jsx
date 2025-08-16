import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { HiMiniUserCircle, HiUsers } from "react-icons/hi2";
import { LuUsers } from "react-icons/lu";
import moment from "moment";
import { MdEventAvailable, MdEventBusy, MdLocationOn } from "react-icons/md";
import { useAuth } from "../context/UserContextProvider";
import { FaCalendarDay } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";

function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);
  const [isImageBroken, setIsImageBroken] = useState(false);

  const isAttending = useMemo(() => {
    return (
      event?.attendees?.some((attendee) =>
        typeof attendee === "string"
          ? attendee === user._id
          : attendee._id === user._id
      ) || false
    );
  }, [event?.attendees, user._id]);

  const formattedDateTime = useMemo(() => {
    if (!event?.date) return { date: "", time: "" };
    const eventMoment = moment(event.date);
    return {
      date: eventMoment.format("MMM Do, YYYY"),
      time: eventMoment.format("hh:mm A"),
      fromNow: moment(event?.createdAt).fromNow(),
    };
  }, [event?.date, event?.createdAt]);

  const fetchEventDetails = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(api_paths.events.get_event(id));
      const data = response.data;
      if (data.success) {
        setEvent(data.event);
      } else {
        toast.error("Failed to load event details");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load event");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleRsvp = useCallback(async () => {
    if (!event?._id || isRsvpLoading) return;

    setIsRsvpLoading(true);
    try {
      const response = await axiosInstance.patch(
        api_paths.events.rsvp_event(event._id)
      );
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setEvent((prevEvent) => {
          if (!prevEvent) return prevEvent;

          const updatedAttendees = isAttending
            ? prevEvent.attendees.filter((attendee) =>
                typeof attendee === "string"
                  ? attendee !== user._id
                  : attendee._id !== user._id
              )
            : [...prevEvent.attendees, user._id];

          return {
            ...prevEvent,
            attendees: updatedAttendees,
          };
        });

        fetchEventDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "RSVP failed");
    } finally {
      setIsRsvpLoading(false);
    }
  }, [event?._id, isAttending, user._id, isRsvpLoading]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <div className="sticky top-0 flex items-center gap-2 p-4 text-gray-800 border-b border-gray-300 max-sm:pt-12 backdrop-blur-2xl bg-gray-50/50">
          <p className="text-lg font-medium">Event</p>
        </div>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="w-1/4 h-4 mb-4 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="sticky top-0 flex items-center gap-2 p-4 text-gray-800 border-b border-gray-300 max-sm:pt-12 backdrop-blur-2xl bg-gray-50/50">
        <p className="text-lg font-medium">Event</p>
      </div>

      <div className="p-4">
        <div className="inline-block">
          <Link to={`/clubs/${event?.club?._id}`}>
            <p className="text-gray-400 hover:underline flex items-center gap-0.5 mx-3 mb-3 transition-colors">
              <LuUsers />
              {event?.club?.name}
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-2 px-0.5">
          <div className="rounded-full max-w-12 shrink-0">
            {event?.createdBy?.profileImageUrl && !isImageBroken ? (
              <img
                src={event?.createdBy?.profileImageUrl}
                onError={() => setIsImageBroken(true)}
                className="object-cover w-12 h-12 max-w-full max-h-full rounded-full"
                alt={`${event?.createdBy?.name}'s profile`}
              />
            ) : (
              <HiMiniUserCircle className="text-gray-300 rounded-full size-12" />
            )}
          </div>

          <div>
            <p className="font-medium">
              {event?.createdBy?.name}{" "}
              <span className="text-xs font-normal text-gray-600">
                • {formattedDateTime.fromNow}
              </span>
            </p>
            <p className="text-sm text-gray-500">{event?.createdBy?.email}</p>
          </div>
        </div>

        <div className="my-4">
          <h1 className="px-2 text-xl font-semibold text-gray-700 max-sm:text-lg">
            {event?.title}
          </h1>
          <p className="px-2 my-2 text-gray-700 whitespace-pre-wrap max-sm:text-sm">
            {event?.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 px-2 mt-8 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaCalendarDay />
              {formattedDateTime.date}
            </span>
            <span className="flex items-center gap-1">
              <FaClock />
              {formattedDateTime.time}
            </span>
          </div>

          <p className="flex items-center px-1.5 gap-1 text-gray-600 text-sm pt-4">
            <MdLocationOn className="size-5 shrink-0" />
            <span className="break-words">{event?.location}</span>
          </p>
        </div>

        <div className="flex items-center w-full px-1 mt-12 mb-6">
          <p className="flex items-center text-sm text-gray-600 text">
            <span className="px-1.5">
              <HiUsers className="size-5 shrink-0" />
            </span>
            {event?.attendees?.length || 0} member
            {event?.attendees?.length !== 1 && "s"} attending
          </p>
          <button
            onClick={handleRsvp}
            disabled={isRsvpLoading}
            className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAttending
                ? "bg-red-100 text-red-500 border border-red-200 hover:bg-red-200"
                : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            }`}
          >
            {isRsvpLoading ? (
              <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin"></div>
            ) : isAttending ? (
              <MdEventBusy className="size-4" />
            ) : (
              <MdEventAvailable className="size-4" />
            )}
            <span className="text-xs">
              {isRsvpLoading
                ? "Loading..."
                : isAttending
                ? "Cancel RSVP"
                : "RSVP"}
            </span>
          </button>
        </div>

        {event?.attendees?.length > 0 && event?.createdBy?._id === user._id && (
          <div className="pt-6 mt-8 border-t border-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-500">
              Attendees ({event.attendees.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
              {event.attendees.map((attendee, index) => (
                <AttendeeCard
                  key={
                    typeof attendee === "string"
                      ? attendee
                      : attendee._id || index
                  }
                  attendee={attendee}
                  currentUser={user}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AttendeeCard({ attendee, currentUser }) {
  const [isImageBroken, setIsImageBroken] = useState(false);

  const attendeeData =
    typeof attendee === "string"
      ? { _id: attendee, name: "Unknown User", email: "" }
      : attendee;

  return (
    <div className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-100/60">
      <div className="shrink-0">
        {attendeeData?.profileImageUrl && !isImageBroken ? (
          <img
            src={attendeeData.profileImageUrl}
            onError={() => setIsImageBroken(true)}
            className="object-cover w-10 h-10 rounded-full"
            alt={`${attendeeData.name}'s profile`}
          />
        ) : (
          <HiMiniUserCircle className="text-gray-400 size-10" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 truncate">
          {attendeeData?._id === currentUser._id ? "You" : attendeeData?.name}
        </p>
        {attendeeData?.email && (
          <p className="text-xs text-gray-500 truncate">{attendeeData.email}</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
