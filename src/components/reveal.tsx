"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

const directions = {
  up: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -32 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
} satisfies Record<string, Variants>;

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof directions;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}

export default function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 0.7,
  style,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      variants={reducedMotion ? { visible: { opacity: 1, x: 0, y: 0, scale: 1 } } : directions[variant]}
      transition={{
        duration: reducedMotion ? 0 : duration,
        ease: [0.16, 1, 0.3, 1],
        delay: reducedMotion ? 0 : delay,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
