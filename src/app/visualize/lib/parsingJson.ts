import { debounce } from "lodash";
export const debouncedFunction = debounce((value: unknown) => parsEditorData(value), 4000);

function extractKeyAndValue(obj: any) {
    const entries = Object.entries(obj);
    console.log("entries:::", entries, typeof entries[0][1])
    if (typeof entries[0][1] === "string") {
        return entries[0][0] + ": " + `"${entries[0][1]}"`;
    }
    return entries[0][0] + ": " + entries[0][1];
}

export function parsEditorData(obj: any) {
    console.log("obj here", obj, JSON.stringify(obj, null, 2));
    const extracted = extractKeyAndValue(obj);
    console.log(`extracted: '${extracted}'`);
    const dummyElement = document.createElement('div');
    dummyElement.innerHTML = extracted;
    dummyElement.style.fontSize = "12px";
    dummyElement.style.width = "fit-content";
    dummyElement.style.height = "fit-content";
    dummyElement.style.padding = "10px";
    dummyElement.style.fontWeight = "500";
    document.body.appendChild(dummyElement);

    console.log("finally", dummyElement.getBoundingClientRect(), extracted);
    const clientRect = dummyElement.getBoundingClientRect();
    const width = clientRect.width + 4;
    const height = clientRect.height;
    document.body.removeChild(dummyElement);
    return { width , height };
    // let append = nodesData;
    // append.push({
    //   id: "1",
    //   height: 200,
    //   width: 200,
    //   data: obj,
    // });
    // const { width, height } = calculateDimensions(obj);
  }