import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { api_paths } from "../utils/apiPaths";
import { useEffect } from "react";
import EventCard from "../components/EventCard";
import AnnouncementCard from "../components/AnnouncementCard";

function Home() {
  const [currentTab, setCurrentTab] = useState("For You");
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [feed, setFeed] = useState([]);
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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(
        api_paths.announcements.get_user_club_announcements
      );
      const data = response.data;
      if (data.success) {
        setAnnouncements(data.announcements);
      } else {
        setError("No announcements found");
      }
    } catch (error) {
      setError(error.response.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab === "Events") {
      fetchEvents();
    }

    if (currentTab === "Announcements") {
      fetchAnnouncements();
    }

    if (currentTab === "For You") {
      if (events.length === 0) fetchEvents();
      if (announcements.length === 0) fetchAnnouncements();
    }
  }, [currentTab]);

  useEffect(() => {
    if (events.length || announcements.length) {
      const eventItems = events.map((e) => ({ ...e, type: "event" }));
      const announcementItems = announcements.map((a) => ({
        ...a,
        type: "announcement",
      }));

      const mergedFeed = [...eventItems, ...announcementItems].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFeed(mergedFeed);
    }
  }, [events, announcements]);

  return (
    <div className="h-full max-w-full ">
      <div className="sticky flex items-center justify-around w-full sm:pt-4 pt-[50px] overflow-x-scroll border-b border-gray-300">
        {tabItems.map((tabItem) => (
          <button
            key={tabItem.label}
            title={tabItem.label}
            onClick={() => setCurrentTab(tabItem.label)}
            className={`tab-label ${
              currentTab === tabItem.label ? "tab-selected" : "tab-not-selected"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {currentTab === "For You" && (
        <div className="">
          {feed.map((item) =>
            item.type === "event" ? (
              <EventCard key={item._id} event={item} />
            ) : (
              <AnnouncementCard
                key={item._id}
                announcement={item}
                fetchAnnouncements={fetchAnnouncements}
              />
            )
          )}
        </div>
      )}

      {currentTab === "Events" && (
        <div className="">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {currentTab === "Announcements" && (
        <div className="">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              fetchAnnouncements={fetchAnnouncements}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
