import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchAllEvents } from "./adminHelper";
import { PiExport, PiUsersThin } from "react-icons/pi";
import { Link } from "react-router-dom";

const AttendeeCount = ({ count }) => (
  <p className="flex items-center gap-1 px-2.5 py-1 text-sm text-green-700 rounded-full bg-green-500/10">
    <PiUsersThin className="stroke-2 size-4" />
    <span>{count}</span>
  </p>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const EventRow = ({ event, index }) => (
  <tr className="grid grid-cols-[0.4fr_2fr_1.5fr_1fr_1fr] sm:grid-cols-[0.5fr_2fr_1.5fr_1fr_1fr] py-4 px-2 max-sm:text-sm">
    <td className="flex items-center justify-center text-gray-600">
      {index + 1}
    </td>
    <td className="flex items-center justify-start gap-2">
      <p className="max-w-[26ch] text-gray-700 font-medium hover:underline">
        <Link to={`/clubs/${event.clubName}/events/${event._id}`}>
          {event.title}
        </Link>
      </p>
    </td>
    <td className="text-gray-600">
      <p>{event.club?.name || "No Club"}</p>
    </td>
    <td className="text-gray-600">
      <p>{formatDate(event.date)}</p>
    </td>
    <td className="flex items-center justify-center">
      <AttendeeCount count={event.attendees?.length || 0} />
    </td>
  </tr>
);

const TableHeader = () => (
  <thead className="w-full">
    <tr className="border-b bg-gray-100/70 border-gray-300 grid grid-cols-[0.4fr_2fr_1.5fr_1fr_1fr] sm:grid-cols-[0.5fr_2fr_1.5fr_1fr_1fr] py-5 px-2">
      <th className="text-sm font-medium text-center text-gray-500 uppercase max-sm:text-xs">
        #
      </th>
      <th className="text-sm font-medium text-left text-gray-500 uppercase max-sm:text-xs">
        Event
      </th>
      <th className="text-sm font-medium text-left text-gray-500 uppercase max-sm:text-xs">
        Club
      </th>
      <th className="text-sm font-medium text-left text-gray-500 uppercase max-sm:text-xs">
        Date
      </th>
      <th className="text-sm font-medium text-center text-gray-500 uppercase max-sm:text-xs">
        Attendees
      </th>
    </tr>
  </thead>
);

function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const eventsData = await fetchAllEvents();

      if (eventsData) {
        setEvents(eventsData);
      }
    } catch (err) {
      setError("Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const convertToCSV = (events) => {
    if (!events.length) return "";
    const header = ["S.No", "Event", "Club", "Date", "Location", "Attendees"];
    const rows = events.map((event, index) => [
      index + 1,
      event.title,
      event.club?.name ?? "No Club",
      formatDate(event.date),
      event.location ?? "Not specified",
      event.attendees?.length ?? 0,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell)}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const handleExportCSV = () => {
    const csv = convertToCSV(events);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "events_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventRows = useMemo(
    () =>
      events.map((event, index) => (
        <EventRow key={event._id} event={event} index={index} />
      )),
    [events]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg text-gray-500">Loading events...</p>
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

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg text-gray-500">No events yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-12 py-16 md:p-8 lg:p-10 max-sm:px-2">
      <div className="flex items-center justify-between w-full px-10 mb-10 max-sm:px-1 max-sm:mb-8">
        <h3 className="text-xl font-semibold text-gray-700 max-sm:text-lg">
          Existing Events
        </h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold transition-all duration-300 rounded-md max-sm:ring-0 text-primary ring-1 hover:bg-primary/10 ring-primary"
        >
          <PiExport className="stroke-2 size-5" />
        </button>
      </div>
      <div className="overflow-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full shadow-sm lg:w-full">
          <TableHeader />
          <tbody className="divide-y divide-gray-300">{eventRows}</tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEventsPage;
