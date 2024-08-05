import { create } from "zustand";
import { parsEditorData } from "./parsingJson";

export type MyNodeData = {
  id: string;
  key: any;
  value: any;
  type: 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null' | undefined;
};

export type MyNodeType = {
  id: string;
  width: number;
  height: number;
  data: MyNodeData[];
};

type State = {
  nodes: MyNodeType[];
};

type Action = {
  setNode: (json: any) => void;
};

const initialNode: MyNodeType[] = [{
  id: "",
  width: 0,
  height: 0,
  data: [],
}];

const useNodes = create<State & Action>((set, get) => ({
  nodes: initialNode,
  setNode: (json: any) => {
    const data = parsEditorData(json, initialNode);
    console.log("returned.//", initialNode);
    set({ nodes: initialNode });
    // set(() => ({ nodes: node })) ;
  },
}));

export default useNodes;
