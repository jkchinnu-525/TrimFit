import Image from "next/image";

export default function Aboutus() {
  return (
    <div id="aboutus" className=" py-40 flex justify-center items-center">
      <Image
        src="/Aboutus.png"
        alt="aboutus"
        width={1200}
        height={1200}
        className="w-full "
      />
    </div>
  );
}
