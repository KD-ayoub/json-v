import { create } from "zustand";
import { parsEditorData } from "./parsingJson";
import { NodeData } from "reaflow";

export type MyNodeData = {
  id: string;
  key: any;
  value: any;
  type:
    | "object"
    | "array"
    | "property"
    | "string"
    | "number"
    | "boolean"
    | "null"
    | undefined;
  isParent: boolean;
  length: number;
  isAlone: boolean;
  isArrayParent: boolean;
};

export type MyNodeType = NodeData<any> & {
  id: string;
  width: number;
  height: number;
  data: MyNodeData[];
  hasParent: boolean;
  isChildOf: string;
  collapse: boolean | undefined;
};

export type MyEdgeType = {
  id: string;
  from: string;
  to: string;
};

type State = {
  nodes: MyNodeType[];
  edges: MyEdgeType[];
  collapsedNodes: MyNodeType[];
  collapsedEdges: MyEdgeType[];
};

type Action = {
  setNode: (json: any) => void;
  setEdges: (edges: MyEdgeType[]) => void;
  setNodes: (nodes: MyNodeType[]) => void;
  setCollapsedNodes: (collapsedNodes: MyNodeType[], collapse: boolean) => void;
  setCollapsedEdges: (collapsedEdges: MyEdgeType[], collapse: boolean) => void;
};

const useNodes = create<State & Action>((set, get) => ({
  nodes: [],
  edges: [],
  collapsedNodes: [],
  collapsedEdges: [],
  setEdges: (edges: MyEdgeType[]) => {
    const nodes = get().nodes;
    set({ nodes, edges: edges });
  },
  setNodes: (nodes: MyNodeType[]) => {
    const edges = get().edges;
    set({ nodes: nodes, edges });
  },
  setCollapsedNodes: (collapsedNodes: MyNodeType[]) => {
    const nodes = get().nodes;
    const edges = get().edges;
    set({ nodes: nodes, edges: edges, collapsedNodes });
  },
  setCollapsedEdges: (collapsedEdges: MyEdgeType[]) => {
    const nodes = get().nodes;
    const edges = get().edges;
    set({ nodes: nodes, edges: edges, collapsedEdges });
  },
  setNode: (json: any) => {
    const initialNode: MyNodeType[] = [];
    const initialEdges: MyEdgeType[] = [];
    parsEditorData(json, initialNode, initialEdges);
    set({ nodes: initialNode, edges: initialEdges });
  },
}));

export default useNodes;
