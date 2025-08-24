import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const Pricing = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planId) => {
    if (planId === 'free') {
      navigate('/register');
    } else {
      // For premium plans (monthly/yearly), redirect to register with plan parameter
      navigate(`/register?plan=${planId}`);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0₫/Vĩnh viễn',
      description: 'Hoàn hảo để bắt đầu hành trình digital của bạn.',
      features: [
        '🔗 Unlimited links',
        '🎨 15+ template chuyên nghiệp',
        '📊 Analytics cơ bản',
        '🌐 Custom URL (lumilink.vn/yourname)',
        '📱 Mobile responsive',
        '⚡ Tốc độ tải nhanh',
        '🔒 SSL bảo mật',
        '📈 QR Code generator'
      ],
      buttonText: '🚀 Bắt đầu miễn phí',
      featured: true,
      highlight: 'Phổ biến nhất'
    },
    {
      id: 'monthly',
      name: 'Premium Tháng',
      price: '50,000₫/tháng',
      description: 'Tất cả tính năng Premium với thanh toán hàng tháng.',
      features: [
        '🏆 Tất cả tính năng Free',
        '🎭 50+ template premium',
        '📈 Analytics nâng cao',
        '🎨 Custom background upload',
        '🎬 Video backgrounds',
        '🛡️ Remove LumiLink branding',
        '🌍 Custom domain',
        '📧 Priority support',
        '⭐ White-label mode'
      ],
      buttonText: '⭐ Nâng cấp Premium',
      featured: false,
      highlight: 'Linh hoạt'
    },
    {
      id: 'yearly',
      name: 'Premium Năm',
      price: '399,000₫/năm',
      originalPrice: '600,000₫',
      description: 'Tiết kiệm 33% với thanh toán hàng năm.',
      features: [
        '🏆 Tất cả tính năng Premium Tháng',
        '💰 Tiết kiệm 33% so với thanh toán tháng',
        '🎁 Bonus: 2 tháng miễn phí',
        '🚀 Ưu tiên hỗ trợ cao nhất',
        '🎨 Early access tính năng mới',
        '📊 Advanced analytics dashboard',
        '🔧 Custom integrations',
        '💎 Premium templates độc quyền'
      ],
      buttonText: '🔥 Tiết kiệm 33%',
      featured: false,
      highlight: 'Phổ biến'
    },
    {
      id: 'lifetime',
      name: 'Premium Trọn Đời',
      price: '999,999₫/một lần',
      description: 'Thanh toán một lần, sử dụng trọn đời.',
      features: [
        '🏆 Tất cả tính năng Premium',
        '♾️ Sử dụng trọn đời',
        '🎯 Không lo tăng giá',
        '👑 VIP support trọn đời',
        '🚀 Tất cả tính năng tương lai',
        '💎 Exclusive lifetime benefits',
        '🎨 Unlimited everything',
        '🔒 Guaranteed forever access'
      ],
      buttonText: '👑 Mua trọn đời',
      featured: false,
      highlight: 'Giá trị nhất'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-dark-900">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Bắt đầu{' '}
            <span className="bg-gradient-to-r from-accent-yellow to-green-400 bg-clip-text text-transparent">
              miễn phí
            </span>{' '}
            ngay hôm nay!
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Không cần thẻ tín dụng, không có phí ẩn. Tạo lumilink chuyên nghiệp trong vài phút!
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className={`relative p-4 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full ${
                plan.featured
                  ? 'border-accent-yellow bg-gradient-to-br from-green-600 to-emerald-700 shadow-2xl sm:scale-105'
                  : 'border-gray-700 bg-dark-800 hover:border-gray-600'
              }`}
            >
              {plan.featured && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 {plan.highlight}
                  </span>
                </motion.div>
              )}

              {!plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.highlight}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-2">
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-400 line-through mb-1">
                      {plan.originalPrice}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-white">{plan.price}</div>
                </div>
                <p className="text-gray-300 text-xs">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300 text-sm">
                    <CheckIcon className="w-4 h-4 text-accent-green mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={plan.featured ? "accent" : "outline"}
                  className={`w-full h-12 relative overflow-hidden group flex items-center justify-center ${
                    plan.featured ? 'bg-gradient-to-r from-accent-yellow to-orange-400 hover:from-orange-400 hover:to-accent-yellow' : ''
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <span className="relative z-10 text-sm font-medium">{plan.buttonText}</span>
                  {plan.featured && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
