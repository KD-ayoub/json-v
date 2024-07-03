"use client";
import React, { useCallback, useContext, useState } from "react";
import { Inter } from "next/font/google";
import { Cog6ToothIcon, MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { ThemeContext } from "./ThemeProvider";
import useFullScreen from "../hooks/useFullScreen";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
const inter = Inter({ subsets: ["latin"] });

export default function Header() {
    const { theme, toogleTheme } = useContext(ThemeContext);
    const { fullScreen, handlFullScreen } = useFullScreen();
    console.log(theme);
  return (
    <div className="w-full h-16 border-b border-gray-400 bg-[#ECECEC] flex items-center p-4">
      <p
        className={`font-['inter'] font-[900] tracking-wide text-2xl ${inter.className}`}
      >
        <span className="text-[#ffc756] text-[35px] font-[600]">&#123;</span>JSON
        <span className="text-[#ffc248] text-[35px] font-[600]">&#125;</span> VIEW
      </p>
      <p
        className={`ml-5 font-['inter'] font-[400] text-lg cursor-pointer px-2 rounded-md text-[#4E5660] ${inter.className}`}
      >
        Graph
      </p>
      <p
        className={`ml-5 font-['inter'] font-[400] text-lg cursor-pointer border border-gray-400 px-2 rounded-md bg-gray-500 text-white ${inter.className}`}
      >
        Tree
      </p>
      <div className="flex flex-1 justify-end gap-5">
        <Cog6ToothIcon className="w-8 cursor-pointer"/>
        { theme === "dark" && <MoonIcon className="w-8 cursor-pointer" onClick={toogleTheme}/>}
        { theme === "light" && <SunIcon className="w-8 cursor-pointer" onClick={toogleTheme}/>}
        { !fullScreen && <ArrowsPointingOutIcon className="w-8 cursor-pointer" onClick={handlFullScreen}/>}
        { fullScreen && <ArrowsPointingInIcon className="w-8 cursor-pointer" onClick={handlFullScreen}/> }
      </div>
    </div>
  );
}
