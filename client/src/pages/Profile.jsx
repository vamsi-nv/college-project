import Modal from "../components/Modal";
import { useAuth } from "../context/UserContextProvider";
import { useEffect, useState, useCallback, useMemo } from "react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import Input from "../components/Input";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import Loader from "../components/Loader";
import { FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { fetchUserClubs } from "../utils/services";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import AnnouncementCard from "../components/AnnouncementCard";
import ClubCard from "../components/ClubCard";

function Profile() {
  const { fetchCurrentUser, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [currentTab, setCurrentTab] = useState("Clubs");
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  const tabItems = useMemo(
    () => [{ label: "Clubs" }, { label: "Events" }, { label: "Announcements" }],
    []
  );

  const userInitials = useMemo(() => {
    if (!user?.name) return "";
    return user.name.split(" ").map((word) => word.charAt(0));
  }, [user?.name]);

  const fetchUserEvents = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        api_paths.events.get_events_createdBy_me
      );
      const data = response.data;
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  }, []);

  const fetchUserAnnouncements = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        api_paths.announcements.get_announcements_createdBy_me
      );
      const data = response.data;
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      toast.error("Failed to fetch announcements");
    }
  }, []);

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!name.trim()) return setError("Name is required");

      try {
        setSaving(true);
        const formData = new FormData();
        formData.append("name", name);

        if (image) {
          formData.append("image", image);
        } else if (removeProfileImage) {
          formData.append("removeProfileImage", true);
        }

        const response = await axiosInstance.put(
          api_paths.auth.update_current_user,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = response.data;
        if (data.success) {
          fetchCurrentUser();
          setIsModalOpen(false);
          setError("");
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again"
        );
        console.log(error);
      } finally {
        setSaving(false);
      }
    },
    [name, image, removeProfileImage, fetchCurrentUser]
  );

  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    setProfileImageUrl("");
  }, []);

  const handleTabChange = useCallback((tabLabel) => {
    setCurrentTab(tabLabel);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const clubData = await fetchUserClubs();
      if (clubData) setClubs(clubData);
    };

    fetchData();
    setProfileImageUrl(user.profileImageUrl || "");
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchTabData = async () => {
      if (currentTab === "Events" && events.length === 0) {
        await fetchUserEvents();
      } else if (currentTab === "Announcements" && announcements.length === 0) {
        await fetchUserAnnouncements();
      }
    };

    if (isMounted) {
      fetchTabData();
    }

    return () => {
      isMounted = false;
    };
  }, [
    currentTab,
    events.length,
    announcements.length,
    fetchUserEvents,
    fetchUserAnnouncements,
  ]);

  useEffect(() => {
    if (isModalOpen && user) {
      setName(user.name);
    }
  }, [isModalOpen, user?.name]);
  useEffect(() => {
    if (!isModalOpen) {
      setRemoveProfileImage(false);
      setImage(null);
      setError("");
    }
  }, [isModalOpen]);

  if (!user) return <Loader />;

  return (
    <div className="w-full h-full">
      <div className="py-20">
        <div className="flex flex-col items-center">
          <div className="max-sm:size-30 size-32 sm:size-36 lg:size-40 rounded-full">
            {profileImageUrl && !loading ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                onError={handleImageError}
                className="w-full h-full object-cover bg-cover rounded-full aspect-square"
                loading="lazy"
              />
            ) : (
              <div className="size-full bg-gray-400 grid place-content-center rounded-full">
                <div className="flex items-center justify-center">
                  {userInitials.map((initial, index) => (
                    <span
                      className="pt-1 text-5xl max-sm:text-4xl text-white"
                      key={index}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-700 sm:text-xl md:text-2xl">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 sm:text-base">{user.email}</p>
          <button
            onClick={handleModalOpen}
            className="flex items-center gap-1 px-3 py-1 my-2 text-xs border rounded-full sm:text-sm sm:px-4 border-primary text-primary hover:bg-primary/30 bg-primary/20"
          >
            <FiEdit2 /> Edit
          </button>
        </div>

        <div className="sticky z-10 flex items-center justify-around w-full overflow-x-scroll border-b border-gray-300 backdrop-blur-2xl">
          {tabItems.map((tabItem) => (
            <button
              key={tabItem.label}
              title={tabItem.label}
              onClick={() => handleTabChange(tabItem.label)}
              className={`tab-label ${
                currentTab === tabItem.label
                  ? "tab-selected"
                  : "tab-not-selected"
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {currentTab === "Clubs" && (
          <div className="my-10 space-y-5">
            {clubs.map((club) => (
              <Link key={club._id} to={`/clubs/${club._id}`}>
                <ClubCard club={club} user={user} />
              </Link>
            ))}
          </div>
        )}

        {currentTab === "Events" && (
          <div>
            {events?.map((event) => (
              <EventCard event={event} key={event?._id} />
            ))}
          </div>
        )}

        {currentTab === "Announcements" && (
          <div>
            {announcements?.map((announcement) => (
              <AnnouncementCard
                announcement={announcement}
                key={announcement._id}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div>
            <h2 className="mx-2 my-5 text-xl font-semibold text-center sm:mx-4 sm:text-2xl text-primary">
              Edit Profile
            </h2>
            <form onSubmit={handleUpdate}>
              <ProfilePhotoSelector
                image={image}
                profileImageUrl={profileImageUrl}
                setProfileImageUrl={setProfileImageUrl}
                setImage={setImage}
                Icon={LuUser}
                removeImage={setRemoveProfileImage}
              />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                id="name"
                label="Name"
                onChange={({ target }) => setName(target.value)}
              />
              {error && (
                <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm sm:mb-3 sm:ml-4">
                  *{error}
                </p>
              )}
              <button
                disabled={saving}
                type="submit"
                className="w-full form-submit-btn"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Profile;
