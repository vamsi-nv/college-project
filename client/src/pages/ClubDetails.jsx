import { useEffect, useRef, useState, useCallback } from "react";
import { PiUsersThreeThin } from "react-icons/pi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { AnimatePresence, motion } from "motion/react";
import { LuPen, LuPlus, LuTrash2, LuUserMinus } from "react-icons/lu";
import { MdAnnouncement, MdEvent } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { HiMiniUserCircle, HiOutlineUserGroup } from "react-icons/hi2";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Input from "../components/Input";
import EventCard from "../components/EventCard";
import AnnouncementCard from "../components/AnnouncementCard";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useAuth } from "../context/UserContextProvider";
import { RxDotsHorizontal } from "react-icons/rx";

function ClubDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const postMenuRef = useRef(null);
  const clubEditMenuRef = useRef(null);
  const memberMenuRef = useRef(null);
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState("Events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isClubEditMenuOpen, setIsClubEditMenuOpen] = useState(false);
  const [openMenuMemberId, setOpenMenuMemberId] = useState(null);
  const [formType, setFormType] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [isImageBroken, setIsImageBroken] = useState(false);
  const [clubForm, setClubForm] = useState({
    name: "",
    description: "",
    coverImage: null,
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    pinned: false,
  });

  const tabItems = [
    { label: "Members" },
    { label: "Events" },
    { label: "Announcements" },
  ];

  const toggleMemberMenu = (memberId) => {
    setOpenMenuMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const handleEventDelete = useCallback((eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event._id !== eventId)
    );
  }, []);

  const handleAnnouncementDelete = useCallback((announcementId) => {
    setAnnouncements((prevAnnouncements) =>
      prevAnnouncements.filter(
        (announcement) => announcement._id !== announcementId
      )
    );
  }, []);

  const handleTogglePin = useCallback((announcementId) => {
    setAnnouncements((prevAnnouncements) =>
      prevAnnouncements.map((a) =>
        a._id === announcementId ? { ...a, pinned: !a.pinned } : a
      )
    );
  }, []);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(api_paths.clubs.get_club(id));
      if (response.data.success) {
        setClub(response.data.club);
      } else {
        toast.error("Failed to fetch club details");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch club details"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchClubEvents = async () => {
    try {
      const response = await axiosInstance.get(
        api_paths.events.get_all_events(club._id)
      );
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  const fetchClubAnnouncements = async () => {
    try {
      const response = await axiosInstance.get(
        api_paths.announcements.get_all_announcements(club._id)
      );
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      toast.error("Failed to fetch announcements");
    }
  };

  const handleLeaveClub = async () => {
    try {
      const response = await axiosInstance.post(
        api_paths.clubs.leave_club(club._id)
      );
      if (response.data.success) {
        toast.success("You left the club");
        fetchClubDetails();
        navigate("/clubs");
      } else {
        toast.error("Failed to leave club");
      }
    } catch (error) {
      toast.error("Failed to leave club");
    }
  };

  const handleJoinClub = async () => {
    try {
      const response = await axiosInstance.post(
        api_paths.clubs.join_club(club._id)
      );
      if (response.data.success) {
        toast.success("You joined the club");
        fetchClubDetails();
      } else {
        toast.error("Failed to join club");
      }
    } catch {
      toast.error("Failed to join club");
    }
  };

  const handleDeleteClub = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this club?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(
        api_paths.clubs.delete_club(club._id)
      );
      if (response.data.success) {
        toast.success("Club deleted");
        navigate("/clubs");
      }
    } catch (error) {
      toast.error("Failed to delete club");
    }
  };

  const handlePostEvent = async () => {
    const { title, description, date, location } = eventForm;
    if (!title) return setError("Title is required");
    if (!description) return setError("Description is required");
    if (!location) return setError("Location is required");
    if (!date) return setError("Date is required");

    setError("");
    try {
      const response = await axiosInstance.post(api_paths.events.create_event, {
        ...eventForm,
        club: club._id,
      });
      if (response.data.success) {
        toast.success("Event posted!");
        setIsModalOpen(false);
        fetchClubEvents();
      } else {
        toast.error("Failed to post event.");
      }
    } catch (error) {
      toast.error("Failed to post event");
    } finally {
    }
  };

  const handlePostAnnouncement = async () => {
    const { title, content } = announcementForm;
    if (!title) return setError("Title is required");
    if (!content) return setError("Content is required");

    setError("");
    try {
      const response = await axiosInstance.post(
        api_paths.announcements.create_announcement,
        {
          ...announcementForm,
          club: club._id,
        }
      );
      if (response.data.success) {
        toast.success("Announcement Posted");
        fetchClubAnnouncements();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to post announcement");
      }
    } catch (error) {
      toast.error("Failed to post announcement");
    } finally {
    }
  };

  const handleEditClub = async (e) => {
    e.preventDefault();

    const { name, description, coverImage } = clubForm;

    if (!name || !description) {
      setError(!name ? "Name is required" : "Description is required");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      } else if (removeCoverImage) {
        formData.append("removeCoverImage", true);
      }

      const response = await axiosInstance.put(
        api_paths.clubs.update_club(club?._id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Club updated successfully!");
        setIsModalOpen(false);
        setClubForm({ name: "", description: "", coverImage: null });
        fetchClubDetails();
      } else {
        toast.error(response.data.message || "Failed to update club");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      setError(message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMemberFromClub = async (userToRemove) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to remove this user?"
      );
      if (!confirm) return;
      const response = await axiosInstance.patch(
        api_paths.clubs.remover_member_from_club(club._id),
        { userToRemove }
      );
      if (response.data.success) {
        fetchClubDetails();
        setCurrentTab("Members");
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
    }
  };

  const handleToggleAdmin = async (userToToggle) => {
    try {
      const response = await axiosInstance.patch(
        api_paths.clubs.toggle_admin(club._id),
        { userToToggle }
      );
      if (response.data.success) {
        fetchClubDetails();
        setCurrentTab("Members");
      }
    } catch (error) {
      toast.error("Error setting admin status");
    }
  };

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  useEffect(() => {
    if (club?._id) {
      if (currentTab === "Events") fetchClubEvents();
      if (currentTab === "Announcements") fetchClubAnnouncements();
    }
  }, [club?._id, currentTab]);

  useEffect(() => {
    if (isModalOpen) {
      setError("");
      setEventForm({
        title: "",
        description: "",
        date: "",
        location: "",
      });
      setAnnouncementForm({
        title: "",
        content: "",
        pinned: false,
      });
      setClubForm({
        name: club.name || "",
        description: club.description || "",
        coverImage: null,
      });
      if (club.coverImage) {
        setCoverImageUrl(club.coverImage);
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        isClubEditMenuOpen &&
        clubEditMenuRef.current &&
        !clubEditMenuRef.current.contains(event.target)
      ) {
        setIsClubEditMenuOpen(false);
      }

      if (
        isPostMenuOpen &&
        postMenuRef.current &&
        !postMenuRef.current.contains(event.target)
      ) {
        setIsPostMenuOpen(false);
      }

      if (
        openMenuMemberId !== null &&
        memberMenuRef.current &&
        !memberMenuRef.current.contains(event.target)
      ) {
        setOpenMenuMemberId(null);
      }
    }

    const shouldListen =
      isClubEditMenuOpen || isPostMenuOpen || openMenuMemberId !== null;

    if (shouldListen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isClubEditMenuOpen, isPostMenuOpen, openMenuMemberId]);

  if (loading) return <Loader />;
  // if (!club || !user || !club.createdBy)
  //   return (
  //     <p className="mt-20 text-center text-red-500">
  //       Club not found or failed to load.
  //     </p>
  //   );

  return (
    <div className="relative w-full h-full pt-12 sm:pt-0">
      <div className="flex items-center justify-between p-4 max-sm:text-sm">
        <p>{club?.name}</p>

        {club?.createdBy?._id === user._id && (
          <div className="relative group">
            <button
              onClick={() => setIsClubEditMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <HiOutlineDotsVertical className="size-5" />
            </button>
            {isClubEditMenuOpen && (
              <motion.div
                initial={{ x: 10, y: -10, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                ref={clubEditMenuRef}
                className="absolute right-0 p-2 space-y-1 border border-gray-200 rounded-lg shadow-md bg-gray-50"
              >
                <button
                  onClick={() => {
                    setFormType("EditClub");
                    setIsModalOpen(true);
                    setClubForm({
                      name: club.name,
                      description: club.description,
                      coverImage: club.coverImage,
                    });
                  }}
                  className="flex items-center gap-1 w-full px-4 py-2 max-sm:text-sm text-left rounded-[6px] text-gray-700 hover:bg-primary/20 hover:text-primary transition-all duration-300 "
                >
                  <LuPen />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClub}
                  className="flex items-center gap-1 w-full px-4 py-2 max-sm:text-sm text-left rounded-[6px] transition-all duration-300  hover:bg-red-100 text-red-500"
                >
                  <LuTrash2 /> Delete
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="w-full ">
        {club?.coverImage ? (
          <img
            src={club?.coverImage}
            alt="Club Cover"
            className="object-cover w-full h-auto aspect-video"
          />
        ) : (
          <PiUsersThreeThin className="mx-auto font-light text-gray-300 size-42" />
        )}
      </div>

      <div className="flex items-center justify-between w-full p-6">
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <h1 className="flex-1 font-semibold text-black/80 lg:text-xl sm:text-xl max-sm:text-lg">
              {club?.name}
            </h1>

            {club?.createdBy?._id !== user._id &&
              (club?.members?.some((member) => member._id === user._id) ? (
                <button
                  onClick={handleLeaveClub}
                  className="px-6 py-2 text-sm border rounded-full hover:bg-primary/30 text-primary bg-primary/20"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={handleJoinClub}
                  className="px-8 py-2 text-sm text-white rounded-full bg-primary hover:bg-primary/90"
                >
                  Join
                </button>
              ))}

            {club?.admins?.some((admin) => admin?._id === user?._id) && (
              <div
                onClick={() => setIsPostMenuOpen((prev) => !prev)}
                className=""
              >
                <div className="relative">
                  <button className="p-2 text-white transition-all duration-300 rounded-full shadow-lg bg-primary hover:scale-105 hover:bg-primary/90">
                    <LuPlus className="size-5 max-sm:size-4" />
                  </button>
                  {isPostMenuOpen && (
                    <div ref={postMenuRef}>
                      <AnimatePresence>
                        <motion.button
                          initial={{ x: 35, y: 35, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          exit={{ opacity: 0, scale: 0 }}
                          onClick={() => {
                            setFormType("PostEvent");
                            setCurrentTab("Events");
                            setIsModalOpen(true);
                          }}
                          className="absolute p-3 text-white transition-all duration-300 rounded-full shadow-lg right-8 bottom-8 bg-primary hover:scale-105 hover:bg-primary/90"
                        >
                          <MdEvent className="size-5 max-sm:size-4 " />
                        </motion.button>
                      </AnimatePresence>
                      <AnimatePresence>
                        <motion.button
                          initial={{ x: 35, y: -35, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          exit={{ opacity: 0, scale: 0 }}
                          onClick={() => {
                            setFormType("PostAnnouncement");
                            setCurrentTab("Announcements");
                            setIsModalOpen(true);
                          }}
                          className="absolute p-3 text-white transition-all duration-300 rounded-full shadow-lg top-8 right-8 bg-primary hover:scale-105 hover:bg-primary/90"
                        >
                          <MdAnnouncement className="size-5 max-sm:size-4" />
                        </motion.button>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-700 max-w-5/6 max-sm:text-sm">
            {club?.description}
          </p>
        </div>
      </div>

      <div>
        <div className="sticky flex items-center justify-around w-full overflow-x-auto border-b border-gray-300 whitespace-nowrap sm:pt-3 top-16">
          {tabItems.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`tab-label ${
                currentTab === tab.label ? "tab-selected" : "tab-not-selected"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {currentTab === "Members" && (
          <div className="flex flex-col items-start last:mb-30">
            {club.members.map((member) => (
              <div
                key={member._id}
                className="relative flex items-center justify-between w-full px-5 py-5"
              >
                {club.admins.some((admin) => admin._id === user._id) &&
                  user._id !== member._id && (
                    <div className="absolute right-1 top-1">
                      <button
                        className="p-2 rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={() => toggleMemberMenu(member._id)}
                      >
                        <RxDotsHorizontal className="" />
                      </button>
                      {openMenuMemberId === member._id && (
                        <div className="relative z-20 " ref={memberMenuRef}>
                          <div className="absolute flex text-sm flex-col p-2 bg-white border border-gray-200 rounded-lg shadow-lg -left-38 whitespace-nowrap">
                            <button
                              onClick={() => {
                                handleToggleAdmin(member._id);
                                setOpenMenuMemberId(null);
                              }}
                              className="px-4 py-4 rounded-md hover:bg-gray-200/50"
                            >
                              {club.admins.some(
                                (admin) => admin._id === member._id
                              )
                                ? "Remove as admin"
                                : "Make club admin"}
                            </button>
                            <button
                              onClick={() => {
                                handleRemoveMemberFromClub(member._id);
                                setOpenMenuMemberId(null);
                              }}
                              className="px-4 py-4 flex items-center gap-1 hover:bg-red-500/10 rounded-md text-red-500"
                            >
                              <LuUserMinus />
                              Remove User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                <div className="flex items-center gap-2">
                  <div className="size-8">
                    {member.profileImageUrl && !isImageBroken ? (
                      <img
                        src={member.profileImageUrl}
                        alt=""
                        onError={() => setIsImageBroken(true)}
                        className="rounded-full size-full"
                      />
                    ) : (
                      <HiMiniUserCircle className="text-gray-300 size-full" />
                    )}
                  </div>
                  <p>{member.name}</p>
                </div>
                {club.admins.some((admin) => admin._id === member._id) && (
                  <span className="px-3 py-1 mr-10 text-xs font-medium text-green-500 border border-green-500 rounded-full bg-green-500/10">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {currentTab === "Events" && (
          <div>
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleEventDelete}
              />
            ))}
          </div>
        )}

        {currentTab === "Announcements" && (
          <div>
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onDelete={handleAnnouncementDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div>
            <h2 className="mx-2 my-5 text-xl font-semibold text-center text-primary sm:mx-4 sm:text-2xl">
              {formType === "PostEvent" && "Event"}
              {formType === "PostAnnouncement" && "Announcement"}
              {formType === "EditClub" && "Edit Club"}
            </h2>
            {formType === "PostEvent" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePostEvent();
                }}
              >
                <Input
                  label="Title"
                  placeholder="Enter title"
                  id="event-title"
                  type="text"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <div className="flex flex-col mb-4">
                  <label
                    className="input-field-label"
                    htmlFor="event-description"
                  >
                    Description
                  </label>
                  <textarea
                    id="event-description"
                    rows={5}
                    placeholder="Enter description"
                    className="input-field"
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <Input
                  label="Location"
                  placeholder="Enter location"
                  id="event-location"
                  type="text"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Date & Time"
                  id="event-date"
                  type="datetime-local"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
                {error && (
                  <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm">
                    *{error}
                  </p>
                )}
                <button type="submit" className="w-full form-submit-btn">
                  Post
                </button>
              </form>
            )}
            {formType === "PostAnnouncement" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePostAnnouncement();
                }}
              >
                <Input
                  label="Title"
                  placeholder="Enter title"
                  id="announcement-title"
                  type="text"
                  value={announcementForm.title}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <div className="flex flex-col mb-4">
                  <label
                    className="input-field-label"
                    htmlFor="announcement-content"
                  >
                    Content
                  </label>
                  <textarea
                    id="announcement-content"
                    rows={5}
                    placeholder="Enter content"
                    className="input-field"
                    value={announcementForm.content}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-1 mx-2 mb-4">
                  <input
                    type="checkbox"
                    id="pin"
                    className="accent-primary size-3"
                    checked={announcementForm.pinned}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        pinned: e.target.checked,
                      }))
                    }
                  />
                  <label className="text-sm text-gray-600" htmlFor="pin">
                    Pin
                  </label>
                </div>
                {error && (
                  <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm">
                    *{error}
                  </p>
                )}
                <button type="submit" className="w-full form-submit-btn">
                  Post
                </button>
              </form>
            )}
            {formType === "EditClub" && (
              <form
                onSubmit={handleEditClub}
                className="flex flex-col gap-1 p-2 sm:gap-2 sm:p-4"
              >
                <ProfilePhotoSelector
                  image={clubForm.coverImage}
                  removeImage={setRemoveCoverImage}
                  setImage={(img) =>
                    setClubForm((prev) => ({ ...prev, coverImage: img }))
                  }
                  profileImageUrl={coverImageUrl}
                  setProfileImageUrl={setCoverImageUrl}
                  Icon={HiOutlineUserGroup}
                />
                <Input
                  value={clubForm.name}
                  id="club-name"
                  onChange={({ target }) =>
                    setClubForm((prev) => ({ ...prev, name: target.value }))
                  }
                  type="text"
                  label="Club Name"
                  placeholder="Enter club name"
                />
                <div className="flex flex-col mb-4">
                  <label className="input-field-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    value={clubForm.description}
                    onChange={(e) =>
                      setClubForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter club description"
                    id="description"
                    rows={6}
                    className="input-field"
                  />
                </div>
                {error && (
                  <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm sm:mb-3 sm:ml-4">
                    * {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="form-submit-btn"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ClubDetails;
