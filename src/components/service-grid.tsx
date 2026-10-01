"use client";

import { motion } from "framer-motion";

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
  return (
    <motion.div
      className="service-grid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      transition={{ staggerChildren: 0.12 }}
    >
      {services.map((service) => (
        <motion.article
          className="service-card"
          key={service.number}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
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
