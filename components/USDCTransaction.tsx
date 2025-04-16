import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";
import { erc20Abi } from "viem";
import { base, baseSepolia } from "viem/chains";
import { useReadContract } from "wagmi";

/**
 * Props interface for the USDCTransaction component
 * @param chainId - The current chain ID (e.g., "84532" for Base Sepolia)
 * @param embeddedWalletAddress - The address of the embedded wallet
 */
interface USDCTransactionProps {
  chainId: string | undefined;
  embeddedWalletAddress: string | undefined;
}

/**
 * USDCTransaction Component
 *
 * This component allows users to send USDC tokens using their embedded wallet.
 * It provides functionality for:
 * 1. Checking the embedded wallet's USDC balance
 * 2. Sending USDC to a recipient address
 * 3. Handling transaction states and errors
 * 4. Waiting for transaction confirmation
 */
export default function USDCTransaction({
  chainId,
  embeddedWalletAddress,
}: USDCTransactionProps) {
  // Read the embedded wallet's USDC balance using the ERC20 contract
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
      {/* UI temporarily disabled */}
    </div>
  );
}
