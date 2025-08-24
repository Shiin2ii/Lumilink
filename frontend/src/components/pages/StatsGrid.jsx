import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Card from '../common/Card';

const StatsGrid = ({
  stats = [],
  title = "Được tin tưởng bởi hàng nghìn người dùng",
  subtitle = "Những con số ấn tượng của LumiLink",
  columns = 4,
  animated = true,
  variant = 'default',
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  // Default stats if none provided
  const defaultStats = [
    {
      id: 1,
      title: "Người dùng hoạt động",
      value: 50000,
      suffix: "+",
      icon: "👥",
      color: "blue",
      description: "Đang sử dụng LumiLink hàng ngày"
    },
    {
      id: 2,
      title: "Links được tạo",
      value: 250000,
      suffix: "+",
      icon: "🔗",
      color: "green",
      description: "Tổng số links đã được tạo"
    },
    {
      id: 3,
      title: "Lượt click mỗi tháng",
      value: 5000000,
      suffix: "+",
      icon: "📊",
      color: "purple",
      description: "Traffic được tạo ra"
    },
    {
      id: 4,
      title: "Uptime",
      value: 99.9,
      suffix: "%",
      icon: "⚡",
      color: "orange",
      description: "Độ tin cậy hệ thống"
    }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  // Animate numbers when in view
  useEffect(() => {
    if (!isInView || !animated) return;

    const animateNumbers = () => {
      displayStats.forEach((stat, index) => {
        const targetValue = stat.value;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetValue / steps;
        let currentValue = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          currentValue += increment;
          
          if (step >= steps) {
            currentValue = targetValue;
            clearInterval(timer);
          }

          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = currentValue;
            return newStats;
          });
        }, duration / steps);
      });
    };

    const delay = setTimeout(animateNumbers, 500);
    return () => clearTimeout(delay);
  }, [isInView, animated, displayStats]);

  const formatNumber = (num, suffix = '') => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M' + suffix;
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K' + suffix;
    } else if (num % 1 !== 0) {
      return num.toFixed(1) + suffix;
    }
    return Math.floor(num) + suffix;
  };

  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  const variants = {
    default: 'bg-gray-50',
    dark: 'bg-gray-900',
    transparent: 'bg-transparent',
    gradient: 'bg-gradient-to-br from-gray-50 to-white'
  };

  return (
    <section 
      ref={ref}
      className={`py-20 ${variants[variant]} ${className}`}
      {...props}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className={`grid gap-8 ${gridColumns[columns]} max-w-7xl mx-auto`}>
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card
                variant="elevated"
                className="text-center relative overflow-hidden group cursor-pointer"
                hover={false}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors[stat.color] || colors.blue} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div
                  className="text-6xl mb-4"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {stat.icon}
                </motion.div>

                {/* Animated Number */}
                <motion.div
                  className="mb-2"
                  initial={{ scale: 0.5 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colors[stat.color] || colors.blue} bg-clip-text text-transparent`}>
                    {animated ? formatNumber(animatedStats[index], stat.suffix) : formatNumber(stat.value, stat.suffix)}
                  </span>
                </motion.div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {stat.title}
                </h3>

                {/* Description */}
                {stat.description && (
                  <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                    {stat.description}
                  </p>
                )}

                {/* Hover Effect */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[stat.color] || colors.blue}`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <span className="text-gray-700 font-medium">
              Cập nhật real-time • Dữ liệu chính xác 100%
            </span>
          </div>
        </motion.div>

        {/* Floating Elements */}
        {animated && (
          <>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 left-10 w-16 h-16 border border-blue-200 rounded-full opacity-30"
            />
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1.1, 1, 1.1]
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-20 right-10 w-12 h-12 border border-purple-200 rounded-full opacity-30"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default StatsGrid;
