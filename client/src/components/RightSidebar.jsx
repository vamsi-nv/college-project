import { useEffect, useState } from "react";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContextProvider";

function RightSidebar() {
  const [clubs, setClubs] = useState([]);
  const { user } = useAuth();

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
        fetchAllclubs();
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
    <div className={`p-3 mt-10 lg:p-6 `}>
      <h3 className="px-4 mb-3 text-lg font-medium text-gray-500">
        What to join
      </h3>
      <div className=" xl:w-[60%] flex flex-col">
        {clubs.map((club) => (
          <div key={club._id} className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <div>
                {club.coverImage ? (
                  <img
                    src={club.coverImage}
                    alt="club cover image"
                    className="bg-contain rounded-full w-14 h-14"
                  />
                ) : (
                  <HiOutlineUserGroup className="w-12 h-12 p-2 text-gray-400 bg-contain border border-gray-300 rounded-full" />
                )}
              </div>
              <div>
                <Link to={`/clubs/${club._id}`}>
                  <h4 className="text-base ">{club.name}</h4>
                </Link>
                <p className="text-xs text-gray-400">
                  {club.members.length} members
                </p>
              </div>
            </div>
            <button
              onClick={() => handleJoinClub(club._id)}
              className="px-4 py-1 mt-2 text-sm text-white transition-colors duration-300 rounded-full bg-primary hover:bg-primary/90 place-self-start"
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
