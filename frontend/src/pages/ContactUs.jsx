import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

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
            <h1 className="text-5xl font-bold mb-6">Liên hệ</h1>
            <p className="text-xl mb-8">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Thông tin liên hệ
              </h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <EnvelopeIcon className="w-6 h-6 text-primary-500 mr-4" />
                  <span className="text-gray-700 dark:text-gray-300">support@lumilink.vn</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-6 h-6 text-primary-500 mr-4" />
                  <span className="text-gray-700 dark:text-gray-300">+84 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-6 h-6 text-primary-500 mr-4" />
                  <span className="text-gray-700 dark:text-gray-300">
                    123 Nguyễn Huệ, Q1, TP.HCM
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Gửi tin nhắn
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Tiêu đề"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Nội dung tin nhắn"
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
