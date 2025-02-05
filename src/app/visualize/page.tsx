"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Editor, { EditorProps, OnValidate } from "@monaco-editor/react";
import { Container, Section, Bar } from "@column-resizer/react";
import { Canvas, ElkRoot, Label, Node } from "reaflow";
import dynamic from "next/dynamic";
import Zoomable from "../components/Zoomable";
import debounce from "lodash/debounce";
import Image from "next/image";
import Forest from "@/app/assets/images/forest.jpeg";
import { parsEditorData } from "./lib/parsingJson";
import useNodes from "./lib/GraphNodes";
import CustomeNode from "../components/CustomeNode";
import useChoice from "./lib/useChoice";
import { json } from "stream/consumers";
import { JSONTree } from "react-json-tree";
import useRotation from "./lib/useRotation";
import { Bars3CenterLeftIcon } from "@heroicons/react/16/solid";
import useModal from "./lib/useModal";
import { Modal } from "antd";
import { ThemeContext } from "../components/ThemeProvider";

enum CanvasPosition {
  CENTER = "center",
  TOP = "top",
  LEFT = "left",
  RIGHT = "right",
  BOTTOM = "bottom",
}

const lightGrayTheme = {
  scheme: "Light Gray",
  author: "Your Name",
  base00: "#F3F3F3", // Background
  base01: "#E8E8E8", // Lighter background (used for status bars, line number, etc.)
  base02: "#DADADA", // Selection background
  base03: "#CCCCCC", // Comments, invisibles, line highlighting
  base04: "#BEBEBE", // Darker background (used for status bars)
  base05: "#A3A3A3", // Default text, variables, classes, identifiers
  base06: "#8A8A8A", // Secondary text, attributes, keywords
  base07: "#737373", // Darker text, primary content
  base08: "#595959", // Error, invalid text
  base09: "#FF6347", // Warnings, escape characters (e.g., Tomato color)
  base0A: "#FFD700", // Integers, booleans, constants (e.g., Gold color)
  base0B: "#32CD32", // Strings, inherited class, markup code (e.g., Lime Green color)
  base0C: "#20B2AA", // Support, regular expressions, escape characters (e.g., Light Sea Green)
  base0D: "#1E90FF", // Functions, methods, attribute IDs (e.g., Dodger Blue color)
  base0E: "#BA55D3", // Keywords, storage, selector (e.g., Medium Orchid color)
  base0F: "#8B0000", // Deprecated, opening/closing embedded language tags (e.g., Dark Red)
};

const darkGrayTheme = {
  scheme: "Dark Gray",
  author: "Your Name",
  base00: "#1B1B1B", // Background (dark gray)
  base01: "#2B2B2B", // Lighter background (status bars, line numbers)
  base02: "#3A3A3A", // Selection background
  base03: "#4A4A4A", // Comments, invisibles, line highlighting
  base04: "#5A5A5A", // Darker background (status bars)
  base05: "#CFCFCF", // Default text, variables, classes, identifiers
  base06: "#A9A9A9", // Secondary text, attributes, keywords
  base07: "#E0E0E0", // Darker text, primary content
  base08: "#FF4C4C", // Error, invalid text (vibrant red)
  base09: "#FF7F50", // Warnings, escape characters (Tomato color)
  base0A: "#FFD700", // Integers, booleans, constants (Gold color)
  base0B: "#7FFF00", // Strings, inherited class, markup code (Chartreuse color)
  base0C: "#20B2AA", // Support, regular expressions, escape characters (Light Sea Green)
  base0D: "#4682B4", // Functions, methods, attribute IDs (Steel Blue)
  base0E: "#DA70D6", // Keywords, storage, selector (Orchid color)
  base0F: "#B22222", // Deprecated, opening/closing embedded language tags (Firebrick)
};





