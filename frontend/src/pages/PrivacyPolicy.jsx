import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Thu thập thông tin',
      content: 'Chúng tôi thu thập thông tin bạn cung cấp khi đăng ký tài khoản, tạo profile và sử dụng dịch vụ.'
    },
    {
      title: 'Sử dụng thông tin',
      content: 'Thông tin được sử dụng để cung cấp và cải thiện dịch vụ, hỗ trợ khách hàng và gửi thông báo quan trọng.'
    },
    {
      title: 'Bảo mật',
      content: 'Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn công nghiệp để bảo vệ thông tin của bạn.'
    },
    {
      title: 'Chia sẻ thông tin',
      content: 'Chúng tôi không bán, trao đổi hay chuyển giao thông tin cá nhân cho bên thứ ba mà không có sự đồng ý của bạn.'
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
            <h1 className="text-5xl font-bold mb-6">Chính sách bảo mật</h1>
            <p className="text-xl mb-4">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
