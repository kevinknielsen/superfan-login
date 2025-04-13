import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { base, baseSepolia } from "viem/chains";
import SignMessage from "./SignMessage";
import USDCTransaction from "./USDCTransaction";
import WalletInfo from "./WalletInfo";

export default function EmbeddedWallets() {
  const { wallets } = useWallets();
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [embeddedWallet, setEmbeddedWallet] = useState<
    ConnectedWallet | undefined
  >();

  const copyToClipboard = useCallback(
    async (text: string, walletType: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(walletType);
      setTimeout(() => setCopiedWallet(null), 2000);
    },
    []
  );

  useEffect(() => {
    const embeddedWallet = wallets.find(
      (wallet) => wallet.connectorType === "embedded"
    );
    if (embeddedWallet) {
      setEmbeddedWallet(embeddedWallet);
    }
  }, [wallets]);

  const currentChainId = embeddedWallet?.chainId
    .replace("eip155:", "")
    .toString();
  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col sm:flex-row gap-2">
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
          <WalletInfo
            embeddedWalletAddress={embeddedWallet?.address}
            chainId={currentChainId}
            copiedWallet={copiedWallet}
            onCopyWallet={copyToClipboard}
          />
        </div>
        <div className="text-lg font-semibold">Operations</div>
        <SignMessage />
        <div className="h-px bg-gray-200 my-4"></div>
        <USDCTransaction
          chainId={currentChainId}
          embeddedWalletAddress={embeddedWallet?.address}
        />
      </div>
    </div>
  );
}
