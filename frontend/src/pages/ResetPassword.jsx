import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Get token from URL parameters
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (accessToken) {
      setToken(accessToken);
    } else if (refreshToken) {
      setToken(refreshToken);
    } else {
      // No token found, redirect to forgot password
      toast.error('Link reset không hợp lệ hoặc đã hết hạn');
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  // Password strength validation
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    return { requirements, score };
  };

  const passwordStrength = validatePassword(formData.newPassword);

  const getStrengthColor = (score) => {
    if (score <= 1) return 'text-red-500';
    if (score <= 2) return 'text-yellow-500';
    if (score <= 3) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStrengthText = (score) => {
    if (score <= 1) return 'Yếu';
    if (score <= 2) return 'Trung bình';
    if (score <= 3) return 'Mạnh';
    return 'Rất mạnh';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {

      
      const response = await apiClient.post('/auth/reset-password', {
        token: token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success('Mật khẩu đã được reset thành công!');

        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Không thể reset mật khẩu';
      toast.error(errorMessage);
      
      if (error.response?.status === 400) {
        toast.error('Link reset không hợp lệ hoặc đã hết hạn');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordInput = ({ 
    name, 
    label, 
    placeholder, 
    value, 
    showPassword, 
    onToggleVisibility,
    error 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300 ${
            error ? 'border-red-500' : 'border-white/20'
          }`}
        />
        <button
          type="button"
          onClick={() => onToggleVisibility(name.replace('Password', '').replace('new', 'new').replace('confirm', 'confirm'))}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <ExclamationTriangleIcon className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );

  if (isSuccess) {
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
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center relative z-10"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Thành Công!
          </h1>
          <p className="text-gray-300 mb-6">
            Mật khẩu của bạn đã được reset thành công. Bạn sẽ được chuyển đến trang đăng nhập...
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
          >
            Đăng Nhập Ngay
          </Link>
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
            <LockClosedIcon className="h-8 w-8 text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Reset Mật Khẩu
          </h1>
          <p className="text-gray-300">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <PasswordInput
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={formData.newPassword}
              showPassword={showPasswords.new}
              onToggleVisibility={togglePasswordVisibility}
              error={errors.newPassword}
            />
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Độ mạnh mật khẩu:
                  </span>
                  <span className={`text-sm font-medium ${getStrengthColor(passwordStrength.score)}`}>
                    {getStrengthText(passwordStrength.score)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries({
                    'Ít nhất 6 ký tự': passwordStrength.requirements.length,
                    'Chữ hoa': passwordStrength.requirements.uppercase,
                    'Chữ thường': passwordStrength.requirements.lowercase,
                    'Số': passwordStrength.requirements.number
                  }).map(([requirement, met]) => (
                    <div key={requirement} className="flex items-center gap-1">
                      <CheckCircleIcon 
                        className={`h-3 w-3 ${met ? 'text-green-500' : 'text-gray-300'}`} 
                      />
                      <span className={met ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <PasswordInput
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            showPassword={showPasswords.confirm}
            onToggleVisibility={togglePasswordVisibility}
            error={errors.confirmPassword}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang reset...
              </div>
            ) : (
              'Reset Mật Khẩu'
            )}
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
          >
            Quay lại đăng nhập
          </Link>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
