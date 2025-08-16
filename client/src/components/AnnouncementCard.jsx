import { memo, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/UserContextProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsFillPinFill } from "react-icons/bs";
import { ProfileImage, ClubLink, AuthorInfo } from "./PostCard";
import { LuPin, LuPinOff, LuTrash2 } from "react-icons/lu";

const ActionMenu = memo(({ announcement, onPin, onDelete, isOwner }) => {
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
    setIsOpen((prev) => !prev);
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
        aria-label="Announcement options"
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
            onClick={() => handleMenuAction(onPin)}
            className="w-full px-4 flex items-center gap-1 py-3 text-left rounded-[4px] hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label={
              announcement.pinned ? "Unpin announcement" : "Pin announcement"
            }
          >
            {announcement.pinned ? (
              <>
                <LuPinOff /> Unpin
              </>
            ) : (
              <>
                <LuPin /> Pin
              </>
            )}
          </button>
          <button
            onClick={() => handleMenuAction(onDelete)}
            className="w-full flex items-center gap-1 px-4 py-3 text-left rounded-[4px] hover:bg-red-500/10 hover:text-red-500 transition-colors"
            aria-label="Delete announcement"
          >
            <LuTrash2 /> Delete
          </button>
        </div>
      )}
    </div>
  );
});

function AnnouncementCard({ announcement, onDelete, onTogglePin }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = useMemo(
    () => announcement.postedBy._id === user._id,
    [announcement.postedBy._id, user._id]
  );

  const handleClubNavigation = useCallback(() => {
    navigate(`/clubs/${announcement.club._id}`);
  }, [navigate, announcement.club._id]);

  const handleDelete = useCallback(async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this announcement?"
      );
      if (!confirmDelete) return;

      const response = await axiosInstance.delete(
        api_paths.announcements.delete_announcement(announcement._id)
      );

      if (response.data?.success) {
        toast.success("Announcement deleted successfully");
        onDelete?.(announcement._id);
      } else {
        throw new Error("Failed to delete announcement");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error deleting announcement";
      toast.error(errorMessage);
    }
  }, [announcement._id, onDelete]);

  const handleTogglePin = useCallback(async () => {
    try {
      const response = await axiosInstance.patch(
        api_paths.announcements.toggle_pin(announcement._id)
      );

      if (response.data?.success) {
        toast.success(response.data.message);
        onTogglePin?.(announcement._id);
      } else {
        throw new Error("Failed to toggle pin");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error updating pin status";
      toast.error(errorMessage);
    }
  }, [announcement._id, onTogglePin]);

  return (
    <article className="relative flex flex-col p-3 transition-colors border-b border-gray-300 md:p-4 hover:bg-gray-50/50">
      <ClubLink club={announcement.club} onClick={handleClubNavigation} />
      <div className="flex gap-1.5">
        <div className="flex-shrink-0">
          <ProfileImage
            profileImageUrl={announcement.postedBy.profileImageUrl}
            userName={announcement.postedBy.name}
          />
        </div>

        <div className="flex-1 min-w-0">
          <AuthorInfo
            author={announcement.postedBy}
            createdAt={announcement.createdAt}
          />

          <div className="space-y-1">
            <h2 className="font-semibold break-words text-black/75">
              {announcement.title}
            </h2>
            <p className="text-base text-gray-700 break-words whitespace-pre-wrap max-sm:text-sm">
              {announcement.content}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute flex items-center top-4 right-4">
        {announcement.pinned && (
          <div
            title="Pinned announcement"
            className="p-2 text-gray-400"
            aria-label="This announcement is pinned"
          >
            <BsFillPinFill size={14} />
          </div>
        )}

        <ActionMenu
          announcement={announcement}
          onPin={handleTogglePin}
          onDelete={handleDelete}
          isOwner={isOwner}
        />
      </div>
    </article>
  );
}

export default memo(AnnouncementCard, (prevProps, nextProps) => {
  return (
    prevProps.announcement._id === nextProps.announcement._id &&
    prevProps.announcement.pinned === nextProps.announcement.pinned &&
    prevProps.announcement.title === nextProps.announcement.title &&
    prevProps.announcement.content === nextProps.announcement.content &&
    prevProps.announcement.createdAt === nextProps.announcement.createdAt
  );
});
