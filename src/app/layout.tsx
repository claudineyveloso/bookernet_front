import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../../styles/layout/layout.scss';
import '../../styles/demo/Demos.scss';
import "primereact/resources/themes/lara-light-cyan/theme.css";
//import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookernet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" style={{ fontSize: "14px" }}>
      <head>
        <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        <PrimeReactProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </PrimeReactProvider>

      </body>
    </html>
  );
}
