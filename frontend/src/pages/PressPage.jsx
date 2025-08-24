import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, NewspaperIcon, TrophyIcon, UserIcon } from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PressPage = () => {
  const pressReleases = [
    {
      id: 1,
      title: 'LumiLink ra mắt tính năng Video Background đột phá',
      date: '2024-01-20',
      category: 'Product Launch',
      excerpt: 'Tính năng mới cho phép người dùng tùy chỉnh video background, tạo trải nghiệm tương tác độc đáo.',
      link: '#'
    },
    {
      id: 2,
      title: 'LumiLink hoàn thành vòng gọi vốn Series A 5 triệu USD',
      date: '2024-01-15',
      category: 'Funding',
      excerpt: 'Vòng gọi vốn được dẫn dắt bởi Sequoia Capital Vietnam, đánh dấu bước phát triển mạnh mẽ.',
      link: '#'
    },
    {
      id: 3,
      title: 'LumiLink đạt mốc 1 triệu người dùng toàn cầu',
      date: '2024-01-10',
      category: 'Milestone',
      excerpt: 'Chỉ sau 18 tháng ra mắt, LumiLink đã thu hút được 1 triệu người dùng trên toàn thế giới.',
      link: '#'
    }
  ];

  const mediaKit = [
    {
      title: 'Logo & Brand Assets',
      description: 'Logo, màu sắc và guidelines sử dụng thương hiệu',
      downloadLink: '#'
    },
    {
      title: 'Product Screenshots',
      description: 'Hình ảnh chất lượng cao của giao diện sản phẩm',
      downloadLink: '#'
    },
    {
      title: 'Company Information',
      description: 'Thông tin công ty, số liệu và fact sheet',
      downloadLink: '#'
    }
  ];

  const awards = [
    {
      title: 'Best Startup 2024',
      organization: 'TechCrunch Vietnam',
      year: '2024'
    },
    {
      title: 'Innovation Award',
      organization: 'Vietnam Startup Awards',
      year: '2023'
    },
    {
      title: 'Product of the Year',
      organization: 'Product Hunt Vietnam',
      year: '2023'
    }
  ];

  const leadership = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Co-founder',
      bio: 'Former Product Manager tại Facebook, 10+ năm kinh nghiệm trong tech industry.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Trần Thị B',
      position: 'CTO & Co-founder',
      bio: 'Ex-Engineering Lead tại Google, chuyên gia về scalable systems và AI.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
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
            <h1 className="text-5xl font-bold mb-6">Press Center</h1>
            <p className="text-xl mb-8">
              Tin tức, thông cáo báo chí và tài liệu truyền thông về LumiLink
            </p>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Thông cáo báo chí
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                        {release.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(release.date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {release.excerpt}
                    </p>
                  </div>
                  <a
                    href={release.link}
                    className="ml-6 text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Đọc thêm →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Media Kit
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tài liệu và hình ảnh chính thức của LumiLink
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {mediaKit.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <NewspaperIcon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {item.description}
                </p>
                <a
                  href={item.downloadLink}
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Tải xuống
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Giải thưởng & Ghi nhận
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-sm"
              >
                <TrophyIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {award.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {award.organization} • {award.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ban lãnh đạo
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl text-center"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {leader.name}
                </h3>
                <p className="text-primary-500 font-medium mb-3">
                  {leader.position}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {leader.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Press */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Liên hệ báo chí
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Cần thêm thông tin hoặc muốn phỏng vấn? Chúng tôi sẵn sàng hỗ trợ.
            </p>
            <div className="space-y-4">
              <p className="text-lg">
                Email: <a href="mailto:press@lumilink.vn" className="underline">press@lumilink.vn</a>
              </p>
              <p className="text-lg">
                Phone: <a href="tel:+84123456789" className="underline">+84 123 456 789</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PressPage;
