import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { base, baseSepolia } from "viem/chains";
import SmartSignMessage from "./SmartSignMessage";
import SmartUSDCTransaction from "./SmartUSDCTransaction";
import SmartWalletInfo from "./SmartWalletInfo";

export default function SmartWallets() {
  const { user } = usePrivy();
  const { client } = useSmartWallets();
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [smartWalletAddress, setSmartWalletAddress] = useState<
    string | undefined
  >();
  const [currentChainId, setCurrentChainId] = useState<string | undefined>();

  const copyToClipboard = useCallback(
    async (text: string, walletType: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(walletType);
      setTimeout(() => setCopiedWallet(null), 2000);
    },
    []
  );

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
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col sm:flex-row gap-2">
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
          <SmartWalletInfo
            smartWalletAddress={smartWalletAddress}
            chainId={currentChainId}
            copiedWallet={copiedWallet}
            onCopyWallet={copyToClipboard}
          />
        </div>
        <div className="text-lg font-semibold">Smart Wallet Operations</div>
        <SmartSignMessage />
        <div className="h-px bg-gray-200 my-4"></div>
        <SmartUSDCTransaction
          chainId={currentChainId}
          smartWalletAddress={smartWalletAddress}
        />
      </div>
    </div>
  );
}
