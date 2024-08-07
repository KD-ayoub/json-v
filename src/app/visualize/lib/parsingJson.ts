import { Node, parseTree } from "jsonc-parser";
import { MyEdgeType, MyNodeData, MyNodeType } from "./GraphNodes";
import { sum } from "lodash";

let idCounter = 0;

function generateUniqueId() {
  idCounter += 1;
  return idCounter.toString();
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
    id: generateUniqueId(),
  };
}

function parentNode(
  child: Node,
  formated: MyNodeType,
  initialNode: MyNodeType[]
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
  initialNode.push({
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
      },
    ],
    hasParent: true,
    parentOf: (idCounter + 2).toString()
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
  // console.log("ParseObject--)-)-)-)-)", children);
  children.forEach((child, idx) => {
    if (
      child.children &&
      simpleObjectValuesType(child.children[0].type) &&
      simpleObjectValuesType(child.children[1].type)
    ) {
      /// does not have a child
      formated.data.push(parseSimpleObject(child.children));
      const { width, height, id } = getLongestElement(children);
      formated.width = width;
      formated.height = height;
      formated.id = id;
      console.log("entered........", idx, formated.id);
    }
    if (
      child.children &&
      child.children[1].children &&
      !simpleObjectValuesType(child.children[1].type)
    ) {
      //// has child
      // console.log("i wan t here  ??;;;;::::///", formated.id);
      parentNode(child.children[0], formated, initialNode);
      // initialNode.push(parentformated);
      traverseTree(child.children[1], initialNode, true, initialEdges);
      // parseObject(child.children[1].children, type, parentformated, formated, initialNode, initialEdges);
    }
  });
  // console.log("all done done", initialNode);
}

function addEdges(initialEdges: MyEdgeType[], initialNode: MyNodeType[]) {
  const reversedNodes = [...initialNode].reverse();
  console.log("reversed", reversedNodes);
  // Iterate through the reversed array and add edges
  let parent:string[] = [];
  for (let i = 0; i < reversedNodes.length; i++) {
    const currentNode = reversedNodes[i];
    
    if (currentNode.hasParent && currentNode.data[0].isParent) {
      console.log(`printed, ${currentNode.id}`);
      initialEdges.push({
        id: `${currentNode.id}-${reversedNodes[i - 1].id}`,
        from: `${currentNode.id}`,
        to: `${reversedNodes[i - 1].id}`,
      });
      parent.push(currentNode.id);
      // parent.push(reversedNodes[i - 1].id);
    } 
    else if (currentNode.hasParent) {
      console.log("printedElse", currentNode.id);
      parent.push(currentNode.id);
      // initialEdges.push({
      //   id: `${currentNode.id}-${currentNode.parentOf}`,
      //   from: `${currentNode.id}`,
      //   to: `${currentNode.parentOf}`,
      // });
    }
    // if (!nextNode) {
    //   initialEdges.push({
    //     id: `${reversedNodes[0].id}-${
    //       reversedNodes[reversedNodes.length - 1].id
    //     }`,
    //     from: `${reversedNodes[0].id}`,
    //     to: `${reversedNodes[reversedNodes.length - 1].id}`,
    //   });

    //   break;
    // }
  }
  console.log(
    `${reversedNodes[0].id}-${reversedNodes[reversedNodes.length - 1].id}`,parent
  );
}

function traverseTree(
  parsedTree: Node,
  initialNode: MyNodeType[],
  hasParent: boolean,
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
      hasParent: hasParent,
      parentOf: ""
    };
    let parentformated: MyNodeType = {
      id: "",
      width: 0,
      height: 0,
      data: [],
      hasParent: false,
      parentOf: ""
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

    traverseTree(parsedTree, initialNode, false, initialEdges);
    addEdges(initialEdges, initialNode);
    console.log("initial", initialNode);
    return [];
  } catch (error) {
    console.error("Error in parsedTree");
    return [];
  }
}
