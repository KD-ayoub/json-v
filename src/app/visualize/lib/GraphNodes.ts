import { create } from "zustand";
import { parsEditorData } from "./parsingJson";

export type MyNodeData = {
  id: string;
  key: any;
  value: any;
  type: 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null' | undefined;
  isParent: boolean,
};

export type MyNodeType = {
  id: string;
  width: number;
  height: number;
  data: MyNodeData[];
  hasParent: boolean,
};

export type MyEdgeType = {
  id: string,
  from: string,
  to: string
}

type State = {
  nodes: MyNodeType[];
  edges: MyEdgeType[];
};

type Action = {
  setNode: (json: any) => void;
};

const initialNode: MyNodeType[] = [];
const initialEdges: MyEdgeType[] = []

const useNodes = create<State & Action>((set, get) => ({
  nodes: [],
  edges: [],
  setNode: (json: any) => {
    const data = parsEditorData(json, initialNode, initialEdges);
    console.log("returned.//", initialNode);
    set({ nodes: initialNode, edges: initialEdges });
    // set(() => ({ nodes: node })) ;
  },
}));

export default useNodes;
