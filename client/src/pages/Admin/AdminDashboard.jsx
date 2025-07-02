import { useEffect, useMemo, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { MdEvent } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { fetchAllClubs, fetchAllEvents, fetchAllUsers } from "./adminHelper";

function AdminDashboard() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [clubsData, eventsData, usersData] = await Promise.all([
        fetchAllClubs(),
        fetchAllEvents(),
        fetchAllUsers(),
      ]);

      if (clubsData) setClubs(clubsData);
      if (eventsData) setEvents(eventsData);
      if (usersData) setUsers(usersData);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-10 px-8 py-8 max-sm:py-16 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
        <div className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50/80 hover:shadow-lg">
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
        <div className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50/80 hover:shadow-lg">
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
        <div className="inline-block px-8 py-6 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50/80 hover:shadow-lg">
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
    </div>
  );
}

export default AdminDashboard;
