import React, {
  MouseEvent,
  PropsWithChildren,
  WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function Zoomable({ children }: PropsWithChildren) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const childDivRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlWheel = useCallback(
    (e: WheelEvent) => {
      if (childDivRef.current && divRef.current) {
        const { left, top } = divRef.current.getBoundingClientRect();
        const pointerX = e.pageX - left;
        const pointerY = e.pageY - top;
        const targetX = (pointerX - position.x) / scale;
        const targetY = (pointerY - position.y) / scale;
        let newScale =
          scale + -1 * Math.max(-1, Math.min(1, e.deltaY)) * 0.1 * scale;
        newScale = Math.max(0.01, Math.min(100, newScale));
        const newPosX = -targetX * newScale + pointerX;
        const newPosY = -targetY * newScale + pointerY;
        console.log("dim: ", left, top, e.deltaMode);
        setScale(newScale);
        setPosition({ x: newPosX, y: newPosY });
        childDivRef.current.style.transform = `translate(${newPosX}px, ${newPosY}px) scale(${newScale})`;
      }
    },
    [scale, position]
  );
  const handlMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsDragging(true);
      setPrevPosition({ x: e.clientX, y: e.clientY });
    },
    [isDragging, prevPosition]
  );

  const handlMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !childDivRef.current) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      setPrevPosition({ x: e.clientX, y: e.clientY });
      console.log("hererererererere....", position);
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      childDivRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
    },
    [prevPosition, position]
  );
  const handlMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [isDragging]);
  /// background
  //   style={{
  //     backgroundImage:
  //       "linear-gradient(#E4E4E4 1.5px, transparent 1.5px),linear-gradient(90deg, #E4E4E4 1.5px, transparent 1.5px),linear-gradient(#E4E4E4 1px, transparent 1px),linear-gradient(90deg, #E4E4E4 1px, transparent 1px);",
  //     backgroundPosition: "-1.5px -1.5px,-1.5px -1.5px,-1px -1px,-1px -1px;",
  //     backgroundSize: "100px 100px,100px 100px,20px 20px,20px 20px;"
  // }}

  return (
    <div
      ref={divRef}
      className="absolute w-full h-full"
      onWheel={handlWheel}
      onMouseDown={handlMouseDown}
      onMouseMove={handlMouseMove}
      onMouseUp={handlMouseUp}
      style={{
        backgroundImage:
          "linear-gradient(#E4E4E4 1.5px, transparent 1.5px),linear-gradient(90deg, #E4E4E4 1.5px, transparent 1.5px),linear-gradient(#E4E4E4 1px, transparent 1px),linear-gradient(90deg, #E4E4E4 1px, transparent 1px);",
        backgroundPosition: "-1.5px -1.5px,-1.5px -1.5px,-1px -1px,-1px -1px;",
        backgroundSize: "100px 100px,100px 100px,20px 20px,20px 20px;",
      }}
    >
      <div
        ref={childDivRef}
        style={{
          width: "fit-content",
          transformOrigin: "0% 0%",
          // transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
