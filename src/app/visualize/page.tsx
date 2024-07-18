"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Container, Section, Bar } from "@column-resizer/react";
import { Canvas, Label, Node } from "reaflow";
import dynamic from "next/dynamic";
import Zoomable from "../components/Zoomable";
import debounce from "lodash/debounce";
import Image from "next/image";
import Forest from "@/app/assets/images/forest.jpeg";
import { debouncedFunction, parsEditorData } from "./lib/parsingJson";

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
};

export default function Visualize() {
  const [editorData, setEditorData] = useState({});
  const [nodesData, setNodesData] = useState<NodeType[]>([]);
  function handleOnchange(event: string | undefined) {
    try {
      const json = JSON.parse(event || "");
      // const { width, height } = debouncedFunction(json)!;
      const { width, height } = parsEditorData(json);
      console.log("entered((((((")
      setNodesData((prev) => [
        ...prev,
        {
          id: (prev.length + 1).toString(), // Ensure unique ID
          height,
          width,
          data: json,
        },
      ]);
    } catch (err) {
      console.log("JSON parese error");
    }
  }
  console.log("nodenodenodenode", nodesData);
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
                nodes={nodesData}
                // edges={edges}
                node={
                  <Node
                    style={{ stroke: "#465872", fill: "#F5F8FA" }}
                    label={<Label style={{ fill: "#535353" }} />}
                  >
                    {(event) => (
                      <foreignObject height={event.height} width={event.width}>
                        <span
                          style={{
                            padding: "10px 10px 10px 10px",
                            width: "100%",
                            display: "block",
                            fontSize: 12,
                          }}
                        >
                          <span>key: </span>
                          {typeof event.node.data.key === "string"
                            ? `"${event.node.data.key}"`
                            : event.node.data.key}
                        </span>
                        {/* <span style={{ padding: "10px 10px 0px 10px", width: "100%", display: "block", fontSize: 12}}>
                        <span>sdsd: </span>
                        {event.node.data.sdsd}
                      </span>
                      <span style={{ padding: "0px 10px", width: "100%", display: "block", fontSize: 12}}>
                        <span>erer: </span>
                        "{event.node.data.erer}"
                      </span>
                      <span style={{ padding: "0px 10px 10px 10px", width: "100%", display: "block", fontSize: 12}}>
                        <span>dsds: </span>
                        {event.node.data.dsds}
                      </span> */}
                      </foreignObject>
                    )}
                  </Node>
                }
                direction="RIGHT"
              />
            </Zoomable>
          </div>
        </Section>
      </Container>
    </div>
  );
}
