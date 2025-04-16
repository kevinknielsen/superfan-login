import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia], // Base is now first, making it the default
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
