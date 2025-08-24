import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AboutUs = () => {
  const values = [
    {
      icon: HeartIcon,
      title: 'Tận tâm',
      description: 'Chúng tôi luôn đặt người dùng lên hàng đầu trong mọi quyết định.'
    },
    {
      icon: SparklesIcon,
      title: 'Sáng tạo',
      description: 'Không ngừng đổi mới để mang đến trải nghiệm tốt nhất.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Tiến bộ',
      description: 'Giúp mọi người phát triển và thành công trên môi trường số.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <section className="bg-gradient-to-br from-primary-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Về chúng tôi</h1>
            <p className="text-xl mb-8">
              Chúng tôi tin rằng mọi người đều xứng đáng có một không gian số đẹp và chuyên nghiệp
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              LumiLink được sinh ra với sứ mệnh giúp mọi người tạo ra những lumilink đẹp mắt, 
              chuyên nghiệp và hiệu quả. Chúng tôi muốn democratize việc tạo ra một online presence 
              ấn tượng, không phân biệt kỹ năng kỹ thuật.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
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

export default AboutUs;
