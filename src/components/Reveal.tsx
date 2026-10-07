"use client";

import { useEffect, useRef, useState } from "react";

// Fades + un-blurs its content the first time it scrolls into view.
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children?: React.ReactNode;
  className?: string;
  as?: "div" | "p" | "h1" | "h2" | "blockquote" | "figure" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`transition-[opacity,transform,filter] duration-[1400ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[4px]"
      } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0 motion-reduce:transition-none ${className}`}
    >
      {children}
    </Tag>
  );
}
