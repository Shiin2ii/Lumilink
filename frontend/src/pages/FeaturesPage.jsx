import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  LinkIcon,
  PaintBrushIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  PlayIcon,
  MusicalNoteIcon,
  CogIcon,
  ShieldCheckIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: LinkIcon,
      title: 'Unlimited Links',
      description: 'Thêm không giới hạn các liên kết đến mạng xã hội, website, và nội dung của bạn.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: PaintBrushIcon,
      title: 'Custom Themes',
      description: 'Tùy chỉnh giao diện với hàng trăm theme đẹp mắt và khả năng personalization.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: PlayIcon,
      title: 'Video Backgrounds',
      description: 'Tạo ấn tượng mạnh với video background và audio tùy chỉnh cho profile.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Theo dõi clicks, views, và engagement với dashboard analytics chi tiết.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Optimized',
      description: 'Giao diện responsive hoàn hảo trên mọi thiết bị từ mobile đến desktop.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Tải trang siêu nhanh với công nghệ tối ưu hóa hiệu suất cao cấp.',
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  const advancedFeatures = [
    {
      icon: MusicalNoteIcon,
      title: 'Audio Integration',
      description: 'Thêm nhạc nền cho profile với hỗ trợ Spotify, SoundCloud và file audio.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Custom Domains',
      description: 'Sử dụng domain riêng cho thương hiệu chuyên nghiệp.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy Controls',
      description: 'Kiểm soát quyền riêng tư với các tùy chọn bảo mật nâng cao.'
    },
    {
      icon: CogIcon,
      title: 'API Access',
      description: 'Tích hợp với các ứng dụng khác thông qua API mạnh mẽ.'
    },
    {
      icon: HeartIcon,
      title: 'Social Proof',
      description: 'Hiển thị follower count và social proof để tăng uy tín.'
    },
    {
      icon: SparklesIcon,
      title: 'AI Suggestions',
      description: 'Gợi ý thông minh để tối ưu hóa profile và tăng engagement.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Tính năng
              <span className="block text-yellow-300">Mạnh mẽ</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Khám phá những tính năng đột phá giúp bạn tạo ra lumilink chuyên nghiệp và hiệu quả nhất
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Bắt đầu miễn phí
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tính năng chính
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300">
              Mọi thứ bạn cần để tạo ra lumilink hoàn hảo
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tính năng nâng cao
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Những công cụ chuyên nghiệp cho người dùng cao cấp
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Sẵn sàng tạo lumilink của bạn?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Tham gia hàng nghìn creator đã tin tưởng sử dụng LumiLink để phát triển online presence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Bắt đầu miễn phí
              </Link>
              <Link
                to="/video-demo"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Xem demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
