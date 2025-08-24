import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');

    // Validation
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {

      
      const response = await apiClient.post('/auth/forgot-password', { email });

      if (response.data.success) {
        setIsEmailSent(true);
        toast.success('Email reset mật khẩu đã được gửi!');

      }
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Không thể gửi email reset mật khẩu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setEmail('');
    setError('');
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-accent-yellow rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Email Đã Được Gửi!
            </h1>
            <p className="text-gray-300">
              Chúng tôi đã gửi link reset mật khẩu đến email của bạn
            </p>
          </div>

          {/* Email Display */}
          <div className="bg-dark-700/50 border border-gray-600/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-white font-medium">
                {email}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-300">
              📧 Kiểm tra hộp thư đến của bạn
            </p>
            <p className="text-sm text-gray-300">
              🔍 Nếu không thấy email, hãy kiểm tra thư mục spam
            </p>
            <p className="text-sm text-gray-300">
              ⏰ Link reset sẽ hết hạn sau 1 giờ
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-all duration-200"
            >
              Gửi Lại Email
            </button>

            <Link
              to="/login"
              className="w-full bg-dark-700/50 border border-gray-600/50 text-white py-3 px-4 rounded-lg font-medium hover:bg-dark-600/50 hover:border-gray-500/50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-all duration-200 text-center block"
            >
              Quay Lại Đăng Nhập
            </Link>
          </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent-yellow rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
            <EnvelopeIcon className="h-8 w-8 text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Quên Mật Khẩu?
          </h1>
          <p className="text-gray-300">
            Nhập email của bạn để nhận link reset mật khẩu
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className={`w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300 ${
                  error ? 'border-red-500' : 'border-white/20'
                }`}
              />
              <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang gửi...
              </div>
            ) : (
              'Gửi Email Reset'
            )}
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-accent-yellow hover:text-yellow-300 font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <p className="text-xs text-primary-300 text-center">
            💡 Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc liên hệ hỗ trợ
          </p>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
