
import type { Metadata } from "next";
import "./globals.css";
import { didot, zuhairDisplay, zuhairText } from "./fonts";

export const metadata: Metadata = {
  title: "Quran Reading Circle - Interactive Quran Reading",
  description: "Quran Reading Circle is a free, online Quran reading and learning site with a fully color-coded Tajweedi Quran. Read the Quran online with translations and tajweed rules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${didot.variable} ${zuhairDisplay.variable} ${zuhairText.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

