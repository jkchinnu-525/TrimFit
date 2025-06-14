import Image from "next/image";

export default function Section() {
  return (
    <div id="section" className="pt-64 relative">
      {/* Elliptical gradient background under text */}
      <div className="absolute pt-36 pr-60 top-1/2 left-[0%] -translate-y-1/2 w-[980px] h-[600px] pointer-events-none">
        <div
          className="w-full h-full rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse, #3F8F8D 0%, rgba(63, 143, 141, 0.7) 40%, transparent 80%)",
            filter: "blur(100px)",
          }}
        />
      </div>
      <div className="relative pb-44 ">
        <div className="ml-28 relative max-w-3xl z-10">
          <div className="flex justify center items-center rounded-2xl gap-2 max-w-fit  bg-[#31484D] p-2">
            <div className="relative flex justify-center items-center bg-stone-500/40 ml-1 rounded-full w-2 h-2">
              <div className="flex justify-center items-center bg-[#4FB3B0] rounded-full w-2 h-2 animate-ping">
                <div className="flex justify-center items-center bg-white/50 rounded-full w-2 h-2 animate-ping"></div>
              </div>
              <div className="top-1/2 left-1/2 absolute flex justify-center items-center bg-[#4FB3B0]/80 rounded-full w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <p className="text-xs font-medium font-['Inter'] pr-2 text-white">
              Built for your job searching
            </p>
          </div>
          <Image
            src="/Text.png"
            alt="section"
            width={420}
            height={100}
            className="pt-4"
          />
          <p className="text-black font-semibold font-['Inter'] text-[16px] leading-[24px] mt-8">
            Tailoring your resume isn&apos;t just about <br />
            keywords—it&apos;s about positioning yourself <br /> as the solution
            to the employer&apos;s needs.
          </p>
          <div className="flex gap-4 mt-8 w-fit items-center">
            <div className="bg-transparent h-[44px] rounded-2xl backdrop-blur-xs cursor-pointer hover:bg-gradient-to-t hover:from-[#4FB3B0]/45 hover:via-[#4FB3B0]/10 hover:to-transparent inline-flex items-center px-6 shadow-[0px_1.1877729892730713px_4.751091957092285px_0px_rgba(0,0,0,0.25),inset_-0.2969432473182678px_-2.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,0.8),inset_0.2969432473182678px_0.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,1)] transition-all duration-300">
              <button className=" text-[14px] text-[#1b788a] font-regular cursor-pointer font-['Inter'] leading-[1.5] flex items-center gap-2">
                Login
              </button>
            </div>
            <div className="bg-transparent h-[44px] rounded-2xl backdrop-blur-xs cursor-pointer hover:bg-gradient-to-t hover:from-[#4FB3B0]/45 hover:via-[#4FB3B0]/10 hover:to-transparent inline-flex items-center px-6 shadow-[0px_1.1877729892730713px_4.751091957092285px_0px_rgba(0,0,0,0.25),inset_-0.2969432473182678px_-2.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,0.8),inset_0.2969432473182678px_0.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,1)] transition-all duration-300">
              <button className=" text-[14px] text-[#1b788a] font-medium cursor-pointer font-['Inter'] leading-[1.5] flex items-center gap-2">
                Try Now
                <div className="pt-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -right-1  top-[35%] -translate-y-1/2 z-10">
          <Image
            src="/Pic.png"
            alt="section"
            width={600}
            height={100}
            className="shadow-[0px_0px_30px_8px_#78B1AF] rounded-[64px] border-6 border-[#3F8F8D]/60 h-[430px] w-[680px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
