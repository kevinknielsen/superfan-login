import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";
import { CheckIcon, CopyIcon } from "lucide-react";
import { erc20Abi, formatEther, formatUnits } from "viem";
import { base, baseSepolia } from "viem/chains";
import { useBalance, useReadContract } from "wagmi";

interface WalletInfoProps {
  embeddedWalletAddress: string | undefined;
  chainId: string | undefined;
  copiedWallet: string | null;
  onCopyWallet: (address: string, type: string) => void;
}

export default function WalletInfo({
  embeddedWalletAddress,
  chainId,
  copiedWallet,
  onCopyWallet,
}: WalletInfoProps) {
  const { data: embeddedEthBalance } = useBalance({
    address: embeddedWalletAddress as `0x${string}`,
    chainId: chainId === baseSepolia.id.toString() ? baseSepolia.id : base.id,
  });

  const { data: embeddedUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address:
      chainId === baseSepolia.id.toString()
        ? BASE_SEPOLIA_USDC_ADDRESS
        : BASE_USDC_ADDRESS,
    functionName: "balanceOf",
    chainId: chainId === baseSepolia.id.toString() ? baseSepolia.id : base.id,
    args: [embeddedWalletAddress as `0x${string}`],
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Embedded Wallet
            </label>
            <div className="relative">
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md">
                {embeddedWalletAddress}
              </div>
              <button
                onClick={() =>
                  onCopyWallet(embeddedWalletAddress || "", "embedded")
                }
                className="absolute right-2 top-2"
              >
                {copiedWallet === "embedded" ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="text-xs mt-1">
          <span className="font-semibold">Balance:</span>
          {embeddedEthBalance &&
            ` ${formatEther(embeddedEthBalance.value)} ETH`}
          {embeddedUsdcBalance !== undefined &&
            `, ${formatUnits(embeddedUsdcBalance, 6)} USDC`}
        </div>
        {chainId === baseSepolia.id.toString() && (
          <div className="text-xs mt-1">
            <a
              href="https://faucet.circle.com/"
              target="_blank"
              className="text-blue-500 hover:text-blue-600 transition-colors underline"
            >
              USDC Sepolia Faucet
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
