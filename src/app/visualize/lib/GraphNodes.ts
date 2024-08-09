import { create } from "zustand";
import { parsEditorData } from "./parsingJson";

export type MyNodeData = {
  id: string;
  key: any;
  value: any;
  type: 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null' | undefined;
  isParent: boolean,
  length: number
};

export type MyNodeType = {
  id: string;
  width: number;
  height: number;
  data: MyNodeData[];
  hasParent: boolean,
  isChildOf: string,
  collapse: boolean | undefined
};

export type MyEdgeType = {
  id: string,
  from: string,
  to: string
}

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
  setCollapsedNodes: (collapsedNodes: MyNodeType[], collapse: boolean) => void
  setCollapsedEdges: (collapsedEdges: MyEdgeType[], collapse: boolean) => void
};

const initialNode: MyNodeType[] = [];
const initialEdges: MyEdgeType[] = []

const useNodes = create<State & Action>((set, get) => ({
  nodes: [],
  edges: [],
  collapsedNodes: [],
  collapsedEdges: [],
  setEdges: (edges: MyEdgeType[]) => { 
    const nodes = get().nodes;
    set({ nodes, edges: edges }) 
  },
  setNodes: (nodes: MyNodeType[]) => { 
    const edges = get().edges;
    set({ nodes: nodes, edges }) 
  },
  setCollapsedNodes: (collapsedNodes: MyNodeType[], collapse: boolean) => { 
    const nodes = get().nodes;
    const edges = get().edges;
    if (collapse) {
      console.log("zusNodes", collapsedNodes);
      set({ nodes: nodes, edges: edges, collapsedNodes }) 
    } else {
      set({ nodes: nodes, edges: edges, collapsedNodes: [] }) 
    }
  },
  setCollapsedEdges: (collapsedEdges: MyEdgeType[], collapse: boolean) => { 
    const nodes = get().nodes;
    const edges = get().edges;
    if (collapse) {
      console.log("zusEdges", collapsedEdges);
      set({ nodes: nodes, edges: edges, collapsedEdges }) 
    } else {
      set({ nodes: nodes, edges: edges, collapsedEdges: [] }) 
    }
  },
  setNode: (json: any) => {
    const data = parsEditorData(json, initialNode, initialEdges);
    console.log("returned.//", initialNode);
    set({ nodes: initialNode, edges: initialEdges });
    // set(() => ({ nodes: node })) ;
  },
}));

export default useNodes;
