import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuUsers, LuCalendar, LuMegaphone } from "react-icons/lu";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Input from "../components/Input";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import { HiOutlineUserGroup } from "react-icons/hi2";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useAuth } from "../context/UserContextProvider";
import ClubHeader from "../components/ClubDetailsComponets/ClubHeader";
import ClubCover from "../components/ClubDetailsComponets/ClubCover";
import ClubInfo from "../components/ClubDetailsComponets/ClubInfo";
import AddContentButton from "../components/ClubDetailsComponets/AddContentButton";
import ClubTabs from "../components/ClubDetailsComponets/ClubTabs";
import ClubEventsList from "../components/ClubDetailsComponets/ClubEventsList";
import ClubAnnouncementsList from "../components/ClubDetailsComponets/ClubAnnouncementsList";
import MembersList from "../components/ClubDetailsComponets/MembersList";

function ClubDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState("Events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [formType, setFormType] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [removeCoverImage, setRemoveCoverImage] = useState(false);

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
    { label: "Members", icon: LuUsers, count: club?.members?.length || 0 },
    { label: "Events", icon: LuCalendar, count: events.length },
    { label: "Announcements", icon: LuMegaphone, count: announcements.length },
  ];

  const isClubOwner = club?.createdBy?._id === user?._id;
  const isClubAdmin = club?.admins?.some((admin) => admin?._id === user?._id);

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

  const handleToggleAdmin = async (userToToggle) => {
    try {
      const response = await axiosInstance.patch(
        api_paths.clubs.toggle_admin(club._id),
        { userToToggle }
      );
      if (response.data.success) {
        fetchClubDetails();
      }
    } catch (error) {
      toast.error("Error setting admin status");
    }
  };

  const handleRemoveMember = async (userToRemove) => {
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
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
    }
  };

  const handleEditClub = () => {
    setFormType("EditClub");
    setIsModalOpen(true);
    setClubForm({
      name: club.name || "",
      description: club.description || "",
      coverImage: null,
    });
    if (club.coverImage) {
      setCoverImageUrl(club.coverImage);
    }
  };

  const handleCreateEvent = () => {
    setFormType("PostEvent");
    setCurrentTab("Events");
    setIsModalOpen(true);
  };

  const handleCreateAnnouncement = () => {
    setFormType("PostAnnouncement");
    setCurrentTab("Announcements");
    setIsModalOpen(true);
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();
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
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleEditClubSubmit = async (e) => {
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
    } finally {
      setSaving(false);
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
    }
  }, [isModalOpen]);

  if (loading) return <Loader />;

  if (!club || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Club not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ClubHeader
        club={club}
        user={user}
        onEditClub={handleEditClub}
        onDeleteClub={handleDeleteClub}
      />

      <ClubCover coverImage={club?.coverImage} clubName={club?.name} />

      <ClubInfo
        club={club}
        user={user}
        onJoinClub={handleJoinClub}
        onLeaveClub={handleLeaveClub}
      >
        <AddContentButton
          onCreateEvent={handleCreateEvent}
          onCreateAnnouncement={handleCreateAnnouncement}
          isAdmin={isClubAdmin}
        />
      </ClubInfo>

      <ClubTabs
        tabs={tabItems}
        activeTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <div className="pb-20">
        {currentTab === "Members" && (
          <MembersList
            club={club}
            user={user}
            onToggleAdmin={handleToggleAdmin}
            onRemoveMember={handleRemoveMember}
          />
        )}

        {currentTab === "Events" && (
          <ClubEventsList events={events} onEventDelete={handleEventDelete} />
        )}

        {currentTab === "Announcements" && (
          <ClubAnnouncementsList
            announcements={announcements}
            onAnnouncementDelete={handleAnnouncementDelete}
            onTogglePin={handleTogglePin}
          />
        )}
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div className="p-6">
            <h2 className="mb-6 text-2xl font-semibold text-center text-primary">
              {formType === "PostEvent" && "Create Event"}
              {formType === "PostAnnouncement" && "Create Announcement"}
              {formType === "EditClub" && "Edit Club"}
            </h2>

            {formType === "PostEvent" && (
              <form onSubmit={handlePostEvent} className="space-y-4">
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
                  Post Event
                </button>
              </form>
            )}

            {formType === "PostAnnouncement" && (
              <form onSubmit={handlePostAnnouncement} className="space-y-4">
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
                  Post Announcement
                </button>
              </form>
            )}

            {/* Edit Club Form */}
            {formType === "EditClub" && (
              <form onSubmit={handleEditClubSubmit} className="space-y-4">
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
                  className="w-full form-submit-btn"
                >
                  {saving ? "Saving..." : "Save Changes"}
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
