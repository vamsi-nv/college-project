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
function Profile() {
  const { fetchCurrentUser, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [currentTab, setCurrentTab] = useState("Clubs")

  const tabItems = [
    {
      label: "Clubs",
    },
    {
      label: "Events",
    },
    {
      label: "Announcements",
    },
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setError("Name is required");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
    }

    if (user.profileImageUrl) {
      setProfileImageUrl(user.profileImageUrl);
    }
  }, [user]);

  if (!user) return <Loader />;

  return (
    <div className="w-full h-full">
      <div className="px-6 py-20">
        <div className="flex flex-col items-center">
          <div className="max-sm:size-30 size-32 sm:size-36 lg:size-40">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt=""
                className="w-full h-full rounded-full aspect-square"
              />
            ) : (
              <HiMiniUserCircle className="w-full h-full text-gray-300 rounded-full" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700">
            {user.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-500">{user.email}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs sm:text-sm flex items-center gap-1 px-3 sm:px-4 py-1 my-2 border rounded-full border-primary text-primary hover:bg-primary/30 bg-primary/20"
          >
            <FiEdit2 /> Edit
          </button>
        </div>

        <div className="sticky flex items-center justify-around w-full pt-12 overflow-x-scroll border-b border-gray-200 sm:pt-5">
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
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen}>
          <div>
            <h2 className="mx-2 my-5 text-xl font-semibold text-center sm:mx-4 sm:text-2xl text-primary">
              Update Profile
            </h2>
            <form onSubmit={handleUpdate}>
              <ProfilePhotoSelector
                image={image}
                profileImageUrl={profileImageUrl}
                setProfileImageUrl={setProfileImageUrl}
                setImage={setImage}
                Icon={HiMiniUserCircle}
              />
              <Input
                type={"text"}
                placeholder={"Enter your name"}
                value={name}
                id={"name"}
                label={"Name"}
                onChange={({ target }) => setName(target.value)}
              />
              {error && (
                <p className="mb-2 ml-2 text-xs text-red-500 sm:text-sm sm:mb-3 sm:ml-4">
                  *{error}
                </p>
              )}
              <button
                disabled={loading}
                type="submit"
                className="w-full form-submit-btn"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Profile;
