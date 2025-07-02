import { useEffect, useState } from "react";
import { fetchAllClubs, handleDeleteClub } from "./adminHelper";
import { PiUsersThreeThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";

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

  return (
    <div className="w-full h-full px-12 py-16 md:p-8 lg:p-10 max-sm:px-6">
      <div className="grid grid-cols-1 grid-rows-1 gap-4 md:hidden">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="flex items-center justify-between gap-2 px-4 py-2 border border-gray-200 rounded-lg shadow hover:shadow-lg hover:bg-gray-50/80 min-h-[128px]"
          >
            <div className="">
              {club.coverImage ? (
                <img
                  src={club.coverImage}
                  alt="Club Cover"
                  className="object-cover h-auto border-none rounded-full w-14 aspect-square"
                />
              ) : (
                <PiUsersThreeThin className="font-light text-gray-400 size-14 max-sm:size-8" />
              )}
            </div>
            <div className="flex flex-col items-start flex-1 p-4">
              <Link to={`/clubs/${club._id}`}>
                <h4 className="text-base font-medium text-gray-700 max-sm:text-sm hover:underline">
                  {club.name}
                </h4>
              </Link>
              <p className="text-sm text-gray-500 max-sm:text-xs">
                {club.members.length} members
              </p>
            </div>
            <span
              title="Delete Club"
              className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 text-md"
              onClick={() => handleDeleteClub(club._id)}
            >
              <LuTrash2 />
            </span>
          </div>
        ))}
      </div>

      <table className=" max-md:hidden w-full lg:w-[90%] l rounded shadow-[0_0_0px] shadow-gray-500">
        <thead className="w-full">
          <tr className="border-b bg-primary/10 border-dashed border-gray-500 grid grid-cols-[0.5fr_2fr_1fr_1fr_0.5fr] py-5 max-md:text-sm">
            <th className="font-medium text-center text-gray-900">#</th>
            <th className="font-medium text-left text-gray-900">Club</th>
            <th className="font-medium text-left text-gray-900">Created by</th>
            <th className="font-medium text-left text-gray-900">
              No.of Members
            </th>
            <th className="font-medium text-center text-gray-900">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 divide-dashed">
          {clubs.map((club, index) => (
            <tr className="grid grid-cols-[0.5fr_2fr_1fr_1fr_0.5fr] py-4 max-md:text-sm">
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
                <p className="max-w-[26ch]">{club.name}</p>
              </td>
              <td className="flex items-center justify-start">
                {club.createdBy.name}
              </td>
              <td className="flex items-center justify-start">
                {club.members.length} members
              </td>
              <td className="flex items-center justify-center">
                <span
                  title="Delete Club"
                  className="text-center rounded-full cursor-pointer hover:bg-red-500/10 hover:text-red-500 text-md"
                  onClick={() => handleDeleteClub(club._id)}
                >
                  <LuTrash2 />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminClubsPage;
