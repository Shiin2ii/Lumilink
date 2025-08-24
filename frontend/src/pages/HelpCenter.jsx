import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  PaintBrushIcon,
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả', icon: DocumentTextIcon },
    { id: 'getting-started', name: 'Bắt đầu', icon: RocketLaunchIcon },
    { id: 'customization', name: 'Tùy chỉnh', icon: PaintBrushIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', name: 'Cài đặt', icon: CogIcon },
    { id: 'premium', name: 'Premium', icon: CreditCardIcon },
    { id: 'security', name: 'Bảo mật', icon: ShieldCheckIcon },
    { id: 'support', name: 'Hỗ trợ', icon: ChatBubbleLeftRightIcon }
  ];

  const faqs = [
    {
      category: 'getting-started',
      categoryName: 'Bắt đầu',
      questions: [
        {
          q: 'Làm thế nào để tạo tài khoản LumiLink?',
          a: 'Để tạo tài khoản LumiLink: 1) Truy cập trang chủ LumiLink 2) Nhấn nút "Đăng ký" 3) Điền email và mật khẩu 4) Xác nhận email 5) Hoàn thành profile cơ bản. Tài khoản miễn phí cho phép bạn tạo unlimited links ngay lập tức.'
        },
        {
          q: 'Tôi có thể thêm bao nhiêu links?',
          a: 'Tất cả các gói đều hỗ trợ unlimited links. Bạn có thể thêm bao nhiêu link tùy thích mà không bị giới hạn số lượng.'
        },
        {
          q: 'Làm thế nào để thêm link mới?',
          a: 'Vào Dashboard > Links > "Thêm Link Mới". Nhập tiêu đề, URL đích, chọn icon (tùy chọn) và nhấn "Lưu". Link sẽ xuất hiện ngay trên trang LumiLink của bạn.'
        },
        {
          q: 'URL LumiLink của tôi là gì?',
          a: 'URL LumiLink của bạn có dạng: lumilink.vn/username. Bạn có thể tùy chỉnh username trong phần Settings > Profile.'
        },
        {
          q: 'Làm thế nào để chia sẻ LumiLink?',
          a: 'Copy URL LumiLink của bạn và chia sẻ trên bio Instagram, YouTube, TikTok, Facebook hoặc bất kỳ đâu bạn muốn. Bạn cũng có thể tạo QR Code trong Dashboard.'
        }
      ]
    },
    {
      category: 'customization',
      categoryName: 'Tùy chỉnh',
      questions: [
        {
          q: 'Làm thế nào để thay đổi theme?',
          a: 'Vào Dashboard > Customize > Themes. Chọn từ 15+ theme miễn phí hoặc 50+ theme premium. Bạn có thể preview trước khi áp dụng.'
        },
        {
          q: 'Tôi có thể upload background tùy chỉnh không?',
          a: 'Có! Gói Premium cho phép upload ảnh background tùy chỉnh. Gói Premium cũng hỗ trợ video background và gradient tùy chỉnh.'
        },
        {
          q: 'Làm thế nào để thay đổi màu sắc?',
          a: 'Trong phần Customize > Colors, bạn có thể tùy chỉnh màu chủ đạo, màu text, màu button và màu background. Gói miễn phí có 10 màu cơ bản, Premium có unlimited colors.'
        },
        {
          q: 'Tôi có thể thay đổi font chữ không?',
          a: 'Có, vào Customize > Typography để chọn font chữ. Gói miễn phí có 5 font cơ bản, Premium có 50+ Google Fonts.'
        },
        {
          q: 'Làm thế nào để sắp xếp lại thứ tự links?',
          a: 'Trong Dashboard > Links, sử dụng tính năng drag & drop để kéo thả links theo thứ tự mong muốn. Thay đổi sẽ được lưu tự động.'
        }
      ]
    },
    {
      category: 'analytics',
      categoryName: 'Analytics',
      questions: [
        {
          q: 'Làm thế nào để xem thống kê?',
          a: 'Vào Dashboard > Analytics để xem tổng quan về lượt view, click rate, top links và traffic sources. Dữ liệu được cập nhật real-time.'
        },
        {
          q: 'Analytics có chính xác không?',
          a: 'Có, LumiLink sử dụng hệ thống tracking chính xác 99.9%. Chúng tôi lọc bot traffic và chỉ đếm real users.'
        },
        {
          q: 'Tôi có thể xuất báo cáo không?',
          a: 'Gói Premium cho phép xuất báo cáo PDF/Excel theo tuần, tháng hoặc tùy chỉnh thời gian. Báo cáo bao gồm chi tiết về performance từng link.'
        },
        {
          q: 'Làm thế nào để theo dõi conversion?',
          a: 'Sử dụng UTM parameters hoặc tích hợp Google Analytics. Premium users có thể set up conversion tracking cho từng link cụ thể.'
        }
      ]
    },
    {
      category: 'settings',
      categoryName: 'Cài đặt',
      questions: [
        {
          q: 'Làm thế nào để thay đổi username?',
          a: 'Vào Settings > Profile > Username. Lưu ý: username phải unique và chỉ chứa chữ cái, số, dấu gạch ngang và gạch dưới.'
        },
        {
          q: 'Tôi có thể thay đổi email không?',
          a: 'Có, vào Settings > Account > Email. Bạn sẽ cần xác nhận email mới trước khi thay đổi có hiệu lực.'
        },
        {
          q: 'Làm thế nào để xóa tài khoản?',
          a: 'Vào Settings > Account > Delete Account. Lưu ý: Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu.'
        },
        {
          q: 'Tôi có thể ẩn LumiLink branding không?',
          a: 'Có, gói Premium cho phép ẩn hoàn toàn LumiLink branding và thêm logo/branding của riêng bạn.'
        }
      ]
    },
    {
      category: 'premium',
      categoryName: 'Premium',
      questions: [
        {
          q: 'Premium có những tính năng gì?',
          a: 'Premium bao gồm: 50+ themes, custom background/video, unlimited colors & fonts, advanced analytics, remove branding, priority support, custom domain và nhiều tính năng khác.'
        },
        {
          q: 'Giá Premium là bao nhiêu?',
          a: 'Premium Tháng: 50,000₫/tháng. Premium Năm: 399,000₫/năm (tiết kiệm 33%). Premium Trọn Đời: 999,999₫ một lần.'
        },
        {
          q: 'Làm thế nào để nâng cấp Premium?',
          a: 'Vào Dashboard > Premium hoặc nhấn "Upgrade" ở bất kỳ đâu. Chọn gói phù hợp và thanh toán qua VNPay, MoMo hoặc Banking.'
        },
        {
          q: 'Tôi có thể hủy Premium không?',
          a: 'Có, bạn có thể hủy bất kỳ lúc nào trong Settings > Subscription. Tính năng Premium sẽ hoạt động đến hết chu kỳ đã thanh toán.'
        },
        {
          q: 'Custom domain hoạt động như thế nào?',
          a: 'Premium users có thể sử dụng domain riêng (vd: links.yoursite.com). Chúng tôi sẽ hướng dẫn cấu hình DNS chi tiết.'
        }
      ]
    },
    {
      category: 'security',
      categoryName: 'Bảo mật',
      questions: [
        {
          q: 'Dữ liệu của tôi có an toàn không?',
          a: 'Có, LumiLink sử dụng mã hóa SSL 256-bit, tuân thủ GDPR và lưu trữ dữ liệu trên server bảo mật tại Việt Nam.'
        },
        {
          q: 'Tôi có thể bật 2FA không?',
          a: 'Có, vào Settings > Security > Two-Factor Authentication để bật 2FA qua Google Authenticator hoặc SMS.'
        },
        {
          q: 'Làm thế nào để đổi mật khẩu?',
          a: 'Vào Settings > Security > Change Password. Nhập mật khẩu cũ và mật khẩu mới. Mật khẩu nên có ít nhất 8 ký tự.'
        },
        {
          q: 'Tôi quên mật khẩu thì làm sao?',
          a: 'Nhấn "Quên mật khẩu" ở trang đăng nhập, nhập email và làm theo hướng dẫn trong email reset password.'
        }
      ]
    },
    {
      category: 'support',
      categoryName: 'Hỗ trợ',
      questions: [
        {
          q: 'Làm thế nào để liên hệ support?',
          a: 'Bạn có thể liên hệ qua: Email: support@lumilink.vn, Live chat trong Dashboard, hoặc form liên hệ trên website.'
        },
        {
          q: 'Thời gian phản hồi support là bao lâu?',
          a: 'Free users: 24-48h. Premium users: 2-6h. Chúng tôi làm việc 24/7 và luôn cố gắng phản hồi nhanh nhất có thể.'
        },
        {
          q: 'Tôi gặp bug thì báo cáo như thế nào?',
          a: 'Gửi email đến support@lumilink.vn với mô tả chi tiết bug, screenshot và thông tin browser/device. Chúng tôi sẽ khắc phục trong 24h.'
        },
        {
          q: 'LumiLink có hỗ trợ tiếng Việt không?',
          a: 'Có, LumiLink được phát triển tại Việt Nam với đội ngũ support 100% tiếng Việt. Chúng tôi hiểu rõ nhu cầu người dùng Việt.'
        }
      ]
    }
  ];

  // Filter FAQs based on search term and selected category
  const filteredFaqs = faqs.filter(category => {
    if (selectedCategory !== 'all' && category.category !== selectedCategory) {
      return false;
    }

    if (searchTerm) {
      return category.questions.some(q =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  }).map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      !searchTerm ||
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

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
            <h1 className="text-5xl font-bold mb-6">Trung tâm Hỗ trợ</h1>
            <p className="text-xl mb-8">Tìm câu trả lời cho mọi thắc mắc về LumiLink</p>

            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi hoặc từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <QuestionMarkCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Thử tìm kiếm với từ khóa khác hoặc chọn category khác
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Xem tất cả câu hỏi
              </button>
            </motion.div>
          ) : (
            filteredFaqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mr-4">
                    {categories.find(cat => cat.id === category.category)?.icon && (
                      React.createElement(categories.find(cat => cat.id === category.category).icon, {
                        className: "w-6 h-6 text-primary-500"
                      })
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {category.categoryName}
                  </h2>
                </div>

                <div className="grid gap-6">
                  {category.questions.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-start">
                        <QuestionMarkCircleIcon className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{faq.q}</span>
                      </h3>
                      <div className="pl-8">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Vẫn cần hỗ trợ?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Đội ngũ support của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:support@lumilink.vn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                📧 Email Support
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-block"
              >
                💬 Live Chat
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
