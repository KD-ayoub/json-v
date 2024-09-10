import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Label, Node, NodeData, NodeProps } from "reaflow";
import useNodes, { MyNodeData, MyNodeType } from "../visualize/lib/GraphNodes";
import { BoltSlashIcon, LinkIcon } from "@heroicons/react/16/solid";
import { produce } from "immer";
import { uniq } from "lodash";
import { Modal } from "antd";
import CopyBoard from "./CopyBoard";
import useModal from "../visualize/lib/useModal";

const CustomeNode = (nodeProps: NodeProps<NodeData>) => {
  const { isModalOpen, modalContent, setModalContent, setIsModalOpen } = useModal();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalContent, setModalContent] = useState<ReactNode>();
  const [collapse, setCollapse] = useState(false);
  const edges = useNodes((state) => state.edges);
  const nodes = useNodes((state) => state.nodes);
  const setCollapsedNodes = useNodes((state) => state.setCollapsedNodes);
  const setCollapsedEdges = useNodes((state) => state.setCollapsedEdges);
  const setNodes = useNodes((state) => state.setNodes);

  function filterCollapsedChildren(nodes: MyNodeType[], id: string) {
    let collect: typeof nodes = [];

    function findChildren(parentId: string) {
      const children = nodes.filter((node) => node.isChildOf === parentId);
      collect.push(...children);
      children.forEach((child) => {
        findChildren(child.id);
      });
    }
    nodes.forEach((child) => {
      if (child.collapse) {
        findChildren(child.id);
      }
    });

    const updatedNodes = nodes.filter(
      (node) => !collect.some((col) => col.id === node.id)
    );
    const copyEdges: typeof edges = [...edges];
    collect = uniq(collect);
    collect.forEach((node) => {
      copyEdges.splice(
        copyEdges.findIndex(
          (edge) => edge.id === `${node.isChildOf}-${node.id}`
        ),
        1
      );
    });
    setCollapsedNodes(updatedNodes, true);
    setCollapsedEdges(copyEdges, true);
  }
  function handleClick(e: MouseEvent, id: string) {
    const index = nodes.findIndex((node) => node.id === id);
    const newNodes = produce(nodes, (draft) => {
      if (index >= 0 && index < draft.length) {
        draft[index].collapse = !collapse;
      }
    });
    setNodes(newNodes);
    setCollapse(!collapse);
    filterCollapsedChildren(newNodes, id);
  }
  function formateData(data: MyNodeData[]) {
    console.log("inside function", data);
    let obj = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === "") return data[i].value;
      if (data[i].value === "") return data[i].key;
      const constructed = { [data[i].key]: data[i].value };
      Object.assign(obj, constructed);
    }
    return obj;
  }

  function handleNodeClick(event: MouseEvent, data: NodeData) {
    const returned = formateData(data.data);
    console.log("ret", returned);
    setModalContent(<CopyBoard json={JSON.stringify(returned, null, 2)} />);
    setIsModalOpen(true);
  }
  function handleModalCancel() {
    setIsModalOpen(false);
  }
  
  return (
    <>
      <Node
        {...nodeProps}
        style={{ fill: "#F5F8FA" }}
        label={<Label style={{ fill: "#535353" }} />}
        className="pointer-events-auto"
        onClick={handleNodeClick}
      >
        {(event) => (
          <foreignObject
            className="pointer-events-none select-none"
            height={event.height}
            width={event.width}
          >
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
              function isValidUrl(url: string) {
                try {
                  return Boolean(new URL(url));
                } catch (error) {
                  return false;
                }
              }
              if (value.isParent) {
                let jsx = (
                  <span
                    className={`ml-2 ${
                      value.isArrayParent ? "text-[#FF6B00]" : "text-[#751DEA]"
                    } max-w-[250px] text-center whitespace-nowrap overflow-hidden text-ellipsis`}
                  >
                    {value.key}
                  </span>
                );
                if (isValidUrl(value.key)) {
                  jsx = (
                    <span>
                      <a
                        href={value.key}
                        target="_blank"
                        className={`ml-2 ${
                          value.isArrayParent
                            ? "text-[#FF6B00]"
                            : "text-[#751DEA]"
                        } max-w-[250px] text-center whitespace-nowrap underline overflow-hidden text-ellipsis`}
                      >
                        {value.key}
                      </a>
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    className={`w-full h-full flex justify-between items-center text-[12px] font-[500]`}
                  >
                    {jsx}
                    <span className="p-[10px]">({value.length})</span>
                    <button
                      className="w-10 h-full flex pointer-events-auto justify-center items-center bg-[#465772]"
                      onClick={(e) => handleClick(e, event.node.id)}
                    >
                      {!(event.node as MyNodeType).collapse && (
                        <LinkIcon className="w-5" color="#D3D3D3" />
                      )}
                      {(event.node as MyNodeType).collapse && (
                        <BoltSlashIcon className="w-5" color="#D3D3D3" />
                      )}
                    </button>
                  </span>
                );
              }
              if (value.isAlone) {
                let jsx = (
                  <span
                    key={idx}
                    className={`w-full block text-[12px] ${textColor} font-[500] p-[10px]`}
                  >
                    {value.type === "string"
                      ? value.value
                      : value.type === "boolean"
                      ? boolean
                      : value.type === "null"
                      ? "null"
                      : value.value}
                  </span>
                );
                if (isValidUrl(value.value)) {
                  jsx = (
                    <span
                      key={idx}
                      className={`w-full block text-[12px] ${textColor} font-[500] p-[10px]`}
                    >
                      <span>
                        <a
                          key={idx}
                          href={value.value}
                          target="_blank"
                          className="underline"
                        >
                          {value.value}
                        </a>
                      </span>
                    </span>
                  );
                }
                return jsx;
              }
              if (isValidUrl(value.value)) {
                return (
                  <span
                    key={idx}
                    className={`w-full block text-[12px] max-w-[650px] whitespace-nowrap overflow-hidden text-ellipsis ${textColor} font-[500] ${padding}`}
                  >
                    <span className="text-[#751DEA]">{value.key}: </span>
                    <span>
                      <a
                        href={value.value}
                        target="_blank"
                        className="underline"
                      >
                        {value.value}
                      </a>
                    </span>
                  </span>
                );
              }
              return (
                <span
                  key={idx}
                  className={`w-full block text-[12px] max-w-[650px] whitespace-nowrap overflow-hidden text-ellipsis ${textColor} font-[500] ${padding}`}
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
    </>
  );
}

export default React.memo(CustomeNode);
