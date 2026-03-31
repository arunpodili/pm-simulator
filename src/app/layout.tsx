import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "PM Simulator - Product Management Training Platform",
  description: "Master product management with industry-specific templates, embedded learning, and community case studies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased bg-white text-gray-900">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
