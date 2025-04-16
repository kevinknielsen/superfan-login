import { X } from "lucide-react";
import QRCode from "react-qr-code";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

interface DepositOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function DepositOverlay({ isOpen, onClose, walletAddress }: DepositOverlayProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Deposit</h2>
        <p className="text-sm text-gray-600 mb-6">
          to your Superfan wallet
        </p>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">1</span>
            </div>
            <p className="text-sm font-medium">Fund USDC on Base</p>
          </div>
          <p className="text-xs text-gray-600 ml-8">
            You need to bridge to Base to use Superfan One
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <QRCode value={walletAddress} size={200} />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
          <div className="flex-grow font-mono text-sm truncate">
            {walletAddress}
          </div>
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-500" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}