import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, UserIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const GDPRPage = () => {
  const rights = [
    {
      icon: UserIcon,
      title: 'Quyền truy cập',
      description: 'Bạn có quyền yêu cầu truy cập vào dữ liệu cá nhân mà chúng tôi xử lý về bạn.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Quyền chỉnh sửa',
      description: 'Bạn có quyền yêu cầu chúng tôi chỉnh sửa dữ liệu cá nhân không chính xác.'
    },
    {
      icon: TrashIcon,
      title: 'Quyền xóa',
      description: 'Bạn có quyền yêu cầu chúng tôi xóa dữ liệu cá nhân của bạn trong một số trường hợp.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quyền hạn chế',
      description: 'Bạn có quyền yêu cầu hạn chế việc xử lý dữ liệu cá nhân của bạn.'
    }
  ];

  const dataTypes = [
    'Thông tin tài khoản (tên, email, mật khẩu)',
    'Thông tin profile (bio, links, hình ảnh)',
    'Dữ liệu sử dụng (clicks, views, thời gian truy cập)',
    'Thông tin kỹ thuật (IP, browser, thiết bị)',
    'Cookie và tracking data'
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
            <h1 className="text-5xl font-bold mb-6">GDPR Compliance</h1>
            <p className="text-xl mb-4">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="text-lg text-gray-200">
              Cam kết bảo vệ dữ liệu cá nhân theo quy định GDPR của Liên minh châu Âu
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
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Quyền của bạn theo GDPR
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12">
              Chúng tôi tôn trọng và bảo vệ các quyền dữ liệu cá nhân của bạn
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {rights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <right.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {right.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {right.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Dữ liệu chúng tôi thu thập
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <ul className="space-y-3">
                {dataTypes.map((dataType, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    {dataType}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Cơ sở pháp lý xử lý dữ liệu
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Đồng ý (Consent)</h3>
                  <p className="text-gray-600 dark:text-gray-300">Khi bạn đăng ký tài khoản và đồng ý với điều khoản sử dụng.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hợp đồng (Contract)</h3>
                  <p className="text-gray-600 dark:text-gray-300">Để cung cấp dịch vụ LumiLink mà bạn đã đăng ký.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lợi ích chính đáng (Legitimate Interest)</h3>
                  <p className="text-gray-600 dark:text-gray-300">Để cải thiện dịch vụ và phân tích sử dụng.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Bảo mật dữ liệu
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu cá nhân:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  Mã hóa dữ liệu khi truyền tải và lưu trữ
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  Kiểm soát truy cập nghiêm ngặt
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  Audit và monitoring thường xuyên
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  Đào tạo nhân viên về bảo mật dữ liệu
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Thực hiện quyền GDPR của bạn
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Để thực hiện bất kỳ quyền GDPR nào, vui lòng liên hệ với chúng tôi qua:
            </p>
            <div className="space-y-2">
              <p className="text-lg">
                <strong>Email:</strong> <a href="mailto:privacy@lumilink.vn" className="text-primary-500 hover:underline">privacy@lumilink.vn</a>
              </p>
              <p className="text-lg">
                <strong>Data Protection Officer:</strong> <a href="mailto:dpo@lumilink.vn" className="text-primary-500 hover:underline">dpo@lumilink.vn</a>
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 30 ngày theo quy định GDPR.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GDPRPage;
