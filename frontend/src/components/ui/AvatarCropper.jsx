import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

const AvatarCropper = ({ 
  isOpen, 
  onClose, 
  imageSrc, 
  onCropComplete,
  title = "Chỉnh sửa Avatar"
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation) => {
    setRotation(rotation);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create canvas and crop image
  const createCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    return new Promise((resolve) => {
      image.onload = () => {
        // Set canvas size to crop area
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        // Apply rotation if needed
        if (rotation !== 0) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // Draw cropped image
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        // Convert to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
      image.src = imageSrc;
    });
  }, [imageSrc, croppedAreaPixels, rotation]);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const croppedBlob = await createCroppedImage();
      if (croppedBlob) {
        await onCropComplete(croppedBlob);
        onClose();
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Cropper Container */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ height: '400px' }}>
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1} // Square aspect ratio for avatar
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onRotationChange={onRotationChange}
                onCropComplete={onCropCompleteCallback}
                cropShape="round"
                showGrid={false}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#111827'
                  }
                }}
              />
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4 mb-6">
            {/* Zoom Control */}
            <div className="flex items-center space-x-4">
              <MagnifyingGlassMinusIcon className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <MagnifyingGlassPlusIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400 w-12">{zoom.toFixed(1)}x</span>
            </div>

            {/* Rotation Control */}
            <div className="flex items-center space-x-4">
              <ArrowPathIcon className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-400 w-12">{rotation}°</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Đặt lại</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                <CheckIcon className="w-4 h-4" />
                <span>{isProcessing ? 'Đang xử lý...' : 'Lưu'}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AvatarCropper;
