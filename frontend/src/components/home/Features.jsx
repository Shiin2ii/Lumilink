import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleViewDemo = () => {
    navigate('/components');
  };

  const features = [
    {
      id: 0,
      icon: "🎨",
      title: "Thiết kế không giới hạn",
      description: "Hàng trăm template đẹp mắt, tùy chỉnh màu sắc, font chữ và layout theo ý muốn",
      details: [
        "50+ template chuyên nghiệp",
        "Tùy chỉnh màu sắc unlimited",
        "Custom CSS cho pro users",
        "Mobile-first responsive"
      ],
      gradient: "from-pink-500 to-purple-600",
      demo: "🎭"
    },
    {
      id: 1,
      icon: "📊",
      title: "Analytics chi tiết",
      description: "Theo dõi lượt view, click rate, nguồn traffic và nhiều metrics quan trọng khác",
      details: [
        "Real-time analytics",
        "Click tracking per link",
        "Geographic insights",
        "Traffic source analysis"
      ],
      gradient: "from-blue-500 to-cyan-600",
      demo: "📈"
    },
    {
      id: 2,
      icon: "🚀",
      title: "Tốc độ siêu nhanh",
      description: "CDN toàn cầu, tối ưu SEO và load time dưới 1 giây cho trải nghiệm tốt nhất",
      details: [
        "Global CDN network",
        "99.9% uptime guarantee",
        "SEO optimized",
        "Lightning fast loading"
      ],
      gradient: "from-green-500 to-emerald-600",
      demo: "⚡"
    },
    {
      id: 3,
      icon: "🔗",
      title: "Link management thông minh",
      description: "Quản lý links dễ dàng với drag & drop, scheduling và link expiration",
      details: [
        "Drag & drop reordering",
        "Link scheduling",
        "Expiration dates",
        "Bulk operations"
      ],
      gradient: "from-orange-500 to-red-600",
      demo: "🔧"
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Tính năng{' '}
            <span className="bg-gradient-to-r from-accent-yellow to-orange-400 bg-clip-text text-transparent">
              đỉnh cao
            </span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Khám phá những tính năng mạnh mẽ giúp bạn tạo ra lumilink chuyên nghiệp và hiệu quả nhất
          </motion.p>
        </motion.div>

        {/* Interactive Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveFeature(index)}
                className={`cursor-pointer p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-gradient-to-r ' + feature.gradient + ' border-transparent shadow-2xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <motion.div
                    className="text-3xl sm:text-4xl flex-shrink-0"
                    animate={activeFeature === index ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                      activeFeature === index ? 'text-white' : 'text-gray-200'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${
                      activeFeature === index ? 'text-white/90' : 'text-gray-400'
                    }`}>
                      {feature.description}
                    </p>
                    
                    {/* Feature Details */}
                    <AnimatePresence>
                      {activeFeature === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-2"
                        >
                          {feature.details.map((detail, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center space-x-2 text-white/80"
                            >
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              <span className="text-sm">{detail}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Demo */}
          <div className="relative">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Demo Container */}
              <div className={`bg-gradient-to-br ${features[activeFeature].gradient} rounded-3xl p-8 shadow-2xl`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-8xl mb-6"
                  >
                    {features[activeFeature].demo}
                  </motion.div>
                  
                  <h4 className="text-2xl font-bold text-white mb-4">
                    {features[activeFeature].title}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {features[activeFeature].details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="bg-white/20 rounded-lg p-3"
                      >
                        <span className="text-white text-xs font-medium">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
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
                className="absolute -top-4 -right-4 w-8 h-8 bg-accent-yellow rounded-full opacity-60"
              />
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1.2, 1, 1.2]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-white rounded-full opacity-40"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🚀 Trải nghiệm ngay - Miễn phí!
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
