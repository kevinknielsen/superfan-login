import { useLogin, usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { ready, authenticated, logout } = usePrivy();
  const { login } = useLogin();

  return (
    <div className="flex flex-col justify-evenly h-full">
      <div className="flex flex-col gap-4">
        <a
          href="https://github.com/builders-garden/privy-advanced-wallets"
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
        >
          Github Repository
        </a>
        <div className="text-3xl lg:text-6xl font-black">Privy Starter</div>
        <div className="text-md lg:text-lg">
          This app demonstrates how to use Privy Embedded Wallets to sign and
          execute transactions.
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
            onClick={logout}
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
          <Image src="/images/bg-logo.svg" alt="logo" width={75} height={75} />
        </Link>
      </div>
    </div>
  );
}
