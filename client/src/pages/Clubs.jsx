import { LuUsers } from "react-icons/lu";
import Input from "../components/Input";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi2";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";

function Clubs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const handleCreateClub = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log(name, description);

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!description) {
      setError("Description is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await axiosInstance.post(
        api_paths.clubs.create_club,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      if (data.success) {
        console.log("Club created : ", data.club);
        setIsModalOpen(false);
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
      setName("");
      setDescription("");
      setCoverImage(null);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 pt-12 pb-2 sm:pt-2 w-full flex items-center justify-between px-5">
        <LuUsers className="size-6 text-gray-500" />
        <button
          onClick={() => setIsModalOpen(true)}
          className=" text-sm hover:bg-primary/20 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium border border-primary transition-all duration-300 ease-in-out"
        >
          + Create Club
        </button>
      </div>
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-gray-300/30 backdrop-blur-xs flex items-center justify-center w-full px-2"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-lg shadow-lg border border-gray-200 p-4 sm:p-8 bg-gray-50 rounded-lg"
          >
            <h2 className="mx-2 sm:mx-4 my-5 font-semibold text-xl sm:text-2xl text-center text-primary">
              Create Club
            </h2>
            <form
              onSubmit={handleCreateClub}
              className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-4"
            >
              <ProfilePhotoSelector
                image={coverImage}
                setImage={setCoverImage}
                Icon={HiOutlineUserGroup}
              />
              <Input
                value={name}
                id="club-name"
                onChange={({ target }) => setName(target.value)}
                type="text"
                label="Club Name"
                placeholder="Enter club name"
              />

              <div className="flex flex-col mb-4">
                <label className="input-field-label" htmlFor={"description"}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter club description"
                  name="description"
                  id="description"
                  rows={6}
                  className="input-field"
                ></textarea>
              </div>
              {error && (
                <p className="text-xs sm:text-sm text-red-500 mb-2 sm:mb-3 ml-2 sm:ml-4">
                  *{error}
                </p>
              )}

              <button type="submit" className="form-submit-btn">
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
            <button
              disabled={loading}
              onClick={() => setIsModalOpen(false)}
              className="absolute hover:bg-primary/10 p-2 hover:text-primary rounded-full top-5 right-5"
            >
              <IoCloseOutline className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clubs;
