import { useState } from "react";
import EmbeddedWallets from "./EmbeddedWallets";
import SmartWallets from "./SmartWallets";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<"embedded" | "smart">("embedded");

  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex border-b border-gray-200">
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
        <div className="mt-4">
          {activeTab === "embedded" ? <EmbeddedWallets /> : <SmartWallets />}
        </div>
      </div>
    </div>
  );
}
