import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AnalyticsPage = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'Thống kê chi tiết',
      description: 'Theo dõi views, clicks, và engagement rate theo thời gian thực'
    },
    {
      icon: EyeIcon,
      title: 'Phân tích lưu lượng',
      description: 'Hiểu rõ nguồn traffic và hành vi của visitors'
    },
    {
      icon: CursorArrowRaysIcon,
      title: 'Click tracking',
      description: 'Theo dõi hiệu suất từng link và tối ưu hóa conversion'
    },
    {
      icon: MapPinIcon,
      title: 'Phân tích địa lý',
      description: 'Xem audience đến từ đâu trên thế giới'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Thiết bị & trình duyệt',
      description: 'Phân tích loại thiết bị và trình duyệt người dùng sử dụng'
    },
    {
      icon: ClockIcon,
      title: 'Báo cáo thời gian thực',
      description: 'Dữ liệu cập nhật liên tục, không delay'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Analytics
              <span className="block text-yellow-300">Thông minh</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Hiểu rõ audience của bạn với công cụ phân tích mạnh mẽ và báo cáo chi tiết
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Bắt đầu phân tích
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AnalyticsPage;
