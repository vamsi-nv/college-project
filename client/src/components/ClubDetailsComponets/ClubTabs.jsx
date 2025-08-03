function ClubTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="sticky top-0  border-b border-gray-200 ">
      <div className="flex justify-around overflow-x-auto itms-center">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.label)}
              className={`tab-label ${
                activeTab === tab.label ? "tab-selected" : "tab-not-selected"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ClubTabs;
