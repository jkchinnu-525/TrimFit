"use client";
import Lenis from "lenis";
import { useEffect } from "react";

const ScrollEffect: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const lenis = new Lenis({
      prevent: (node) => {
        return node.tagName === "TEXTAREA" || !!node.closest("textarea");
      },
    });

    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <div>{children}</div>;
};

export default ScrollEffect;
