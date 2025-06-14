"use client";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Linegradient() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -500 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="mt-50"
    >
      <Image
        src="/Linegradient.png"
        alt="Linegradient"
        width={1000}
        height={1000}
        className="w-full h-auto"
      />
    </motion.div>
  );
}
