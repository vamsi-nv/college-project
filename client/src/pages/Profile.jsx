import Modal from "../components/Modal";
import { HiMiniUserCircle } from "react-icons/hi2";
import { useAuth } from "../context/UserContextProvider";
import { useEffect, useState } from "react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import Input from "../components/Input";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import Loader from "../components/Loader";
import { FiEdit2 } from "react-icons/fi";
import { PiUsersThreeThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { fetchUserClubs } from "../utils/services";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import AnnouncementCard from "../components/AnnouncementCard";

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

  const tabItems = [
    { label: "Clubs" },
    { label: "Events" },
    { label: "Announcements" },
  ];

  const fetchUserEvents = async () => {
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
  };

  const fetchUserAnnouncements = async () => {
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
  };

  const handleUpdate = async (e) => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      const clubData = await fetchUserClubs();
      if (clubData) setClubs(clubData);
    };

    if (user) {
      fetchData();
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [user]);

  useEffect(() => {
    if (currentTab === "Events") fetchUserEvents();
    if (currentTab === "Announcements") fetchUserAnnouncements();
  }, [currentTab]);

  useEffect(() => {
    if (isModalOpen && user) {
      setName(user.name);
    }
  }, [isModalOpen, user]);

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
          <div className="max-sm:size-30 size-32 sm:size-36 lg:size-40">
            {profileImageUrl && !loading ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  setProfileImageUrl("");
                }}
                className="w-full h-full rounded-full aspect-square"
              />
            ) : (
              <div className="size-full bg-gray-400 grid place-content-center rounded-full">
                <div className="flex items-center justify-center">
                  {user.name.split(" ").map((word, index) => (
                    <span
                      className="pt-1 text-5xl max-sm:text-4xl text-white"
                      key={index}
                    >
                      {word.charAt(0)}
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
            onClick={() => setIsModalOpen(true)}
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
              onClick={() => setCurrentTab(tabItem.label)}
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
          <div>
            {clubs.map((club) => (
              <Link key={club._id} to={`/clubs/${club._id}`}>
                <div
                  title={club.name}
                  className="hover:bg-gray-50/50 mx-auto my-5 w-4/5 sm:w-[80%] md:w-6/7 lg:w-4/5 xl:w-3/5 border border-gray-300 rounded-2xl shadow-gray-300/80 hover:shadow-[0_0_10px] hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {club.coverImage ? (
                    <img
                      src={club.coverImage}
                      alt={club.name}
                      className="object-cover aspect-video rounded-t-2xl"
                    />
                  ) : (
                    <PiUsersThreeThin className="mx-auto font-light min-h-[190px] text-gray-300 max-sm:size-24 sm:size-32 size-40" />
                  )}
                  <div className="p-4">
                    <h2 className="flex items-center justify-between text-lg font-semibold text-gray-700 max-sm:text-sm">
                      {club.name}
                      {club.admins.includes(user._id) && (
                        <span className="px-2 py-0.5 text-xs font-medium text-green-500 border border-green-500 rounded-full bg-green-500/10">
                          Admin
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-500 max-sm:text-xs max-w-[40ch]">
                      {club.description}
                    </p>
                  </div>
                </div>
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