export default function Visualize() {
  const { theme, toogleTheme } = useContext(ThemeContext);
  const [editorData, setEditorData] = useState<any>();
  const [collapseEditor, setCollapseEditor] = useState(false);
  const zusNode = useNodes((state) => state.nodes);
  const zusEdge = useNodes((state) => state.edges);
  const setEdges = useNodes((state) => state.setEdges);
  const setNodes = useNodes((state) => state.setNodes);
  const collapsedNodes = useNodes((state) => state.collapsedNodes);
  const collapsedEdges = useNodes((state) => state.collapsedEdges);
  const setZusNode = useNodes((state) => state.setNode);
  const choice = useChoice((state) => state.choice);
  const direction = useRotation((state) => state.direction);
  const memoizedNodes = useMemo(
    () => (collapsedNodes.length > 0 ? collapsedNodes : zusNode),
    [collapsedNodes, zusNode]
  );
  const memoizedEdges = useMemo(
    () =>
      collapsedEdges.length > 0
        ? collapsedEdges
        : collapsedEdges.length === 0 && collapsedNodes.length > 0
        ? collapsedEdges
        : zusEdge,
    [collapsedEdges, collapsedNodes, zusNode]
  );
  const [canvasWidth, setCanvasWidth] = useState(2000);
  const [canvasHeight, setCanvasHeight] = useState(2000);
  const debouncedHandleOnchange = useCallback(
    debounce((value: string | undefined) => {
      console.log("Entered debounce", value);
      try {
        setEdges([]); // Clear edges to avoid duplicates
        setNodes([]); // Clear nodes to avoid duplicates
        const json = JSON.parse(value || "");
        setZusNode(json);
        setEditorData(json);
      } catch (err) {
        console.log("JSON parse error");
        setEdges([]);
        setNodes([]);
        setEditorData(undefined);
      }
    }, 800),
    []
  );
  function handleLayoutChange(layout: ElkRoot) {
    setCanvasWidth((layout.width as number) + 50);
    setCanvasHeight((layout.height as number) + 50);
  }
  function handleErrors(errors: any) {
    console.log("Error_onvalidate", errors);
    setEdges([]);
    setNodes([]);
    setEditorData(undefined);
  }
  // Cleanup on unmount
  useEffect(() => {
    console.log("dirr", direction);
    return () => {
      debouncedHandleOnchange.cancel();
    };
  }, [debouncedHandleOnchange, choice]);
  return (
    <div className="w-full h-[calc(100%_-_3.5rem)]">
      <button
        className="absolute z-50 bottom-0 m-2 rounded-lg bg-[#F8F8F8]"
        onClick={() => setCollapseEditor(!collapseEditor)}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={"0"}
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 19V5c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zm-11 0V5h9l.002 14H10z"></path>
        </svg>
      </button>
      <Container style={{ height: "100%", background: "#80808080" }}>
        <Section
          hidden={collapseEditor}
          minSize={300}
          maxSize={600}
          defaultSize={400}
        >
          <Editor
            height={"100%"}
            loading=""
            defaultLanguage="json"
            options={{
              fontSize: 18,
              minimap: { enabled: false },
              contextmenu: false,
            }}
            onValidate={handleErrors}
            onChange={debouncedHandleOnchange}
            theme={theme === "dark" ? "vs-dark" : "light"}
          />
        </Section>
        <Bar size={2} style={{ background: "#000", cursor: "col-resize" }} />
        <Section
          minSize={0}
          className={`${theme === "dark" ? "bg-[#1E1E1E]" : "bg-[#F3F3F3]"}`}
        >
          {!choice && (
            <div className="w-full h-full relative">
              <Zoomable>
                <Canvas
                  className="test-class"
                  key={direction}
                  defaultPosition={"" as CanvasPosition}
                  onLayoutChange={handleLayoutChange}
                  readonly={false}
                  dragEdge={null}
                  dragNode={null}
                  zoomable={false}
                  // pannable={false}
                  // fit={true}
                  nodes={memoizedNodes}
                  edges={memoizedEdges}
                  node={(p) => <CustomeNode {...p} />}
                  direction={direction}
                  width={canvasWidth}
                  height={canvasHeight}
                  maxHeight={canvasHeight}
                  maxWidth={canvasWidth}
                />
              </Zoomable>
            </div>
          )}
          {choice && (
            <div className="max-h-full w-full overflow-auto">
              <JSONTree
                data={editorData}
                theme={ theme === "dark" ? darkGrayTheme: lightGrayTheme}
                invertTheme={false}
              />
            </div>
          )}
        </Section>
      </Container>
    </div>
  );
}
