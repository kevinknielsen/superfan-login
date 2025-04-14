import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";
import { useSendTransaction } from "@privy-io/react-auth";
import { Send } from "lucide-react";
import { useState } from "react";
import {
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  http,
  parseUnits,
} from "viem";
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
  // State management for the component
  const [usdcAmount, setUsdcAmount] = useState(""); // Amount of USDC to send
  const [recipientAddress, setRecipientAddress] = useState(""); // Recipient's address
  const [errorMessage, setErrorMessage] = useState(""); // Error message display
  const [isSendingTransaction, setIsSendingTransaction] = useState(false); // Transaction status
  const { sendTransaction } = useSendTransaction(); // Hook for sending transactions

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

  /**
   * Handles the USDC transfer transaction
   * 1. Encodes the transfer function call
   * 2. Sends the transaction using the embedded wallet
   * 3. Waits for transaction confirmation
   * 4. Handles success and error states
   */
  const handleSendTransaction = async () => {
    setIsSendingTransaction(true);
    try {
      // Determine the correct USDC contract address based on the chain
      const usdcAddress =
        chainId === baseSepolia.id.toString()
          ? BASE_SEPOLIA_USDC_ADDRESS
          : BASE_USDC_ADDRESS;

      // Encode the transfer function call
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipientAddress as `0x${string}`, parseUnits(usdcAmount, 6)],
      });

      // Send the transaction and get the transaction hash
      const hash = await sendTransaction({
        to: usdcAddress,
        value: BigInt(0),
        data,
      });

      // Create a public client to wait for transaction confirmation
      const publicClient = createPublicClient({
        chain:
          chainId?.toString() === baseSepolia.id.toString()
            ? baseSepolia
            : base,
        transport: http(),
      });

      // Wait for the transaction to be confirmed
      await publicClient.waitForTransactionReceipt(hash);
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSendingTransaction(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold">
        Send USDC with Embedded Wallet
      </div>
      {/* Input fields for USDC amount and recipient address */}
      <div className="flex flex-row gap-2">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            USDC Amount
          </label>
          <input
            type="number"
            value={usdcAmount}
            onChange={(e) => setUsdcAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* Send USDC button with various disabled states */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        disabled={
          isSendingTransaction ||
          !usdcAmount ||
          !recipientAddress ||
          embeddedUsdcBalance === undefined ||
          embeddedUsdcBalance < parseUnits(usdcAmount, 6)
        }
        onClick={handleSendTransaction}
      >
        <Send className="w-4 h-4" />
        {isSendingTransaction ? "Sending..." : "Send USDC"}
      </button>
      {/* Display insufficient balance warning */}
      {embeddedUsdcBalance !== undefined &&
        parseFloat(usdcAmount) > 0 &&
        embeddedUsdcBalance < parseUnits(usdcAmount, 6) && (
          <div className="text-red-500 text-xs text-center mt-1">
            Insufficient USDC balance
          </div>
        )}
      {/* Display error message if transaction fails */}
      {errorMessage && (
        <div className="text-red-500 text-xs text-center mt-1">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
