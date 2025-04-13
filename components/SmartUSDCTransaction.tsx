import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { Send } from "lucide-react";
import { useState } from "react";
import { encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { base, baseSepolia } from "viem/chains";
import { useReadContract } from "wagmi";

interface SmartUSDCTransactionProps {
  chainId: string | undefined;
  smartWalletAddress: string | undefined;
}

export default function SmartUSDCTransaction({
  chainId,
  smartWalletAddress,
}: SmartUSDCTransactionProps) {
  const [usdcAmount, setUsdcAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSendingTransaction, setIsSendingTransaction] = useState(false);
  const { client } = useSmartWallets();

  const { data: smartWalletUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address:
      chainId === baseSepolia.id.toString()
        ? BASE_SEPOLIA_USDC_ADDRESS
        : BASE_USDC_ADDRESS,
    functionName: "balanceOf",
    chainId: chainId === baseSepolia.id.toString() ? baseSepolia.id : base.id,
    args: [smartWalletAddress as `0x${string}`],
  });

  const handleSendTransaction = async () => {
    if (!client) return;

    setIsSendingTransaction(true);
    try {
      const usdcAddress =
        chainId === baseSepolia.id.toString()
          ? BASE_SEPOLIA_USDC_ADDRESS
          : BASE_USDC_ADDRESS;

      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipientAddress as `0x${string}`, parseUnits(usdcAmount, 6)],
      });

      await client.sendTransaction({
        to: usdcAddress,
        value: BigInt(0),
        data,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSendingTransaction(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold">Send USDC with Smart Wallet</div>
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
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        disabled={
          isSendingTransaction ||
          !usdcAmount ||
          !recipientAddress ||
          !client ||
          smartWalletUsdcBalance === undefined ||
          smartWalletUsdcBalance < parseUnits(usdcAmount, 6)
        }
        onClick={handleSendTransaction}
      >
        <Send className="w-4 h-4" />
        {isSendingTransaction ? "Sending..." : "Send USDC"}
      </button>
      {smartWalletUsdcBalance !== undefined &&
        parseFloat(usdcAmount) > 0 &&
        smartWalletUsdcBalance < parseUnits(usdcAmount, 6) && (
          <div className="text-red-500 text-xs text-center mt-1">
            Insufficient USDC balance
          </div>
        )}
      {errorMessage && (
        <div className="text-red-500 text-xs text-center mt-1">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
