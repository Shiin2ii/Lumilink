import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  HeartIcon,
  SparklesIcon,
  PaintBrushIcon,
  PlayIcon,
  MusicalNoteIcon,
  CameraIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: SparklesIcon },
    { id: 'creative', name: 'Creative', icon: PaintBrushIcon },
    { id: 'business', name: 'Business', icon: BriefcaseIcon },
    { id: 'music', name: 'Music', icon: MusicalNoteIcon },
    { id: 'photography', name: 'Photography', icon: CameraIcon },
    { id: 'education', name: 'Education', icon: AcademicCapIcon },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBagIcon }
  ];

  const templates = [
    {
      id: 1,
      name: 'Neon Dreams',
      category: 'creative',
      preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
      likes: 1250,
      views: 15600,
      isPro: false,
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      description: 'Thiết kế neon sống động với hiệu ứng ánh sáng'
    },
    {
      id: 2,
      name: 'Minimalist Pro',
      category: 'business',
      preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=400&fit=crop',
      likes: 980,
      views: 12300,
      isPro: true,
      colors: ['#2C3E50', '#FFFFFF', '#3498DB'],
      description: 'Thiết kế tối giản chuyên nghiệp cho doanh nghiệp'
    },
    {
      id: 3,
      name: 'Music Waves',
      category: 'music',
      preview: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop',
      likes: 2100,
      views: 28900,
      isPro: false,
      colors: ['#8B5CF6', '#EC4899', '#F59E0B'],
      description: 'Template âm nhạc với hiệu ứng sóng âm'
    },
    {
      id: 4,
      name: 'Nature Focus',
      category: 'photography',
      preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop',
      likes: 1450,
      views: 18700,
      isPro: true,
      colors: ['#10B981', '#059669', '#065F46'],
      description: 'Thiết kế tự nhiên cho nhiếp ảnh gia'
    },
    {
      id: 5,
      name: 'Gradient Glow',
      category: 'creative',
      preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop',
      likes: 1890,
      views: 23400,
      isPro: false,
      colors: ['#667EEA', '#764BA2', '#F093FB'],
      description: 'Gradient rực rỡ với hiệu ứng phát sáng'
    },
    {
      id: 6,
      name: 'Corporate Elite',
      category: 'business',
      preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=400&fit=crop',
      likes: 750,
      views: 9800,
      isPro: true,
      colors: ['#1F2937', '#374151', '#6B7280'],
      description: 'Thiết kế cao cấp cho doanh nghiệp lớn'
    },
    {
      id: 7,
      name: 'Study Hub',
      category: 'education',
      preview: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      likes: 680,
      views: 8500,
      isPro: false,
      colors: ['#3B82F6', '#1E40AF', '#1E3A8A'],
      description: 'Template giáo dục với tông màu học thuật'
    },
    {
      id: 8,
      name: 'Shop Vibes',
      category: 'ecommerce',
      preview: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=400&fit=crop',
      likes: 1320,
      views: 16200,
      isPro: true,
      colors: ['#F59E0B', '#D97706', '#92400E'],
      description: 'Thiết kế bán hàng với màu sắc thu hút'
    },
    {
      id: 9,
      name: 'Retro Funk',
      category: 'music',
      preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
      likes: 1780,
      views: 21500,
      isPro: false,
      colors: ['#EF4444', '#F97316', '#EAB308'],
      description: 'Phong cách retro cho nghệ sĩ âm nhạc'
    }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

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
              Templates
              <span className="block text-yellow-300">Đẹp mắt</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Khám phá bộ sưu tập template được thiết kế chuyên nghiệp. Chọn và tùy chỉnh theo phong cách riêng của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Bắt đầu miễn phí
              </Link>
              <Link
                to="/features"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Xem tính năng
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Preview Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    {hoveredTemplate === template.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex space-x-3"
                      >
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                          <EyeIcon className="w-4 h-4 inline mr-2" />
                          Preview
                        </button>
                        <button className="bg-primary-500 text-white px-4 py-2 rounded-full font-medium hover:bg-primary-600 transition-colors">
                          Sử dụng
                        </button>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Pro Badge */}
                  {template.isPro && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      PRO
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <div className="flex space-x-2">
                      <span className="flex items-center text-gray-500 text-sm">
                        <HeartIcon className="w-4 h-4 mr-1" />
                        {template.likes}
                      </span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {template.views}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {template.description}
                  </p>

                  {/* Color Palette */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {template.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {categories.find(cat => cat.id === template.category)?.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Templates được yêu thích
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Được sử dụng bởi hàng nghìn creator trên toàn thế giới
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50+', label: 'Templates chuyên nghiệp' },
              { number: '10K+', label: 'Lượt sử dụng hàng tháng' },
              { number: '95%', label: 'Đánh giá tích cực' },
              { number: '24/7', label: 'Hỗ trợ tùy chỉnh' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm"
              >
                <div className="text-3xl font-bold text-primary-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
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
              Tạo lumilink đẹp trong 2 phút
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Chọn template yêu thích, tùy chỉnh theo phong cách riêng và chia sẻ với thế giới
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Bắt đầu ngay
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TemplatesPage;
