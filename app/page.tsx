"use client";

import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";
import {
  useLogin,
  usePrivy,
  useSendTransaction,
  useSignMessage,
  useWallets,
} from "@privy-io/react-auth";
import {
  CheckIcon,
  ChevronDown,
  ChevronUp,
  CopyIcon,
  Pen,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  encodeFunctionData,
  erc20Abi,
  formatEther,
  formatUnits,
  parseUnits,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { useBalance, useReadContract } from "wagmi";

export default function Home() {
  const { ready, authenticated, logout, user } = usePrivy();
  const { login } = useLogin();
  const { wallets } = useWallets();

  const embeddedWallet = wallets.find(
    (wallet) => wallet.connectorType === "embedded"
  );

  const chainId = embeddedWallet?.chainId.toString()?.replace("eip155:", "");

  const [message, setMessage] = useState("");
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [signedMessage, setSignedMessage] = useState("");
  const [isSignedMessageExpanded, setIsSignedMessageExpanded] = useState(false);
  const [copiedSignedMessage, setCopiedSignedMessage] = useState(false);
  const [embeddedWalletAddress, setEmbeddedWalletAddress] = useState<
    string | undefined
  >();
  const [usdcAmount, setUsdcAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { signMessage } = useSignMessage();
  const { sendTransaction } = useSendTransaction();

  const [isSendingTransaction, setIsSendingTransaction] = useState(false);

  const handleSendTransaction = async () => {
    setIsSendingTransaction(true);
    try {
      await sendTransaction({
        to:
          chainId === baseSepolia.id.toString()
            ? BASE_SEPOLIA_USDC_ADDRESS
            : BASE_USDC_ADDRESS,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipientAddress as `0x${string}`, parseUnits(usdcAmount, 6)],
        }),
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSendingTransaction(false);
    }
  };

  const copyToClipboard = useCallback(
    async (text: string, walletType: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(walletType);
      setTimeout(() => setCopiedWallet(null), 2000);
    },
    []
  );

  const copySignedMessage = async () => {
    await navigator.clipboard.writeText(signedMessage);
    setCopiedSignedMessage(true);
    setTimeout(() => setCopiedSignedMessage(false), 2000);
  };

  const toggleSignedMessageExpansion = () => {
    setIsSignedMessageExpanded(!isSignedMessageExpanded);
  };

  const handleLogout = () => {
    // Reset all input fields
    setMessage("");
    setUsdcAmount("");
    setRecipientAddress("");
    setSignedMessage("");
    setErrorMessage("");

    // Call the Privy logout function
    logout();
  };

  useEffect(() => {
    if (user?.wallet?.address) {
      setEmbeddedWalletAddress(user.wallet.address);
    }
  }, [user]);

  const { data: embeddedEthBalance } = useBalance({
    address: embeddedWalletAddress as `0x${string}`,
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
    <div className="min-h-screen min-w-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-screen text-black">
        <div className="col-span-2 bg-gray-50 p-12 h-full flex flex-col lg:flex-row items-center justify-center space-y-2">
          <div className="flex flex-col justify-evenly h-full">
            <div className="flex flex-col gap-4">
              <a
                href="https://github.com/builders-garden/privy-advanced-wallets"
                target="_blank"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
              >
                Github Repository
              </a>
              <div className="text-3xl lg:text-6xl font-black">
                Privy Starter
              </div>
              <div className="text-md lg:text-lg">
                This app demonstrates how to use Privy Embedded Wallets to sign
                and execute transactions.
              </div>

              {ready && !authenticated && (
                <button
                  className="bg-black text-white w-fit rounded-md px-4 py-2 hover:bg-gray-800 transition-colors"
                  onClick={() => login()}
                >
                  Start now
                </button>
              )}
              {ready && authenticated && (
                <button
                  className="bg-red-500 text-white w-fit rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="text-sm">with ❤️ by</div>
              <Link
                href="https://builders.garden"
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/bg-logo.svg"
                  alt="logo"
                  width={75}
                  height={75}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white h-full p-12 lg:p-48 flex flex-col lg:flex-row items-center justify-center w-full space-y-4">
          {!user && <div className="lg:w-1/2"></div>}
          {user && (
            <div className="lg:flex lg:flex-row justify-center w-full">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-row items-center gap-1 bg-gray-200 p-1 rounded-lg text-xs text-gray-800 font-medium">
                      Connected to{" "}
                      <div
                        className="flex flex-row gap-1 bg-white text-gray-800 p-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={async () => {
                          if (embeddedWallet) {
                            await embeddedWallet.switchChain(
                              chainId === base.id.toString()
                                ? baseSepolia.id
                                : base.id
                            );
                          }
                        }}
                      >
                        <Image
                          src="/images/base-logo.png"
                          alt="base"
                          width={16}
                          height={16}
                        />
                        {chainId === baseSepolia.id.toString()
                          ? "Base Sepolia"
                          : "Base"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div className="relative flex-grow">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Embedded Wallet
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={user.wallet?.address}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  user.wallet?.address || "",
                                  "embedded"
                                )
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
                          `${formatEther(embeddedEthBalance.value)} ETH`}
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
                </div>
                <div className="text-lg font-semibold">Operations</div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">Sign Message</div>
                  <div className="flex flex-row gap-2 w-full items-center">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter message to sign"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        signMessage({ message }).then((signature) => {
                          setSignedMessage(signature.signature);
                        });
                      }}
                      disabled={!message.trim()}
                    >
                      <Pen className="w-4 h-4" />
                      Sign Message
                    </button>
                  </div>

                  {signedMessage && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold">
                        Signed Message
                      </div>
                      <div className="bg-gray-100 p-2 rounded-md break-all">
                        {isSignedMessageExpanded
                          ? signedMessage
                          : `${signedMessage.slice(0, 50)}...`}
                      </div>
                      <div className="flex flex-row gap-2 mt-1">
                        <button
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                          onClick={copySignedMessage}
                        >
                          {copiedSignedMessage ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <CopyIcon className="w-4 h-4" />
                          )}
                          {copiedSignedMessage
                            ? "Copied!"
                            : "Copy to Clipboard"}
                        </button>
                        <button
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                          onClick={toggleSignedMessageExpansion}
                        >
                          {isSignedMessageExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          {isSignedMessageExpanded ? "Collapse" : "Expand"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold">
                    Send USDC Transaction
                  </div>
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
                      embeddedUsdcBalance === undefined ||
                      embeddedUsdcBalance < parseUnits(usdcAmount, 6)
                    }
                    onClick={handleSendTransaction}
                  >
                    <Send className="w-4 h-4" />
                    {isSendingTransaction ? "Sending..." : "Send USDC"}
                  </button>
                  {embeddedUsdcBalance !== undefined &&
                    parseFloat(usdcAmount) > 0 &&
                    embeddedUsdcBalance < parseUnits(usdcAmount, 6) && (
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
