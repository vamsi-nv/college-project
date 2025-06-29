import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../context/UserContextProvider";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import { PiUsersThreeThin } from "react-icons/pi";
import Modal from "../components/Modal";
import Input from "../components/Input";
import AnnouncementCard from "../components/AnnouncementCard";
import { LuTrash2 } from "react-icons/lu";

function ClubDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("Events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

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

  const tabItems = [{ label: "Events" }, { label: "Announcements" }];

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
    } catch {
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
    } catch {
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
    } catch {
      toast.error("Failed to post event");
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
    } catch {
      toast.error("Failed to post announcement");
    }
  };

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  useEffect(() => {
    if (club?._id) fetchClubEvents();
    if (club?._id) fetchClubAnnouncements();
  }, [club?._id]);

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

  if (loading || !club || !user || !club.createdBy) return <Loader />;

  return (
    <div className="w-full h-full pt-12 sm:pt-0">
      <div className="flex items-center justify-between p-4 max-sm:text-sm">
        <h3 className="md:text-lg max-sm:text-sm">{club.name}</h3>
        {club.createdBy._id === user._id && (
          <button
            onClick={handleDeleteClub}
            className="p-2 rounded-full hover:text-red-500 hover:bg-red-500/10"
          >
            <LuTrash2 className="size-4 md:size-5" />
          </button>
        )}
      </div>

      {club.coverImage ? (
        <img
          src={club.coverImage}
          alt="Club Cover"
          className="object-cover w-full h-auto border-none aspect-video"
        />
      ) : (
        <PiUsersThreeThin className="mx-auto font-light text-gray-300 size-42" />
      )}

      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="font-medium text-gray-700 lg:text-3xl sm:text-2xl max-sm:text-xl">
            {club.name}
          </h1>
          <p className="text-gray-500 max-sm:text-sm">{club.description}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {club.createdBy._id !== user._id &&
            (club.members.some((member) => member._id === user._id) ? (
              <button
                onClick={handleLeaveClub}
                className="px-6 py-2 text-sm border rounded-full border-primary hover:bg-primary/30 text-primary bg-primary/20"
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

          {club.createdBy._id === user._id && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs text-white rounded-full bg-primary"
            >
              + {currentTab === "Events" ? "Event" : "Announcement"}
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between border-b border-gray-200 max-md:mx-5">
          <div className="flex items-center gap-3">
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
        </div>

        {currentTab === "Events" && (
          <div>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {currentTab === "Announcements" && (
          <div>
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                fetchClubAnnouncements={fetchClubAnnouncements}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div>
            <h2 className="mx-2 my-5 text-xl font-semibold text-center text-primary sm:mx-4 sm:text-2xl">
              {currentTab === "Events" ? "Event" : "Announcement"}
            </h2>
            {currentTab === "Events" ? (
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
                  <p className="mb-2 ml-2 text-xs text-red-500">* {error}</p>
                )}
                <button type="submit" className="w-full form-submit-btn">
                  Post
                </button>
              </form>
            ) : (
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
                  <p className="mb-2 ml-2 text-xs text-red-500">* {error}</p>
                )}
                <button type="submit" className="w-full form-submit-btn">
                  Post
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
