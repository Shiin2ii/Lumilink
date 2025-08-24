import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const CookiePolicy = () => {
  const sections = [
    {
      title: 'Cookie là gì?',
      content: 'Cookie là các file text nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website. Chúng giúp website ghi nhớ thông tin về chuyến thăm của bạn.'
    },
    {
      title: 'Chúng tôi sử dụng Cookie như thế nào?',
      content: 'Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, phân tích traffic website và cá nhân hóa nội dung.'
    },
    {
      title: 'Các loại Cookie chúng tôi sử dụng',
      content: 'Essential cookies (cần thiết), Analytics cookies (phân tích), Functional cookies (chức năng) và Marketing cookies (tiếp thị).'
    },
    {
      title: 'Quản lý Cookie',
      content: 'Bạn có thể quản lý hoặc xóa cookie thông qua cài đặt trình duyệt. Tuy nhiên, việc tắt cookie có thể ảnh hưởng đến chức năng của website.'
    },
    {
      title: 'Cookie của bên thứ ba',
      content: 'Chúng tôi có thể sử dụng cookie của bên thứ ba như Google Analytics để phân tích và cải thiện dịch vụ.'
    },
    {
      title: 'Cập nhật chính sách',
      content: 'Chính sách cookie này có thể được cập nhật định kỳ. Chúng tôi sẽ thông báo về những thay đổi quan trọng.'
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
            <h1 className="text-5xl font-bold mb-6">Chính sách Cookie</h1>
            <p className="text-xl mb-4">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="text-lg text-gray-200">
              Tìm hiểu cách LumiLink sử dụng cookie để cải thiện trải nghiệm của bạn
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
            className="mb-12"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Tóm tắt về Cookie
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                Chúng tôi sử dụng cookie để cải thiện trải nghiệm website, phân tích cách sử dụng 
                và cung cấp nội dung phù hợp. Bằng việc tiếp tục sử dụng website, bạn đồng ý với 
                việc sử dụng cookie của chúng tôi.
              </p>
            </div>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Cookie Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Bạn có thể quản lý tùy chọn cookie của mình tại đây:
            </p>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" checked disabled className="mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Essential Cookies (Bắt buộc)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Analytics Cookies</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Functional Cookies</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Marketing Cookies</span>
              </label>
            </div>
            <button className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Lưu tùy chọn
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
