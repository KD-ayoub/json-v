"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Container, Section, Bar } from "@column-resizer/react";
import { Canvas, Node } from "reaflow";
import dynamic from 'next/dynamic';
import Zoomable from "../components/Zoomable";


const nodes = [
  {
    id: "1",
    text: "1",
  },
  {
    id: "2",
    text: "2",
  },
  {
    id: "3",
    text: "3",
  },
];

const edges = [
  {
    id: "1-2",
    from: "1",
    to: "2",
  },
  {
    id: "2-3",
    from: "2",
    to: "3",
  },
];

export default function Visualize() {

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
          />
        </Section>
        <Bar size={2} style={{ background: "#000", cursor: "col-resize" }} />
        <Section minSize={0} className="bg-white">
          <div className="w-full h-full relative">
            <Zoomable>
              <h1>Headinggg...</h1>
              <h1>Headinggg...</h1>
            </Zoomable>
              {/* <Canvas nodes={nodes} edges={edges} /> */}
          </div>
        </Section>
      </Container>
    </div>
  );
}
