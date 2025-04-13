import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onchain Webapp Starter",
  description: "Next.js starter with Privy Embedded Wallets and Smart Wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
