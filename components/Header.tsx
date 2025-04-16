import { useLogin, usePrivy } from "@privy-io/react-auth";

/**
 * Header Component
 *
 * This component provides the main header for the application, including:
 * 1. A link to the GitHub repository
 * 2. The application title and description
 * 3. Login/Logout functionality
 * 4. A link to the Builders Garden website
 */
export default function Header() {
  // Hooks for authentication functionality
  const { ready, authenticated, logout } = usePrivy();
  const { login } = useLogin();

  return (
    <div className="flex flex-col justify-evenly h-full">
      <div className="flex flex-col gap-4">
        {/* GitHub repository link */}
        <a
          href="https://github.com/kevinknielsen/superfan-login"
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
        >
          Login Repository [Hackathon]
        </a>
        {/* Application title */}
        <div className="text-3xl lg:text-6xl font-black">Superfan One</div>
        {/* Application description */}
        <div className="text-md lg:text-lg">
          This is the login experience for Superfan One, allowing investors to onboard with their email on Privy and fund their wallet.  
        </div>

        {/* Login button - shown when not authenticated */}
        {ready && !authenticated && (
          <button
            className="bg-black text-white w-fit rounded-md px-4 py-2 hover:bg-gray-800 transition-colors"
            onClick={() => login()}
          >
            Start now
          </button>
        )}
        {/* Logout button - shown when authenticated */}
        {ready && authenticated && (
          <button
            className="bg-red-500 text-white w-fit rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
      {/* Builders Garden attribution */}
      <div className="flex flex-row gap-2 items-center">
        <div className="text-sm">Kevin Nielsen</div>
      </div>
    </div>
  );
}
