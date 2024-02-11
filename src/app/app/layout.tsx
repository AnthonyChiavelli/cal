import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "../components/sidebar";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cal",
  description: "Manage your bookings",
};

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-500 text-slate-100`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}

export default withPageAuthRequired(RootLayout as any, { returnTo: "/app" });
