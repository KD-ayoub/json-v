import React, { PropsWithChildren } from "react";

export default function VisualizeLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-16 border-b border-gray-400 bg-yellow-200"></div>
      {children}
    </div>
  );
}
