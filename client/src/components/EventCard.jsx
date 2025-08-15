import { memo, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { LuTrash2 } from "react-icons/lu";
import { FiClock } from "react-icons/fi";
import { RxDotsHorizontal } from "react-icons/rx";
import moment from "moment";
import { api_paths } from "../utils/apiPaths";  
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdEventAvailable, MdEventBusy } from "react-icons/md";
import { ProfileImage, ClubLink, AuthorInfo } from "./PostCard";

const EventDateTime = memo(({ date }) => {
  const formattedDate = useMemo(
    () => ({
      date: moment(date).format("MMM Do, YYYY"),
      time: moment(date).format("hh:mm A"),
      full: moment(date).format("LLLL"),
    }),
    [date]
  );

  return (
    <div
      className="group text-xs  flex items-center justify-center gap-1 text-gray-500 hover:text-primary hover:bg-primary/10 py-1 px-1.5 rounded-full transition-all duration-300"
      title={formattedDate.full}
    >
      <FiClock className="size-4" />
      <div className="block group-hover:block whitespace-nowrap">
        <span>{formattedDate.date}</span>
        <span className="mx-1">•</span>
        <span>{formattedDate.time}</span>
      </div>
    </div>
  );
});

const ActionMenu = memo(({ event, onDelete, isOwner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleMenu = useCallback((e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleMenuAction = useCallback((action) => {
    setIsOpen(false);
    action();
  }, []);

  if (!isOwner) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className="p-2 transition-colors rounded-full cursor-pointer text-md hover:bg-gray-500/10"
        aria-label="Event options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <RxDotsHorizontal />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full flex-col items-start text-sm p-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 min-w-[100px]"
        >
          <button
            onClick={() => handleMenuAction(() => onDelete(event._id))}
            className="w-full px-4 flex items-center gap-1 py-3 text-left rounded-[4px] hover:bg-red-500/10 hover:text-red-500 transition-colors"
            aria-label="Delete event"
          >
            <LuTrash2/>Delete
          </button>
        </div>
      )}
    </div>
  );
});

const DeleteButton = memo(({ onDelete, eventId, isOwner }) => {
  if (!isOwner) return null;

  return (
    <button
      onClick={() => onDelete(eventId)}
      title="Delete Event"
      className="flex items-center justify-center gap-1 p-2 transition-colors rounded-full cursor-pointer text-md hover:bg-red-500/10 hover:text-red-500"
      aria-label="Delete event"
    >
      <LuTrash2 size={16} />
    </button>
  );
});

const RSVPButton = memo(({ isAttending, onRsvp, isLoading }) => (
  <button
    onClick={onRsvp}
    disabled={isLoading}
    className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
      isAttending
        ? "bg-red-100 text-red-500 hover:bg-red-200"
        : "bg-primary/10 text-primary hover:bg-primary/20"
    }`}
    aria-label={isAttending ? "Cancel RSVP" : "RSVP to event"}
  >
    {isAttending ? (
      <MdEventBusy className="size-4" />
    ) : (
      <MdEventAvailable className="size-4" />
    )}
    <span className="text-xs sm:text-sm">
      {isLoading ? "..." : isAttending ? "Cancel RSVP" : "RSVP"}
    </span>
  </button>
));

function EventCard({ event, onDelete }) {
  const [isAttending, setIsAttending] = useState(false);
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = useMemo(
    () => event.createdBy?._id === user?._id,
    [event.createdBy?._id, user?._id]
  );

  const eventLink = useMemo(
    () => `/clubs/${event.club?.name}/events/${event?._id}`,
    [event.club?.name, event?._id]
  );

  useEffect(() => {
    if (event?.attendees && user?._id) {
      setIsAttending(event.attendees.includes(user._id));
    }
  }, [event?.attendees, user?._id]);

  const handleClubNavigation = useCallback(() => {
    if (event.club?._id) {
      navigate(`/clubs/${event.club._id}`);
    }
  }, [navigate, event.club?._id]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this event?"
        );
        if (!confirmDelete) return;

        const response = await axiosInstance.delete(
          api_paths.events.delete_event(id)
        );

        if (response.data?.success) {
          toast.success("Event deleted successfully");
          onDelete?.(id);
        } else {
          throw new Error("Failed to delete event");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error deleting event";
        toast.error(errorMessage);
      }
    },
    [onDelete]
  );

  const handleRsvp = useCallback(async () => {
    if (isRsvpLoading) return;

    setIsRsvpLoading(true);

    try {
      const response = await axiosInstance.patch(
        api_paths.events.rsvp_event(event._id)
      );

      if (response.data?.success) {
        toast.success(response.data.message);
        setIsAttending((prev) => !prev);
      } else {
        throw new Error("RSVP failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "RSVP failed";
      toast.error(errorMessage);
    } finally {
      setIsRsvpLoading(false);
    }
  }, [event._id, isRsvpLoading]);

  return (
    <article className="relative flex flex-col p-3 transition-colors border-b border-gray-300 md:p-4 hover:bg-gray-50/50">
      <ClubLink club={event.club} onClick={handleClubNavigation} />

      <div className="flex items-start gap-1.5">
        <div className="flex-shrink-0">
          <ProfileImage
            profileImageUrl={event.createdBy?.profileImageUrl}
            userName={event.createdBy?.name}
          />
        </div>

        <div className="flex-1 min-w-0">
          <AuthorInfo author={event.createdBy} createdAt={event.createdAt} />

          <Link
            to={eventLink}
            className="block transition-opacity hover:opacity-80"
          >
            <div className="space-y-1">
              <h2 className="font-semibold break-words text-black/75">
                {event?.title}
              </h2>
              <p className="text-base text-gray-700 break-words whitespace-pre-wrap max-sm:text-sm">
                {event?.description}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute flex items-center gap-1 max-sm:hidden top-4 right-4">
        <EventDateTime date={event.date} />
        <ActionMenu
          event={event}
          onDelete={handleDelete}
          isOwner={isOwner}
        />
      </div>

      <div className="flex items-center w-full px-1 mt-3">
        <div className="mr-auto sm:hidden">
          <EventDateTime date={event.date} />
        </div>

        <RSVPButton
          isAttending={isAttending}
          onRsvp={handleRsvp}
          isLoading={isRsvpLoading}
        />
      </div>

      {isOwner && (
        <div className="absolute sm:hidden top-4 right-4">
          <ActionMenu
            event={event}
            onDelete={handleDelete}
            isOwner={true}
          />
        </div>
      )}
    </article>
  );
}

export default memo(EventCard, (prevProps, nextProps) => {
  const prevEvent = prevProps.event;
  const nextEvent = nextProps.event;

  return (
    prevEvent._id === nextEvent._id &&
    prevEvent.title === nextEvent.title &&
    prevEvent.description === nextEvent.description &&
    prevEvent.date === nextEvent.date &&
    prevEvent.attendees?.length === nextEvent.attendees?.length &&
    JSON.stringify(prevEvent.attendees) ===
      JSON.stringify(nextEvent.attendees) &&
    prevEvent.createdAt === nextEvent.createdAt
  );
});