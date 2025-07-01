import { useEffect, useState } from "react";
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
    <div className="w-full h-full p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  md:gap-10">
        <div className="hover:bg-gray-50/80 hover:shadow-lg inline-block shadow-md border border-gray-200 rounded-lg py-6 px-8">
          <div className="flex items-center gap-1 mb-2">
            <LuUsers className="text-primary size-6" />
            <p className="text-gray-500 text-lg">Total Clubs</p>
          </div>
          <p className="text-2xl text-gray-800 font-medium">
            {clubs.length} Clubs
          </p>
        </div>
        <div className="hover:bg-gray-50/80 hover:shadow-lg inline-block shadow-md border border-gray-200 rounded-lg py-6 px-8">
          <div className="flex items-center gap-1 mb-2">
            <MdEvent className="text-primary size-6" />
            <p className="text-gray-500 text-lg">Total Events</p>
          </div>
          <p className="text-2xl text-gray-800 font-medium">
            {events.length} Events
          </p>
        </div>
        <div className="hover:bg-gray-50/80 hover:shadow-lg inline-block shadow-md border border-gray-200 rounded-lg py-6 px-8">
          <div className="flex items-center gap-1 mb-2">
            <FiUser className="text-primary size-6" />
            <p className="text-gray-500 text-lg">Total Users</p>
          </div>
          <p className="text-2xl text-gray-800 font-medium">
            {users.length} Users
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
