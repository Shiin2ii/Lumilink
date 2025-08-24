import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SwatchIcon,
  CheckIcon,
  EyeIcon,
  SparklesIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';

const ThemeSelector = ({
  selectedTheme = 'default',
  onThemeChange,
  showPreview = true,
  className = '',
  ...props
}) => {
  const [previewTheme, setPreviewTheme] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const themes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean và professional',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#fbbf24',
        background: '#ffffff',
        text: '#1f2937'
      },
      preview: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Tối màu, dễ nhìn',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#fbbf24',
        background: '#1f2937',
        text: '#ffffff'
      },
      preview: 'bg-gradient-to-br from-gray-800 to-gray-900'
    },
    {
      id: 'colorful',
      name: 'Colorful',
      description: 'Sống động và năng động',
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937'
      },
      preview: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Tối giản và tinh tế',
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        accent: '#000000',
        background: '#ffffff',
        text: '#000000'
      },
      preview: 'bg-gradient-to-br from-gray-100 to-gray-200'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Xanh tự nhiên',
      colors: {
        primary: '#059669',
        secondary: '#065f46',
        accent: '#84cc16',
        background: '#f0fdf4',
        text: '#1f2937'
      },
      preview: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Ấm áp như hoàng hôn',
      colors: {
        primary: '#ea580c',
        secondary: '#dc2626',
        accent: '#fbbf24',
        background: '#fff7ed',
        text: '#1f2937'
      },
      preview: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Mát mẻ như đại dương',
      colors: {
        primary: '#0891b2',
        secondary: '#0e7490',
        accent: '#06b6d4',
        background: '#f0f9ff',
        text: '#1f2937'
      },
      preview: 'bg-gradient-to-br from-cyan-500 to-blue-600'
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Tùy chỉnh theo ý bạn',
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937'
      },
      preview: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      isCustom: true
    }
  ];

  const fonts = [
    { id: 'inter', name: 'Inter', class: 'font-sans', preview: 'Modern & Clean' },
    { id: 'poppins', name: 'Poppins', class: 'font-poppins', preview: 'Friendly & Round' },
    { id: 'roboto', name: 'Roboto', class: 'font-roboto', preview: 'Professional' },
    { id: 'playfair', name: 'Playfair', class: 'font-serif', preview: 'Elegant & Classic' }
  ];

  const handleThemeSelect = (themeId) => {
    onThemeChange?.(themeId);
  };

  const handlePreview = (themeId) => {
    setPreviewTheme(themeId);
  };

  const closePreview = () => {
    setPreviewTheme(null);
  };

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];
  const previewThemeData = themes.find(t => t.id === previewTheme);

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <SwatchIcon className="w-5 h-5 mr-2" />
            Chọn Theme
          </h3>
          <p className="text-sm text-gray-600">
            Tùy chỉnh giao diện lumilink của bạn
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustomizer(true)}
        >
          <PaintBrushIcon className="w-4 h-4 mr-2" />
          Tùy chỉnh
        </Button>
      </div>

      {/* Current Theme Info */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-xl ${currentTheme.preview}`} />
          <div>
            <h4 className="font-semibold text-gray-900">{currentTheme.name}</h4>
            <p className="text-sm text-gray-600">{currentTheme.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              {Object.entries(currentTheme.colors).slice(0, 4).map(([key, color]) => (
                <div
                  key={key}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={key}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              clickable
              onClick={() => handleThemeSelect(theme.id)}
              className={`relative p-4 cursor-pointer transition-all duration-300 ${
                selectedTheme === theme.id
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-lg'
              }`}
            >
              {/* Theme Preview */}
              <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview} relative overflow-hidden`}>
                {/* Mock Content */}
                <div className="absolute inset-2 bg-white/20 rounded backdrop-blur-sm">
                  <div className="p-2 space-y-1">
                    <div className="w-8 h-8 bg-white/40 rounded-full mx-auto" />
                    <div className="h-1 bg-white/40 rounded mx-auto w-12" />
                    <div className="space-y-0.5">
                      <div className="h-1 bg-white/30 rounded w-full" />
                      <div className="h-1 bg-white/30 rounded w-3/4" />
                    </div>
                  </div>
                </div>

                {/* Selected Indicator */}
                <AnimatePresence>
                  {selectedTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
                    >
                      <CheckIcon className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Custom Badge */}
                {theme.isCustom && (
                  <div className="absolute top-2 left-2">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-1">{theme.name}</h4>
                <p className="text-xs text-gray-600 mb-3">{theme.description}</p>
                
                {/* Color Palette */}
                <div className="flex justify-center space-x-1 mb-3">
                  {Object.entries(theme.colors).slice(0, 4).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Preview Button */}
                {showPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(theme.id);
                    }}
                    className="w-full"
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Font Selection */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Chọn Font</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fonts.map((font) => (
            <Card
              key={font.id}
              clickable
              className={`p-3 text-center cursor-pointer transition-all duration-300 hover:shadow-md`}
            >
              <div className={`${font.class} text-lg font-semibold text-gray-900 mb-1`}>
                Aa
              </div>
              <p className="text-sm font-medium text-gray-900">{font.name}</p>
              <p className="text-xs text-gray-600">{font.preview}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewTheme}
        onClose={closePreview}
        title="Theme Preview"
        size="lg"
      >
        {previewThemeData && (
          <div className="space-y-4">
            <div 
              className="w-full h-64 rounded-xl relative overflow-hidden"
              style={{ backgroundColor: previewThemeData.colors.background }}
            >
              <div className={`absolute inset-0 ${previewThemeData.preview} opacity-20`} />
              
              {/* Mock LumiLink Preview */}
              <div className="absolute inset-4 bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                  style={{ backgroundColor: previewThemeData.colors.primary }}
                />
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: previewThemeData.colors.text }}
                >
                  @yourname
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: previewThemeData.colors.secondary }}
                >
                  LumiLink của tôi ✨
                </p>
                
                <div className="space-y-2">
                  {['Instagram', 'Website', 'YouTube'].map((link, idx) => (
                    <div
                      key={link}
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: previewThemeData.colors.primary,
                        color: previewThemeData.colors.background
                      }}
                    >
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {previewThemeData.name}
              </h4>
              <p className="text-gray-600 mb-4">{previewThemeData.description}</p>
              
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={closePreview}
                >
                  Đóng
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleThemeSelect(previewTheme);
                    closePreview();
                  }}
                >
                  Chọn Theme Này
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom Theme Modal */}
      <Modal
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        title="Tùy chỉnh Theme"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center text-gray-600">
            <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Custom Theme Builder
            </h3>
            <p>Tính năng tùy chỉnh theme chi tiết đang được phát triển!</p>
            <p className="text-sm mt-2">
              Sẽ có sớm với nhiều tùy chọn màu sắc, font chữ và layout.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ThemeSelector;
