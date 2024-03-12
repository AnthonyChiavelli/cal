import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavWrapper from "../components/nav_wrapper";
import "../globals.css";
import { getSession } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cal",
  description: "Manage your bookings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div className={`${inter.className} bg-slate-500 text-slate-100`}>
      <ToastContainer hideProgressBar />
      <NavWrapper userName={session?.user.name}>{children}</NavWrapper>
    </div>
  );
}
