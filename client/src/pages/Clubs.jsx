import { useState, useEffect } from "react";
import { LuPlus, LuUsers } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import Input from "../components/Input";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import ClubCard from "../components/ClubCard";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUserClubs } from "../utils/services";

function Clubs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clubs, setClubs] = useState([]);

  const [clubForm, setClubForm] = useState({
    name: "",
    description: "",
    coverImage: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const clubData = await fetchUserClubs();

      if (clubData) {
        setClubs(clubData);
      }
    };

    fetchData();
  }, []);

  const handleCreateClub = async (e) => {
    e.preventDefault();

    const { name, description, coverImage } = clubForm;

    if (!name || !description) {
      setError(!name ? "Name is required" : "Description is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (coverImage) formData.append("coverImage", coverImage);

      const response = await axiosInstance.post(
        api_paths.clubs.create_club,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Club created successfully!");
        setIsModalOpen(false);
        setClubForm({ name: "", description: "", coverImage: null });
        fetchUserClubs();
      } else {
        toast.error(response.data.message || "Failed to create club");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setError("");
      setClubForm({ name: "", description: "", coverImage: null });
    }
  }, [isModalOpen]);

  return (
    <div className="w-full min-h-screen">
      <div className="sticky top-0 z-10 flex items-center justify-between w-full px-5 pt-[52px] pb-2 border-b border-gray-200 sm:pt-5 backdrop-blur-xl bg-gray-50/60">
        <LuUsers className="text-gray-500 size-6" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 text-xs font-medium transition-all duration-300 ease-in-out border rounded-full hover:bg-primary/20 bg-primary/10 text-primary border-primary"
        >  
          <LuPlus className="stroke-2 size-4"/>Create Club
        </button>
      </div>

      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen} loading={loading}>
          <h2 className="mx-2 my-5 text-xl font-semibold text-center sm:mx-4 sm:text-2xl text-primary">
            Create Club
          </h2>
          <form
            onSubmit={handleCreateClub}
            className="flex flex-col gap-1 p-2 sm:gap-2 sm:p-4"
          >
            <ProfilePhotoSelector
              image={clubForm.coverImage}
              setImage={(img) =>
                setClubForm((prev) => ({ ...prev, coverImage: img }))
              }
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
              disabled={loading}
              className="form-submit-btn"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </Modal>
      )}

      <div className="flex flex-col justify-center w-full h-full px-4 py-6">
        {clubs.length === 0 ? (
          <p className="mt-10 text-center text-gray-400">
            No clubs yet. Create one!
          </p>
        ) : (
          clubs.map((club) => (
            <Link key={club._id} to={club._id}>
              <ClubCard club={club} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Clubs;
