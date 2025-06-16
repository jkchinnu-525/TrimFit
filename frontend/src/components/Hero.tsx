"use client";
import { motion } from "framer-motion";
// import { useRef } from "react";
import "./HeroAnimations.css";
import Image from "next/image";

function cx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type BackgroundImageProps = {
  additionalClassNames?: string[];
  children?: React.ReactNode;
};

function BackgroundImage({
  children,
  additionalClassNames = [],
}: BackgroundImageProps) {
  return (
    <div
      className={cx(
        "absolute h-[450px] left-0 top-0 w-[386.511px]",
        ...additionalClassNames
      )}
    >
      {children}
    </div>
  );
}

function CardBorder() {
  return (
    <BackgroundImage>
      <div className="absolute h-[430px] md:h-[430px] left-0 rounded-[50px] top-0 w-[340px] md:w-[386px]">
        <div
          className="absolute inset-[-4.005px] pointer-events-none rounded-[54.0053px] border-[8.0106px] border-solid border-[#268382] shadow-[0px_0px_20px_0px_#268382] animate-optimized-glow will-change-transform"
          style={
            {
              "--glow-color": "#268382",
            } as React.CSSProperties
          }
        />
      </div>
    </BackgroundImage>
  );
}

export default function Hero() {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const inView = useInView(containerRef, {
  //   once: true,
  // });

  // Animation variants with proper typing
  // const headlineVariant = {
  //   initial: { opacity: 0, y: -200 },
  //   animate: {
  //     opacity: inView ? 1 : 0,
  //     y: inView ? 0 : -200,
  //   },
  // };

  // const tubeLightVariant = {
  //   initial: { opacity: 0, x: -300 },
  //   animate: {
  //     opacity: inView ? 1 : 0,
  //     x: inView ? 0 : -300,
  //   },
  // };

  // const cardsVariant = {
  //   initial: { opacity: 0, x: 300 },
  //   animate: {
  //     opacity: inView ? 1 : 0,
  //     x: inView ? 0 : 300,
  //   },
  // };

  return (
    <div id="hero">
      <div className="flex flex-col pb-16 md:pb-32 lg:pb-44">
        {/* Main hero container with proper height calculation */}
        <div className="relative w-full min-h-screen">
          <div className="relative w-full h-full" data-name="HeroSection">
            {/* Headline - Responsive */}
            <div className="absolute left-1/2 top-[60px] md:top-[80px] lg:top-[96.044px] 2xl:left-[850px] 3xl:top-[100px] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center text-center font-extrabold font-['Inter'] text-[#000] whitespace-pre px-4 md:px-6 lg:px-0">
              <p className="text-[24px] md:text-[32px] lg:text-[45.0596px] font-black font-['Noto_Serif_JP'] leading-[1.2] md:leading-[1.3] lg:leading-[1.4] mb-0 mr-0 md:mr-4 lg:mr-8">
                Land More Interviews
              </p>
              <p className="text-[24px] md:text-[32px] lg:text-[45.0596px] font-black font-['Noto_Serif_JP'] leading-[1.2] md:leading-[1.3] lg:leading-[1.4]">
                Faster—{" "}
                <span className="text-[#3f8f8d]">
                  No More Generic Applications
                </span>
              </p>
            </div>

            {/* Tube light gradient effect (optimized) */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div
                className="absolute left-[290px] md:left-[730px] top-[90px] md:top-[200px] w-[840px] md:w-[1500px] 2xl:w-[1600px] 2xl:ml-1 2xl:top-[220px] h-[500px] z-0 -translate-x-1/2 pointer-events-none "
                style={{
                  backgroundImage: "url(/Newlight.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Reduced blur effect for better performance */}
              <div className="absolute ml-16 left-1/2 top-[300px] blur-[40px] w-[1200px] h-[80px] -translate-x-1/2 pointer-events-none bg-[#D9D9D9]/10 z-1 rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Cards section with proper spacing - moved outside absolute positioning */}
        <div className="relative w-full px-4 md:px-8 lg:px-16 -mt-64 md:-mt-72">
          <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16 xl:gap-24 items-center justify-center relative max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="relative card-container md:mt-14 mb-44 md:mb-0 floating-card-1">
              <div
                className="mt-8 ml-7 w-[75px] h-[70px] z-10 relative"
                style={{
                  backgroundImage: "url(/Logo1.svg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative h-[150px] w-[340px] md:h-[340px] md:w-[380px] flex flex-col items-start justify-start px-8 pt-8 pb-8 bg-white rounded-[50.0662px] shadow-none">
                <h3 className="text-[35px] font-['Noto_Serif_JP:Regular',_sans-serif] font-normal text-[#000] mb-2">
                  Resume Analysis
                </h3>
                <p className="text-[18px] font-['Inter:Medium',_sans-serif] text-[#000] pt-4 leading-[1.4]">
                  Trained Scikit-learn classifiers to analyze resume structure
                  and quantify the effectiveness, providing users with
                  actionable feedback on formatting and content gaps.
                </p>
              </div>
              <CardBorder />
            </div>

            {/* Card 2 */}
            <div className="relative card-container mt-14 mb-44 md:mb-0 floating-card-2">
              <div
                className="mt-8 w-[140px] h-[70px] z-10 relative"
                style={{
                  backgroundImage: "url(/Logo.svg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative h-[160px] w-[340px] md:h-[340px] md:w-[380px] flex flex-col items-start justify-start px-8 pt-8 pb-8 bg-white rounded-[50.0662px] shadow-none">
                <h3 className="text-[35.0464px] font-['Noto_Serif_JP:Regular',_sans-serif] font-normal text-[#000] mb-2">
                  Semantic Analysis
                </h3>
                <p className="text-[18.0238px] font-['Inter:Medium',_sans-serif] pt-4 text-[#000] leading-[1.4]">
                  Used BERT embeddings to map resume content to the job
                  descriptions semantically, ensuring deeper relevance beyond
                  keyword stuffing while improved ATS compatibility by 40% in
                  user tests.
                </p>
              </div>
              <CardBorder />
            </div>

            {/* Card 3 */}
            <div className="relative card-container mt-14 mb-20 md:mb-0 floating-card-3">
              <Image
                className="mt-8 ml-4 w-[150px] h-[80px] z-10 relative"
                src="/Logo2.svg"
                alt="Vector Similarity Logo"
                width={100}
                height={80}
              />
              <div className="relative h-[150px] w-[340px] md:h-[340px] md:w-[380px] flex flex-col items-start justify-start px-8 pt-8 bg-white rounded-[50.0662px] shadow-none">
                <h3 className="text-[35.0464px] font-['Noto_Serif_JP:Regular',_sans-serif] font-normal text-[#000] mb-2">
                  Vector Similarity
                </h3>
                <p className="text-[18.0238px] font-['Inter:Medium',_sans-serif] pt-4 text-[#000] leading-[1.4]">
                  Integrated FAISS for vector similarity search, enabling
                  real-time matching of user skills with job requirements and
                  reduced alignment time from minutes to milliseconds.
                </p>
              </div>
              <CardBorder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
