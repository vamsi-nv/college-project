import { useState } from "react";

function Home() {
  const [currentTab, setCurrentTab] = useState("For You");

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

  return (
    <div className=" w-full h-full relative">
      <div className="sticky top-5 w-full flex items-center justify-around overflow-x-scroll border-b border-gray-200">
        {tabItems.map((tabItem) => (
          <span
            key={tabItem.label}
            onClick={() => setCurrentTab(tabItem.label)}
            className={`tab-label ${
              currentTab === tabItem.label ? "tab-selected" : "tab-not-selected"
            }`}
          >
            {tabItem.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Home;
