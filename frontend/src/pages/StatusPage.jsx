import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  SignalIcon 
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const StatusPage = () => {
  const services = [
    {
      name: 'Website chính',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '120ms'
    },
    {
      name: 'API Service',
      status: 'operational', 
      uptime: '99.95%',
      responseTime: '85ms'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms'
    },
    {
      name: 'File Upload',
      status: 'maintenance',
      uptime: '99.90%',
      responseTime: '200ms'
    },
    {
      name: 'Email Service',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '150ms'
    }
  ];

  const incidents = [
    {
      date: '2024-01-15',
      title: 'Bảo trì định kỳ hệ thống',
      status: 'resolved',
      description: 'Nâng cấp server để cải thiện hiệu suất'
    },
    {
      date: '2024-01-10', 
      title: 'Gián đoạn upload file',
      status: 'resolved',
      description: 'Sự cố tạm thời với dịch vụ upload, đã khắc phục'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'outage':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'operational':
        return 'Hoạt động bình thường';
      case 'maintenance':
        return 'Đang bảo trì';
      case 'outage':
        return 'Gián đoạn';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <section className="bg-gradient-to-br from-green-600 to-emerald-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <SignalIcon className="w-12 h-12 mr-4" />
              <h1 className="text-5xl font-bold">System Status</h1>
            </div>
            <p className="text-xl mb-8">
              Theo dõi tình trạng hoạt động của tất cả dịch vụ LumiLink
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <div className="flex items-center text-2xl font-semibold">
                <CheckCircleIcon className="w-8 h-8 text-green-300 mr-3" />
                Tất cả hệ thống đang hoạt động bình thường
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Tình trạng dịch vụ
            </h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(service.status)}
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {getStatusText(service.status)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Uptime: <span className="font-semibold text-green-600">{service.uptime}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Response: <span className="font-semibold">{service.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Sự kiện gần đây
            </h2>
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {incident.title}
                    </h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Đã khắc phục
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {incident.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(incident.date).toLocaleDateString('vi-VN')}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Nhận thông báo cập nhật
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Đăng ký để nhận thông báo khi có sự cố hoặc bảo trì hệ thống
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <button className="bg-primary-500 text-white px-6 py-3 rounded-r-lg hover:bg-primary-600 transition-colors">
                Đăng ký
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StatusPage;
