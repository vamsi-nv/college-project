import { useEffect, useState } from "react";
import { fetchAllClubs } from "./adminHelper";
import { PiUsersThreeThin } from "react-icons/pi";
import { Link } from "react-router-dom";

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
        <p className="text-gray-500 text-lg">No clubs yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-12 py-16 md:p-8 lg:p-10 max-sm:px-2">
      <table className=" w-full lg:w-[90%] l rounded shadow-[0_0_0px] shadow-gray-500">
        <thead className="w-full">
          <tr className="border-b bg-primary/10 border-dashed border-gray-500 grid grid-cols-[0.4fr_2fr_2fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr] py-5 max-sm:text-sm px-2">
            <th className="font-medium text-center text-gray-900">#</th>
            <th className="font-medium text-left text-gray-900">Club</th>
            <th className="font-medium text-left text-gray-900">Created by</th>
            <th className="font-medium text-center text-gray-900 ">
              No.of Members
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 divide-dashed">
          {clubs.map((club, index) => (
            <tr
              key={club._id}
              className="grid grid-cols-[0.4fr_2fr_2fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr] py-4 px-2 max-sm:text-sm"
            >
              <td className="flex items-center justify-center">{index + 1}</td>
              <td className="flex items-center justify-start gap-2">
                {club.coverImage ? (
                  <img
                    src={club.coverImage}
                    alt="Club Cover"
                    className="hidden object-cover w-12 h-auto border-none rounded-full aspect-square lg:block"
                  />
                ) : (
                  <PiUsersThreeThin className="hidden font-light text-gray-400 size-12 lg:block" />
                )}
                <p className="max-w-[26ch] hover:underline">
                  <Link to={`/clubs/${club._id}`}>{club.name}</Link>
                </p>
              </td>
              <td className="">
                <p>{club.createdBy.name}</p>
              </td>
              <td className="text-center">
                <p>{club.members.length}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminClubsPage;
