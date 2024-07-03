import React, { MouseEvent, PropsWithChildren, useRef } from "react";

export default function Zoomable({ children }: PropsWithChildren) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  function handlMouseEnter(e: MouseEvent) {
    // console.log(e);
    if (divRef.current && parentRef.current) {
      divRef.current.className = "";
      const { x: offsetX, y: offsetY } =
        parentRef.current.getBoundingClientRect();
      divRef.current.style.transform = `translate(${e.clientX - offsetX}px, ${
        e.clientY - offsetY
      }px) scale(2.5)`;
      //   console.log("result");
    }
  }
  return (
    <div
      ref={parentRef}
      className="absolute w-full h-full"
      style={{
        backgroundImage:
          "linear-gradient(#000 1.5px, transparent 1.5px),linear-gradient(90deg, #000 1.5px, transparent 1.5px),linear-gradient(#000 1px, transparent 1px),linear-gradient(90deg, #000 1px, transparent 1px);",
        backgroundPosition: "-1.5px -1.5px,-1.5px -1.5px,-1px -1px,-1px -1px;",
        backgroundSize: "100px 100px,100px 100px,20px 20px,20px 20px;"
    }}
      onMouseMove={handlMouseEnter}
    >
      <div
        ref={divRef}
        style={{ width: "fit-content", transformOrigin: "0% 0%" }}
      >
        {children}
      </div>
    </div>
  );
}
