import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Minh Anh",
      role: "Content Creator",
      avatar: "👩‍💻",
      content: "LumiLink giúp mình tăng 300% traffic từ Instagram! Interface đẹp, dễ sử dụng và hoàn toàn miễn phí. Recommend 100%!",
      rating: 5,
      platform: "Instagram: 50K followers"
    },
    {
      id: 2,
      name: "Đức Thành",
      role: "YouTuber",
      avatar: "🎬",
      content: "Từ khi dùng LumiLink, subscriber của mình tăng vọt vì dễ dàng tìm thấy tất cả content. Analytics chi tiết giúp mình hiểu audience hơn.",
      rating: 5,
      platform: "YouTube: 100K subscribers"
    },
    {
      id: 3,
      name: "Thu Hà",
      role: "Online Business",
      avatar: "💼",
      content: "Tuyệt vời! Khách hàng dễ dàng tìm thấy shop online của mình. Conversion rate tăng 250% chỉ sau 1 tháng sử dụng.",
      rating: 5,
      platform: "E-commerce Store Owner"
    },
    {
      id: 4,
      name: "Hoàng Nam",
      role: "Musician",
      avatar: "🎵",
      content: "Perfect cho musician như mình! Fan có thể nghe nhạc trên mọi platform từ 1 link duy nhất. Setup chỉ mất 5 phút!",
      rating: 5,
      platform: "Spotify: 25K monthly listeners"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
      >
        ⭐
      </motion.span>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-32 h-32 border border-accent-yellow/20"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-24 h-24 border border-primary-400/20"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Người dùng{' '}
            <span className="bg-gradient-to-r from-accent-yellow to-green-400 bg-clip-text text-transparent">
              yêu thích
            </span>{' '}
            LumiLink
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Hàng nghìn creator và business đã tin tưởng sử dụng LumiLink để phát triển online presence
          </motion.p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251,191,36,0.3) 0%, transparent 50%),
                                   radial-gradient(circle at 75% 75%, rgba(16,185,129,0.3) 0%, transparent 50%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Floating Elements - Square shapes */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-accent-yellow/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-3 h-3 bg-green-400/30"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <div className="text-center">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-6"
                >
                  {testimonials[currentTestimonial].avatar}
                </motion.div>

                {/* Stars */}
                <motion.div
                  className="flex justify-center space-x-1 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {renderStars(testimonials[currentTestimonial].rating)}
                </motion.div>

                {/* Content */}
                <motion.blockquote
                  className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  "{testimonials[currentTestimonial].content}"
                </motion.blockquote>

                {/* Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h4 className="text-xl font-bold text-accent-yellow mb-1">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-300 mb-2">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-sm text-gray-400">
                    {testimonials[currentTestimonial].platform}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 transition-all duration-300 ${
                  currentTestimonial === index
                    ? 'bg-accent-yellow scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { number: "10K+", label: "Người dùng hài lòng", icon: "😊" },
            { number: "50M+", label: "Lượt click mỗi tháng", icon: "🔗" },
            { number: "99.9%", label: "Uptime guarantee", icon: "⚡" },
            { number: "24/7", label: "Support miễn phí", icon: "💬" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-accent-yellow mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
