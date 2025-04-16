import EmbeddedWallets from "./EmbeddedWallets";

/**
 * Main wallet component that displays the Embedded Wallets interface
 */
export default function Tabs() {
  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col gap-4 w-full">
        <EmbeddedWallets />
      </div>
    </div>
  );
}
