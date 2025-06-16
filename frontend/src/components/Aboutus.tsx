import Image from "next/image";

export default function Aboutus() {
  return (
    <div
      id="aboutus"
      className="py-20 md:py-32 lg:py-40 flex justify-center items-center px-4 md:px-8"
    >
      <Image
        src="/Aboutus.png"
        alt="aboutus"
        width={1200}
        height={1200}
        className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl h-auto"
      />
    </div>
  );
}
