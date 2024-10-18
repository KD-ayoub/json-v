import { LinkIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import img from "@/app/assets/images/white-bg.jpeg";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={img}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* <div className="text-center bg-white bg-opacity-80 p-8 rounded-lg shadow-lg z-10"> */}
        <h1 className="text-5xl font-bold text-[#751DEA]">
          Welcome to JSON Graph Visualizer
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Turn your JSON text into interactive graphs effortlessly.
        </p>
        <div className="mt-8">
          {/* <Image src={imgSvg} alt="Visualization" width={300} height={300} /> */}
        </div>
        <Link href="/visualize">
          <button className="mt-6 px-6 py-2 bg-[#751DEA] text-white font-semibold rounded-lg shadow-md hover:bg-[#5b12c1] transition duration-300">
            Start Visualizing
          </button>
        </Link>
      {/* </div> */}
    </main>
  );
}
