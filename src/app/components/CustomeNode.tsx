import React from "react";
import { Label, Node, NodeData, NodeProps } from "reaflow";
import { MyNodeData } from "../visualize/lib/GraphNodes";
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
                : "text-[#AFAFAF]"
            const boolean =
              value.type === "boolean" && value.value ? "true" : "false";
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
