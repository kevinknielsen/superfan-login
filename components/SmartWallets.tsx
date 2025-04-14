import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { base, baseSepolia } from "viem/chains";
import SmartSignMessage from "./SmartSignMessage";
import SmartUSDCTransaction from "./SmartUSDCTransaction";
import SmartWalletInfo from "./SmartWalletInfo";

/**
 * SmartWallets Component
 *
 * This is the main component for managing smart wallet operations.
 * It provides:
 * 1. Chain switching functionality between Base and Base Sepolia
 * 2. Smart wallet information display
 * 3. Message signing capabilities
 * 4. USDC transaction capabilities
 */
export default function SmartWallets() {
  // Hooks for accessing Privy and smart wallet functionality
  const { user } = usePrivy();
  const { client } = useSmartWallets();

  // State management
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [smartWalletAddress, setSmartWalletAddress] = useState<
    string | undefined
  >();
  const [currentChainId, setCurrentChainId] = useState<string | undefined>();

  /**
   * Handles copying wallet addresses to clipboard
   * Shows a temporary success indicator
   */
  const copyToClipboard = useCallback(
    async (text: string, walletType: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(walletType);
      setTimeout(() => setCopiedWallet(null), 2000);
    },
    []
  );

  /**
   * Effect to set the smart wallet address when the user is available
   * Finds the smart wallet account from the user's linked accounts
   */
  useEffect(() => {
    if (!user) return;
    console.log("linkedAccounts", user.linkedAccounts);
    const smartWallet = user.linkedAccounts.find(
      (account) => account.type === "smart_wallet"
    );
    if (smartWallet) {
      setSmartWalletAddress(smartWallet.address);
    }
  }, [user]);

  /**
   * Handles switching between Base and Base Sepolia chains
   * Updates the current chain ID state after switching
   */
  const handleSwitchChain = async () => {
    if (client) {
      const chainId = await client.getChainId();
      console.log("current chainId", chainId);
      const targetChain =
        chainId.toString() === base.id.toString() ? baseSepolia.id : base.id;
      console.log("switching to chain ID:", targetChain);
      await client.switchChain({ id: targetChain });
      const newChainId = await client.getChainId();
      setCurrentChainId(newChainId.toString());
    }
  };

  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col gap-4 w-full">
        {/* Chain selection and wallet info section */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Chain selector with Base logo */}
            <div className="flex flex-row items-center gap-1 bg-gray-200 p-1 rounded-lg text-xs text-gray-800 font-medium">
              Connected to{" "}
              <div
                className="flex flex-row gap-1 bg-white text-gray-800 p-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleSwitchChain}
              >
                <Image
                  src="/images/base-logo.png"
                  alt="base"
                  width={16}
                  height={16}
                />
                {currentChainId === baseSepolia.id.toString()
                  ? "Base Sepolia"
                  : "Base"}
              </div>
            </div>
          </div>
          {/* Smart wallet information display */}
          <SmartWalletInfo
            smartWalletAddress={smartWalletAddress}
            chainId={currentChainId}
            copiedWallet={copiedWallet}
            onCopyWallet={copyToClipboard}
          />
        </div>
        {/* Smart wallet operations section */}
        <div className="text-lg font-semibold">Smart Wallet Operations</div>
        {/* Message signing component */}
        <SmartSignMessage />
        <div className="h-px bg-gray-200 my-4"></div>
        {/* USDC transaction component */}
        <SmartUSDCTransaction
          chainId={currentChainId}
          smartWalletAddress={smartWalletAddress}
        />
      </div>
    </div>
  );
}
