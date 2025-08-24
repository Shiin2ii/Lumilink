/**
 * =============================================================================
 * VIDEO UPLOADER COMPONENT
 * =============================================================================
 * Upload videos to Cloudinary with 30-second limit and optimization
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  FilmIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import {
  CLOUDINARY_CONFIG,
  VIDEO_CONSTRAINTS,
  getVideoTransformations,
  getCloudinaryUploadUrl,
  validateCloudinaryConfig,
  parseCloudinaryPlayerUrl,
  generateCloudinaryVideoUrls
} from '../config/cloudinary';

const VideoUploader = ({ onVideoUploaded, onClose, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [parsedCloudinaryData, setParsedCloudinaryData] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'cloudinary'
  const fileInputRef = useRef(null);

  // Validate Cloudinary configuration on component mount
  React.useEffect(() => {
    if (!validateCloudinaryConfig()) {
      toast.error('Cloudinary chưa được cấu hình. Vui lòng liên hệ admin.');
    }
  }, []);

  const validateVideo = (file) => {
    // Check file type
    if (!VIDEO_CONSTRAINTS.ALLOWED_FORMATS.includes(file.type)) {
      toast.error('Chỉ hỗ trợ định dạng MP4, WebM, MOV, AVI');
      return false;
    }

    // Check file size
    if (file.size > VIDEO_CONSTRAINTS.MAX_FILE_SIZE) {
      toast.error(`Video không được vượt quá ${VIDEO_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        setVideoDuration(duration);
        
        if (duration > VIDEO_CONSTRAINTS.MAX_DURATION) {
          toast.error(`Video không được dài quá ${VIDEO_CONSTRAINTS.MAX_DURATION} giây`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      
      video.onerror = () => {
        toast.error('Không thể đọc thông tin video');
        resolve(false);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!validateVideo(file)) return;
    
    const isDurationValid = await checkVideoDuration(file);
    if (!isDurationValid) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const uploadToCloudinary = async () => {
    if (!videoFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
      formData.append('resource_type', 'video');

      // Cloudinary transformations for optimization
      const transformations = getVideoTransformations('HD');
      formData.append('transformation', JSON.stringify(transformations));

      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
      });

      xhr.open('POST', getCloudinaryUploadUrl());
      xhr.send(formData);

      const result = await uploadPromise;
      
      // Return video data to parent component
      const videoData = {
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        cloudinaryData: result
      };

      toast.success('Video đã được upload thành công!');
      onVideoUploaded(videoData);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi upload video. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCloudinaryUrlChange = (url) => {
    setCloudinaryUrl(url);

    if (url.trim()) {
      const parsed = parseCloudinaryPlayerUrl(url);
      if (parsed.isValid) {
        setParsedCloudinaryData(parsed);
        const videoUrls = generateCloudinaryVideoUrls(parsed.cloudName, parsed.publicId);
        setVideoPreview(videoUrls.preview);
        toast.success('Cloudinary URL parsed successfully!');
      } else {
        setParsedCloudinaryData(null);
        setVideoPreview(null);
        toast.error(parsed.error || 'Invalid Cloudinary URL');
      }
    } else {
      setParsedCloudinaryData(null);
      setVideoPreview(null);
    }
  };

  const handleCloudinarySubmit = () => {
    if (!parsedCloudinaryData) {
      toast.error('Please enter a valid Cloudinary URL');
      return;
    }

    const videoUrls = generateCloudinaryVideoUrls(
      parsedCloudinaryData.cloudName,
      parsedCloudinaryData.publicId
    );

    const videoData = {
      url: videoUrls.desktop, // Use desktop quality as primary
      mobileUrl: videoUrls.mobile,
      poster: videoUrls.poster,
      cloudName: parsedCloudinaryData.cloudName,
      publicId: parsedCloudinaryData.publicId,
      isCloudinaryLink: true,
      cloudinaryData: {
        cloudName: parsedCloudinaryData.cloudName,
        publicId: parsedCloudinaryData.publicId,
        urls: videoUrls
      }
    };

    toast.success('Cloudinary video configured!');
    onVideoUploaded(videoData);
  };

  const resetUploader = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(0);
    setUploadProgress(0);
    setCloudinaryUrl('');
    setParsedCloudinaryData(null);
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <FilmIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Background Video</h3>
            <p className="text-gray-400 text-sm">Upload video hoặc dùng Cloudinary URL</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-700/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-amber-500 text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          📁 Upload File
        </button>
        <button
          onClick={() => setActiveTab('cloudinary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cloudinary'
              ? 'bg-amber-500 text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          ☁️ Cloudinary URL
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' && !videoPreview ? (
          /* Upload Area */
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-amber-400 bg-amber-400/10' 
                : 'border-amber-500/50 bg-amber-500/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-amber-600/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <CloudArrowUpIcon className="w-8 h-8 text-amber-400" />
            </div>
            
            <h4 className="text-white font-medium mb-2">Drop your video here or</h4>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Browse Video Files
            </button>
            
            <p className="text-gray-400 text-sm mt-4">
              MP4, WebM up to {VIDEO_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB • Max {VIDEO_CONSTRAINTS.MAX_DURATION} seconds
            </p>
            
            <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
              <div className="flex items-center justify-center space-x-2 text-amber-300">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Pro Tip: Use short, looping videos for best performance</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/mov,video/avi"
              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </motion.div>
        ) : activeTab === 'cloudinary' && !videoPreview ? (
          /* Cloudinary URL Input */
          <motion.div
            key="cloudinary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Cloudinary Player URL
              </label>
              <input
                type="url"
                value={cloudinaryUrl}
                onChange={(e) => handleCloudinaryUrlChange(e.target.value)}
                placeholder="https://player.cloudinary.com/embed/?cloud_name=xxx&public_id=yyy"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <p className="text-gray-400 text-sm mt-2">
                Paste your Cloudinary player embed URL or direct video URL
              </p>
            </div>

            {parsedCloudinaryData && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">URL Parsed Successfully</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><span className="text-gray-400">Cloud Name:</span> {parsedCloudinaryData.cloudName}</p>
                  <p><span className="text-gray-400">Public ID:</span> {parsedCloudinaryData.publicId}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Supported URL Formats</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Player: https://player.cloudinary.com/embed/?cloud_name=xxx&public_id=yyy</p>
                <p>• Direct: https://res.cloudinary.com/xxx/video/upload/.../yyy.mp4</p>
                <p>• Image: https://res.cloudinary.com/xxx/image/upload/.../yyy.jpg</p>
              </div>
            </div>

            <button
              onClick={handleCloudinarySubmit}
              disabled={!parsedCloudinaryData}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>Use Cloudinary Video</span>
            </button>
          </motion.div>
        ) : (
          /* Video Preview & Upload */
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Video Preview */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                src={videoPreview}
                controls
                className="w-full h-48 object-cover"
                muted
                loop
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {parsedCloudinaryData ? 'Cloudinary' : `${videoDuration.toFixed(1)}s`}
              </div>
              {parsedCloudinaryData && (
                <div className="absolute top-2 left-2 bg-amber-500/90 text-black text-xs px-2 py-1 rounded font-medium">
                  {parsedCloudinaryData.publicId}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Uploading...</span>
                  <span className="text-amber-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {parsedCloudinaryData ? (
                <button
                  onClick={handleCloudinarySubmit}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Use Cloudinary Video</span>
                </button>
              ) : (
                <button
                  onClick={uploadToCloudinary}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Upload Video</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={resetUploader}
                disabled={uploading}
                className="px-4 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoUploader;
