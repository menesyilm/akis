"use client";

import { motion, useReducedMotion } from "framer-motion";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const stepVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

export default function StepsList({ steps }: { steps: StepItem[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.ol
      className="steps-list"
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={listVariants}
    >
      {steps.map((step) => (
        <motion.li
          className="step"
          data-scroll-reveal
          key={step.number}
          variants={stepVariants}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="step-number">{step.number}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
          <span className="step-arrow" aria-hidden="true">↗</span>
        </motion.li>
      ))}
    </motion.ol>
  );
}
