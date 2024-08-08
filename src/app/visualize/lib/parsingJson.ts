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
  console.log("lengthlzntght", child);
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
  };
  //   const { width, height } = extraxWidthAndHeight(`${key}: ${value}`, typeof value === "string");
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

function parentNode(
  child: Node,
  formated: MyNodeType,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[]
) {
  console.log("childe in parentNode", child);
  const { width, height } = extraxWidthAndHeight(`${child.value}(1)`, true);
  console.log("parentNode§§§§", initialNode, formated);
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
  //   initialEdges.push({
  //     id: `${parentformated.id}-${formated.id}`,
  //     from: `${parentformated.id}`,
  //     to: `${formated.id}`,
  //   });
  // }
  const node = {
    id: generateUniqueId(),
    width: width + 45 > 300 ? 320 : width + 45,
    height: height,
    data: [
      {
        id: generateUniqueId(),
        type: child.type,
        key: child.value,
        value: "",
        isParent: true,
        length: 0,
      },
    ],
    hasParent: true,
    isChildOf: "",
  };
  ids.push(node.id);
  initialNode.push(node);
  initialEdges.push({
    id: `${formated.id}-${node.id}`,
    from: `${formated.id}`,
    to: `${node.id}`,
  });
}

function hasNetsedObject(children: Node[]) {
  console.log("extrat", children);
  children.forEach((child) => {
    if (child.children) {
      if (child.children[1].type === "object") {
        console.log("got object");
        return true;
      }
    }
  });
  return false;
}

/// case Object
function parseObject(
  children: Node[],
  type: string,
  parentformated: MyNodeType,
  formated: MyNodeType,
  initialNode: MyNodeType[],
  initialEdges: MyEdgeType[],
  isChildOf: string,
  prevId: string
) {
  const filteredSimpleChildren = filterSimpleObjectChildren(children);
  const filteredChildren = filterObjectChildren(children);
  console.log("all done inininin", filteredChildren, filteredSimpleChildren);
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
  console.log("all done done", filteredSimpleChildren, parentformated, ids);
  console.log("all done inininin", initialNode);
  if (filteredChildren.length > 0) {
    filteredChildren.forEach((child, idx) => {
      if (child.children) {
        // const id = generateUniqueId();
        // if (child.children[1].children) {
        //   console.log("enteredIF", prevId, formated.id);
        //   prevId = hasNetsedObject(child.children[1].children)?  id : formated.id;
        // }
        console.log("prevvvv", child.children);
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
            },
          ],
          hasParent: true,
          isChildOf: isChildOf === "root" ? formated.id : isChildOf,
        };
        console.log("connected", formated.id);
        ids.push(formated.id);
        initialNode.push(node);
        traverseTree(
          child.children[1],
          initialNode,
          true,
          node.id,
          initialEdges,
          prevId
        );
      }
    });
  }
}

function addEdges(initialEdges: MyEdgeType[], initialNode: MyNodeType[]) {
  for (let i = 1; i < initialNode.length; i++) {
    initialEdges.push({
      id: `${initialNode[i].isChildOf}-${initialNode[1].id}`,
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
  prevId: string
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
      hasParent: hasParent,
      isChildOf: "",
    };
    let parentformated: MyNodeType = {
      id: "",
      width: 0,
      height: 0,
      data: [],
      hasParent: false,
      isChildOf: "",
    };
    parseObject(
      parsedTree.children,
      parsedTree.type,
      parentformated,
      formated,
      initialNode,
      initialEdges,
      isChildOf,
      prevId
    );
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

    traverseTree(parsedTree, initialNode, false, "root", initialEdges, "");
    addEdges(initialEdges, initialNode);
    console.log("initial", initialNode);
    return [];
  } catch (error) {
    console.error("Error in parsedTree");
    return [];
  }
}
