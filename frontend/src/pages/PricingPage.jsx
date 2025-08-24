import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  StarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      icon: SparklesIcon,
      price: billingCycle === 'monthly' ? 'Miễn phí' : 'Miễn phí',
      description: 'Hoàn hảo để bắt đầu',
      features: [
        'Unlimited links',
        '5 custom themes',
        'Basic analytics',
        'Mobile optimized',
        'QR code generator',
        'Basic customization'
      ],
      limitations: [
        'LumiLink branding',
        'No custom domain',
        'Limited themes',
        'Basic support'
      ],
      cta: 'Bắt đầu miễn phí',
      popular: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      icon: StarIcon,
      price: billingCycle === 'monthly' ? '99.000đ/tháng' : '990.000đ/năm',
      originalPrice: billingCycle === 'yearly' ? '1.188.000đ' : null,
      description: 'Cho creators nghiêm túc',
      features: [
        'Everything in Free',
        'Remove LumiLink branding',
        'Custom domains',
        'Unlimited themes',
        'Video backgrounds',
        'Audio integration',
        'Advanced analytics',
        'Priority support',
        'Custom CSS',
        'Link scheduling'
      ],
      limitations: [],
      cta: 'Nâng cấp Pro',
      popular: true,
      color: 'from-primary-500 to-purple-600'
    },
    {
      name: 'Business',
      icon: RocketLaunchIcon,
      price: billingCycle === 'monthly' ? '299.000đ/tháng' : '2.990.000đ/năm',
      originalPrice: billingCycle === 'yearly' ? '3.588.000đ' : null,
      description: 'Cho doanh nghiệp',
      features: [
        'Everything in Pro',
        'Multiple team members',
        'Advanced integrations',
        'API access',
        'White-label solution',
        'Custom analytics',
        'Dedicated support',
        'SLA guarantee',
        'Advanced security',
        'Bulk operations'
      ],
      limitations: [],
      cta: 'Liên hệ tư vấn',
      popular: false,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const faqs = [
    {
      question: 'Tôi có thể thay đổi gói dịch vụ bất cứ lúc nào không?',
      answer: 'Có, bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào. Thay đổi sẽ có hiệu lực ngay lập tức.'
    },
    {
      question: 'Có giới hạn số lượng links không?',
      answer: 'Tất cả các gói đều hỗ trợ unlimited links. Bạn có thể thêm bao nhiêu link tùy thích.'
    },
    {
      question: 'Tôi có thể sử dụng domain riêng không?',
      answer: 'Gói Pro và Business hỗ trợ custom domain. Bạn có thể sử dụng domain của riêng mình.'
    },
    {
      question: 'Có hỗ trợ tiếng Việt không?',
      answer: 'Có, chúng tôi hỗ trợ đầy đủ tiếng Việt và có đội ngũ support tiếng Việt 24/7.'
    },
    {
      question: 'Chính sách hoàn tiền như thế nào?',
      answer: 'Chúng tôi có chính sách hoàn tiền 30 ngày không điều kiện nếu bạn không hài lòng.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bảng giá
              <span className="block text-yellow-300">Minh bạch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Chọn gói phù hợp với nhu cầu của bạn. Bắt đầu miễn phí, nâng cấp khi cần thiết.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg">
              <div className="flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                  }`}
                >
                  Thanh toán hàng tháng
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                    billingCycle === 'yearly'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                  }`}
                >
                  Thanh toán hàng năm
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Tiết kiệm 17%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-4 ring-primary-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    Phổ biến nhất
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </div>
                      {plan.originalPrice && (
                        <div className="text-lg text-gray-500 line-through">
                          {plan.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-center opacity-60">
                          <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link
                    to={plan.name === 'Free' ? '/register' : '/contact'}
                    className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Những câu hỏi phổ biến về dịch vụ của chúng tôi
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 mb-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Bắt đầu ngay hôm nay
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Tham gia hàng nghìn creator đã tin tưởng sử dụng LumiLink
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Tạo tài khoản miễn phí
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
