import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaintBrushIcon,
  PhotoIcon,
  SwatchIcon,
  SparklesIcon,
  EyeIcon,
  CheckIcon,
  FilmIcon,
  MusicalNoteIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import MediaBackground from './MediaBackground';

const ProfileCustomizer = ({ profile, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('theme');
  const [customProfile, setCustomProfile] = useState(profile);

  const gradientThemes = [
    {
      id: 'gradient-sunset',
      name: 'Sunset',
      type: 'gradient',
      value: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
      preview: 'linear-gradient(135deg, #fb923c, #ef4444, #ec4899)'
    },
    {
      id: 'gradient-ocean',
      name: 'Ocean',
      type: 'gradient',
      value: 'bg-gradient-to-br from-blue-400 via-blue-600 to-purple-600',
      preview: 'linear-gradient(135deg, #60a5fa, #2563eb, #9333ea)'
    },
    {
      id: 'gradient-forest',
      name: 'Forest',
      type: 'gradient',
      value: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
      preview: 'linear-gradient(135deg, #4ade80, #10b981, #0d9488)'
    },
    {
      id: 'gradient-night',
      name: 'Night',
      type: 'gradient',
      value: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900',
      preview: 'linear-gradient(135deg, #111827, #581c87, #4c1d95)'
    },
    {
      id: 'gradient-aurora',
      name: 'Aurora',
      type: 'gradient',
      value: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
      preview: 'linear-gradient(135deg, #c084fc, #ec4899, #ef4444)'
    },
    {
      id: 'solid-dark',
      name: 'Dark',
      type: 'gradient',
      value: 'bg-gray-900',
      preview: '#111827'
    }
  ];

  const videoThemes = [
    {
      id: 'video-space',
      name: 'Space Journey',
      type: 'video',
      url: 'https://player.vimeo.com/external/370467553.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=164&oauth2_token_id=57447761',
      poster: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800',
      audio: null
    },
    {
      id: 'video-ocean',
      name: 'Ocean Waves',
      type: 'video',
      url: 'https://player.vimeo.com/external/370467717.sd.mp4?s=7f87abf2c5c3c7b5c5c5c5c5c5c5c5c5c5c5c5c5&profile_id=164',
      poster: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
      audio: null
    },
    {
      id: 'video-city',
      name: 'Neon City',
      type: 'video',
      url: 'https://player.vimeo.com/external/370467553.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=164',
      poster: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
      audio: null
    }
  ];

  const gifThemes = [
    {
      id: 'gif-matrix',
      name: 'Matrix',
      type: 'gif',
      url: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      preview: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/200w.gif'
    },
    {
      id: 'gif-neon',
      name: 'Neon City',
      type: 'gif',
      url: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
      preview: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/200w.gif'
    },
    {
      id: 'gif-space',
      name: 'Space Travel',
      type: 'gif',
      url: 'https://media.giphy.com/media/3o7qDMlVquZI1axqQ8/giphy.gif',
      preview: 'https://media.giphy.com/media/3o7qDMlVquZI1axqQ8/200w.gif'
    }
  ];

  const layouts = [
    {
      id: 'default',
      name: 'Default',
      description: 'Classic vertical layout'
    },
    {
      id: 'grid',
      name: 'Grid',
      description: '2-column grid layout'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean minimal design'
    },
    {
      id: 'card',
      name: 'Cards',
      description: 'Card-based layout'
    }
  ];

  const accentColors = [
    { name: 'Yellow', value: '#fbbf24', class: 'accent-yellow' },
    { name: 'Blue', value: '#3b82f6', class: 'blue-500' },
    { name: 'Purple', value: '#8b5cf6', class: 'purple-500' },
    { name: 'Pink', value: '#ec4899', class: 'pink-500' },
    { name: 'Green', value: '#10b981', class: 'emerald-500' },
    { name: 'Red', value: '#ef4444', class: 'red-500' },
    { name: 'Orange', value: '#f97316', class: 'orange-500' },
    { name: 'Teal', value: '#14b8a6', class: 'teal-500' }
  ];

  const handleThemeChange = (theme) => {
    setCustomProfile(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        background: theme,
        backgroundId: theme.id
      }
    }));
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newBackground = {
      id: `custom-${type}-${Date.now()}`,
      name: `Custom ${type}`,
      type: type,
      url: url,
      isCustom: true
    };

    if (type === 'video') {
      newBackground.poster = url;
    }

    handleThemeChange(newBackground);
  };

  const handleLayoutChange = (layout) => {
    setCustomProfile(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        layout: layout.id
      }
    }));
  };

  const handleAccentColorChange = (color) => {
    setCustomProfile(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        accentColor: color.value,
        accentClass: color.class
      }
    }));
  };

  const handleSave = () => {
    onUpdate(customProfile);
    onClose();
  };

  const tabs = [
    { id: 'theme', name: 'Gradients', icon: PaintBrushIcon },
    { id: 'video', name: 'Videos', icon: FilmIcon },
    { id: 'gif', name: 'GIFs', icon: PhotoIcon },
    { id: 'upload', name: 'Upload', icon: CloudArrowUpIcon },
    { id: 'layout', name: 'Layout', icon: SwatchIcon },
    { id: 'colors', name: 'Colors', icon: SparklesIcon },
    { id: 'typography', name: 'Typography', icon: SparklesIcon },
    { id: 'audio', name: 'Audio', icon: MusicalNoteIcon }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex h-[80vh]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Customize Profile</h2>
            
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <CheckIcon className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full mt-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            {/* Settings Panel */}
            <div className="w-80 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'theme' && (
                  <motion.div
                    key="theme"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gradient Backgrounds</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {gradientThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme)}
                          className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                            customProfile.theme?.backgroundId === theme.id
                              ? 'border-primary-500 ring-2 ring-primary-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-full h-16 rounded-lg mb-2"
                            style={{ background: theme.preview }}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'video' && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Backgrounds</h3>
                    <div className="space-y-3">
                      {videoThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            customProfile.theme?.backgroundId === theme.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-16 h-12 rounded-lg bg-cover bg-center"
                              style={{ backgroundImage: `url(${theme.poster})` }}
                            ></div>
                            <div>
                              <div className="font-medium text-gray-900">{theme.name}</div>
                              <div className="text-sm text-gray-600">Video background</div>
                              {theme.audio && (
                                <div className="text-xs text-blue-600 flex items-center mt-1">
                                  <MusicalNoteIcon className="w-3 h-3 mr-1" />
                                  With audio
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gif' && (
                  <motion.div
                    key="gif"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">GIF Backgrounds</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {gifThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme)}
                          className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                            customProfile.theme?.backgroundId === theme.id
                              ? 'border-primary-500 ring-2 ring-primary-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-full h-16 rounded-lg mb-2 bg-cover bg-center"
                            style={{ backgroundImage: `url(${theme.preview})` }}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Custom Media</h3>
                    <div className="space-y-4">
                      {/* Upload Video */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                        <FilmIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-medium text-gray-900 mb-2">Upload Video</h4>
                        <p className="text-sm text-gray-600 mb-4">MP4, WebM up to 50MB</p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'video')}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                        >
                          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                          Choose Video
                        </label>
                      </div>

                      {/* Upload Image/GIF */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-medium text-gray-900 mb-2">Upload Image/GIF</h4>
                        <p className="text-sm text-gray-600 mb-4">JPG, PNG, GIF up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                        >
                          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                          Choose Image
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'layout' && (
                  <motion.div
                    key="layout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Style</h3>
                    <div className="space-y-3">
                      {layouts.map((layout) => (
                        <button
                          key={layout.id}
                          onClick={() => handleLayoutChange(layout)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            customProfile.theme?.layout === layout.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{layout.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{layout.description}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'colors' && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Accent Colors</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {accentColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => handleAccentColorChange(color)}
                          className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                            customProfile.theme?.accentColor === color.value
                              ? 'border-gray-900 ring-2 ring-gray-300'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {customProfile.theme?.accentColor === color.value && (
                            <CheckIcon className="w-4 h-4 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'typography' && (
                  <motion.div
                    key="typography"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography & Styling</h3>
                    <div className="space-y-6">
                      {/* Font Family */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={customProfile.theme?.typography?.fontFamily || 'Inter, sans-serif'}
                          onChange={(e) => setCustomProfile(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              typography: {
                                ...prev.theme?.typography,
                                fontFamily: e.target.value
                              }
                            }
                          }))}
                        >
                          <option value="Inter, sans-serif">Inter</option>
                          <option value="Roboto, sans-serif">Roboto</option>
                          <option value="Poppins, sans-serif">Poppins</option>
                          <option value="Montserrat, sans-serif">Montserrat</option>
                          <option value="Open Sans, sans-serif">Open Sans</option>
                          <option value="Lato, sans-serif">Lato</option>
                          <option value="Nunito, sans-serif">Nunito</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={customProfile.theme?.typography?.fontSize || '16px'}
                          onChange={(e) => setCustomProfile(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              typography: {
                                ...prev.theme?.typography,
                                fontSize: e.target.value
                              }
                            }
                          }))}
                        >
                          <option value="14px">Small (14px)</option>
                          <option value="16px">Medium (16px)</option>
                          <option value="18px">Large (18px)</option>
                          <option value="20px">Extra Large (20px)</option>
                        </select>
                      </div>

                      {/* Link Colors */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link Color</label>
                        <input
                          type="color"
                          className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                          value={customProfile.theme?.typography?.linkColor || '#3B82F6'}
                          onChange={(e) => setCustomProfile(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              typography: {
                                ...prev.theme?.typography,
                                linkColor: e.target.value
                              }
                            }
                          }))}
                        />
                      </div>

                      {/* Border Radius */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={customProfile.theme?.customization?.borderRadius || '12px'}
                          onChange={(e) => setCustomProfile(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              customization: {
                                ...prev.theme?.customization,
                                borderRadius: e.target.value
                              }
                            }
                          }))}
                        >
                          <option value="4px">Small (4px)</option>
                          <option value="8px">Medium (8px)</option>
                          <option value="12px">Large (12px)</option>
                          <option value="16px">Extra Large (16px)</option>
                          <option value="24px">Rounded (24px)</option>
                        </select>
                      </div>

                      {/* Spacing */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link Spacing</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={customProfile.theme?.customization?.spacing || 'comfortable'}
                          onChange={(e) => setCustomProfile(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              customization: {
                                ...prev.theme?.customization,
                                spacing: e.target.value
                              }
                            }
                          }))}
                        >
                          <option value="compact">Compact</option>
                          <option value="comfortable">Comfortable</option>
                          <option value="relaxed">Relaxed</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'audio' && (
                  <motion.div
                    key="audio"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Audio</h3>
                    <div className="space-y-4">
                      {/* Upload Audio */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                        <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-medium text-gray-900 mb-2">Upload Background Music</h4>
                        <p className="text-sm text-gray-600 mb-4">MP3, WAV up to 20MB</p>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const audioUrl = URL.createObjectURL(file);
                              setCustomProfile(prev => ({
                                ...prev,
                                theme: {
                                  ...prev.theme,
                                  audio: audioUrl
                                }
                              }));
                            }
                          }}
                          className="hidden"
                          id="audio-upload"
                        />
                        <label
                          htmlFor="audio-upload"
                          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                        >
                          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                          Choose Audio
                        </label>
                      </div>

                      {/* Audio Settings */}
                      {customProfile.theme?.audio && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h5 className="font-medium text-gray-900 mb-3">Audio Settings</h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Volume
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                defaultValue="30"
                                className="w-full"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="autoplay-audio"
                                defaultChecked
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <label htmlFor="autoplay-audio" className="ml-2 text-sm text-gray-700">
                                Auto-play when page loads
                              </label>
                            </div>
                            <button
                              onClick={() => {
                                setCustomProfile(prev => ({
                                  ...prev,
                                  theme: {
                                    ...prev.theme,
                                    audio: null
                                  }
                                }));
                              }}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove audio
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 bg-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <EyeIcon className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full relative">
                {/* Preview Background */}
                <MediaBackground
                  background={customProfile.theme?.background}
                  className="rounded-xl"
                />

                {/* Preview Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{customProfile.displayName}</h3>
                  <p className="text-white/80 text-sm mb-4">@{customProfile.username}</p>
                  <div className="space-y-2 w-full max-w-xs">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <span className="text-sm">🌐 Website</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <span className="text-sm">📸 Instagram</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCustomizer;
