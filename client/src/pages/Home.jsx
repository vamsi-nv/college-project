import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useEffect } from "react";
import EventCard from "../components/EventCard";

function Home() {
  const [currentTab, setCurrentTab] = useState("For You");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tabItems = [
    {
      label: "For You",
    },
    {
      label: "Events",
    },
    {
      label: "Announcements",
    },
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true), setError("");
      const response = await axiosInstance.get(
        api_paths.events.get_user_club_events
      );
      const data = response.data;

      if (data.success) {
        setEvents(data.events);
      } else {
        setError("No events found");
      }
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab === "Events") {
      fetchEvents();
    }
  }, [currentTab]);

  return (
    <div className=" w-full h-full">
      <div className="sticky pt-12 sm:pt-5 w-full flex items-center justify-around overflow-x-scroll border-b border-gray-200">
        {tabItems.map((tabItem) => (
          <button
            key={tabItem.label}
            onClick={() => setCurrentTab(tabItem.label)}
            className={`tab-label ${
              currentTab === tabItem.label ? "tab-selected" : "tab-not-selected"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {currentTab === "Events" && (
        <div className="">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
