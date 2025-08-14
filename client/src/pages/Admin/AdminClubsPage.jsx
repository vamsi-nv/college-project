import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchAllClubs } from "./adminHelper";
import { PiExport, PiUsers, PiUsersThreeThin } from "react-icons/pi";
import { Link } from "react-router-dom";

const ClubImage = ({ coverImage, clubName }) => {
  if (coverImage) {
    return (
      <img
        src={coverImage}
        alt={`${clubName} Cover`}
        className="hidden object-cover w-12 h-auto border-none rounded-full aspect-square lg:block"
        loading="lazy"
      />
    );
  }
  return (
    <PiUsersThreeThin
      fill="white"
      className="hidden p-1 font-light text-white bg-gray-300 rounded-full fill-white stroke-5 size-12 lg:block"
    />
  );
};

const MemberCount = ({ count }) => (
  <p className="flex items-center gap-1 px-2.5 py-1 text-sm text-green-700 rounded-full bg-green-500/10">
    <PiUsers className="stroke-2 size-4" />
    <span>{count}</span>
  </p>
);

const ClubRow = ({ club, index }) => (
  <tr className="grid grid-cols-[0.4fr_2fr_2fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr] py-4 px-2 max-sm:text-sm">
    <td className="flex items-center justify-center text-gray-600">
      {index + 1}
    </td>
    <td className="flex items-center justify-start gap-2">
      <ClubImage coverImage={club.coverImage} clubName={club.name} />
      <p className="max-w-[26ch] text-gray-700 font-medium hover:underline">
        <Link to={`/clubs/${club._id}`}>{club.name}</Link>
      </p>
    </td>
    <td className="text-gray-600">
      <p>{club.createdBy.name}</p>
    </td>
    <td className="flex items-center justify-center">
      <MemberCount count={club.members.length} />
    </td>
  </tr>
);

const TableHeader = () => (
  <thead className="w-full">
    <tr className="border-b bg-gray-100/70 border-gray-300 grid grid-cols-[0.4fr_2fr_2fr_1fr] sm:grid-cols-[0.5fr_2fr_1fr_1fr] py-5 px-2">
      <th className="text-sm font-medium text-center text-gray-500 uppercase max-sm:text-xs">
        #
      </th>
      <th className="text-sm font-medium text-left text-gray-500 uppercase max-sm:text-xs">
        Club
      </th>
      <th className="text-sm font-medium text-left text-gray-500 uppercase max-sm:text-xs">
        Created by
      </th>
      <th className="text-sm font-medium text-center text-gray-500 uppercase max-sm:text-xs">
        No.of Members
      </th>
    </tr>
  </thead>
);

function AdminClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const clubsData = await fetchAllClubs();

      if (clubsData) {
        setClubs(clubsData);
      }
    } catch (err) {
      setError("Failed to fetch clubs");
      console.error("Error fetching clubs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const convertToCSV = (clubs) => {
    if (!clubs.length) return "";
    const header = ["S.No", "Club", "Created By", "No.of Members"];
    const rows = clubs.map((club, index) => [
      index + 1,
      club.name,
      club.createdBy?.name ?? "Unknown",
      club.members?.length ?? 0,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell)}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const handleExportCSV = () => {
    const csv = convertToCSV(clubs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clubs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const clubRows = useMemo(
    () =>
      clubs.map((club, index) => (
        <ClubRow key={club._id} club={club} index={index} />
      )),
    [clubs]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg text-gray-500">Loading clubs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg text-gray-500">No clubs yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-12 py-16 md:p-8 lg:p-10 max-sm:px-2">
      <div className="flex items-center justify-between w-full px-10 max-sm:px-1 max-sm:mb-8 mb-10">
        <h3 className="text-xl font-semibold text-gray-700 max-sm:text-lg">Existing Clubs</h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 px-3 max-sm:ring-0 py-2 text-xs font-semibold transition-all duration-300 rounded-md text-primary ring-1 hover:bg-primary/10 ring-primary"
        >
          <PiExport className="stroke-2 size-5" /> 
        </button>
      </div>
      <div className="overflow-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full shadow-sm lg:w-full">
          <TableHeader />
          <tbody className="divide-y divide-gray-300">{clubRows}</tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminClubsPage;
