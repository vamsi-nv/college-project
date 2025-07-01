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

  return (
    <div className="w-full h-full p-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {clubs.map((club) => (
          <div className="flex items-center justify-between gap-2 px-8 py-6 border border-gray-200 rounded-lg shadow hover:shadow-lg hover:bg-gray-50/80">
            <div className="">
              {club.coverImage ? (
                <img
                  src={club.coverImage}
                  alt="Club Cover"
                  className="object-cover w-24 h-auto border-none rounded-full aspect-square"
                />
              ) : (
                <PiUsersThreeThin className="mx-auto font-light text-gray-300 size-24" />
              )}
            </div>
            <div className="flex flex-col items-start self-stretch flex-1 p-4">
              <Link to={`/clubs/${club._id}`}>
                <h4 className="text-xl font-medium text-gray-900">
                  {club.name}
                </h4>
              </Link>
              <p className="text-gray-500">{club.members.length} members</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminClubsPage;
