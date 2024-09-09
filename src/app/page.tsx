import { LinkIcon } from "@heroicons/react/16/solid";
import Image from "next/image";

export default function Home() {
  return (

      <main className="min-h-screen w-screen h-screen">
        <p
          id="p-e"
          style={{
            width: "fit-content",
            padding: "10px",
            height: "fit-content",
            fontSize: 12,
          }}
        >
          squadName: "Super hero squad"
        </p>
        <span
          className={`w-full flex justify-center items-center text-[12px] font-[500]`}
        >
          homeTown
          <span className="p-[10px]">(1)</span>
          <span>
            <LinkIcon className="w-4" />
          </span>
        </span>
      </main>
  );
}
