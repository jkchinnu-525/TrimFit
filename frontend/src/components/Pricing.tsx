import React from "react";

const CheckIcon = () => (
  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
    <svg
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_440_53)">
        <circle cx="16.067" cy="16.0238" r="15.7225" fill="#3F8F8D" />
        <path
          d="M6.89551 19.299C6.89551 19.299 8.86082 19.299 11.4812 23.8847C11.4812 23.8847 18.7647 11.874 25.2384 9.47241"
          stroke="white"
          strokeWidth="1.96531"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_440_53">
          <rect
            width="31.445"
            height="31.445"
            fill="white"
            transform="translate(0.34436 0.30127)"
          />
        </clipPath>
      </defs>
    </svg>
  </div>
);

// Circular Background Gradient Mesh Component
const CircularGradientMesh = () => (
  <div className="absolute top-[280px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-90 overflow-hidden pointer-events-none">
    {/* Radar center point */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]">
      {/* Concentric radar circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-teal-400/40 rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-teal-400/30 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-teal-400/25 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-teal-400/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-teal-400/15 rounded-full"></div>

      {/* Central radar dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-teal-500 rounded-full animate-pulse shadow-lg shadow-teal-500/50"></div>

      {/* Radar sweep beam */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] animate-[spin_8s_linear_infinite]">
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[5px] origin-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(45, 212, 191, 0.8) 0%, rgba(45, 212, 191, 0.6) 50%, transparent 100%)",
            boxShadow:
              "0 0 20px rgba(45, 212, 191, 0.6), 0 0 40px rgba(45, 212, 191, 0.4)",
          }}
        />
      </div> */}

      {/* Secondary sweep beam - opposite direction */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] animate-[spin_15s_linear_infinite_reverse]">
        <div
          className="absolute top-1/2 left-1/2 w-[250px] h-[1px] origin-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0.4) 50%, transparent 100%)",
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.5)",
          }}
        />
      </div>

      {/* Rotating gradient orbs - more visible */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] animate-[spin_15s_linear_infinite]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(45, 212, 191, 0.9) 0%, rgba(45, 212, 191, 0.6) 50%, transparent 80%)",
            boxShadow: "0 0 30px rgba(45, 212, 191, 0.7)",
          }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] animate-[spin_8s_linear_infinite_reverse]">
        <div
          className="absolute bottom-0 right-0 w-[50px] h-[50px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(45, 212, 191, 0.9) 0%, rgba(45, 212, 191, 0.6) 50%, transparent 80%)",
            boxShadow: "0 0 30px rgba(45, 212, 191, 0.7)",
          }}
        />
      </div>

      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] animate-[spin_10s_linear_infinite]">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(63, 143, 141, 0.8) 0%, rgba(63, 143, 141, 0.5) 50%, transparent 80%)",
            boxShadow: "0 0 20px rgba(63, 143, 141, 0.6)",
          }}
        />
      </div> */}

      {/* Pulsing radar rings */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-teal-500/60 rounded-full animate-[ping_3s_ease-out_infinite]"></div> */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-cyan-400/50 rounded-full animate-[ping_4s_ease-out_infinite]"></div> */}

      {/* Background glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full animate-pulse"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45, 212, 191, 0.15) 0%, rgba(153, 246, 228, 0.1) 50%, transparent 80%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  </div>
);

const PricingCard = ({
  title,
  subtitle,
  price,
  period = "/month",
  features,
  buttonText,
  isPopular = false,
  buttonStyle = "primary",
  height = "h-[620px]",
}: {
  title: string;
  subtitle: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonStyle?: "primary" | "secondary";
  height?: string;
}) => (
  <div className={`relative ${isPopular ? "z-10" : "z-0"}`}>
    {/* Popular Badge */}
    {isPopular && (
      <div className="absolute -top-4 mt-8 left-6 z-20">
        <div className="bg-gradient-to-r from-teal-200 via-teal-600 to-slate-600 text-transparent bg-clip-text font-semibold text-sm px-3 py-1">
          Most Popular
        </div>
      </div>
    )}

    {/* Card */}
    <div
      className={`relative bg-white/80 backdrop-blur-lg rounded-[45px] p-8 ${height} border border-gray-200/20 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.35)] overflow-hidden`}
    >
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-teal-400/30 rounded-[45px]" />
      <div className="absolute inset-0 shadow-[0px_-40px_30px_-10px_inset_rgba(63,143,141,0.5),-30px_0px_30px_-25px_inset_rgba(79,179,176,0.6),30px_0px_30px_-25px_inset_rgba(79,179,176,0.6),0px_-71px_60px_-40px_inset_rgba(9,158,155,0.898),0px_-91px_30px_-8px_inset_rgba(79,179,176,0.5),4px_4px_25px_0px_inset_rgba(0,0,0,0.25)] rounded-[45px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="text-left mb-6 mt-4">
          <h3 className="text-[42px] font-semibold text-[#737373] mb-2">
            {title}
          </h3>
          <p className="text-[#737373] text-[18px]">{subtitle}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-start">
            <span className="text-black text-[40px] font-medium mr-1">$</span>
            <span className="text-[40px] font-medium text-black">{price}</span>
            <span className="text-[#737373] text-[18px] ml-1">{period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex-1 space-y-5 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckIcon />
              <span className="text-black/80 font-['Inter'] text-[18px] font-regular">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          className={`w-full py-4 px-6 mb-8 cursor-pointer rounded-2xl font-medium text-lg transition-all duration-200 ${
            buttonStyle === "primary"
              ? "bg-[#0a262c] text-white hover:bg-[#4FB3B0] shadow-[-45px_44px_45px_-29px_inset_#95D2D0,-23px_-23px_46px_-9px_inset_#000000]"
              : "bg-[#0a262c] text-white hover:bg-[#4FB3B0] shadow-[-45px_44px_45px_-29px_inset_#95D2D0,-23px_-23px_46px_-9px_inset_#000000]"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  </div>
);

export default function Pricing() {
  return (
    <div id="pricing" className="relative pt-10 px-4 bg-white ">
      {/* Circular Background Gradient Mesh */}
      <CircularGradientMesh />

      {/* Fallback simple background effect */}
      <div className="absolute top-[350px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-teal-200/20 rounded-full blur-3xl animate-pulse z-0"></div>

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-[35px] font-black font-['Noto_Serif_JP'] text-[#3F8F8D] mb-8">
            Pricing
          </h1>
          <h2 className="text-[45px] font-semibold font-['Noto_Serif_JP'] text-black/80 mb-6 leading-tight">
            Power Up Your Job Hunt: Choose
            <br />
            Your Perfect Plan
          </h2>
          <p className="text-[18px] text-black font-medium font-['Inter'] max-w-5xl mx-auto leading-relaxed">
            All plans include core AI tailoring, ATS optimization, and instant
            formatting.
            <br />
            Join our 92,000+ users who doubled interview rates.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-end gap-8 lg:gap-6 max-w-6xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            title="Free"
            subtitle="Testing The Waters"
            price="0"
            features={[
              "3 resume tailors/month",
              "Basic keyword optimization",
              "1 template style",
            ]}
            buttonText="Start for free"
            height="h-[520px]"
          />

          {/* Basic Plan */}
          <PricingCard
            title="Basic"
            subtitle="Serious job hunters"
            price="4.99"
            features={[
              "15 resume tailors/month",
              "Advanced ATS scanning",
              "5 Premium templates",
              "Priority support",
            ]}
            buttonText="Get Started"
            isPopular={true}
            height="h-[600px]"
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            subtitle="Competitive edge seekers"
            price="9.99"
            features={[
              "Unlimited tailors",
              "Multi-job matching",
              "Unlimited Premium Templates",
              "AI content enhancer",
              "1-on-1 setup call",
            ]}
            buttonText="Go Pro"
            height="h-[680px]"
          />
        </div>
      </div>
    </div>
  );
}
