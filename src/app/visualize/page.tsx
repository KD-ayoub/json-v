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

export default function Visualize() {
  const [editorData, setEditorData] = useState({});
  const [loading, setLoading] = useState(true);
  const zusNode = useNodes((state) => state.nodes);
  const zusEdge = useNodes((state) => state.edges);
  const setEdges = useNodes((state) => state.setEdges);
  const setNodes = useNodes((state) => state.setNodes);
  const collapsedNodes = useNodes((state) => state.collapsedNodes);
  const collapsedEdges = useNodes((state) => state.collapsedEdges);
  const setZusNode = useNodes((state) => state.setNode);



  const debouncedHandleOnchange = useCallback(
    debounce((value: string | undefined) => {
      console.log("Entered debounce");
      try {
        setEdges([]); // Clear edges to avoid duplicates
        setNodes([]); // Clear nodes to avoid duplicates
        const json = JSON.parse(value || "");
        setZusNode(json);
        setLoading(false);
      } catch (err) {
        console.log("JSON parse error");
        setEdges([]);
        setNodes([]);
        setLoading(true);
      }
    }, 800),
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedHandleOnchange.cancel();
    };
  }, [debouncedHandleOnchange]);

  return (
    <div className="w-full h-[calc(100%_-_4rem)]">
      <Container style={{ height: "100%", background: "#80808080" }}>
        <Section minSize={300} maxSize={600} defaultSize={400}>
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
            onChange={debouncedHandleOnchange}
          />
        </Section>
        <Bar size={2} style={{ background: "#000", cursor: "col-resize" }} />
        <Section minSize={0} className="bg-[#F3F3F3]">
          <div className="w-full h-full relative">
            <Zoomable>
              <Canvas
                defaultPosition={"" as CanvasPosition}
                readonly={true}
                zoomable={false}
                nodes={collapsedNodes.length > 0 ? collapsedNodes : zusNode}
                edges={collapsedEdges.length > 0 ? collapsedEdges : (collapsedEdges.length === 0 && collapsedNodes.length >0 ) ? collapsedEdges : zusEdge}
                node={(p) => <CustomeNode {...p}/>}
                direction="RIGHT"
                maxHeight={5000}
                maxWidth={5000}
              />
            </Zoomable>
          </div>
        </Section>
      </Container>
    </div>
  );
}
