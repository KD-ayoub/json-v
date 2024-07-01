"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { Container, Section, Bar } from "@column-resizer/react";

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
        <Section minSize={0}>
            <div>dgfgdfgdfgs</div>
        </Section>
      </Container>
    </div>
  );
}
