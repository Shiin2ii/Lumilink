import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'tips', name: 'Tips & Tricks' },
    { id: 'updates', name: 'Cập nhật' },
    { id: 'tutorials', name: 'Hướng dẫn' },
    { id: 'marketing', name: 'Marketing' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips để tối ưu hóa LumiLink của bạn',
      excerpt: 'Khám phá những bí quyết giúp tăng engagement và conversion rate cho lumilink của bạn.',
      author: 'LumiLink Team',
      date: '2024-01-20',
      readTime: '5 phút đọc',
      category: 'tips',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
      tags: ['optimization', 'engagement', 'tips']
    },
    {
      id: 2,
      title: 'Cập nhật tính năng mới: Video Backgrounds',
      excerpt: 'Giới thiệu tính năng video background mới giúp tạo ấn tượng mạnh cho profile của bạn.',
      author: 'Product Team',
      date: '2024-01-18',
      readTime: '3 phút đọc',
      category: 'updates',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop',
      tags: ['video', 'features', 'updates']
    },
    {
      id: 3,
      title: 'Hướng dẫn tạo LumiLink chuyên nghiệp từ A-Z',
      excerpt: 'Từ việc chọn template đến tối ưu hóa SEO, hướng dẫn chi tiết để tạo lumilink hoàn hảo.',
      author: 'Design Team',
      date: '2024-01-15',
      readTime: '8 phút đọc',
      category: 'tutorials',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=300&fit=crop',
      tags: ['tutorial', 'design', 'professional']
    },
    {
      id: 4,
      title: 'Social Media Marketing với LumiLink',
      excerpt: 'Cách sử dụng lumilink để tăng traffic từ social media và xây dựng personal brand mạnh mẽ.',
      author: 'Marketing Team',
      date: '2024-01-12',
      readTime: '6 phút đọc',
      category: 'marketing',
      image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&h=300&fit=crop',
      tags: ['marketing', 'social-media', 'branding']
    },
    {
      id: 5,
      title: 'Analytics: Hiểu rõ audience của bạn',
      excerpt: 'Sử dụng công cụ analytics để phân tích hành vi người dùng và tối ưu hóa chiến lược content.',
      author: 'Data Team',
      date: '2024-01-10',
      readTime: '7 phút đọc',
      category: 'tips',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
      tags: ['analytics', 'data', 'optimization']
    },
    {
      id: 6,
      title: 'Tùy chỉnh CSS nâng cao cho Pro Users',
      excerpt: 'Khám phá những trick CSS giúp tạo ra những hiệu ứng độc đáo cho lumilink của bạn.',
      author: 'Dev Team',
      date: '2024-01-08',
      readTime: '10 phút đọc',
      category: 'tutorials',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop',
      tags: ['css', 'customization', 'advanced']
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
            <h1 className="text-5xl font-bold mb-6">LumiLink Blog</h1>
            <p className="text-xl mb-8">
              Tips, tricks và cập nhật mới nhất từ đội ngũ LumiLink
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span className="mr-4">{post.author}</span>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="mr-4">{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{post.readTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
                  >
                    Đọc tiếp →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Đăng ký newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Nhận những bài viết mới nhất và tips hữu ích từ LumiLink
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

export default BlogPage;
