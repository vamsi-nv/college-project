import { useEffect, useMemo, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { MdEvent } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { fetchAllClubs, fetchAllEvents, fetchAllUsers } from "./adminHelper";

function AdminDashboard() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortedClubs, setSortedClubs] = useState([]);
  const [sortedEvents, setSortedEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [clubsData, eventsData, usersData] = await Promise.all([
        fetchAllClubs(),
        fetchAllEvents(),
        fetchAllUsers(),
      ]);

      if (clubsData) {
        setClubs(clubsData);
        const sortedClubs = [...clubsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSortedClubs(sortedClubs);
      }
      if (eventsData) {
        setEvents(eventsData);
        const sortedEvents = [...eventsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSortedEvents(sortedEvents);
      }
      if (usersData) setUsers(usersData);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-10 px-4 py-8 max-sm:py-16 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
        <div className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md hover:outline-2 hover:outline-primary hover:bg-gray-50/80 hover:shadow-lg">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <LuUsers className="text-primary size-6 " />
            </div>
            <p className="text-gray-500 text-md">Total Clubs</p>
          </div>
          <p className="px-2 text-xl font-medium text-gray-700">
            {clubs.length} Clubs
          </p>
        </div>
        <div className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md hover:outline-2 hover:outline-primary hover:bg-gray-50/80 hover:shadow-lg">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <FiUser className="text-primary size-6 " />
            </div>
            <p className="text-gray-500 text-md">Total Users</p>
          </div>
          <p className="px-2 text-xl font-medium text-gray-700">
            {users.length} Users
          </p>
        </div>
        <div className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md hover:outline-2 hover:outline-primary hover:bg-gray-50/80 hover:shadow-lg">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <MdEvent className="text-primary size-6 " />
            </div>
            <p className="text-gray-500 text-md">Total Events</p>
          </div>
          <p className="px-2 text-xl font-medium text-gray-700">
            {events.length} Events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col h-full px-5 py-3 border border-gray-200 rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            Recently Created Clubs
          </h3>
          <div className="max-sm:text-sm">
            <div className="grid grid-cols-[2.5fr_2fr_1.5fr] border-b border-dashed mb-2 bg-primary/10 p-2">
              <p className="font-medium">Club Name</p>
              <p className="font-medium">Club Creator</p>
              <p className="font-medium text-center">No.of Members</p>
            </div>
            <div className="p-2 divide-y divide-gray-300 divide-dashed">
              {sortedClubs.slice(0, 8).map((club) => (
                <div key={club._id}>
                  <div className="grid grid-cols-[2.5fr_2fr_1.5fr] py-2 ">
                    <p>{club.name}</p>
                    <p className="">{club.createdBy.name}</p>
                    <p className="text-center">{club.members.length}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full px-5 py-3 border border-gray-200 rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            Recent Events
          </h3>
          {/* <div className="max-sm:text-xs">
            <div className="grid grid-cols-[2fr_2fr_0.5fr] border-b border-dashed mb-2 bg-primary/10 p-2">
              <p className="font-medium">Event</p>
              <p className="font-medium">Club</p>
              <p className="font-medium">Attendees</p>
            </div>
            <div className="p-2 divide-y divide-gray-300 divide-dashed">
              {sortedEvents.slice(0, 8).map((event) => (
                <div key={event._id}>
                  <div className="grid grid-cols-[2fr_2fr_0.5fr] py-2 ">
                    <p className="">{event.title}</p>
                    <p className="">{event.club.name}</p>
                    <p className="w-full text-center">{event.attendees.length}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          <div className="max-sm:text-sm">
            <div className="grid grid-cols-[2fr_2fr_1fr] max-sm:grid-cols-[1.5fr_1.5fr_1fr] border-b border-dashed mb-2 bg-primary/10 p-2">
              <p className="font-medium">Event</p>
              <p className="font-medium">Club</p>
              <p className="font-medium text-center">Attendees</p>
            </div>
            <div className="p-2 divide-y divide-gray-300 divide-dashed">
              {sortedEvents.slice(0, 8).map((event) => (
                <div key={event._id}>
                  <div className="grid grid-cols-[2fr_2fr_1fr] max-sm:grid-cols-[1.5fr_1.5fr_1fr] py-2">
                    <p className="truncate">{event.title}</p>
                    <p className="truncate">{event.club.name}</p>
                    <p className="w-full text-center">
                      {event.attendees.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
