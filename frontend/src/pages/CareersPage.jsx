import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  HeartIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const CareersPage = () => {

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Lương cạnh tranh',
      description: 'Mức lương hấp dẫn + bonus theo performance'
    },
    {
      icon: UserGroupIcon,
      title: 'Team tuyệt vời',
      description: 'Làm việc cùng những người tài năng và passionate'
    },
    {
      icon: SparklesIcon,
      title: 'Học hỏi & phát triển',
      description: 'Budget training, conference và career development'
    },
    {
      icon: HeartIcon,
      title: 'Work-life balance',
      description: 'Flexible working hours và remote-friendly'
    }
  ];

  const values = [
    {
      title: 'Innovation First',
      description: 'Chúng tôi luôn tìm cách làm mọi thứ tốt hơn và khác biệt'
    },
    {
      title: 'User-Centric',
      description: 'Mọi quyết định đều hướng đến trải nghiệm tốt nhất cho người dùng'
    },
    {
      title: 'Transparency',
      description: 'Văn hóa minh bạch, feedback thẳng thắn và honest communication'
    },
    {
      title: 'Growth Mindset',
      description: 'Không ngừng học hỏi, thử nghiệm và cải tiến bản thân'
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
            <h1 className="text-5xl font-bold mb-6">
              Careers at LumiLink
            </h1>
            <p className="text-xl mb-8">
              Tham gia cùng chúng tôi xây dựng tương lai của digital identity
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center">
                <UserGroupIcon className="w-6 h-6 mr-2" />
                <span>3 nhân viên</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-6 h-6 mr-2" />
                <span>1 văn phòng</span>
              </div>
              <div className="flex items-center">
                <RocketLaunchIcon className="w-6 h-6 mr-2" />
                <span>Startup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Những giá trị định hình văn hóa công ty chúng tôi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
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

      {/* Benefits */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Phúc lợi & Quyền lợi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Chúng tôi chăm sóc team như gia đình
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Tình trạng tuyển dụng
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Cập nhật mới nhất về kế hoạch nhân sự
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="w-12 h-12 text-gray-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Hiện tại chưa có kế hoạch tuyển dụng
              </h3>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                LumiLink hiện đang hoạt động với đội ngũ 3 nhân viên tại 1 văn phòng.
                Chúng tôi chưa có kế hoạch mở rộng nhân sự trong thời gian tới.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  💡 Tuy nhiên, chúng tôi luôn chào đón những tài năng xuất sắc!
                  Nếu bạn quan tâm đến LumiLink, hãy gửi CV để chúng tôi lưu trữ cho tương lai.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Quan tâm đến tương lai của LumiLink?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Mặc dù hiện tại chưa tuyển dụng, chúng tôi luôn sẵn sàng kết nối với những tài năng tiềm năng.
              Gửi CV để chúng tôi liên hệ khi có cơ hội phù hợp!
            </p>
            <Link
              to="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Gửi thông tin liên hệ
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;
