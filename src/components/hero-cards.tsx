"use client";

import { motion, useReducedMotion } from "framer-motion";

const springTransition = { type: "spring", stiffness: 260, damping: 20 } as const;

export default function HeroCards() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />

      <motion.div
        className="flow-card card-back"
        whileHover={reducedMotion ? undefined : { y: -10, rotate: 7 }}
        transition={springTransition}
      >
        <span className="flow-label">BUGÜNÜN AKIŞI</span>
        <span className="flow-line"><i />Sipariş alındı</span>
        <span className="flow-line"><i />Rapor hazırlandı</span>
        <span className="flow-line"><i />Görev hatırlatıldı</span>
      </motion.div>

      <motion.div
        className="flow-card card-front"
        whileHover={reducedMotion ? undefined : { y: -10, rotate: -6 }}
        transition={springTransition}
      >
        <span className="card-spark">✳</span>
        <span className="flow-label">DAHA AZ TEKRAR</span>
        <strong>Daha çok<br />işinize odaklanın.</strong>
        <span className="card-footer"><span />Akışınız düzene giriyor</span>
      </motion.div>

      <span className="art-dot dot-one" />
      <span className="art-dot dot-two" />
      <span className="art-cross">＋</span>
    </div>
  );
}
