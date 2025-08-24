import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    username: null, // null, 'valid', 'invalid'
    email: null
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Debounce function for API calls
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) return;

    setIsCheckingUsername(true);
    try {
      const response = await authAPI.checkUsername(username);

      if (response.success) {
        if (response.available) {
          setValidationStatus(prev => ({ ...prev, username: 'valid' }));
          setErrors(prev => ({ ...prev, username: '' }));
        } else {
          setValidationStatus(prev => ({ ...prev, username: 'invalid' }));
          setErrors(prev => ({ ...prev, username: response.message || 'Tên người dùng đã được sử dụng' }));
        }
      } else {
        setValidationStatus(prev => ({ ...prev, username: 'invalid' }));
        setErrors(prev => ({ ...prev, username: response.message || 'Lỗi kiểm tra tên người dùng' }));
      }
    } catch (error) {
      // Error checking username
      setValidationStatus(prev => ({ ...prev, username: 'invalid' }));
      setErrors(prev => ({ ...prev, username: 'Lỗi kiểm tra tên người dùng' }));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Check email availability
  const checkEmailAvailability = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;

    setIsCheckingEmail(true);
    try {
      const response = await authAPI.checkEmail(email);

      if (response.success) {
        if (response.available) {
          setValidationStatus(prev => ({ ...prev, email: 'valid' }));
          setErrors(prev => ({ ...prev, email: '' }));
        } else {
          setValidationStatus(prev => ({ ...prev, email: 'invalid' }));
          setErrors(prev => ({ ...prev, email: response.message || 'Email đã được sử dụng' }));
        }
      } else {
        setValidationStatus(prev => ({ ...prev, email: 'invalid' }));
        setErrors(prev => ({ ...prev, email: response.message || 'Lỗi kiểm tra email' }));
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setValidationStatus(prev => ({ ...prev, email: 'invalid' }));
      setErrors(prev => ({ ...prev, email: 'Lỗi kiểm tra email' }));
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Debounced validation functions
  const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);
  const debouncedCheckEmail = debounce(checkEmailAvailability, 500);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Reset validation status when user types
    if (name === 'username') {
      setValidationStatus(prev => ({ ...prev, username: null }));
      if (value.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(value)) {
        debouncedCheckUsername(value);
      }
    }
    
    if (name === 'email') {
      setValidationStatus(prev => ({ ...prev, email: null }));
      if (/\S+@\S+\.\S+/.test(value)) {
        debouncedCheckEmail(value);
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username chỉ được chứa chữ, số, _ và -';
    } else if (validationStatus.username === 'invalid') {
      newErrors.username = errors.username || 'Username đã được sử dụng';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    } else if (validationStatus.email === 'invalid') {
      newErrors.email = errors.email || 'Email đã được sử dụng';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && 
           validationStatus.username === 'valid' && 
           validationStatus.email === 'valid';
  };

  const validatePassword = (password) => {
    // Kiểm tra có khoảng trắng
    if (/\s/.test(password)) {
      return 'Mật khẩu không được chứa khoảng trắng';
    }

    // Kiểm tra độ dài tối thiểu
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Kiểm tra có chữ cái
    if (!/[a-zA-Z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một chữ cái';
    }

    // Kiểm tra không được toàn bộ là số
    if (/^\d+$/.test(password)) {
      return 'Mật khẩu không được toàn bộ là số';
    }

    return null; // Hợp lệ
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await register(formData);

      if (result.success) {
        // Redirect ngay lập tức sau khi đăng ký thành công
        const redirectPath = result.redirect_to || '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        setErrors({ submit: result.error || 'Có lỗi xảy ra khi tạo tài khoản' });
      }
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    let strength = 0;
    const checks = [
      password.length >= 6, // Ít nhất 6 ký tự
      /[a-zA-Z]/.test(password), // Có chữ cái
      !/^\d+$/.test(password) && password.length > 0, // Không toàn bộ là số
      !/\s/.test(password) && password.length > 0, // Không có khoảng trắng
      /[0-9]/.test(password) // Có số (tùy chọn, tăng độ mạnh)
    ];

    strength = checks.filter(Boolean).length;
    return { strength, checks };
  };

  const { strength, checks } = passwordStrength();



  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckIcon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            🎉 Chào mừng bạn đến với LumiLink!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 mb-8 max-w-md mx-auto"
          >
            Tài khoản của bạn đã được tạo thành công. Hãy bắt đầu tạo lumilink đầu tiên!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link to="/dashboard">
              <Button variant="accent" size="lg">
                🚀 Bắt đầu tạo lumilink
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation - Same as Login */}
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

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="mb-6">
              <Logo size="large" variant="light" animated={true} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Tạo tài khoản miễn phí 🚀
            </h1>
            <p className="text-gray-300">
              Bước {step}/2 - {step === 1 ? 'Thông tin cơ bản' : 'Tạo mật khẩu'}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mt-4">
              <motion.div
                className="bg-gradient-to-r from-accent-yellow to-orange-400 h-2 rounded-full"
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {step === 1 && (
            <>


              {/* Step 1 Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300 pr-20 ${
                        errors.username ? 'border-red-500' : 
                        validationStatus.username === 'valid' ? 'border-green-500' :
                        validationStatus.username === 'invalid' ? 'border-red-500' :
                        'border-white/20'
                      }`}
                      placeholder="yourname"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      {isCheckingUsername && (
                        <div className="w-4 h-4 border-2 border-accent-yellow border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {!isCheckingUsername && validationStatus.username === 'valid' && (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      )}
                      {!isCheckingUsername && validationStatus.username === 'invalid' && (
                        <XMarkIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="absolute right-3 bottom-0 transform translate-y-full text-gray-400 text-xs">
                      lumilink.vn/
                    </div>
                    <AnimatePresence>
                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.username}
                        </motion.p>
                      )}
                      {!errors.username && validationStatus.username === 'valid' && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-green-400 text-sm mt-1"
                        >
                          ✓ Username có thể sử dụng
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300 pr-12 ${
                        errors.email ? 'border-red-500' : 
                        validationStatus.email === 'valid' ? 'border-green-500' :
                        validationStatus.email === 'invalid' ? 'border-red-500' :
                        'border-white/20'
                      }`}
                      placeholder="your@email.com"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      {isCheckingEmail && (
                        <div className="w-4 h-4 border-2 border-accent-yellow border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {!isCheckingEmail && validationStatus.email === 'valid' && (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      )}
                      {!isCheckingEmail && validationStatus.email === 'invalid' && (
                        <XMarkIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                      {!errors.email && validationStatus.email === 'valid' && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-green-400 text-sm mt-1"
                        >
                          ✓ Email có thể sử dụng
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Next Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="accent"
                    className="w-full"
                    disabled={
                      !formData.username || 
                      !formData.email || 
                      validationStatus.username !== 'valid' || 
                      validationStatus.email !== 'valid' ||
                      isCheckingUsername ||
                      isCheckingEmail
                    }
                  >
                    {(isCheckingUsername || isCheckingEmail) ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang kiểm tra...</span>
                      </div>
                    ) : (
                      'Tiếp tục →'
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}

          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300 pr-12 ${
                      errors.password ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded ${
                            level <= strength
                              ? strength <= 2
                                ? 'bg-red-500'
                                : strength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="space-y-1 text-xs">
                      {[
                        'Ít nhất 6 ký tự',
                        'Có chữ cái (a-z, A-Z)',
                        'Không toàn bộ là số',
                        'Không có khoảng trắng',
                        'Có số (tùy chọn)'
                      ].map((requirement, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 ${
                            checks[index] ? 'text-green-400' : 'text-gray-400'
                          }`}
                        >
                          <span>{checks[index] ? '✓' : '○'}</span>
                          <span>{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300 pr-12 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-accent-yellow bg-white/10 border-white/20 rounded focus:ring-accent-yellow focus:ring-2 mt-1"
                />
                <p className="text-sm text-gray-300">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="text-accent-yellow hover:text-yellow-300">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy" className="text-accent-yellow hover:text-yellow-300">
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  ← Quay lại
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full mr-2"
                        />
                        Đang tạo...
                      </>
                    ) : (
                      '🎉 Tạo tài khoản'
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          )}



          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-6"
          >
            <p className="text-gray-300">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-accent-yellow hover:text-yellow-300 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
