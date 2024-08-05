import { Node, parseTree } from "jsonc-parser";
import { MyNodeData, MyNodeType } from "./GraphNodes";
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
  };
  //   const { width, height } = extraxWidthAndHeight(`${key}: ${value}`, typeof value === "string");
  return data;
}
function getLongestElement(children: Node[]) {
  let widths: number[] = [];
  let heights: number[] = [];
  children.forEach((child) => {
    const key = child.children?.at(0)?.value;
    const value = child.children?.at(1)?.value;
    const { width, height } = extraxWidthAndHeight(
      `${key}: ${value}`,
      typeof value === "string"
    );
    widths.push(width);
    heights.push(height);
  });
  const calculated = children.length > 1 ? 56 + (18 * (children.length - 2)) : 38 // 28 + 18 + 28 /// 28 + 18 + 18 + 28
  return { width: Math.max(...widths), height: calculated, id: Math.random().toString()};
}

function parentNode(child: Node, formated: MyNodeType) {
  console.log("childe in parentNode", child);
  const { width, height } = extraxWidthAndHeight(
    `${child.value}   (1)`,
    true
  );
  console.log("child widtth", width, height);
  formated.id = Math.random().toString();
  formated.width = width;
  formated.height = height;
}

/// case Object
function parseObject(children: Node[], type: string, formated: MyNodeType) {
  
  children.forEach((child, idx) => {
    if (
      child.children &&
      simpleObjectValuesType(child.children[0].type) &&
      simpleObjectValuesType(child.children[1].type)
    ) {
      console.log("entered........");
      formated.data.push(parseSimpleObject(child.children));
      const { width, height, id} = getLongestElement(children);
      formated.width = width;
      formated.height = height;
      formated.id = id;
    } 
    if (child.children && child.children[1].children && !simpleObjectValuesType(child.children[1].type)) {
      console.log("i wan t here  ??;;;;::::///", child.children);
      parentNode(child.children[0], formated);
      parseObject(child.children[1].children, type, formated);
    }
  });
}

function traverseTree(parsedTree: Node, initialNode: MyNodeType[]) {
  if (!parsedTree.children) {
    console.log("Error in traverseTree");
    return;
  }
  if (parsedTree.type === "object") {
    let formated:MyNodeType = {
      id: "",
      width: 0,
      height: 0,
      data: []
    };
    parseObject(parsedTree.children, parsedTree.type, formated);
    initialNode.push(formated);
  } else {
    console.log("not object", parsedTree)
  }
}

export function parsEditorData(obj: any, initialNode: MyNodeType[]) {
  try {
    const parsedTree = parseTree(JSON.stringify(obj, null, 2));
    if (!parsedTree) throw new Error("Error in parsedTree");
    traverseTree(parsedTree, initialNode);
    console.log("initial", initialNode);
    return [];
  } catch (error) {
    console.error("Error in parsedTree");
    return [];
  }
}
