import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  EyeIcon,
  CheckIcon,
  StarIcon,
  SparklesIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Reusable UI Components
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';

const TemplatesTab = ({ data, refreshData, user }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Mock templates data
  const templates = [
    {
      id: 'minimal-dark',
      name: 'Minimal Dark',
      description: 'Thiết kế tối giản với tone màu tối',
      category: 'minimal',
      premium: false,
      preview: 'https://via.placeholder.com/300x400/1F2937/FFFFFF?text=Minimal+Dark',
      settings: {
        backgroundType: 'solid',
        backgroundColor: '#1F2937',
        textColor: '#FFFFFF',
        fontFamily: 'Inter',
        linkStyle: 'rounded'
      }
    },
    {
      id: 'gradient-purple',
      name: 'Purple Gradient',
      description: 'Gradient tím hồng hiện đại',
      category: 'gradient',
      premium: false,
      preview: 'https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Purple+Gradient',
      settings: {
        backgroundType: 'gradient',
        backgroundGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        textColor: '#FFFFFF',
        fontFamily: 'Poppins',
        linkStyle: 'rounded'
      }
    },
    {
      id: 'neon-cyber',
      name: 'Neon Cyber',
      description: 'Phong cách cyberpunk với hiệu ứng neon',
      category: 'creative',
      premium: true,
      preview: 'https://via.placeholder.com/300x400/0F172A/00FFFF?text=Neon+Cyber',
      settings: {
        backgroundType: 'solid',
        backgroundColor: '#0F172A',
        textColor: '#00FFFF',
        fontFamily: 'Orbitron',
        linkStyle: 'neon'
      }
    },
    {
      id: 'nature-green',
      name: 'Nature Green',
      description: 'Thiết kế tự nhiên với tone xanh lá',
      category: 'nature',
      premium: false,
      preview: 'https://via.placeholder.com/300x400/059669/FFFFFF?text=Nature+Green',
      settings: {
        backgroundType: 'gradient',
        backgroundGradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
        textColor: '#FFFFFF',
        fontFamily: 'Lato',
        linkStyle: 'rounded'
      }
    },
    {
      id: 'glass-morphism',
      name: 'Glass Morphism',
      description: 'Hiệu ứng kính mờ hiện đại',
      category: 'modern',
      premium: true,
      preview: 'https://via.placeholder.com/300x400/6366F1/FFFFFF?text=Glass+Morphism',
      settings: {
        backgroundType: 'gradient',
        backgroundGradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        textColor: '#FFFFFF',
        fontFamily: 'Inter',
        linkStyle: 'glass'
      }
    },
    {
      id: 'retro-wave',
      name: 'Retro Wave',
      description: 'Phong cách synthwave những năm 80',
      category: 'retro',
      premium: true,
      preview: 'https://via.placeholder.com/300x400/1E1B4B/FF00FF?text=Retro+Wave',
      settings: {
        backgroundType: 'gradient',
        backgroundGradient: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 50%, #EC4899 100%)',
        textColor: '#FF00FF',
        fontFamily: 'Orbitron',
        linkStyle: 'retro'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất Cả', count: templates.length },
    { id: 'minimal', name: 'Tối Giản', count: templates.filter(t => t.category === 'minimal').length },
    { id: 'gradient', name: 'Gradient', count: templates.filter(t => t.category === 'gradient').length },
    { id: 'creative', name: 'Sáng Tạo', count: templates.filter(t => t.category === 'creative').length },
    { id: 'nature', name: 'Tự Nhiên', count: templates.filter(t => t.category === 'nature').length },
    { id: 'modern', name: 'Hiện Đại', count: templates.filter(t => t.category === 'modern').length },
    { id: 'retro', name: 'Retro', count: templates.filter(t => t.category === 'retro').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  // Apply template
  const applyTemplate = async (template) => {
    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/profile/apply-template`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: template.id,
          settings: template.settings
        })
      });

      if (response.ok) {
        toast.success(`Đã áp dụng template "${template.name}" thành công!`);
        refreshData && refreshData('profile');
      } else {
        throw new Error('Failed to apply template');
      }
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Không thể áp dụng template');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 mb-4"
        >
          <SparklesIcon className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 font-medium">Mẫu Thiết Kế</span>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Chọn Template Cho Profile
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Áp dụng ngay các mẫu thiết kế đẹp mắt và chuyên nghiệp cho profile của bạn
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group">
              {/* Premium Badge */}
              {template.premium && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <StarIcon className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                </div>
              )}

              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-4 overflow-hidden relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={EyeIcon}
                    onClick={() => setPreviewTemplate(template)}
                  >
                    Xem Trước
                  </Button>
                  
                  {(!template.premium || user?.plan === 'Premium') ? (
                    <Button
                      size="sm"
                      icon={CheckIcon}
                      onClick={() => applyTemplate(template)}
                    >
                      Áp Dụng
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                    >
                      Cần Premium
                    </Button>
                  )}
                </div>
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{template.name}</h3>
                  <div className="flex items-center space-x-1">
                    <DevicePhoneMobileIcon className="w-4 h-4 text-gray-400" />
                    <ComputerDesktopIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">
                  {template.description}
                </p>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={EyeIcon}
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1"
                  >
                    Xem Trước
                  </Button>
                  
                  {(!template.premium || user?.plan === 'Premium') ? (
                    <Button
                      size="sm"
                      icon={CheckIcon}
                      onClick={() => applyTemplate(template)}
                      className="flex-1"
                    >
                      Áp Dụng
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="flex-1"
                    >
                      Cần Premium
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <EmptyState
          icon={DocumentDuplicateIcon}
          title="Không có template nào"
          description="Không tìm thấy template trong danh mục này"
        />
      )}

      {/* Custom Template CTA */}
      <Card background="bg-gradient-to-r from-purple-600/10 to-pink-600/10" border="border-purple-500/30">
        <div className="text-center">
          <PaintBrushIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Cần thiết kế riêng?
          </h3>
          <p className="text-gray-300 mb-6">
            Liên hệ với chúng tôi để tạo template tùy chỉnh theo yêu cầu của bạn
          </p>
          <Button>
            Liên Hệ Thiết Kế
          </Button>
        </div>
      </Card>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <img
                src={previewTemplate.preview}
                alt={previewTemplate.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <p className="text-gray-300 mb-6">{previewTemplate.description}</p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
                className="flex-1"
              >
                Đóng
              </Button>
              
              {(!previewTemplate.premium || user?.plan === 'Premium') ? (
                <Button
                  onClick={() => {
                    applyTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1"
                >
                  Áp Dụng Template
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="flex-1"
                >
                  Cần Premium
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TemplatesTab;
