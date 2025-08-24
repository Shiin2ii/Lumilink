import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { VIDEO_PRESETS, VideoBackgroundManager } from '../config/videoBackgrounds';

const VideoSelector = ({ 
  selectedVideoId = 'DEMON_SLAYER',
  onVideoChange = () => {},
  onClose = () => {},
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewVideoId, setPreviewVideoId] = useState(null);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);

  // Get unique categories
  const categories = ['all', ...new Set(Object.values(VIDEO_PRESETS).map(v => v.category))];

  // Filter videos based on search and category
  const filteredVideos = Object.values(VIDEO_PRESETS).filter(video => {
    const matchesSearch = video.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleVideoSelect = (videoId) => {
    onVideoChange(videoId);
    setPreviewVideoId(null);
  };

  const handlePreview = (videoId) => {
    setPreviewVideoId(previewVideoId === videoId ? null : videoId);
  };

  const togglePreviewMute = () => {
    setIsPreviewMuted(!isPreviewMuted);
  };

  return (
    <div className={`bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white font-mono">Chọn Video Background</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          ✕
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Tìm kiếm video..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all appearance-none"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category === 'all' ? 'Tất cả danh mục' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredVideos.map(video => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative bg-white/5 border rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 cursor-pointer ${
              selectedVideoId === video.id ? 'border-blue-400/50 bg-blue-500/10' : 'border-white/10'
            }`}
            onClick={() => handleVideoSelect(video.id)}
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-gray-800">
              {previewVideoId === video.id ? (
                <video
                  autoPlay
                  loop
                  muted={isPreviewMuted}
                  className="w-full h-full object-cover"
                  src={VideoBackgroundManager.generateCloudinaryUrl(video, 'HD')}
                />
              ) : (
                <img
                  src={video.poster}
                  alt={video.name}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Preview Controls */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(video.id);
                    }}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    {previewVideoId === video.id ? (
                      <PauseIcon className="w-5 h-5" />
                    ) : (
                      <PlayIcon className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  
                  {video.hasAudio && previewVideoId === video.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePreviewMute();
                      }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                      {isPreviewMuted ? (
                        <SpeakerXMarkIcon className="w-5 h-5" />
                      ) : (
                        <SpeakerWaveIcon className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedVideoId === video.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h4 className="font-semibold text-white mb-1">{video.name}</h4>
              <p className="text-sm text-white/60 mb-2 line-clamp-2">{video.description}</p>
              
              <div className="flex items-center justify-between text-xs text-white/40">
                <span className="capitalize">{video.category}</span>
                <div className="flex items-center space-x-2">
                  <span>{video.duration}s</span>
                  {video.hasAudio && <SpeakerWaveIcon className="w-3 h-3" />}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {video.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <SwatchIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Không tìm thấy video phù hợp</p>
          <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
        </div>
      )}

      {/* Custom Video Option */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <button
          onClick={() => handleVideoSelect('CUSTOM_VIDEO')}
          className="w-full p-4 bg-white/5 border border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          + Thêm video tùy chỉnh
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default VideoSelector;
