import { useState, useEffect, useCallback, useMemo } from "react";
import EventCard from "../components/EventCard";
import AnnouncementCard from "../components/AnnouncementCard";
import Loader from "../components/Loader";
import HomeService from "../services/homeServices";

const TAB_ITEMS = [
  { label: "For You" },
  { label: "Events" },
  { label: "Announcements" },
];

function Home() {
  const [currentTab, setCurrentTab] = useState("For You");
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState({
    events: false,
    announcements: false,
    forYou: false,
  });

  const feed = useMemo(() => {
    if (events.length === 0 && announcements.length === 0) return [];
    return HomeService.createMergedFeed(events, announcements);
  }, [events, announcements]);

  const handleEventDelete = useCallback((eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event._id !== eventId)
    );
  }, []);

  const handleAnnouncementDelete = useCallback((announcementId) => {
    setAnnouncements((prevAnnouncements) =>
      prevAnnouncements.filter(
        (announcement) => announcement._id !== announcementId
      )
    );
  }, []);

  const handleTogglePin = useCallback((announcementId) => {
    setAnnouncements((prevAnnouncements) =>
      prevAnnouncements.map((a) =>
        a._id === announcementId ? { ...a, pinned: !a.pinned } : a
      )
    );
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedEvents = await HomeService.fetchEvents();
      setEvents(fetchedEvents);
      setFetchedData((prev) => ({ ...prev, events: true }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedAnnouncements = await HomeService.fetchAnnouncements();
      setAnnouncements(fetchedAnnouncements);
      setFetchedData((prev) => ({ ...prev, announcements: true }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const { events: fetchedEvents, announcements: fetchedAnnouncements } =
        await HomeService.fetchAllData();

      setEvents(fetchedEvents);
      setAnnouncements(fetchedAnnouncements);
      setFetchedData((prev) => ({
        ...prev,
        events: true,
        announcements: true,
        forYou: true,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (currentTab === "For You" && !fetchedData.forYou) {
      fetchAllData();
    } else if (currentTab === "Events" && !fetchedData.events) {
      fetchEvents();
    } else if (currentTab === "Announcements" && !fetchedData.announcements) {
      fetchAnnouncements();
    }
  }, [
    currentTab,
    fetchedData,
    loading,
    fetchAllData,
    fetchEvents,
    fetchAnnouncements,
  ]);

  const renderContent = () => {
    switch (currentTab) {
      case "For You":
        return (
          <div className="">
            {feed.map((item) =>
              item.type === "event" ? (
                <EventCard
                  key={`event-${item._id}`}
                  event={item}
                  onDelete={handleEventDelete}
                />
              ) : (
                <AnnouncementCard
                  key={`announcement-${item._id}`}
                  announcement={item}
                  onDelete={handleAnnouncementDelete}
                  onTogglePin={handleTogglePin}
                />
              )
            )}
          </div>
        );

      case "Events":
        return (
          <div className="">
            {events.map((event) => (
              <EventCard
                key={`event-${event._id}`}
                onDelete={handleEventDelete}
                event={event}
              />
            ))}
          </div>
        );

      case "Announcements":
        return (
          <div className="">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={`announcement-${announcement._id}`}
                announcement={announcement}
                onDelete={handleAnnouncementDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="h-full max-w-full">
      <div className="sticky flex items-center justify-around w-full sm:pt-4 pt-[50px] overflow-x-scroll border-b border-gray-300">
        {TAB_ITEMS.map((tabItem) => (
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

      {renderContent()}
    </div>
  );
}

export default Home;
