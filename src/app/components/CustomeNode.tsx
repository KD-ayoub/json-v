import React, { MouseEvent, useState } from "react";
import { Label, Node, NodeData, NodeProps } from "reaflow";
import useNodes, { MyNodeData, MyNodeType } from "../visualize/lib/GraphNodes";
import { BoltSlashIcon, LinkIcon } from "@heroicons/react/16/solid";
import { produce } from "immer";

export default function CustomeNode(nodeProps: NodeProps<NodeData>) {
  const [collapse, setCollapse] = useState(false);
  const edges = useNodes((state) => state.edges);
  const nodes = useNodes((state) => state.nodes);
  const collapsedNodes = useNodes((state) => state.collapsedNodes);
  const collapsedEdges = useNodes((state) => state.collapsedEdges);
  const setCollapsedNodes = useNodes((state) => state.setCollapsedNodes);
  const setCollapsedEdges = useNodes((state) => state.setCollapsedEdges);
  const setNodes = useNodes((state) => state.setNodes);
  function extractEdges(extractedNodes: MyNodeType[]) {
    let copyEdges: typeof edges;
    if (collapsedNodes.length > 0 && verifyCollapsed(collapsedNodes)) {
      console.log("found");
      copyEdges = [...collapsedEdges];
    } else {
      console.log("found1");
      copyEdges = [...edges];
    }
    extractedNodes.forEach((node) => {
      copyEdges.splice(
        copyEdges.findIndex(
          (edge) => edge.id === `${node.isChildOf}-${node.id}`
        ),
        1
      );
    });
    return copyEdges;
  }

  function verifyCollapsed(collapsedNodes: MyNodeType[]) {
    for (let i = 0; i < collapsedNodes.length; i++) {
      if (collapsedNodes[i].collapse) {
        return true;
      }
    }
    return false;
  }

  function extractNodes(id: string) {
    let copyNodes: typeof nodes;
    const bo = verifyCollapsed(collapsedNodes);
    console.log("bo", bo);
    if (collapsedNodes.length > 0 && verifyCollapsed(collapsedNodes)) {
      console.log("found");
      copyNodes = [...collapsedNodes];
    } else {
      console.log("found1");
      copyNodes = [...nodes];
    }
    const collect: typeof nodes = [];
    console.log("collapsed", collapsedNodes, collapsedEdges);
    function findChildren(parentId: string) {
      const children = copyNodes.filter((node) => node.isChildOf === parentId);
      collect.push(...children);

      children.forEach((child) => {
        findChildren(child.id);
      });
    }

    findChildren(id);
    const updatedNodes = copyNodes.filter(
      (node) => !collect.some((col) => col.id === node.id)
    );
    return { collect, updatedNodes };
  }
  function handleClick(e: MouseEvent, id: string) {
    const { collect, updatedNodes } = extractNodes(id);
    console.log("updatedErrrorr", collect);
    const extractedEdges = extractEdges(collect);
    console.log("updatedErrrorr", collect);
    const index = nodes.findIndex((node) => node.id === id);
    const newNode = produce(nodes, (draft) => {
      draft[index].collapse = true;
    });
    const newNode1 = produce(updatedNodes, (draft) => {
      if (index > 0 && index < draft.length) {
        draft[index].collapse = true;
      }
    });
    setNodes(newNode);
    setCollapse(true);
    setCollapsedNodes(newNode1, true);
    setCollapsedEdges(extractedEdges, true);
    if (collapse) {
      setCollapse(false);
      setCollapsedNodes(nodes, false);
      setCollapsedEdges(edges, false);
    }
  }

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
                  <span className="ml-2 text-[#751DEA] max-w-[250px] overflow-hidden text-ellipsis">
                    {value.key}
                  </span>
                  <span className="p-[10px]">({value.length})</span>
                  <button
                    className="w-10 h-full flex justify-center items-center bg-[#465772]"
                    onClick={(e) => handleClick(e, event.node.id)}
                  >
                    {!collapse && <LinkIcon className="w-5" color="#D3D3D3" />}
                    {collapse && (
                      <BoltSlashIcon className="w-5" color="#D3D3D3" />
                    )}
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
