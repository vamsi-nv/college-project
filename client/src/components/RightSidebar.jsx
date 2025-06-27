import { useEffect, useState } from "react";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/UserContextProvider";
import { HiOutlineUserGroup } from "react-icons/hi2";

function RightSidebar() {
  const [clubs, setClubs] = useState([]);

  const fetchAllclubs = async () => {
    const response = await axiosInstance.get(api_paths.clubs.get_all_clubs);
    const data = response.data;

    if (data.success) {
      setClubs(data.clubs);
    }
  };

  const handleJoinClub = async (id) => {
    try {
      const response = await axiosInstance.post(api_paths.clubs.join_club(id));
      const data = response.data;
      if (data.success) {
        console.log("Joined club");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again"
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllclubs();
  }, []);

  return (
    <div className="mt-10 p-3 lg:p-6">
      <h3 className="font-medium text-lg mb-3 px-4 text-gray-500">
        What to join
      </h3>
      <div className=" xl:w-[60%] flex flex-col">
        {clubs.map((club) => (
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <div>
                {club.coverImage ? (
                  <img
                    src={club.coverImage}
                    alt="club cover image"
                    className="w-14 h-14 bg-contain rounded-full"
                  />
                ) : (
                  <HiOutlineUserGroup className="w-12 h-12 p-2 text-gray-400 border border-gray-300 bg-contain rounded-full" />
                )}
              </div>
              <div>
                <h4 className="text-base ">{club.name}</h4>
                <p className="text-xs text-gray-400">
                  {club.members.length} members
                </p>
              </div>
            </div>
            <button
              onClick={() => handleJoinClub(club._id)}
              className="bg-primary hover:bg-primary/90 transition-colors duration-300 text-white px-3 py-1 rounded-full text-xs place-self-start mt-2"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightSidebar;
