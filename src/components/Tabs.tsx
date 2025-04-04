import { useState } from "react";

interface TabProps {
  tabs: {
    id: string;
    label: string;
    subTabs?: { id: string; label: string }[];
  }[];
  onTabChange: (tabId: string, subTabId?: string) => void;
}

export default function Tabs({ tabs, onTabChange }: TabProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(tabs[0].subTabs?.[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const firstSubTab = tabs.find((tab) => tab.id === tabId)?.subTabs?.[0]?.id;
    setActiveSubTab(firstSubTab);
    onTabChange(tabId, firstSubTab);
  };

  const handleSubTabClick = (subTabId: string) => {
    setActiveSubTab(subTabId);
    onTabChange(activeTab, subTabId);
  };

  return (
    <div className="mt-6 w-full max-w-lg">
      {/* Main Tabs */}
      <div className="flex space-x-4 border-b-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 font-bold ${activeTab === tab.id ? "text-blue-400 border-b-2 border-blue-400" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tabs */}
      {tabs.find((tab) => tab.id === activeTab)?.subTabs && (
        <div className="mt-4 flex space-x-4">
          {tabs
            .find((tab) => tab.id === activeTab)
            ?.subTabs?.map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => handleSubTabClick(subTab.id)}
                className={`px-4 py-2 font-bold ${activeSubTab === subTab.id ? "text-yellow-400 border-b-2 border-yellow-400" : ""}`}
              >
                {subTab.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
