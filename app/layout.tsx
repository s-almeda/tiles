import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'
const nintendoDS = localFont({
  src: '../public/fonts/Nintendo-DS-BIOS.ttf',
  display: 'swap',
  variable: '--font-nintendo'
})
const nintendoSansSerif = localFont({
  src: '../public/fonts/nintendo_sans_serif.ttf',
  display: 'swap',
  variable: '--font-nintendo-sans-serif'
})

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "tiles",
  description: "little guys with little tiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nintendoDS.variable} ${nintendoSansSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
