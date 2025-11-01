import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teendex - Gamified CRM for Gen Z Freelancers",
  description: "Transform your freelance business into an engaging, game-like experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
