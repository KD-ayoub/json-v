import { Node, parseTree } from "jsonc-parser";
import { MyEdgeType, MyNodeData, MyNodeType } from "./GraphNodes";
import { sum } from "lodash";

let idCounter = 0;
let ids: string[] = [];
function generateUniqueId() {
  idCounter += 1;
  return idCounter.toString();
}

function extractLength(child: Node) {
  let count = 0;
  let found = false;
  if (child.children) {
    child.children?.forEach((child, idx) => {
      if (child.children) {
        if (child.children[1].type === "object") {
          count += 1;
        } else if (simpleObjectValuesType(child.children[1].type)) {
          found = true;
        }
      }
    });
    if (found) {
      count += 1;
    }
  }
  return count;
}

export function extraxWidthAndHeight(str: string, isString: boolean) {
  const dummyElement = document.createElement("div");
  dummyElement.innerHTML = str;
  dummyElement.style.fontSize = "12px";
  dummyElement.style.width = "fit-content";
  dummyElement.style.height = "fit-content";
  dummyElement.style.padding = "10px";
  dummyElement.style.fontWeight = "500";
  document.body.appendChild(dummyElement);
  const clientRect = dummyElement.getBoundingClientRect();
  const width = clientRect.width + 8;
  const height = clientRect.height;
  document.body.removeChild(dummyElement);
  return { width, height };
}

function simpleObjectValuesType(type: string) {
  const array = ["string", "number", "boolean", "null"];
  return array.includes(type);
}

function parseSimpleObject(children: Node[]) {
  const key = children.at(0)?.value;
  const value = children.at(1)?.value;
  const type = children.at(1)?.type;
  const data = {
    id: generateUniqueId(),
    key: key,
    value: value,
    type: type,
    isParent: false,
    length: 0,
    isAlone: false,
  };
  return data;
}

function filterSimpleObjectChildren(children: Node[]) {
  return children.filter((child, idx) => {
    if (child.children) {
      return child.children[1].type !== "object";
    }
  });
}

function filterObjectChildren(children: Node[]) {
  return children.filter((child, idx) => {
    if (child.children) {
      return child.children[1].type === "object";
    }
  });
}

function filterArrayChildren(children: Node[]) {
  return children.filter((child, idx) => {
    if (child.children) {
      return child.children[1].type === "array";
    }
  });
}

function getLongestElement(children: Node[]) {
  let widths: number[] = [];
  let heights: number[] = [];
  let filteredChildren = filterSimpleObjectChildren(children);
  filteredChildren.forEach((child) => {
    const key = child.children?.at(0)?.value;
    const value = child.children?.at(1)?.value;
    const { width, height } = extraxWidthAndHeight(
      `${key}: ${value}`,
      typeof value === "string"
    );
    widths.push(width);
    heights.push(height);
  });
  const calculated =
    filteredChildren.length > 1 ? 56 + 18 * (filteredChildren.length - 2) : 38; // 28 + 18 + 28 /// 28 + 18 + 18 + 28
  return {
    width: Math.max(...widths),
    height: calculated,
    id: generateUniqueId(),
  };
}

/// case Object
function parseObject(
  children: Node[],
  formated: MyNodeType,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[],
  isChildOf: string,
  passedRoot: boolean
) {
  const filteredSimpleChildren = filterSimpleObjectChildren(children);
  const filteredChildren = filterObjectChildren(children);
  console.log(filteredSimpleChildren, filteredChildren);
  if (filteredSimpleChildren.length === 0 && !passedRoot) {
    const rootNode = parseTree(JSON.stringify({ Object: "Root" }, null, 2));
    if (rootNode?.children) {
      console.log("childrenenenrne", rootNode.children);
      const node = parseSimpleObject(rootNode.children[0].children!);
      formated.data.push(node);
      const { width, height, id } = getLongestElement(rootNode.children);
      formated.width = width;
      formated.height = height;
      formated.id = id;
      formated.isChildOf = isChildOf;
      ids.push(isChildOf);
      console.log("formated", formated);
      initialNode.push(formated);
    }
  }
  if (filteredSimpleChildren.length > 0) {
    filteredSimpleChildren.forEach((child, idx) => {
      if (child.children) {
        const node = parseSimpleObject(child.children);

        formated.data.push(node);
      }
    });
    const { width, height, id } = getLongestElement(children);
    formated.width = width;
    formated.height = height;
    formated.id = id;
    formated.isChildOf = isChildOf;
    ids.push(isChildOf);
    initialNode.push(formated);
  }
  if (filteredChildren.length > 0) {
    filteredChildren.forEach((child, idx) => {
      if (child.children) {
        const length = extractLength(child.children[1]);
        const { width, height } = extraxWidthAndHeight(
          `${child.children[0].value}(${length})`,
          true
        );
        const node = {
          id: generateUniqueId(),
          width: width + 45 > 300 ? 320 : width + 45,
          height: height,
          data: [
            {
              id: generateUniqueId(),
              type: child.children[0].type,
              key: child.children[0].value,
              value: "",
              isParent: true,
              length: length || -1,
              isAlone: false,
            },
          ],
          hasParent: true,
          isChildOf: isChildOf === "root" ? formated.id : isChildOf,
          collapse: false,
        };
        ids.push(formated.id);
        initialNode.push(node);
        traverseTree(
          child.children[1],
          initialNode,
          true,
          node.id,
          initialEdges,
          true
        );
      }
    });
  }
}

function addEdges(initialEdges: MyEdgeType[], initialNode: MyNodeType[]) {
  for (let i = 1; i < initialNode.length; i++) {
    initialEdges.push({
      id: `${initialNode[i].isChildOf}-${initialNode[i].id}`,
      from: `${initialNode[i].isChildOf}`,
      to: `${initialNode[i].id}`,
    });
  }
}

function traverseTree(
  parsedTree: Node,
  initialNode: MyNodeType[],
  hasParent: boolean,
  isChildOf: string,
  initialEdges: MyEdgeType[],
  passedRoot: boolean
) {
  let formated: MyNodeType = {
    id: "",
    width: 0,
    height: 0,
    data: [],
    hasParent: hasParent,
    isChildOf: "",
    collapse: undefined,
  };
  if (!parsedTree.children) {
    console.log("Error in traverseTree");
    return;
  }
  if (parsedTree.type === "object") {
    parseObject(
      parsedTree.children,
      formated,
      initialNode,
      initialEdges,
      isChildOf,
      passedRoot
    );
  } else if (parsedTree.type === "array") {
    /// logic for array
    console.log("is Array", parsedTree.children, initialNode);
  }
}

export function parsEditorData(
  obj: any,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[]
) {
  try {
    console.log("beforeEntry", Array.isArray(obj));
    if (Array.isArray(obj)) {
      obj = obj.flat(Infinity);
    }
    console.log("afterIf", obj);
    const parsedTree = parseTree(JSON.stringify(obj, null, 2));
    if (!parsedTree) throw new Error("Error in parsedTree");
    console.log("parsedTree", parsedTree);
    traverseTree(parsedTree, initialNode, false, "root", initialEdges, false);
    addEdges(initialEdges, initialNode);

    console.log("initn", initialNode);
    return [];
  } catch (error) {
    console.error("Error in parsedTree");
    return [];
  }
}
