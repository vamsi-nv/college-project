import {
  useCallback,
  useMemo,
  useState,
  useRef,
  lazy,
  Suspense,
  useEffect,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { LuSearch, LuX } from "react-icons/lu";
import { useDebounce } from "../hooks/useDebounce";
import { HiUsers } from "react-icons/hi2";

const EventCard = lazy(() => import("../components/EventCard"));

const ClubItem = ({ club, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center w-full gap-3 px-3 py-3 transition-colors duration-150 rounded-lg cursor-pointer hover:bg-white"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    <div className="flex-shrink-0 w-12 h-12">
      {club.coverImage ? (
        <img
          src={club.coverImage}
          alt="club cover image"
          className="object-cover rounded-full shrink-0 size-full"
        />
      ) : (
        <HiUsers
          fill="white"
          className="w-12 h-12 p-2 text-white bg-contain border border-gray-300 rounded-full bg-gray-400/60"
        />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 truncate">{club.name}</p>
      <p className="text-sm text-gray-500">
        {club.members?.length || 0} members
      </p>
    </div>
  </div>
);

const SearchInput = ({ value, onChange, onClear }) => (
  <div className="max-sm:mt-[52px] flex m-5 items-center bg-white border border-gray-300 rounded-lg px-4 py-2 w-4/5 max-sm:w-[92%] mx-auto">
    <LuSearch className="flex-shrink-0 mr-3 text-gray-400" size={20} />
    <input
      className="flex-1 text-sm placeholder-gray-500 bg-transparent outline-none"
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search clubs, events, announcements..."
      autoComplete="off"
      spellCheck="false"
    />
    {value && (
      <button
        onClick={onClear}
        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors ml-2"
        aria-label="Clear search"
      >
        <LuX size={14} />
      </button>
    )}
  </div>
);

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const abortControllerRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { events, clubs } = useMemo(() => {
    const events = searchResults.filter((item) => item.type === "event");
    const clubs = searchResults.filter((item) => item.type === "club");
    return { events, clubs };
  }, [searchResults]);

  const fetchSearchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError("");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(
        `/api/explore/search?q=${encodeURIComponent(query)}`,
        {
          signal: abortControllerRef.current.signal,
          timeout: 5000,
        }
      );

      if (response.data?.success) {
        setSearchResults(response.data.results || []);
      } else {
        setError("Failed to fetch search results");
        setSearchResults([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Search error:", error);
        setError("Something went wrong. Please try again.");
        setSearchResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchResults(debouncedSearchQuery);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearchQuery, fetchSearchResults]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClubClick = useCallback(
    (clubId) => {
      navigate(`/clubs/${clubId}`);
    },
    [navigate]
  );

  const showNoResults =
    searchQuery && !loading && searchResults.length === 0 && !error;

  return (
    <div className="w-full min-h-screen bg-white">
      <SearchInput
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      {error && (
        <div className="p-4 mx-5 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {clubs.length > 0 && (
        <section className="m-5">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Clubs ({clubs.length})
          </h2>
          <div className="space-y-1">
            {clubs.map((club) => (
              <ClubItem
                key={club._id}
                club={club}
                onClick={() => handleClubClick(club._id)}
              />
            ))}
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="mb-5">
          <h2 className="mx-5 mb-3 text-lg font-semibold text-gray-800">
            Events ({events.length})
          </h2>
          <Suspense
            fallback={
              <div className="mx-5 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            }
          >
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </Suspense>
        </section>
      )}

      {showNoResults && (
        <div className="py-12 text-center">
          <div className="mb-2 text-gray-400">
            <LuSearch size={48} className="mx-auto" />
          </div>
          <p className="text-lg text-gray-500">
            No results found for "
            <span className="font-semibold text-gray-700">{searchQuery}</span>"
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Try searching with different keywords
          </p>
        </div>
      )}

      {!searchQuery && searchResults.length === 0 && !loading && (
        <div className="py-16 text-center">
          <div className="mb-4 text-gray-300">
            <LuSearch size={64} className="mx-auto" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-gray-600">
            Discover clubs and events
          </h3>
          <p className="text-sm text-gray-500 md:text-base">
            Search for clubs, events, and announcements to get started
          </p>
        </div>
      )}
    </div>
  );
}

export default Explore;
