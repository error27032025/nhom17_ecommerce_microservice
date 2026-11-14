import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ScrollReveal = ({ children, delay = 0.2 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Kích hoạt hiệu ứng ngay khi component được render
    setIsVisible(true);
  }, []); // Chạy một lần duy nhất khi component mount

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
