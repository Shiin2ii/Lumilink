import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import Card from '../common/Card';

const HeroSection = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundVariant = 'gradient',
  showDemo = true,
  animated = true,
  className = '',
  ...props
}) => {
  const [currentText, setCurrentText] = useState(0);
  const [particles, setParticles] = useState([]);

  const heroTexts = [
    { main: "Tạo lumilink", highlight: "miễn phí", sub: "Kết nối tất cả mạng xã hội của bạn trong một link duy nhất" },
    { main: "Thiết kế", highlight: "chuyên nghiệp", sub: "Hàng trăm template đẹp mắt, tùy chỉnh không giới hạn" },
    { main: "Analytics", highlight: "chi tiết", sub: "Theo dõi lượt click, view và hiệu suất của từng link" }
  ];

  // Auto-rotate text every 4 seconds
  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [animated, heroTexts.length]);

  // Generate floating particles
  useEffect(() => {
    if (!animated) return;
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, [animated]);

  const backgroundVariants = {
    gradient: 'bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900',
    solid: 'bg-dark-900',
    light: 'bg-gradient-to-br from-gray-50 to-gray-100',
    custom: ''
  };

  return (
    <section 
      className={`relative min-h-screen flex items-center overflow-hidden ${backgroundVariants[backgroundVariant]} ${className}`}
      {...props}
    >
      {/* Animated Background Elements */}
      {animated && (
        <div className="absolute inset-0">
          {/* Floating Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute bg-accent-yellow rounded-full opacity-20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-accent-yellow rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Animated Title */}
          <div className="mb-8">
            {animated ? (
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentText}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -50, rotateX: 90 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-bold text-white mb-4"
                >
                  {heroTexts[currentText].main}{' '}
                  <span className="text-accent-yellow bg-gradient-to-r from-accent-yellow to-yellow-300 bg-clip-text text-transparent">
                    {heroTexts[currentText].highlight}
                  </span>
                </motion.h1>
              </AnimatePresence>
            ) : (
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                {title || "Tạo lumilink miễn phí"}
              </h1>
            )}
            
            {animated ? (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${currentText}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-gray-300 max-w-2xl mx-auto"
                >
                  {heroTexts[currentText].sub}
                </motion.p>
              </AnimatePresence>
            ) : (
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {description || "Kết nối tất cả mạng xã hội của bạn trong một link duy nhất"}
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="accent" 
                className="relative overflow-hidden group"
                onClick={primaryCTA?.onClick}
              >
                <span className="relative z-10">
                  {primaryCTA?.text || "🚀 Bắt đầu miễn phí"}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="group"
                onClick={secondaryCTA?.onClick}
              >
                <span className="group-hover:text-accent-yellow transition-colors">
                  {secondaryCTA?.text || "👀 Xem demo"}
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: "🎨", title: "Tùy chỉnh dễ dàng", desc: "Drag & drop, không cần code" },
              { icon: "📊", title: "Analytics thông minh", desc: "Theo dõi hiệu suất real-time" },
              { icon: "🚀", title: "Tốc độ lightning", desc: "Load nhanh, SEO tối ưu" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)"
                }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer group"
              >
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-accent-yellow transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Demo Section */}
        {showDemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 relative"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotateY: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block"
            >
              <Card 
                variant="glass" 
                className="w-64 h-96 mx-auto relative overflow-hidden"
              >
                {/* Phone Screen Content */}
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-accent-yellow rounded-full mx-auto mb-4 flex items-center justify-center"
                  >
                    <span className="text-2xl">👤</span>
                  </motion.div>
                  
                  <motion.h4
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white font-bold mb-2"
                  >
                    @yourname
                  </motion.h4>
                  
                  <p className="text-gray-300 text-sm mb-6">LumiLink của tôi ✨</p>
                  
                  {/* Demo Links */}
                  <div className="space-y-3">
                    {['Instagram', 'YouTube', 'Website'].map((link, idx) => (
                      <motion.div
                        key={link}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + idx * 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                      >
                        <span className="text-white text-sm">{link}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Elements Inside */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-4 right-4 w-6 h-6 bg-accent-yellow/30 rounded-full"
                />
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        {animated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/60 text-center"
            >
              <div className="text-sm mb-2">Cuộn xuống để khám phá</div>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
