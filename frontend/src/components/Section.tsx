import Image from "next/image";
import Link from "next/link";
import { verifySession } from "@/lib/session";

export default async function Section() {
  const { isAuth } = await verifySession();
  return (
    <div id="section" className="pt-28 md:pt-32 lg:pt-64 relative">
      <div className="absolute pt-36 sm:pr-60 top-1/2 -left-[25%] sm:left-[0%] -translate-y-1/2 w-[500px] h-[400px] sm:w-[700px] sm:h-[480px] md:w-[980px] md:h-[600px] xl:w-[1200px] xl:h-[700px] pointer-events-none">
        <div
          className="w-full h-full rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse, #3F8F8D 0%, rgba(63, 143, 141, 0.7) 40%, transparent 80%)",
            filter: "blur(100px)",
          }}
        />
      </div>
      <div className="relative flex flex-row pb-16 md:pb-32 lg:pb-44">
        <div className="md:px-8 lg:ml-28 relative max-w-full lg:max-w-3xl z-10">
          <div className="flex justify-start items-center rounded-2xl gap-2 max-w-fit bg-[#31484D] p-2 mx-auto ml-1 sm:ml-2 md:ml-0 md:mx-0">
            <div className="relative flex justify-center items-center bg-stone-500/40 ml-1 rounded-full w-2 h-2">
              <div className="flex justify-center items-center bg-[#4FB3B0] rounded-full w-2 h-2 animate-ping">
                <div className="flex justify-center items-center bg-white/50 rounded-full w-2 h-2 animate-ping"></div>
              </div>
              <div className="top-1/2 left-1/2 absolute flex justify-center items-center bg-[#4FB3B0]/80 rounded-full w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <p className="text-[8px] sm:text-xs font-medium font-Inter pr-2 text-white">
              Built for your job searching
            </p>
          </div>
          <div className="flex ml-1 sm:ml-2 lg:ml-0 lg:justify-center md:justify-start">
            <Image
              src="/Text.png"
              alt="section"
              width={420}
              height={100}
              className="pt-4 w-[170px] sm:w-[280px] md:w-[350px] lg:w-[420px] h-auto"
            />
          </div>
          <p className="text-black font-semibold font-Inter mr-12 pr-8 text-[10px] sm:text-[12px] md:text-[15px] lg:text-[16px] leading-[14px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] mt-8 md:mt-7 lg:mt-8 ml-1 sm:pl-1 sm:px-4 sm:mr-0 md:px-0 text-left">
            Tailoring your resume isn&apos;t just about{" "}
            <br className="hidden sm:block" />
            keywords—it&apos;s about positioning yourself as
            <br className="hidden md:block" /> solution to the employer&apos;s
            needs.
          </p>
          {!isAuth && (
            <div className="flex sm:flex-row gap-2 sm:gap-4 pr-6 pl-0 sm:pl-2 md:pl-0 md:gap-4 mt-6 md:mt-7 lg:mt-8 items-center justify-start">
              <Link
                href="/signin"
                className="bg-transparent h-[40px] sm:h-[44px] w-fit rounded-2xl backdrop-blur-xs cursor-pointer hover:bg-gradient-to-t hover:from-[#4FB3B0]/45 hover:via-[#4FB3B0]/10 hover:to-transparent inline-flex items-center justify-center px-6 shadow-[0px_1.1877729892730713px_4.751091957092285px_0px_rgba(0,0,0,0.25),inset_-0.2969432473182678px_-2.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,0.8),inset_0.2969432473182678px_0.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,1)] transition-all duration-300"
              >
                <span className="text-[12px] sm:text-[14px] text-[#1b788a] font-regular cursor-pointer font-Inter leading-[1.5] flex items-center gap-2">
                  Login
                </span>
              </Link>
            </div>
          )}
          <div className="flex sm:flex-row gap-2 sm:gap-4 pr-6 pl-0 sm:pl-2 md:pl-0 md:gap-4 mt-6 md:mt-7 lg:mt-8 items-center justify-start">
            <Link
              href="/signup"
              className="bg-transparent h-[40px] sm:h-[44px] w-fit rounded-2xl backdrop-blur-xs cursor-pointer hover:bg-gradient-to-t hover:from-[#4FB3B0]/45 hover:via-[#4FB3B0]/10 hover:to-transparent inline-flex items-center justify-center px-6 shadow-[0px_1.1877729892730713px_4.751091957092285px_0px_rgba(0,0,0,0.25),inset_-0.2969432473182678px_-2.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,0.8),inset_0.2969432473182678px_0.5938864946365356px_0.5938864946365356px_0px_rgba(63,143,141,1)] transition-all duration-300"
            >
              <span className="text-[12px] sm:text-[14px] text-[#1b788a] font-medium cursor-pointer font-Inter leading-[1.5] flex items-center sm:gap-2">
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
              </span>
            </Link>
          </div>
        </div>
        <div className="relative mt-4 sm:mt-8 md:mt-12 md:right-2 md:absolute md:top-[35%] xl:top-[30%] md:-translate-y-1/2 z-10 px-0 sm:px-2 md:px-0">
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/Pic.png"
              alt="section"
              width={600}
              height={430}
              className="shadow-[0px_0px_15px_4px_#78B1AF] md:shadow-[0px_0px_25px_6px_#78B1AF] lg:shadow-[0px_0px_30px_8px_#78B1AF] rounded-[32px] md:rounded-[48px] lg:rounded-[64px] border-3 md:border-4 lg:border-6 border-[#3F8F8D]/60 h-[210px] w-[520px] sm:h-[270px] md:h-[320px] xl:h-[380px] sm:w-[500px] md:w-[350px] xl:w-[600px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
