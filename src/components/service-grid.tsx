"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function ServiceGrid({ services }: { services: ServiceItem[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="service-grid"
      initial={false}
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      transition={{ staggerChildren: 0.12 }}
    >
      {services.map((service) => (
        <motion.article
          className="service-card"
          key={service.number}
          variants={cardVariants}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reducedMotion ? undefined : { y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
        >
          <div className="service-card-top">
            <span className="service-number">{service.number}</span>
            <span className="service-icon" aria-hidden="true">{service.icon}</span>
          </div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <span className="service-rule" />
        </motion.article>
      ))}
    </motion.div>
  );
}
