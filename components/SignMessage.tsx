import { useSignMessage } from "@privy-io/react-auth";
import { CheckIcon, ChevronDown, ChevronUp, CopyIcon, Pen } from "lucide-react";
import { useState } from "react";

export default function SignMessage() {
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [isSignedMessageExpanded, setIsSignedMessageExpanded] = useState(false);
  const [copiedSignedMessage, setCopiedSignedMessage] = useState(false);
  const { signMessage } = useSignMessage();

  const copySignedMessage = async () => {
    await navigator.clipboard.writeText(signedMessage);
    setCopiedSignedMessage(true);
    setTimeout(() => setCopiedSignedMessage(false), 2000);
  };

  const toggleSignedMessageExpansion = () => {
    setIsSignedMessageExpanded(!isSignedMessageExpanded);
  };

  const handleSignMessage = async () => {
    const result = await signMessage({ message });
    setSignedMessage(result.signature);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-semibold">
        Sign Message with Embedded Wallet
      </div>
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
          onClick={handleSignMessage}
          disabled={!message.trim()}
        >
          <Pen className="w-4 h-4" />
          Sign Message
        </button>
      </div>

      {signedMessage && (
        <div className="mt-2">
          <div className="text-xs font-semibold">Signed Message</div>
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
              {copiedSignedMessage ? "Copied!" : "Copy to Clipboard"}
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
  );
}
