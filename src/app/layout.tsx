import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
 
const lato = Lato({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Nimbus Board",
  description: "Get information about the weather!",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
}
