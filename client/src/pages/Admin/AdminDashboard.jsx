import { useEffect, useMemo, useState, useCallback } from "react";
import { LuUsers } from "react-icons/lu";
import { MdEvent } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { fetchAllClubs, fetchAllEvents, fetchAllUsers } from "./adminHelper";

function AdminDashboard() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortedClubs = useMemo(() => {
    if (!clubs.length) return [];
    return [...clubs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [clubs]);

  const sortedEvents = useMemo(() => {
    if (!events.length) return [];
    return [...events].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [events]);

  const displayClubs = useMemo(() => sortedClubs.slice(0, 8), [sortedClubs]);
  const displayEvents = useMemo(() => sortedEvents.slice(0, 8), [sortedEvents]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [clubsData, eventsData, usersData] = await Promise.all([
        fetchAllClubs(),
        fetchAllEvents(),
        fetchAllUsers(),
      ]);

      if (clubsData) setClubs(clubsData);
      if (eventsData) setEvents(eventsData);
      if (usersData) setUsers(usersData);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full gap-10 px-4 py-8 max-sm:py-16 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md animate-pulse"
            >
              <div className="flex items-center gap-1 mb-2">
                <div className="p-3 bg-gray-200 rounded-full">
                  <div className="bg-gray-300 rounded size-6"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full h-full gap-10 px-4 py-8 max-sm:py-16 md:p-8 lg:p-10">
        <div className="text-center text-red-600">
          Error loading dashboard: {error}
        </div>  
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-10 px-4 py-8 text-gray-700 max-sm:py-16 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
        <div className="inline-block px-8 py-6 transition-all duration-300 border border-gray-200 rounded-lg shadow-sm hover:-translate-y-1 group hover:shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-3 rounded-lg bg-primary/10">
              <LuUsers className="transition-all duration-300 text-primary size-6 group-hover:scale-110" />
            </div>
            <p className="text-gray-500 text-md">Total Clubs</p>
          </div>
          <p className="px-2 text-xl font-medium text-gray-700">
            {clubs.length} Clubs
          </p>
        </div>

        <div className="inline-block px-8 py-6 transition-all duration-300 border border-gray-200 rounded-lg shadow-sm hover:-translate-y-1 group hover:shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-3 rounded-lg bg-green-500/10">
              <FiUser className="text-green-500 transition-all duration-300 size-6 group-hover:scale-110" />
            </div>
            <p className="text-gray-500 text-md">Total Users</p>
          </div>
          <p className="px-2 text-xl font-medium text-gray-700">
            {users.length} Users
          </p>
        </div>

        <div className="inline-block px-8 py-6 transition-all duration-300 border border-gray-200 rounded-lg shadow-sm hover:-translate-y-1 group hover:shadow-md">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <MdEvent className="text-purple-500 transition-all duration-300 size-6 group-hover:scale-110" />
            </div>
            <p className="text-gray-500 text-md">Total Events</p>
          </div>
          <p className="px-2 text-xl font-medium text-gray-700">
            {events.length} Events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {displayClubs.length > 0 && (
          <div className="flex flex-col h-full py-3 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="px-5 py-4 mb-4 text-lg font-medium text-gray-800">
              Recently Created Clubs
            </h3>
            <div className="max-sm:text-sm">
              <div className="grid grid-cols-[2.5fr_2fr_1.5fr] text-xs uppercase mb-2 text-gray-500 font-medium  bg-gray-100/70 py-3 px-5">
                <p className="">Club Name</p>
                <p className="">Club Creator</p>
                <p className="text-center ">No.of Members</p>
              </div>
              <div className="divide-y divide-gray-300 ">
                {displayClubs.map((club) => (
                  <ClubRow key={club._id} club={club} />
                ))}
              </div>
            </div>
          </div>
        )}

        {displayEvents.length > 0 && (
          <div className="flex flex-col h-full py-3 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="px-5 py-4 mb-4 text-lg font-medium text-gray-800">
              Recent Events
            </h3>
            <div className="max-sm:text-sm">
              <div className="px-5 grid grid-cols-[2fr_2fr_1fr] text-xs uppercase max-sm:grid-cols-[1.5fr_1.5fr_1fr] mb-2 bg-gray-100/70 text-gray-500 font-medium py-3">
                <p className="">Event</p>
                <p className="">Club</p>
                <p className="text-center">Attendees</p>
              </div>
              <div className="divide-y divide-gray-300">
                {displayEvents.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ClubRow = ({ club }) => (
  <div className="px-5 py-2">
    <div className="grid grid-cols-[2.5fr_2fr_1.5fr] py-2">
      <p className="font-medium">{club.name}</p>
      <p className="text-gray-500">{club.createdBy.name}</p>
      <p className="px-3 py-0.5 text-center text-blue-700 rounded-full place-self-center text-sm font-medium w-fit bg-primary/10">
        {club.members.length}
      </p>
    </div>
  </div>
);

const EventRow = ({ event }) => (
  <div className="px-5 py-2">
    <div className="grid grid-cols-[2fr_2fr_1fr] max-sm:grid-cols-[1.5fr_1.5fr_1fr] py-2">
      <p className="font-medium truncate">{event.title}</p>
      <p className="text-gray-500 truncate">{event.club.name}</p>
      <p className="px-3 py-0.5 text-sm text-center text-green-700 rounded-full bg-green-500/10 w-fit font-medium place-self-center">
        {event.attendees.length}
      </p>
    </div>
  </div>
);

export default AdminDashboard;
