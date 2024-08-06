import { Node, parseTree } from "jsonc-parser";
import { MyEdgeType, MyNodeData, MyNodeType } from "./GraphNodes";
import { sum } from "lodash";

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
    id: Math.random().toString(),
    key: key,
    value: value,
    type: type,
    isParent: false,
  };
  //   const { width, height } = extraxWidthAndHeight(`${key}: ${value}`, typeof value === "string");
  return data;
}

function filterObjectChildren(children: Node[]) {
  return children.filter((child, idx) => {
    if (child.children) {
      return child.children[1].type !== "object";
    }
  });
}

function getLongestElement(children: Node[]) {
  let widths: number[] = [];
  let heights: number[] = [];
  let filteredChildren = filterObjectChildren(children);
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
    id: Math.random().toString(),
  };
}

function parentNode(
  child: Node,
  parentformated: MyNodeType,
  initialNode: MyNodeType[]
) {
  console.log("childe in parentNode", child);
  const { width, height } = extraxWidthAndHeight(`${child.value}(1)`, true);
  console.log("parentNode", width, height, child.value);
  // parentformated.id = Math.random().toString();
  // parentformated.width = width + 45 > 300 ? 320 : width + 45;
  // parentformated.height = height;
  // parentformated.data.push({
  //   id: (Math.random() + 1).toString(),
  //   type: child.type,
  //   key: child.value,
  //   value: "",
  //   isParent: true,
  // });
  initialNode.push({
    id: Math.random().toString(),
    width: width + 45 > 300 ? 320 : width + 45,
    height: height,
    data: [
      {
        id: (Math.random() + 1).toString(),
        type: child.type,
        key: child.value,
        value: "",
        isParent: true,
      },
    ],
  });
}

/// case Object
function parseObject(
  children: Node[],
  type: string,
  parentformated: MyNodeType,
  formated: MyNodeType,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[]
) {
  console.log("ParseObject--)-)-)-)-)", children);
  children.forEach((child, idx) => {
    if (
      child.children &&
      simpleObjectValuesType(child.children[0].type) &&
      simpleObjectValuesType(child.children[1].type)
    ) {
      /// does not have a child
      console.log("entered........", idx, formated);
      formated.data.push(parseSimpleObject(child.children));
      const { width, height, id } = getLongestElement(children);
      formated.width = width;
      formated.height = height;
      formated.id = id;
    }
    if (
      child.children &&
      child.children[1].children &&
      !simpleObjectValuesType(child.children[1].type)
    ) {
      //// has child
      console.log("i wan t here  ??;;;;::::///", formated.id);
      parentNode(child.children[0], parentformated, initialNode);
      // initialNode.push(parentformated);
      traverseTree(child.children[1], initialNode, initialEdges);
      // parseObject(child.children[1].children, type, parentformated, formated, initialNode, initialEdges);
    }
  });
  console.log("all done done", initialNode);
  addEdges(parentformated, formated, initialEdges, initialNode);
}

function addEdges(
  parentformated: MyNodeType,
  formated: MyNodeType,
  initialEdges: MyEdgeType[],
  initialNode: MyNodeType[]
) {
  console.log("addEdges", parentformated, formated, initialEdges, initialNode);
  // if (parentformated.id) {
  //   initialEdges.push({
  //     id: `${parentformated.id}-${formated.id}`,
  //     from: `${parentformated.id}`,
  //     to: `${formated.id}`,
  //   });
  // }
}

function traverseTree(
  parsedTree: Node,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[]
) {
  if (!parsedTree.children) {
    console.log("Error in traverseTree");
    return;
  }
  if (parsedTree.type === "object") {
    let formated: MyNodeType = {
      id: "",
      width: 0,
      height: 0,
      data: [],
    };
    let parentformated: MyNodeType = {
      id: "",
      width: 0,
      height: 0,
      data: [],
    };

    parseObject(
      parsedTree.children,
      parsedTree.type,
      parentformated,
      formated,
      initialNode,
      initialEdges
    );
    initialNode.push(formated);
    // initialNode.push(parentformated);
    console.log("initialNode after", initialNode, initialEdges);
  } else {
    console.log("not object", parsedTree);
  }
}

export function parsEditorData(
  obj: any,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[]
) {
  try {
    const parsedTree = parseTree(JSON.stringify(obj, null, 2));
    if (!parsedTree) throw new Error("Error in parsedTree");
    console.log("treeeee", parsedTree);
    traverseTree(parsedTree, initialNode, initialEdges);
    console.log("initial", initialNode);
    return [];
  } catch (error) {
    console.error("Error in parsedTree");
    return [];
  }
}
