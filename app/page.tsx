"use client";

import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";

export default function Home() {
  const { user } = usePrivy();

  return (
    <div className="min-h-screen min-w-screen">
      <div className="flex flex-col lg:flex-row h-screen text-black">
        <div className="flex-1 bg-gray-50 p-6 lg:p-12 relative">
          <div className="relative w-full h-64 mb-6">
            <Image
              src="/images/supa-logoo.png"
              alt="Superfan One logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <Header />
        </div>
        <div className="flex-1 bg-white h-full p-6 lg:p-12 flex flex-col items-center justify-center w-full space-y-4">
          {!user && <div className="w-full lg:w-1/2"></div>}
          {user && <Tabs />}
        </div>
      </div>
    </div>
  );
}
