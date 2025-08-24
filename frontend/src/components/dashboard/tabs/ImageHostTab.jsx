import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  FolderIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Reusable UI Components
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import EmptyState from '../../ui/EmptyState';
import StatCard from '../../ui/StatCard';

const ImageHostTab = ({ data, refreshData, user }) => {
  const [uploadedImages, setUploadedImages] = useState([
    // Mock data - replace with real API data
    {
      id: '1',
      filename: 'avatar.jpg',
      url: 'https://via.placeholder.com/300x200',
      size: 245760, // bytes
      uploadedAt: '2024-01-15T10:30:00Z',
      type: 'image/jpeg'
    },
    {
      id: '2',
      filename: 'background.png',
      url: 'https://via.placeholder.com/400x300',
      size: 512000,
      uploadedAt: '2024-01-14T15:20:00Z',
      type: 'image/png'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Calculate stats
  const totalImages = uploadedImages.length;
  const totalSize = uploadedImages.reduce((acc, img) => acc + img.size, 0);
  const storageLimit = user?.plan === 'Premium' ? 1000 * 1024 * 1024 : 100 * 1024 * 1024; // 1GB vs 100MB
  const usagePercentage = (totalSize / storageLimit) * 100;

  const stats = [
    {
      title: 'Tổng Hình Ảnh',
      value: totalImages,
      icon: PhotoIcon,
      color: 'blue'
    },
    {
      title: 'Dung Lượng Sử Dụng',
      value: formatFileSize(totalSize),
      icon: CloudArrowUpIcon,
      color: 'green'
    },
    {
      title: 'Giới Hạn',
      value: formatFileSize(storageLimit),
      icon: FolderIcon,
      color: 'purple'
    }
  ];

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Handle file upload
  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} không phải là file hình ảnh`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} quá lớn (tối đa 10MB)`);
          continue;
        }

        // Check storage limit
        if (totalSize + file.size > storageLimit) {
          toast.error('Không đủ dung lượng lưu trữ');
          break;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Upload to server
        const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          
          // Add to uploaded images
          const newImage = {
            id: Date.now().toString(),
            filename: file.name,
            url: result.url || URL.createObjectURL(file),
            size: file.size,
            uploadedAt: new Date().toISOString(),
            type: file.type
          };
          
          setUploadedImages(prev => [newImage, ...prev]);
          toast.success(`Đã upload ${file.name} thành công!`);
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể upload hình ảnh');
    } finally {
      setIsUploading(false);
    }
  }, [totalSize, storageLimit]);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  }, [handleFileUpload]);

  // Copy URL to clipboard
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Đã sao chép URL!');
  };

  // Delete image
  const deleteImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return;

    try {
      // Call API to delete
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/upload/image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Đã xóa hình ảnh thành công!');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa hình ảnh');
    }
  };

  // Filter images based on search
  const filteredImages = uploadedImages.filter(img =>
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Lưu Trữ Hình Ảnh</h2>
        <p className="text-gray-400">Upload và quản lý hình ảnh cho profile và liên kết của bạn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Storage Usage */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Dung Lượng Sử Dụng</h3>
          <span className="text-gray-400 text-sm">
            {formatFileSize(totalSize)} / {formatFileSize(storageLimit)}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              usagePercentage > 90 ? 'bg-red-500' : 
              usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{usagePercentage.toFixed(1)}% đã sử dụng</span>
          {user?.plan !== 'Premium' && (
            <span className="text-purple-400">Nâng cấp Premium để có thêm dung lượng</span>
          )}
        </div>
      </Card>

      {/* Upload Area */}
      <Card>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {dragActive ? 'Thả file để upload' : 'Upload Hình Ảnh'}
          </h3>
          <p className="text-gray-400 mb-4">
            Kéo thả file hoặc click để chọn. Hỗ trợ JPG, PNG, GIF (tối đa 10MB)
          </p>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(Array.from(e.target.files))}
            className="hidden"
            id="image-upload"
          />
          
          <Button
            as="label"
            htmlFor="image-upload"
            loading={isUploading}
            disabled={isUploading}
          >
            {isUploading ? 'Đang upload...' : 'Chọn File'}
          </Button>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm hình ảnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={MagnifyingGlassIcon}
          />
        </div>
      </div>

      {/* Images Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6">
          Hình Ảnh Đã Upload ({filteredImages.length})
        </h3>
        
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card padding="p-4" hover={false}>
                  <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium truncate" title={image.filename}>
                      {image.filename}
                    </h4>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{formatFileSize(image.size)}</span>
                      <span>{new Date(image.uploadedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={ClipboardDocumentIcon}
                        onClick={() => copyToClipboard(image.url)}
                        className="flex-1 text-xs"
                      >
                        Copy
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        icon={EyeIcon}
                        onClick={() => window.open(image.url, '_blank')}
                      />
                      
                      <Button
                        size="sm"
                        variant="danger"
                        icon={TrashIcon}
                        onClick={() => deleteImage(image.id)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PhotoIcon}
            title="Chưa có hình ảnh nào"
            description={searchTerm ? 'Không tìm thấy hình ảnh phù hợp' : 'Upload hình ảnh đầu tiên để bắt đầu'}
            actionText={!searchTerm ? 'Upload Hình Ảnh' : undefined}
            onAction={!searchTerm ? () => document.getElementById('image-upload').click() : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default ImageHostTab;
