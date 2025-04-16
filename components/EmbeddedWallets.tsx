import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { base, baseSepolia } from "viem/chains";
import SignMessage from "./SignMessage";
import USDCTransaction from "./USDCTransaction";
import WalletInfo from "./WalletInfo";
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";

/**
 * EmbeddedWallets Component
 *
 * This is the main component for managing embedded wallet operations.
 * It provides:
 * 1. Chain switching functionality between Base and Base Sepolia
 * 2. Embedded wallet information display
 * 3. Message signing capabilities
 * 4. USDC transaction capabilities
 */
export default function EmbeddedWallets() {
  // Hooks for accessing wallet functionality
  const { wallets } = useWallets();

  // State management
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [embeddedWallet, setEmbeddedWallet] = useState<
    ConnectedWallet | undefined
  >();
  const [hasSignedMessage, setHasSignedMessage] = useState(false);

  // Callback for when message is signed
  const onMessageSigned = useCallback(() => {
    setHasSignedMessage(true);
  }, []);

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
   * Effect to set the embedded wallet when available
   * Finds the embedded wallet from the list of connected wallets
   */
  useEffect(() => {
    const embeddedWallet = wallets.find(
      (wallet) => wallet.connectorType === "embedded"
    );
    if (embeddedWallet) {
      setEmbeddedWallet(embeddedWallet);
    }
  }, [wallets]);

  // Get the current chain ID from the embedded wallet
  const currentChainId = embeddedWallet?.chainId
    .replace("eip155:", "")
    .toString();

  // Get wallet balance to check if user has funds
  const { data: embeddedUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address:
      currentChainId === baseSepolia.id.toString()
        ? BASE_SEPOLIA_USDC_ADDRESS
        : BASE_USDC_ADDRESS,
    functionName: "balanceOf",
    chainId: currentChainId === baseSepolia.id.toString() ? baseSepolia.id : base.id,
    args: [embeddedWallet?.address as `0x${string}`],
  });

  // Check if user has completed all required steps
  const hasBalance = embeddedUsdcBalance ? Number(formatUnits(embeddedUsdcBalance, 6)) > 0 : false;
  const canContinue = hasSignedMessage && hasBalance;

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
                onClick={async () => {
                  console.log("trying to switch chain");

                  if (embeddedWallet) {
                    const targetChain =
                      currentChainId === base.id.toString()
                        ? baseSepolia.id
                        : base.id;
                    console.log("switching to chain ID:", targetChain);
                    await embeddedWallet.switchChain(targetChain);
                    console.log("successfully switched chain");
                  } else {
                    console.error("no embedded wallet found");
                  }
                }}
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
          {/* Embedded wallet information display */}
          <WalletInfo
            embeddedWalletAddress={embeddedWallet?.address}
            chainId={currentChainId}
            copiedWallet={copiedWallet}
            onCopyWallet={copyToClipboard}
          />
        </div>
        {/* Embedded wallet operations section */}
        <div className="text-lg font-semibold">Onboarding Steps</div>
        {/* Message signing component */}
        <SignMessage onMessageSigned={onMessageSigned} />
        <div className="h-px bg-gray-200 my-4"></div>
        {/* USDC transaction component */}
        <USDCTransaction
          chainId={currentChainId}
          embeddedWalletAddress={embeddedWallet?.address}
        />

        {/* Continue Button */}
        <div className="mt-8">
          <button
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
              canContinue
                ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!canContinue}
            onClick={() => {
              if (canContinue) {
                window.location.href = 'https://app.superfan.one/';
              }
            }}
          >
            {canContinue ? "Continue to App" : "Complete Required Steps to Continue"}
          </button>
          {!canContinue && (
            <div className="mt-2 text-sm text-gray-600">
              {!hasSignedMessage && !hasBalance && "Please sign the message and add funds to continue"}
              {!hasSignedMessage && hasBalance && "Please sign the message to continue"}
              {hasSignedMessage && !hasBalance && "Please add funds to continue"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
