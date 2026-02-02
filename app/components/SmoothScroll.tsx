"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return (
    <MotionConfig transition={{ duration: 0.3, ease: "easeOut" }}>
      {children}
    </MotionConfig>
  );
}
