"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
      <Tab setPosition={setPosition}>
        <Link href="/#section">Home</Link>
      </Tab>
      <Tab setPosition={setPosition} className="hidden md:block">
        <Link href="/#hero">Features</Link>
      </Tab>
      <Tab setPosition={setPosition}>
        <Link href="/#aboutus">Our Magic</Link>
      </Tab>
      <Tab setPosition={setPosition}>
        <Link href="/#pricing">Pricing</Link>
      </Tab>
      <Tab setPosition={setPosition} className="hidden md:block">
        <Link href="/#footer">Connect With Us</Link>
      </Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  className = "",
}: {
  children: React.ReactNode;
  setPosition: (pos: Position) => void;
  className?: string;
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
      className={`relative z-10 block cursor-pointer py-1.5 text-xs uppercase text-black hover:text-[#31484D] mix-blend-difference px-2 md:px-4 md:py-3 md:text-[12px] lg:text-base ${className}`}
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
      className="absolute z-0 h-7 md:h-10 lg:h-12 rounded-full bg-[#4FB3B0]/80"
    />
  );
};
