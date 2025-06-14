"use client";
import Lenis from "lenis";
import { useEffect } from "react";

// Use requestAnimationFrame to continuously update the scroll
const ScrollEffect: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return <div>{children}</div>;
};

export default ScrollEffect;
