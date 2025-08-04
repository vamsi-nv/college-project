import { useEffect, useState } from "react";
import { fetchAllClubs } from "./adminHelper";
import { PiUsers, PiUsersThreeThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import { LuUsers } from "react-icons/lu";

function AdminClubsPage() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      const clubs = await fetchAllClubs();
      if (clubs) {
        setClubs(clubs);
      }
    };

    fetchClubs();
  }, []);

  if (clubs.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg text-gray-500">No clubs yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-12 py-16 md:p-8 lg:p-10 max-sm:px-2">
      <div className="overflow-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full shadow-sm lg:w-full">
          <thead className="w-full">
            <tr className="border-b  bg-gray-100/70 border-gray-300 grid grid-cols-[0.4fr_2fr_2fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr] py-5 px-2">
              <th className="text-sm font-medium text-center text-gray-500 uppercase">
                #
              </th>
              <th className="text-sm font-medium text-left text-gray-500 uppercase">
                Club
              </th>
              <th className="text-sm font-medium text-left text-gray-500 uppercase">
                Created by
              </th>
              <th className="text-sm font-medium text-center text-gray-500 uppercase ">
                No.of Members
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {clubs.map((club, index) => (
              <tr
                key={club._id}
                className="grid grid-cols-[0.4fr_2fr_2fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr] py-4 px-2 max-sm:text-sm"
              >
                <td className="flex items-center justify-center text-gray-600">
                  {index + 1}
                </td>
                <td className="flex items-center justify-start gap-2">
                  {club.coverImage ? (
                    <img
                      src={club.coverImage}
                      alt="Club Cover"
                      className="hidden object-cover w-12 h-auto border-none rounded-full aspect-square lg:block"
                    />
                  ) : (
                    <PiUsersThreeThin
                      fill="white"
                      className="hidden p-1 font-light text-white bg-gray-300 rounded-full fill-white stroke-5 size-12 lg:block"
                    />
                  )}
                  <p className="max-w-[26ch] text-gray-700 font-medium hover:underline">
                    <Link to={`/clubs/${club._id}`}>{club.name}</Link>
                  </p>
                </td>
                <td className="text-gray-600">
                  <p>{club.createdBy.name}</p>
                </td>
                <td className="flex items-center justify-center ">
                  <p className="flex items-center gap-1 px-2.5 py-1 text-sm text-blue-700 rounded-full bg-primary/20">
                    <PiUsers />
                    <span>{club.members.length}</span>
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminClubsPage;
