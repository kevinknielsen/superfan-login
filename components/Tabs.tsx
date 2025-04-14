import { useState } from "react";
import EmbeddedWallets from "./EmbeddedWallets";
import SmartWallets from "./SmartWallets";

/**
 * Tabs Component
 *
 * This component provides a tabbed interface to switch between:
 * 1. Embedded Wallets - For basic wallet functionality
 * 2. Smart Wallets - For advanced smart wallet operations
 *
 * It manages the active tab state and renders the appropriate component
 * based on the selected tab.
 */
export default function Tabs() {
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState<"embedded" | "smart">("embedded");

  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col gap-4 w-full">
        {/* Tab navigation bar */}
        <div className="flex border-b border-gray-200">
          {/* Embedded Wallets tab button */}
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "embedded"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("embedded")}
          >
            Embedded Wallets
          </button>
          {/* Smart Wallets tab button */}
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "smart"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("smart")}
          >
            Smart Wallets
          </button>
        </div>
        {/* Content area that renders the appropriate component based on active tab */}
        <div className="mt-4">
          {activeTab === "embedded" ? <EmbeddedWallets /> : <SmartWallets />}
        </div>
      </div>
    </div>
  );
}
