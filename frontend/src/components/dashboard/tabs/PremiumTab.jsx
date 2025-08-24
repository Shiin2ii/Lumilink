import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  CheckIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  PlayIcon,
  PhotoIcon,
  EyeSlashIcon,
  UserCircleIcon,
  FilmIcon,
  CloudArrowUpIcon,

} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '../../../services/api';

// Reusable UI Components
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import RingAvatarSettings from '../../ui/RingAvatarSettings';
import RingAvatar from '../../ui/RingAvatar';


// API Services
import premiumApi from '../../../services/premiumApi';

const PremiumTab = ({ refreshData, user }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [videoSourceTab, setVideoSourceTab] = useState('cloudinary');
  const [videoUrl, setVideoUrl] = useState('');
  const [p2pUrl, setP2pUrl] = useState('');
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [previewVideoData, setPreviewVideoData] = useState(null);

  // Avatar Decoration states
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [showDecorationModal, setShowDecorationModal] = useState(false);
  const [showRingAvatarSettings, setShowRingAvatarSettings] = useState(false);
  const [ringAvatarSettings, setRingAvatarSettings] = useState({});

  // Subscription state
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Check if user has premium subscription
  const isPremium = subscriptionData?.isPremium || false;

  // Load subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoadingSubscription(true);
        const response = await apiClient.get('/premium/subscription');

        if (response.data.success) {
          setSubscriptionData(response.data.data);
        }
      } catch (error) {
        console.error('❌ Error fetching subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    if (user?.id) {
      fetchSubscriptionData();
    }
  }, [user?.id]);

  // Load decorations on component mount
  useEffect(() => {
    const loadDecorations = () => {
      const decorationList = [
        'angel.png', 'devil.png', 'cat_ears.png', 'cat_ears_blue.png', 'cat_ears_purple.png',
        'wizard_hat_blue.png', 'wizard_hat_purple.png', 'crystal_ball_blue.png', 'crystal_ball_purple.png',
        'phoenix.png', 'dragon_balls.png', 'lightning.png', 'fire.png', 'unicorn.png',
        'kitsune.png', 'sakura.png', 'autumn_crown.png', 'golden_hex.png', 'heart_to_heart.png',
        'magic_portal_blue.png', 'magic_portal_purple.png', 'skull_medallion.png', 'snowglobe.png'
      ];

      const decorationObjects = decorationList.map((filename, index) => ({
        id: index + 1,
        name: filename.replace('.png', '').replace(/_/g, ' '),
        filename,
        path: `/decorations/${filename}`,
        category: 'premium'
      }));

      setDecorations(decorationObjects);
    };

    loadDecorations();
  }, []);

  // Handle decoration selection
  const handleSelectDecoration = (decoration) => {
    if (!isPremium) {
      toast.error('Cần nâng cấp Premium để sử dụng Avatar Decoration');
      setShowUpgradeModal(true);
      return;
    }

    setSelectedDecoration(decoration);
    setRingAvatarSettings(prev => ({
      ...prev,
      decorationImage: decoration.path,
      ringColor: 'image',
      ringPosition: 'overlay'
    }));

    toast.success(`Đã áp dụng decoration: ${decoration.name}`);
  };

  // Handle apply video
  const handleApplyVideo = async (videoData) => {
    try {
      if (videoData.type === 'file') {
        // Upload file and set as background
        await premiumApi.uploadVideoBackground(videoData.file);
      } else {
        // Use URL directly (cloudinary or p2p)
        await premiumApi.setVideoBackground(videoData.url, videoData.type);
      }

      toast.success('Video background applied successfully!');
      refreshData && refreshData('profile');
    } catch (error) {
      console.error('Error applying video:', error);
      toast.error(error.message || 'Failed to apply video background');
    }
  };

  // Handle apply ring avatar settings
  const handleApplyRingAvatar = async (settings) => {
    try {
      await premiumApi.updateRingAvatarSettings(settings);
      setRingAvatarSettings(settings);
      toast.success('Ring Avatar settings applied successfully!');
      refreshData && refreshData('profile');
    } catch (error) {
      console.error('Error applying ring avatar settings:', error);
      toast.error(error.message || 'Failed to apply ring avatar settings');
    }
  };

  // Premium Features
  const premiumFeatures = [
    {
      id: 'avatar-decoration',
      title: 'Avatar Decoration',
      description: 'Trang trí avatar với các decoration độc đáo',
      icon: UserCircleIcon,
      color: 'purple',
      enabled: true,
      canSave: isPremium,
      demo: '/decorations/angel.png',
      demoType: 'decoration',
      settings: {
        allowDecoration: true,
        categories: ['Gaming', 'Seasonal', 'Fantasy', 'Cute'],
        overlayMode: true
      }
    },
    {
      id: 'animated-background',
      title: 'Hình Ảnh + GIF Background',
      description: 'Upload hình ảnh tĩnh hoặc GIF động làm background',
      icon: PhotoIcon,
      color: 'purple',
      enabled: true,
      canSave: isPremium,
      demo: 'https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy.gif',
      demoType: 'gif', // Specify this is a GIF demo
      settings: {
        allowImage: true,
        allowGif: true,
        maxSize: '10MB',
        formats: ['JPG', 'PNG', 'GIF', 'WEBP']
      }
    },
    {
      id: 'video-background',
      title: 'Video Background',
      description: 'URL Cloudinary hoặc upload video làm background',
      icon: FilmIcon,
      color: 'blue',
      enabled: true,
      canSave: isPremium,
      demo: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761',
      demoType: 'video', // Specify this is a video demo
      settings: {
        allowCloudinary: true,
        allowUpload: true,
        maxDuration: '30s',
        maxSize: '50MB',
        formats: ['MP4', 'WEBM', 'MOV']
      }
    },
    {
      id: 'ring-avatar',
      title: 'Ring Avatar',
      description: 'Hiệu ứng ring xung quanh avatar với nhiều style',
      icon: UserCircleIcon,
      color: 'amber',
      enabled: true,
      canSave: isPremium,
      demo: 'https://player.vimeo.com/external/434045527.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761',
      demoType: 'video', // Ring avatar animation demo
      settings: {
        ringColors: ['gradient', 'rainbow', 'pulse', 'glow'],
        animations: ['rotate', 'pulse', 'bounce', 'static'],
        thickness: [2, 4, 6, 8],
        speed: ['slow', 'normal', 'fast']
      }
    },
    {
      id: 'hide-watermark',
      title: 'Ẩn Watermark',
      description: 'Loại bỏ hoàn toàn watermark "Powered by LumiLink"',
      icon: EyeSlashIcon,
      color: 'green',
      enabled: true,
      canSave: isPremium,
      demo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&crop=center',
      settings: {
        hideFooter: true,
        customBranding: true,
        whiteLabel: true
      }
    }
  ];

  // Handle feature activation
  const handleFeatureActivation = async (featureId) => {
    if (!isPremium) {
      toast.error('Cần nâng cấp Premium để lưu cài đặt này');
      // Show upgrade modal instead of blocking
      setShowUpgradeModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/premium/activate-feature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featureId })
      });

      if (response.ok) {
        toast.success('Đã kích hoạt tính năng thành công!');
        refreshData && refreshData('profile');
      } else {
        throw new Error('Failed to activate feature');
      }
    } catch (error) {
      console.error('Error activating feature:', error);
      toast.error('Không thể kích hoạt tính năng');
    }
  };

  // Handle file upload for premium features
  const handleFileUpload = async (file, featureType) => {
    if (!isPremium) {
      toast.error('Cần nâng cấp Premium để lưu file này');
      setShowUpgradeModal(true);
      return;
    }

    try {
      if (featureType === 'video-background') {
        await premiumApi.uploadVideoBackground(file);
      } else if (featureType === 'animated-background') {
        const result = await premiumApi.uploadBackground(file);

        // Apply image/gif as background using theme settings
        await premiumApi.updateProfile({
          theme: {
            background: {
              type: 'image',
              value: result.url || result.data?.url
            }
          }
        });
      } else if (featureType === 'ring-avatar') {
        await premiumApi.uploadAvatar(file);
      }

      toast.success('Upload thành công!');
      setShowUploadModal(false);
      refreshData && refreshData('profile');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Không thể upload file');
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Premium Hàng Tháng',
      price: '50,000',
      period: '/tháng',
      description: 'Tất cả tính năng Premium với thanh toán hàng tháng',
      popular: false
    },
    {
      id: 'yearly',
      name: 'Premium Hàng Năm',
      price: '399,000',
      period: '/năm',
      originalPrice: '600,000',
      description: 'Tiết kiệm 33% với thanh toán hàng năm',
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Premium Trọn Đời',
      price: '999,999',
      period: 'một lần',
      description: 'Thanh toán một lần, sử dụng trọn đời',
      popular: false
    }
  ];

  const features = [
    {
      category: 'Premium Visual Features',
      icon: SparklesIcon,
      items: [
        'Ảnh động GIF Background',
        'Video Background với loop',
        'Ring Avatar với hiệu ứng',
        'Ẩn Watermark LumiLink',
        'Custom animations'
      ]
    },
    {
      category: 'Analytics & Insights',
      icon: ChartBarIcon,
      items: [
        'Thống kê chi tiết không giới hạn',
        'Phân tích theo thời gian thực',
        'Báo cáo xuất khẩu PDF/Excel',
        'Theo dõi nguồn traffic',
        'Phân tích thiết bị và vị trí'
      ]
    },
    {
      category: 'Advanced Customization',
      icon: PaintBrushIcon,
      items: [
        'Themes cao cấp không giới hạn',
        'CSS tùy chỉnh',
        'Upload background riêng',
        'Fonts cao cấp',
        'Animations và effects'
      ]
    },
    {
      category: 'Links & Content',
      icon: BoltIcon,
      items: [
        'Liên kết không giới hạn',
        'Link scheduling',
        'QR codes tùy chỉnh',
        'Link expiration',
        'Password protected links'
      ]
    },
    {
      category: 'Branding & SEO',
      icon: GlobeAltIcon,
      items: [
        'Custom domain riêng',
        'Loại bỏ watermark LumiLink',
        'SEO optimization tools',
        'Meta tags tùy chỉnh',
        'Google Analytics integration'
      ]
    },
    {
      category: 'Priority Support',
      icon: ShieldCheckIcon,
      items: [
        'Hỗ trợ ưu tiên 24/7',
        'Live chat support',
        'Phone support',
        'Dedicated account manager',
        'Priority feature requests'
      ]
    }
  ];

  const handleUpgrade = async (planId) => {
    setSelectedPlan(planId);
    setIsUpgrading(true);

    try {


      // Call backend to create MoMo payment
      const response = await apiClient.post('/premium/payment/momo/create', { planId });

      if (response.data.success) {


        // Redirect to MoMo payment page
        window.location.href = response.data.data.payUrl;
      } else {
        throw new Error(response.data.message || 'Failed to create payment');
      }

    } catch (error) {
      console.error('❌ Error creating payment:', error);
      toast.error(error.response?.data?.message || error.message || 'Không thể tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setIsUpgrading(false);
      setSelectedPlan(null);
    }
  };

  if (isPremium) {
    return (
      <div className="space-y-8">
        {/* Premium Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card background="bg-gradient-to-r from-purple-600/20 to-pink-600/20" border="border-purple-500/30">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🎉 Bạn đã là thành viên Premium!
              </h2>
              <p className="text-gray-300 mb-4">
                Cảm ơn bạn đã tin tưởng và sử dụng LumiLink Premium
              </p>

              {/* Subscription Info */}
              {subscriptionData?.subscription && (
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Gói:</span>
                      <span className="text-white ml-2 font-medium">
                        {subscriptionData.subscription.planId === 'monthly' ? 'Hàng tháng' :
                         subscriptionData.subscription.planId === 'yearly' ? 'Hàng năm' : 'Trọn đời'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Trạng thái:</span>
                      <span className="text-green-400 ml-2 font-medium">Đang hoạt động</span>
                    </div>
                    {subscriptionData.subscription.daysRemaining > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Còn lại:</span>
                        <span className="text-white ml-2 font-medium">
                          {subscriptionData.subscription.daysRemaining} ngày
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">∞</div>
                  <div className="text-gray-300 text-sm">Liên kết không giới hạn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">✓</div>
                  <div className="text-gray-300 text-sm">Tất cả tính năng cao cấp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-gray-300 text-sm">Hỗ trợ ưu tiên</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  Quản Lý Subscription
                </Button>
                <Button>
                  Khám Phá Tính Năng
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Premium Features Showcase */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">Tính Năng Premium Độc Quyền</h3>
          <p className="text-gray-400 mb-6">Khám phá các tính năng cao cấp để làm nổi bật profile của bạn</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden group" padding="p-3">
                  {/* Feature Demo */}
                  <div className="aspect-[4/3] bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                    {feature.demoType === 'video' ? (
                      <video
                        src={feature.demo}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : feature.demoType === 'gif' ? (
                      <img
                        src={feature.demo}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={feature.demo}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Play/Demo Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={() => setActiveFeature(feature)}
                        icon={PlayIcon}
                      >
                        {feature.demoType === 'video' ? 'Xem Video' :
                         feature.demoType === 'gif' ? 'Xem GIF' : 'Xem Demo'}
                      </Button>
                    </div>

                    {/* Media Type Badge */}
                    {(feature.demoType === 'video' || feature.demoType === 'gif') && (
                      <div className="absolute top-2 left-2">
                        <div className="px-2 py-1 bg-black/70 text-white text-xs rounded-md font-medium">
                          {feature.demoType === 'video' ? '🎥 VIDEO' : '🎞️ GIF'}
                        </div>
                      </div>
                    )}

                    {/* Premium Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        feature.canSave
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        <StarIcon className="w-3 h-3" />
                        <span>{feature.canSave ? 'Premium' : 'Preview Only'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Info */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1.5 rounded-md bg-${feature.color}-500/20`}>
                        <feature.icon className={`w-4 h-4 text-${feature.color}-400`} />
                      </div>
                      <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Feature Actions */}
                  <div className="flex space-x-1.5">
                    {feature.id === 'avatar-decoration' ? (
                      // Special buttons for Avatar Decoration
                      <>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setShowDecorationModal(true)}
                          icon={UserCircleIcon}
                          className="flex-1 text-xs"
                        >
                          {feature.canSave ? 'Chọn Decoration' : 'Preview'}
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => setActiveFeature(feature)}
                          icon={feature.icon}
                          className="flex-1 text-xs"
                        >
                          {feature.canSave ? 'Cài Đặt' : 'Demo'}
                        </Button>
                      </>
                    ) : (
                      // Default buttons for other features
                      <>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setUploadType(feature.id);
                            setVideoSourceTab('cloudinary'); // Reset to default tab
                            setVideoUrl(''); // Reset URL
                            setP2pUrl(''); // Reset P2P URL
                            setShowUploadModal(true);
                          }}
                          icon={CloudArrowUpIcon}
                          className="flex-1 text-xs"
                        >
                          {feature.canSave ? 'Upload' : 'Preview'}
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => setActiveFeature(feature)}
                          icon={feature.icon}
                          className="flex-1 text-xs"
                        >
                          {feature.canSave ? 'Cài Đặt' : 'Demo'}
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium Features Overview */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Tất Cả Tính Năng Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-center space-x-3 mb-4">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                    <h4 className="text-white font-semibold">{feature.category}</h4>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.slice(0, 3).map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-purple-300 font-medium">Nâng Cấp Premium</span>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Mở Khóa Toàn Bộ Tiềm Năng
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Nâng cấp lên Premium để truy cập tất cả tính năng cao cấp, 
          analytics chi tiết và hỗ trợ ưu tiên
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Phổ Biến Nhất
                </span>
              </div>
            )}
            
            <Card 
              className={`text-center ${plan.popular ? 'border-purple-500 bg-purple-600/5' : ''}`}
              hover={false}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              
              <div className="mb-6">
                {plan.originalPrice && (
                  <div className="text-gray-500 line-through text-lg mb-1">
                    {plan.originalPrice}₫
                  </div>
                )}
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">₫{plan.period}</span>
                </div>
              </div>

              <Button
                className="w-full"
                variant={plan.popular ? 'primary' : 'outline'}
                onClick={() => handleUpgrade(plan.id)}
                loading={isUpgrading && selectedPlan === plan.id}
                disabled={isUpgrading}
              >
                {isUpgrading && selectedPlan === plan.id ? 'Đang xử lý...' : 'Chọn Gói Này'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Tính Năng Premium
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.category}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-purple-600/20 rounded-lg">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white">{feature.category}</h4>
                </div>
                
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <h3 className="text-xl font-semibold text-white mb-6">Câu Hỏi Thường Gặp</h3>
        
        <div className="space-y-6">
          {[
            {
              q: 'Tôi có thể hủy subscription bất cứ lúc nào không?',
              a: 'Có, bạn có thể hủy subscription bất cứ lúc nào. Tài khoản sẽ tiếp tục có quyền truy cập Premium cho đến hết chu kỳ thanh toán hiện tại.'
            },
            {
              q: 'Có được hoàn tiền không?',
              a: 'Chúng tôi cung cấp chính sách hoàn tiền trong 30 ngày đầu nếu bạn không hài lòng với dịch vụ.'
            },
            {
              q: 'Tôi có thể thay đổi gói subscription không?',
              a: 'Có, bạn có thể nâng cấp hoặc hạ cấp gói subscription bất cứ lúc nào. Thay đổi sẽ có hiệu lực ngay lập tức.'
            },
            {
              q: 'Custom domain hoạt động như thế nào?',
              a: 'Với Premium, bạn có thể sử dụng domain riêng (ví dụ: yourname.com) thay vì subdomain LumiLink. Chúng tôi sẽ hướng dẫn setup chi tiết.'
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
              <h4 className="text-white font-medium mb-2">{faq.q}</h4>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Card background="bg-gradient-to-r from-purple-600/10 to-pink-600/10" border="border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            Sẵn sàng nâng cấp?
          </h3>
          <p className="text-gray-300 mb-6">
            Tham gia cùng hàng nghìn người dùng đã tin tưởng LumiLink Premium
          </p>
          <Button size="lg" onClick={() => handleUpgrade('yearly')}>
            Bắt Đầu Với Premium
          </Button>
        </Card>
      </motion.div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setVideoSourceTab('cloudinary');
          setVideoUrl('');
          setP2pUrl('');
        }}
        title="Upload Premium Content"
      >
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">
                {uploadType === 'animated-background' && 'Upload Hình Ảnh + GIF Background'}
                {uploadType === 'video-background' && 'Video Background Settings'}
                {uploadType === 'ring-avatar' && 'Upload Ring Avatar'}
              </h4>
            </div>

            {uploadType === 'video-background' && (
              <p className="text-gray-400 text-sm mb-6">
                URL Cloudinary hoặc upload video
              </p>
            )}

            {uploadType !== 'video-background' && (
              <p className="text-gray-400 text-sm mb-6">
                {uploadType === 'animated-background' && 'Hỗ trợ JPG, PNG, GIF, WEBP - tối đa 10MB'}
                {uploadType === 'ring-avatar' && 'Upload ảnh cho ring avatar effect'}
              </p>
            )}
          </div>

          {/* Video Background - Enhanced UI */}
          {uploadType === 'video-background' && (
            <div className="space-y-6">
              {/* Video Source Tabs */}
              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
                {[
                  { id: 'cloudinary', name: 'Cloudinary URL', icon: '☁️' },
                  { id: 'p2p', name: 'P2P Stream', icon: '📡' },
                  { id: 'upload', name: 'Upload File', icon: '📁' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setVideoSourceTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all text-sm ${
                      videoSourceTab === tab.id
                        ? 'bg-yellow-500 text-black font-medium'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Cloudinary URL Option */}
              {videoSourceTab === 'cloudinary' && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      <span className="flex items-center space-x-2">
                        <span>☁️</span>
                        <span>Cloudinary Video URL</span>
                      </span>
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://res.cloudinary.com/your-cloud/video/upload/..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
                      />
                      <p className="text-gray-500 text-xs">
                        Paste URL video từ Cloudinary để sử dụng làm background
                      </p>

                      {videoUrl && (
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => {
                              setPreviewVideoData({ type: 'cloudinary', url: videoUrl });
                              setShowVideoPreview(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            👁️ Preview Video
                          </Button>
                          <Button
                            onClick={() => {
                              handleApplyVideo({ type: 'cloudinary', url: videoUrl });
                              setShowUploadModal(false);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                            size="sm"
                          >
                            ✅ Apply Background
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* P2P Stream Option */}
              {videoSourceTab === 'p2p' && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      <span className="flex items-center space-x-2">
                        <span>📡</span>
                        <span>P2P Stream URL</span>
                      </span>
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={p2pUrl}
                        onChange={(e) => setP2pUrl(e.target.value)}
                        placeholder="magnet:?xt=urn:btih:... hoặc https://webtorrent.io/..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
                      />
                      <p className="text-gray-500 text-xs">
                        Magnet link hoặc torrent URL để stream video P2P
                      </p>

                      {p2pUrl && (
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => {
                              setPreviewVideoData({ type: 'p2p', url: p2pUrl });
                              setShowVideoPreview(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            👁️ Preview Stream
                          </Button>
                          <Button
                            onClick={() => {
                              handleApplyVideo({ type: 'p2p', url: p2pUrl });
                              setShowUploadModal(false);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                            size="sm"
                          >
                            ✅ Apply Background
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* P2P Info */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-blue-400 font-medium text-sm mb-1">
                          📡 P2P Streaming
                        </p>
                        <p className="text-gray-400 text-xs">
                          Sử dụng WebTorrent để stream video trực tiếp từ P2P network. Tiết kiệm bandwidth và tăng tốc độ tải.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload File Tab */}
              {videoSourceTab === 'upload' && (
                <div className="space-y-4">
                  {/* Enhanced File Upload Area */}
                  <div className="border-2 border-dashed border-yellow-500/50 rounded-lg p-8 text-center bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                    {/* Video Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                    </div>

                    {/* Upload Text */}
                    <div className="mb-4">
                      <p className="text-white text-lg font-medium mb-2">
                        Drop your video here or
                      </p>
                      <p className="text-yellow-500 font-medium">
                        Browse Video Files
                      </p>
                    </div>

                    {/* File Info */}
                    <p className="text-gray-400 text-sm mb-6">
                      MP4, WebM up to 50MB
                    </p>

                    {/* Hidden Input */}
                    <input
                      type="file"
                      accept=".mp4,.webm,.mov"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPreviewVideoData({ type: 'file', url, file });
                          setShowVideoPreview(true);
                        }
                      }}
                      className="hidden"
                      id="video-upload"
                    />

                    {/* Browse Button */}
                    <Button
                      as="label"
                      htmlFor="video-upload"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                    >
                      Browse Video Files
                    </Button>
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-yellow-500 font-medium text-sm">
                      💡 Pro Tip: Use short, looping videos for best performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Upload Types */}
          {uploadType !== 'video-background' && (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <CloudArrowUpIcon className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-3 text-sm">Kéo thả file hoặc click để chọn</p>
              <input
                type="file"
                accept={
                  uploadType === 'animated-background' ? '.jpg,.jpeg,.png,.gif,.webp' :
                  '.jpg,.jpeg,.png'
                }
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileUpload(file, uploadType);
                  }
                }}
                className="hidden"
                id="premium-upload"
              />
              <Button as="label" htmlFor="premium-upload" size="sm">
                Chọn File
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Video Preview Modal */}
      {showVideoPreview && previewVideoData && (
        <Modal
          isOpen={showVideoPreview}
          onClose={() => {
            setShowVideoPreview(false);
            setPreviewVideoData(null);
          }}
          title="Video Preview"
          size="lg"
        >
          <div className="space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={previewVideoData.url}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Source:</span>
                  <span className="text-white ml-2">
                    {previewVideoData.type === 'file' ? 'Local File' :
                     previewVideoData.type === 'cloudinary' ? 'Cloudinary' : 'P2P Stream'}
                  </span>
                </div>
                {previewVideoData.file && (
                  <>
                    <div>
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white ml-2">
                        {(previewVideoData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white ml-2">{previewVideoData.file.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">{previewVideoData.file.name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Performance Tips */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-yellow-500 font-medium text-sm mb-1">
                    💡 Performance Tips
                  </p>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• Keep videos under 30 seconds for best performance</li>
                    <li>• Use MP4 format for maximum compatibility</li>
                    <li>• Optimize file size to reduce loading time</li>
                    <li>• Consider using looping videos for seamless background</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVideoPreview(false);
                  setPreviewVideoData(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Apply video as background
                  handleApplyVideo(previewVideoData);
                  setShowVideoPreview(false);
                  setPreviewVideoData(null);
                  setShowUploadModal(false);
                }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                Apply as Background
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Feature Settings Modal */}
      {activeFeature && (
        <Modal
          isOpen={!!activeFeature}
          onClose={() => setActiveFeature(null)}
          title={`Cài Đặt ${activeFeature.title}`}
        >
          <div className="space-y-6">
            {/* Avatar Decoration Settings */}
            {activeFeature.id === 'avatar-decoration' && (
              <div className="space-y-6">

                {/* Current Decoration Info */}
                {selectedDecoration ? (
                  <div className="text-center bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-1 capitalize">
                      {selectedDecoration.name}
                    </h4>
                    <p className="text-purple-200 text-sm">
                      Avatar decoration đang được áp dụng
                    </p>
                  </div>
                ) : (
                  <div className="text-center bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">
                      Chưa có decoration nào được chọn
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowDecorationModal(true);
                      setActiveFeature(null);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    🎨 Chọn Decoration
                  </Button>
                  {selectedDecoration && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDecoration(null);
                        setRingAvatarSettings(prev => ({
                          ...prev,
                          decorationImage: null,
                          ringColor: 'gradient'
                        }));
                        toast.success('Đã xóa decoration');
                      }}
                      className="flex-1"
                    >
                      🗑️ Xóa
                    </Button>
                  )}
                </div>

                {/* Feature Description */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Avatar Decoration Features:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Hàng trăm decoration độc đáo</li>
                    <li>• Overlay mode giống Discord</li>
                    <li>• Categories: Gaming, Seasonal, Fantasy</li>
                    <li>• Real-time preview</li>
                    <li>• Tương thích với Ring Avatar</li>
                  </ul>
                </div>
              </div>
            )}



            {/* Video Background Settings */}
            {activeFeature.id === 'video-background' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Autoplay</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Loop</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Muted</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            )}

            {/* Hide Watermark Settings */}
            {activeFeature.id === 'hide-watermark' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Ẩn Footer</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Custom Branding</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">White Label</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setActiveFeature(null)} className="flex-1">
                Hủy
              </Button>
              <Button onClick={() => handleFeatureActivation(activeFeature.id)} className="flex-1">
                Lưu Cài Đặt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Nâng Cấp Premium"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Tính năng này cần Premium
            </h3>
            <p className="text-gray-400">
              Nâng cấp lên Premium để lưu và sử dụng tính năng này
            </p>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Premium bao gồm:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Tất cả tính năng Premium</li>
              <li>• Upload và lưu không giới hạn</li>
              <li>• Ẩn watermark LumiLink</li>
              <li>• Hỗ trợ ưu tiên 24/7</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1"
            >
              Để sau
            </Button>
            <Button
              onClick={() => {
                setShowUpgradeModal(false);
                // Navigate to pricing or handle upgrade
                toast.success('Chuyển đến trang nâng cấp...');
              }}
              className="flex-1"
            >
              Nâng Cấp Ngay
            </Button>
          </div>
        </div>
      </Modal>

      {/* Avatar Decoration Selection Modal */}
      <Modal
        isOpen={showDecorationModal}
        onClose={() => setShowDecorationModal(false)}
        title="Avatar Decoration"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  AVATAR DECORATION
                </h3>
                <p className="text-purple-100 text-sm">
                  Miscellaneous decorations and quest rewards
                </p>
              </div>
            </div>
          </div>

          {/* Current Avatar Preview */}
          <div className="text-center">
            <h4 className="text-white font-medium mb-4">Preview</h4>
            <div className="flex justify-center">
              <RingAvatar
                user={user}
                size="xl"
                ringSettings={{
                  ...ringAvatarSettings,
                  decorationImage: selectedDecoration?.path,
                  ringColor: selectedDecoration ? 'image' : ringAvatarSettings.ringColor,
                  ringPosition: 'overlay'
                }}
              />
            </div>
            {selectedDecoration && (
              <p className="text-gray-400 text-sm mt-2 capitalize">
                {selectedDecoration.name}
              </p>
            )}
          </div>

          {/* Decorations Grid */}
          <div>
            <h4 className="text-white font-medium mb-3">Chọn Decoration</h4>
            <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
              {/* None Option */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDecoration(null);
                  setRingAvatarSettings(prev => ({
                    ...prev,
                    decorationImage: null,
                    ringColor: 'gradient'
                  }));
                }}
                className={`
                  aspect-square bg-gray-700 rounded-lg border-2 cursor-pointer
                  flex items-center justify-center transition-all
                  ${!selectedDecoration ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'}
                `}
              >
                <span className="text-gray-400 text-xs">None</span>
              </motion.div>

              {/* Decoration Items */}
              {decorations.map((decoration) => (
                <motion.div
                  key={decoration.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectDecoration(decoration)}
                  className={`
                    aspect-square bg-gray-700 rounded-lg border-2 cursor-pointer
                    overflow-hidden transition-all relative
                    ${selectedDecoration?.id === decoration.id ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'}
                  `}
                >
                  <img
                    src={decoration.path}
                    alt={decoration.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="w-full h-full flex items-center justify-center text-gray-400 text-xs hidden"
                  >
                    {decoration.name.slice(0, 3)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDecorationModal(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                setShowDecorationModal(false);
                if (selectedDecoration) {
                  toast.success(`Đã áp dụng decoration: ${selectedDecoration.name}`);
                } else {
                  toast.success('Đã xóa decoration');
                }
              }}
              className="flex-1"
            >
              Áp Dụng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ring Avatar Settings Modal */}
      <RingAvatarSettings
        isOpen={showRingAvatarSettings}
        onClose={() => setShowRingAvatarSettings(false)}
        user={user}
        onApply={handleApplyRingAvatar}
        initialSettings={ringAvatarSettings}
      />
    </div>
  );
};

export default PremiumTab;
