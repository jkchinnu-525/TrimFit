"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Position {
  left: number;
  width: number;
  opacity: number;
}

export const Navigation = () => {
  return (
    <div className="">
      <SlideTabs />
    </div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full p-1"
    >
      <Tab setPosition={setPosition} onClick={() => scrollToSection("section")}>
        Home
      </Tab>
      <Tab setPosition={setPosition} onClick={() => scrollToSection("hero")}>
        Features
      </Tab>
      <Tab setPosition={setPosition} onClick={() => scrollToSection("aboutus")}>
        Our Magic
      </Tab>
      <Tab setPosition={setPosition} onClick={() => scrollToSection("pricing")}>
        Pricing
      </Tab>
      <Tab setPosition={setPosition} onClick={() => scrollToSection("footer")}>
        Connect With Us
      </Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  onClick,
}: {
  children: React.ReactNode;
  setPosition: (pos: Position) => void;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      className="relative z-10 block cursor-pointer py-1.5 text-xs uppercase text-black hover:text-[#31484D] mix-blend-difference md:px-4 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-[#4FB3B0]/80 md:h-12"
    />
  );
};
