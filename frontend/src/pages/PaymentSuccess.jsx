import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('checking'); // checking, success, failed
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get payment parameters from URL
        const orderId = searchParams.get('orderId');
        const resultCode = searchParams.get('resultCode');
        const message = searchParams.get('message');



        if (!orderId) {
          setPaymentStatus('failed');
          return;
        }

        // Check payment status with backend
        const response = await apiClient.get(`/premium/payment/status/${orderId}`);

        const data = response.data;

        if (resultCode === '0') {
          // Payment successful
          setPaymentStatus('success');
          setPaymentInfo({
            orderId,
            message: 'Thanh toán thành công!'
          });
          toast.success('🎉 Chào mừng bạn đến với LumiLink Premium!');
        } else {
          // Payment failed
          setPaymentStatus('failed');
          setPaymentInfo({
            orderId,
            message: message || 'Thanh toán thất bại'
          });
          toast.error('Thanh toán không thành công. Vui lòng thử lại.');
        }

      } catch (error) {
        console.error('❌ Error checking payment status:', error);
        setPaymentStatus('failed');
        setPaymentInfo({
          message: 'Không thể kiểm tra trạng thái thanh toán'
        });
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRetryPayment = () => {
    navigate('/dashboard?tab=premium');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center"
      >
        {paymentStatus === 'checking' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Đang kiểm tra thanh toán...
            </h2>
            <p className="text-gray-400">
              Vui lòng chờ trong giây lát
            </p>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              🎉 Thanh toán thành công!
            </h2>
            
            <p className="text-gray-300 mb-6">
              Chào mừng bạn đến với LumiLink Premium! Tài khoản của bạn đã được nâng cấp thành công.
            </p>

            {paymentInfo?.orderId && (
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Mã đơn hàng:</p>
                <p className="text-white font-mono text-sm">{paymentInfo.orderId}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleBackToDashboard}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Về Dashboard
              </button>
              
              <p className="text-sm text-gray-400">
                Bạn có thể bắt đầu sử dụng các tính năng Premium ngay bây giờ!
              </p>
            </div>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center"
            >
              <XCircleIcon className="w-12 h-12 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Thanh toán thất bại
            </h2>
            
            <p className="text-gray-300 mb-6">
              {paymentInfo?.message || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Thử lại thanh toán
              </button>
              
              <button
                onClick={handleBackToDashboard}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Về Dashboard</span>
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
