import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hudson Flow - Learn the River",
  description: "Learn science and safety from the real Hudson River with live currents, tides, and kayak tips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-b from-blue-50 to-blue-100">
        {children}
      </body>
    </html>
  );
}
