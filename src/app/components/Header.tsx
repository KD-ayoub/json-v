"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/16/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { ThemeContext } from "./ThemeProvider";
import useFullScreen from "../hooks/useFullScreen";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import useChoice from "../visualize/lib/useChoice";
import graphSvg from "@/app/assets/graph.svg";
import useRotation, { Direction } from "../visualize/lib/useRotation";
import { Button, Modal } from "antd";
import useModal from "../visualize/lib/useModal";
import DownloadModalContent from "./DownloadModalContent";
import GraphSVg from "./GraphSvg";

const inter = Inter({ subsets: ["latin"] });

export default function Header() {
  const {
    isModalOpen,
    modalContent,
    title,
    setIsModalOpen,
    setModalClosed,
    setModalContent,
    setModalTitle,
  } = useModal();
  const { theme, toogleTheme } = useContext(ThemeContext);
  const { fullScreen, handlFullScreen } = useFullScreen();
  const choice = useChoice((state) => state.choice);
  const setChoice = useChoice((state) => state.setChoice);
  const degree = useRotation((state) => state.degree);
  const direction = useRotation((state) => state.direction);
  const setDirection = useRotation((state) => state.setDirection);
  console.log(theme, choice);
  function handleDownload() {
    setModalTitle("Download Image");
    setIsModalOpen(true);
    setModalContent(<DownloadModalContent />);
  }
  function handleDirection() {
    const direc: Direction[] = ["RIGHT", "DOWN", "LEFT", "UP"];
    const current = direc.indexOf(direction);
    const next = (current + 1) % direc.length;
    setDirection(direc[next]);
  }
  return (
    <div
      className={`w-full h-14 ${
        theme === "dark" ? "bg-[#262626]" : "bg-white"
      } flex items-center p-4`}
    >
      <p
        className={`font-['inter'] font-[900] ${
          theme === "dark" ? "text-white" : "text-black"
        } tracking-wide text-2xl ${inter.className}`}
      >
        <span className="text-[#FFBD38] text-[35px] font-[600]">&#123;</span>
        JSON
        <span className="text-[#FFBD38] text-[35px] font-[600]">
          &#125;
        </span>{" "}
        VIEW
      </p>
      <button
        className={`ml-20 font-['inter'] font-[400] hover:border-b hover:border-[#FFBD38] text-lg ${
          !choice ? " text-[#FFBD38] border-b border-[#FFBD38]" : theme === "dark" ? "text-white": "text-black"
        }  ${inter.className}`}
        onClick={() => setChoice(false)}
      >
        Graph
      </button>
      <button
        className={`ml-5 font-['inter'] font-[400] hover:border-b  hover:border-[#FFBD38] text-lg ${
          choice ? " text-[#FFBD38] border-b border-[#FFBD38]" : theme === "dark" ? "text-white": "text-black"
        }  ${inter.className}`}
        onClick={() => setChoice(true)}
      >
        Tree
      </button>
      <div className="flex flex-1 justify-end gap-5">
        <GraphSVg
          color={theme === "dark" ? "white" : "dark"}
          rotate={degree}
          handleClick={handleDirection}
        />
        <ArrowDownTrayIcon
          className="w-6 cursor-pointer"
          color={theme === "dark" ? "white" : "dark"}
          onClick={handleDownload}
        />
        {theme === "dark" && (
          <MoonIcon
            className="w-6 cursor-pointer"
            color="white"
            onClick={toogleTheme}
          />
        )}
        {theme === "light" && (
          <SunIcon
            className="w-6 cursor-pointer"
            color="dark"
            onClick={toogleTheme}
          />
        )}
        {!fullScreen && (
          <ArrowsPointingOutIcon
            className="w-6 cursor-pointer"
            color={theme === "dark" ? "white" : "dark"}
            onClick={handlFullScreen}
          />
        )}
        {fullScreen && (
          <ArrowsPointingInIcon
            className="w-6 cursor-pointer"
            color={theme === "dark" ? "white" : "dark"}
            onClick={handlFullScreen}
          />
        )}
      </div>
      <Modal
        open={isModalOpen}
        title={title}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setModalClosed(true);
        }}
      >
        {modalContent}
      </Modal>
    </div>
  );
}
