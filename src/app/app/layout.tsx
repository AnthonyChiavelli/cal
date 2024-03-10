import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavWrapper from "../components/nav_wrapper";

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
  return (
    <div className={`${inter.className} bg-slate-500 text-slate-100`}>
      <ToastContainer hideProgressBar />
      <NavWrapper>{children}</NavWrapper>
    </div>
  );
}
