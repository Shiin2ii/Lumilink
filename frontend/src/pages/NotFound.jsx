import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, ExternalLink } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-lg mx-auto"
      >
        {/* 404 Animation */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-bold text-primary-500 opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Search className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Trang không tìm thấy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Hãy kiểm tra lại URL hoặc quay về trang chủ.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2 min-w-[160px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          
          <Link to="/">
            <Button className="flex items-center gap-2 min-w-[160px]">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Button>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div variants={itemVariants} className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Hoặc bạn có thể thử:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/dashboard"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              Dashboard
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              to="/components"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              Components
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              Đăng nhập
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-500 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
