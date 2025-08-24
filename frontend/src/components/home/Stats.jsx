import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { value: '32,400,000+', label: 'Profile Views' },
    { value: '910,000+', label: 'Users' },
    { value: '450,000+', label: 'File Uploads' },
    { value: '28,300+', label: 'Subscribers' }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-dark-800">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-accent-yellow transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider px-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
