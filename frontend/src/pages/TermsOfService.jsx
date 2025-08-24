import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const TermsOfService = () => {
  const sections = [
    {
      title: 'Chấp nhận điều khoản',
      content: 'Bằng việc sử dụng LumiLink, bạn đồng ý tuân thủ các điều khoản và điều kiện này.'
    },
    {
      title: 'Sử dụng dịch vụ',
      content: 'Bạn có thể sử dụng dịch vụ của chúng tôi cho mục đích hợp pháp và không vi phạm quyền của bên thứ ba.'
    },
    {
      title: 'Tài khoản người dùng',
      content: 'Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình.'
    },
    {
      title: 'Nội dung người dùng',
      content: 'Bạn giữ quyền sở hữu nội dung mình tải lên và chịu trách nhiệm về tính hợp pháp của nội dung đó.'
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
            <h1 className="text-5xl font-bold mb-6">Điều khoản dịch vụ</h1>
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

export default TermsOfService;
