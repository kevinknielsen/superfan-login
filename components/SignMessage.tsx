import { useSignMessage } from "@privy-io/react-auth";
import { CheckIcon, ChevronDown, ChevronUp, CopyIcon, Pen } from "lucide-react";
import { useState } from "react";

interface SignMessageProps {
  onMessageSigned: () => void;
}

/**
 * SignMessage Component
 *
 * This component allows users to sign messages using their embedded wallet.
 * It provides a user interface for:
 * 1. Entering a message to sign
 * 2. Signing the message using the embedded wallet
 * 3. Displaying and managing the signed message (copying, expanding/collapsing)
 */
export default function SignMessage({ onMessageSigned }: SignMessageProps) {
  // State management for the component
  const [message, setMessage] = useState(""); // The message to be signed
  const [signedMessage, setSignedMessage] = useState(""); // The resulting signature
  const [isSignedMessageExpanded, setIsSignedMessageExpanded] = useState(false); // Controls message display length
  const [copiedSignedMessage, setCopiedSignedMessage] = useState(false); // Tracks copy status
  const { signMessage } = useSignMessage(); // Hook for signing messages

  /**
   * Copies the signed message to the clipboard
   * Shows a temporary success indicator
   */
  const copySignedMessage = async () => {
    await navigator.clipboard.writeText(signedMessage);
    setCopiedSignedMessage(true);
    setTimeout(() => setCopiedSignedMessage(false), 2000);
  };

  /**
   * Toggles between expanded and collapsed view of the signed message
   */
  const toggleSignedMessageExpansion = () => {
    setIsSignedMessageExpanded(!isSignedMessageExpanded);
  };

  /**
   * Handles the message signing process using the embedded wallet
   * Requires a non-empty message
   */
  const handleSignMessage = async () => {
    const result = await signMessage({ message });
    setSignedMessage(result.signature);
    onMessageSigned(); // Call the callback when message is signed
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-semibold">
        Sign a Message to Test Your Wallet
      </div>
      {/* Input field for the message to be signed */}
      <div className="flex flex-row gap-2 w-full items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message to sign"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Sign message button - disabled if no message */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSignMessage}
          disabled={!message.trim()}
        >
          <Pen className="w-4 h-4" />
          Sign Message
        </button>
      </div>

      {/* Display area for the signed message */}
      {signedMessage && (
        <div className="mt-2">
          <div className="text-xs font-semibold">Signed Message</div>
          <div className="bg-gray-100 p-2 rounded-md break-all">
            {isSignedMessageExpanded
              ? signedMessage
              : `${signedMessage.slice(0, 50)}...`}
          </div>
          {/* Action buttons for the signed message */}
          <div className="flex flex-row gap-2 mt-1">
            {/* Copy to clipboard button */}
            <button
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
              onClick={copySignedMessage}
            >
              {copiedSignedMessage ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
              {copiedSignedMessage ? "Copied!" : "Copy to Clipboard"}
            </button>
            {/* Expand/Collapse button */}
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
  );
}
