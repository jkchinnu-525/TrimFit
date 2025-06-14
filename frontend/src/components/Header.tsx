import { Navigation } from "./Navigation";
export default function Header() {
  return (
    <div className="sticky top-4 z-50  mt-6 flex justify-center items-center">
      {/* Background with blur and shadow, more rounded and responsive */}
      <div className="absolute left-0 right-0 top-0 z-0 flex justify-center items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-start justify-start p-0">
          <div className="backdrop-blur-[8.97836px] backdrop-filter bg-[rgba(255,255,255,0.2)] h-[80px] rounded-full w-full relative shadow-[-5.02788px_0px_7.32634px_0px_rgba(0,0,0,0.25),5.02788px_9.33749px_10.774px_0px_rgba(0,0,0,0.25)]">
            <div className="absolute border-[2px] border-[rgba(255,255,255,0.2)] border-solid inset-[-4px] pointer-events-none rounded-full" />
          </div>
        </div>
      </div>
      {/* Nav content tightly grouped and responsive */}
      <div className="absolute left-0 right-0 top-0 z-10 flex justify-center items-center w-full h-[80px]">
        <div className="w-full max-w-4xl flex flex-row items-center justify-between h-full px-6">
          {/* Logo */}
          <div className="flex cursor-pointer items-center">
            <div
              className="bg-[50%_50%] bg-cover bg-no-repeat h-[36px] w-[120px] mr-4"
              style={{ backgroundImage: "url(/Image.png)" }}
            />
          </div>
          {/* Navigation Links */}
          <Navigation />
        </div>
      </div>
    </div>
  );
}
