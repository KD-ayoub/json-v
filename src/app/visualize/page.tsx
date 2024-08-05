"use client";

import React, { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Container, Section, Bar } from "@column-resizer/react";
import { Canvas, Label, Node } from "reaflow";
import dynamic from "next/dynamic";
import Zoomable from "../components/Zoomable";
import debounce from "lodash/debounce";
import Image from "next/image";
import Forest from "@/app/assets/images/forest.jpeg";
import { parsEditorData } from "./lib/parsingJson";
import useNodes from "./lib/GraphNodes";
import CustomeNode from "../components/CustomeNode";

enum CanvasPosition {
  CENTER = "center",
  TOP = "top",
  LEFT = "left",
  RIGHT = "right",
  BOTTOM = "bottom",
}

const nodes = [
  {
    id: "1",
    height: 200,
    width: 200,
    data: {
      _id: "SFSDFS",
      value: [1, 2],
    },
  },
  {
    id: "2",
    height: 200,
    width: 200,
    data: {
      _id: "FGBDFDFG",
    },
  },
  {
    id: "3",
    height: 200,
    width: 200,
    data: {
      _id: "FGBDFDFG",
    },
  },
  {
    id: "4",
    height: 200,
    width: 200,
    data: {
      _id: "FGBDFDFG",
    },
  },
  {
    id: "5",
    height: 200,
    width: 200,
    data: {
      _id: "FGBDFDFG",
    },
  },
  {
    id: "6",
    height: 200,
    width: 200,
    data: {
      _id: "FGBDFDFG",
    },
  },
];

// const edges = [
//   {
//     id: "1-2",
//     from: "1",
//     to: "2",
//   },
//   {
//     id: "1-3",
//     from: "1",
//     to: "3",
//   },
//   {
//     id: "1-4",
//     from: "1",
//     to: "4",
//   },
//   {
//     id: "5-6",
//     from: "5",
//     to: "6",
//   },
// ];

type NodeType = {
  id: string;
  height: number;
  width: number;
  data: any;
  // text: string
};

export default function Visualize() {
  const [editorData, setEditorData] = useState({});
  const [loading, setLoading] = useState(true);
  const zusNode = useNodes((state) => state.nodes);
  const setZusNode = useNodes((state) => state.setNode);
  function handleOnchange(value: string | undefined) {
    try {
      const json = JSON.parse(value || "");
      setZusNode(json);
      setLoading(false);
    } catch (err) {
      console.log("JSON parese error");
    }
  }

  return (
    <div className="w-full h-[calc(100%_-_4rem)]">
      <Container style={{ height: "100%", background: "#80808080" }}>
        <Section minSize={300} maxSize={1000} defaultSize={500}>
          <Editor
            height={"100%"}
            loading=""
            defaultLanguage="json"
            options={{
              fontSize: 18,
              minimap: { enabled: false },
              contextmenu: false,
            }}
            onValidate={(errors) => console.log("Error_Here", errors)}
            onChange={handleOnchange}
          />
        </Section>
        <Bar size={2} style={{ background: "#000", cursor: "col-resize" }} />
        <Section minSize={0} className="bg-[#F3F3F3]">
          <div className="w-full h-full relative">
            <Zoomable>
              {/* <Image src={Forest} width={200} height={200} alt="Forest" draggable={false}/> */}
              <Canvas
                defaultPosition={"" as CanvasPosition}
                readonly={true}
                zoomable={false}
                nodes={zusNode}
                // edges={edges}
                node={(p) => <CustomeNode {...p}/>}
                direction="RIGHT"
              />
            </Zoomable>
          </div>
        </Section>
      </Container>
    </div>
  );
}
