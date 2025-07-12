import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import EventCard from "../components/EventCard";
import { PiUsersThreeThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const fetchSearchResults = async (query) => {
    const response = await axiosInstance.get(`/api/explore/search?q=${query}`);
    if (response.data.success) {
      setSearchResults(response.data.results);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const events = searchResults.filter((item) => item.type === "event");
  const clubs = searchResults.filter((item) => item.type === "club");

  return (
    <div className="w-full">
      <div className="max-sm:mt-[51px] flex m-5 items-center bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 w-4/5 max-sm:w-[95%] mx-auto">
        <LuSearch className="text-gray-500 mr-2" />
        <input
          className="flex-1 bg-transparent outline-none text-sm"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search clubs, events, announcements..."
        />
      </div>

      {clubs.length > 0 && (
        <div className="m-5 flex flex-col items-start gap-2">
          <h2 className="font-medium text-lg text-gray-800">Clubs</h2>
          {clubs.map((club) => (
            <div
              onClick={() => navigate(`/clubs/${club._id}`)}
              className="flex items-center gap-2 py-4 px-2 hover:bg-gray-100 w-full rounded-lg"
            >
              <div className="w-14 rounded-full">
                {club.coverImage ? (
                  <img
                    src={club.coverImage}
                    className="h-14 w-14 rounded-full"
                  />
                ) : (
                  <PiUsersThreeThin className="w-14 h-14 text-gray-500 p-1 border rounded-full" />
                )}
              </div>
              <div>
                <p className="font-medium">{club.name}</p>
                <p className="text-xs text-gray-500">
                  {club.members.length} members
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div>
          <h2 className="font-medium text-lg text-gray-800 mx-5 mt-10">
            Events
          </h2>
          {events.map((event) => (
            <EventCard event={event} />
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No results found for "
          <span className="font-semibold">{searchQuery}</span>"
        </div>
      )}
    </div>
  );
}

export default Explore;
