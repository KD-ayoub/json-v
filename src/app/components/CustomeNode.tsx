import React from "react";
import { Label, Node, NodeData, NodeProps } from "reaflow";
import { MyNodeData } from "../visualize/lib/GraphNodes";
import { LinkIcon } from "@heroicons/react/16/solid";
export default function CustomeNode(nodeProps: NodeProps<NodeData>) {
  return (
    <Node
      {...nodeProps}
      style={{ stroke: "#465872", fill: "#F5F8FA" }}
      label={<Label style={{ fill: "#535353" }} />}
    >
      {(event) => (
        <foreignObject height={event.height} width={event.width}>
          {event.node.data.map((value: MyNodeData, idx: number) => {
            const padding =
              event.node.data.length > 1
                ? "first:p-[10px_10px_0px_10px] last:p-[0px_10px_10px_10px] px-[10px]"
                : "p-[10px]";
            const textColor =
              value.type === "string"
                ? "text-[#535353]"
                : value.type === "number"
                ? "text-[#FD0179]"
                : value.type === "boolean"
                ? "text-[#FF0000]"
                : "text-[#AFAFAF]";
            const boolean =
              value.type === "boolean" && value.value ? "true" : "false";
            if (value.isParent) {
              return (
                <span
                  key={idx}
                  className={`w-full h-full flex justify-between items-center text-[12px] font-[500]`}
                >
                  <span className="ml-2 text-[#751DEA] max-w-[250px] overflow-hidden text-ellipsis">{value.key}</span>
                  <span className="p-[10px]">(1)</span>
                  <button className="w-10 h-full flex justify-center items-center bg-[#465772]">
                    <LinkIcon className="w-5" color="#D3D3D3"/>
                  </button>
                </span>
              );
            }
            return (
              <span
                key={idx}
                className={`w-full block text-[12px] ${textColor} font-[500] ${padding}`}
              >
                <span className="text-[#751DEA]">{value.key}: </span>
                {value.type === "string"
                  ? `"${value.value}"`
                  : value.type === "boolean"
                  ? boolean
                  : value.type === "null"
                  ? "null"
                  : value.value}
              </span>
            );
          })}
        </foreignObject>
      )}
    </Node>
  );
}
