import React, { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import ThemeProvider from "../components/ThemeProvider";
const inter = Inter({ subsets: ["latin"] });

export default function VisualizeLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <div className="w-screen h-screen">
        <Header />
        {children}
      </div>
    </ThemeProvider>
  );
}
