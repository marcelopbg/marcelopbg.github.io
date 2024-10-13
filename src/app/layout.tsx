import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./navbar/Navbar";
import { Suspense } from "react";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingOverlay from "./components/LoadingOverlay";
import { LoginProvider } from "./context/LoginContext";
import { PerformanceProvider } from "./context/PerformanceContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Force Mock Exams | Salesforce Certification Prep",
  description: "Boost your Salesforce certification prep with AI-generated mock exams and detailed performance analytics. Start for free today and pass with confidence!",
  // icons: {
  //   icon: '/favicon.ico'
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoginProvider>
          <LoadingProvider>
            <PerformanceProvider>

            <Toaster />
            <Navbar />
            <LoadingOverlay />
            <Suspense>
              {children}
            </Suspense>
            </PerformanceProvider>
          </LoadingProvider>
        </LoginProvider>
      </body>
    </html>
  );
}
