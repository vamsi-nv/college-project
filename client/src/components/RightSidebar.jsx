import { useCallback, useEffect, useState } from "react";
import { api_paths } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { HiOutlineUserGroup, HiUsers } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UserContextProvider";
import { fetchUserClubs } from "../utils/services";

function RightSidebar() {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAllclubs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(api_paths.clubs.get_all_clubs);
      const data = response.data;

      if (data.success) {
        setClubs(data.clubs);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch clubs"
      );
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadMessagesCount = useCallback(async (clubIds) => {
    if (!clubIds || clubIds.length === 0) return;

    try {
      const clubIdsString = clubIds.join(",");
      const response = await axiosInstance.get(
        `${api_paths.messages.get_unread_messages_count}?clubIds=${clubIdsString}`
      );

      const data = response.data;
      if (data.success) {
        setUnreadCounts(data.unreadMessagesCounts);
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch unread message counts"
      );
    }
  }, []);

  const handleJoinClub = async (id) => {
    try {
      setError(null);
      const response = await axiosInstance.post(api_paths.clubs.join_club(id));
      const data = response.data;
      if (data.success) {
        console.log("Joined club");
        await fetchAllclubs();
        const userClubsData = await fetchUserClubs();
        if (userClubsData) {
          setUserClubs(userClubsData);
          const clubIds = userClubsData.map((club) => club._id);
          await fetchUnreadMessagesCount(clubIds);
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again"
      );
      console.error("Error joining club:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userClubsData = await fetchUserClubs();
        if (userClubsData && userClubsData.length > 0) {
          setUserClubs(userClubsData);

          const clubIds = userClubsData.map((club) => club._id);
          await fetchUnreadMessagesCount(clubIds);
        }
      } catch (error) {
        console.error("Error fetching user clubs:", error);
      }
    };

    fetchData();
  }, [fetchUnreadMessagesCount]);

  useEffect(() => {
    fetchAllclubs();
  }, [fetchAllclubs]);

  return (
    <div className={`p-3 mt-10 lg:p-6 `}>
      <div className="xl:w-[80%] border border-gray-300 p-5 rounded-lg">
        <h3 className="px-4 mb-3 text-lg font-semibold text-gray-700">
          What to join
        </h3>
        <div className=" xl:w-full flex flex-col divide-y divide-gray-300">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <div className="size-12 shrink-0">
                  {club.coverImage ? (
                    <img
                      src={club.coverImage}
                      alt="club cover image"
                      className="object-cover rounded-full shrink-0 size-full"
                    />
                  ) : (
                    <HiUsers
                      fill="white"
                      className="w-12 h-12 p-2 bg-gray-400/60 text-white bg-contain border border-gray-300 rounded-full"
                    />
                  )}
                </div>
                <div>
                  <Link to={`/clubs/${club._id}`}>
                    <h4 className="text-base text-gray-700 font-medium">
                      {club.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {club.members.length} members
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleJoinClub(club._id)}
                disabled={loading}
                className="px-4 py-1 mt-2 text-sm text-white transition-colors duration-300 rounded-full bg-primary hover:bg-primary/90 place-self-start disabled:opacity-50"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-300 xl:w-[80%] my-10 rounded-lg p-5">
        <h3 className="px-4 mb-3 text-lg font-medium text-gray-700">
          New Messages
        </h3>

        <div className=" xl:w-full flex flex-col divide-y divide-gray-300">
          {userClubs.map((club) => {
            const unreadCount = unreadCounts[club._id] || 0;

            return (
              <div
                key={club._id}
                className="flex items-center justify-between p-4"
              >
                <div className="relative flex items-center gap-2">
                  <div className="size-12 shrink-0 relative">
                    {club.coverImage ? (
                      <img
                        src={club.coverImage}
                        alt="club cover image"
                        className="object-cover rounded-full shrink-0 size-full"
                      />
                    ) : (
                      <HiUsers
                        fill="white"
                        className="w-12 h-12 p-2 bg-gray-400/60 text-white bg-contain border border-gray-300 rounded-full"
                      />
                    )}
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </div>
                    )}
                  </div>
                  <div>
                    <Link to={`/chat`}>
                      <h4 className="text-base text-gray-700 font-medium">
                        {club.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {unreadCount > 0
                        ? `${unreadCount} new message${
                            unreadCount > 1 ? "s" : ""
                          }`
                        : "No new messages"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
