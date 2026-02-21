"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Animation =
  | "fade-in-up"
  | "fade-in"
  | "scale-in"
  | "slide-in-left"
  | "slide-in-right"
  | "blur-in";

interface AnimateInProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationClassMap: Record<Animation, string> = {
  "fade-in-up": "animate-fade-in-up",
  "fade-in": "animate-fade-in",
  "scale-in": "animate-scale-in",
  "slide-in-left": "animate-slide-in-left",
  "slide-in-right": "animate-slide-in-right",
  "blur-in": "animate-blur-in",
};

export function AnimateIn({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration,
  className,
  threshold = 0.15,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        isVisible ? animationClassMap[animation] : "opacity-0",
        className,
      )}
      style={{
        animationDelay: isVisible && delay ? `${delay}ms` : undefined,
        animationDuration: duration ? `${duration}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}
