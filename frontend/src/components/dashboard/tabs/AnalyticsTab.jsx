import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// API Services
import analyticsApi from '../../../services/analyticsApi';

const AnalyticsTab = ({ data, refreshData, user }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(data?.analytics || {});
  const [loading, setLoading] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({});

  const timeRanges = [
    { id: '24h', label: '24 giờ' },
    { id: '7d', label: '7 ngày' },
    { id: '30d', label: '30 ngày' },
    { id: '90d', label: '90 ngày' }
  ];

  // Fetch analytics data
  const fetchAnalyticsData = async (selectedTimeRange = timeRange) => {
    setLoading(true);
    try {
      const [profileAnalytics, linksAnalytics, overview] = await Promise.all([
        analyticsApi.getProfileAnalytics(selectedTimeRange),
        analyticsApi.getLinksAnalytics(selectedTimeRange),
        analyticsApi.getAnalyticsOverview()
      ]);

      setAnalyticsData({
        profile: profileAnalytics.data,
        links: linksAnalytics.data,
        overview: overview.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time stats
  const fetchRealTimeStats = async () => {
    try {
      const result = await analyticsApi.getRealTimeStats();
      setRealTimeStats(result.data || {});
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = async (newTimeRange) => {
    setTimeRange(newTimeRange);
    await fetchAnalyticsData(newTimeRange);
  };

  // Refresh analytics data
  const refreshAnalytics = async () => {
    await fetchAnalyticsData();
    await fetchRealTimeStats();
    toast.success('Đã cập nhật dữ liệu thống kê');
  };

  // Load data on component mount and time range change
  useEffect(() => {
    fetchAnalyticsData();
    fetchRealTimeStats();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update analytics data when prop changes
  useEffect(() => {
    if (data?.analytics) {
      setAnalyticsData(data.analytics);
    }
  }, [data?.analytics]);

  // Main metrics
  const metrics = [
    {
      title: 'Tổng Lượt Xem',
      value: analyticsData.profile?.profileViews?.total || 0,
      change: analyticsData.profile?.profileViews?.change || '+0%',
      changeType: 'positive',
      icon: EyeIcon,
      color: 'blue',
      description: 'Lượt xem profile'
    },
    {
      title: 'Lượt Xem Tuần Này',
      value: analyticsData.profile?.profileViews?.thisWeek || 0,
      change: analyticsData.profile?.profileViews?.weeklyChange || '+0%',
      changeType: 'positive',
      icon: EyeIcon,
      color: 'green',
      description: '7 ngày qua'
    },
    {
      title: 'Lượt Nhấp Liên Kết',
      value: analyticsData.links?.linkClicks?.total || 0,
      change: analyticsData.links?.linkClicks?.change || '+0%',
      changeType: 'positive',
      icon: CursorArrowRaysIcon,
      color: 'purple',
      description: 'Tổng lượt nhấp'
    },
    {
      title: 'Tỷ Lệ Chuyển Đổi',
      value: `${analyticsData.overview?.conversionRate || 0}%`,
      change: '+2%',
      changeType: 'positive',
      icon: GlobeAltIcon,
      color: 'amber',
      description: 'Click-through rate'
    }
  ];

  // Device breakdown
  const deviceData = analyticsData.overview?.devices || { mobile: 0, desktop: 0, tablet: 0 };
  const totalDeviceViews = deviceData.mobile + deviceData.desktop + deviceData.tablet;
  
  const deviceStats = [
    {
      name: 'Mobile',
      value: deviceData.mobile,
      percentage: totalDeviceViews > 0 ? Math.round((deviceData.mobile / totalDeviceViews) * 100) : 0,
      icon: DevicePhoneMobileIcon,
      color: 'blue'
    },
    {
      name: 'Desktop',
      value: deviceData.desktop,
      percentage: totalDeviceViews > 0 ? Math.round((deviceData.desktop / totalDeviceViews) * 100) : 0,
      icon: ComputerDesktopIcon,
      color: 'green'
    },
    {
      name: 'Tablet',
      value: deviceData.tablet,
      percentage: totalDeviceViews > 0 ? Math.round((deviceData.tablet / totalDeviceViews) * 100) : 0,
      icon: DeviceTabletIcon,
      color: 'purple'
    }
  ];

  // Top countries
  const topCountries = analyticsData.overview?.topCountries || [];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 flex items-center gap-3 mx-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-sm sm:text-base">Đang tải dữ liệu thống kê...</span>
          </div>
        </div>
      )}

      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">Thống Kê Analytics</h2>
          <p className="text-gray-400 text-sm sm:text-base">Phân tích chi tiết về lượt truy cập và tương tác</p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          {/* Time Range Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700 flex-1 sm:flex-none overflow-x-auto">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => handleTimeRangeChange(range.id)}
                disabled={loading}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0 ${
                  timeRange === range.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshAnalytics}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            disabled={loading}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-${metric.color}-500/20 flex-shrink-0`}>
                <metric.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-${metric.color}-400`} />
              </div>
              <span className={`text-xs sm:text-sm ${
                metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              } hidden sm:inline`}>
                {metric.change}
              </span>
            </div>
            <div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">{metric.title}</p>
              <p className="text-gray-500 text-xs hidden sm:block">{metric.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Daily Stats Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
        >
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
            Thống Kê Theo Ngày
          </h3>

          {analyticsData.overview?.dailyStats?.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {analyticsData.overview.dailyStats.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-xs sm:text-sm truncate">
                      {new Date(day.date).toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-white font-medium text-sm">{day.views}</p>
                      <p className="text-gray-400 text-xs">views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium text-sm">{day.clicks}</p>
                      <p className="text-gray-400 text-xs">clicks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Chưa có dữ liệu thống kê</p>
            </div>
          )}
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
        >
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <DevicePhoneMobileIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
            Thiết Bị Truy Cập
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {deviceStats.map((device) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <device.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${device.color}-400 flex-shrink-0`} />
                  <span className="text-gray-300 text-sm sm:text-base truncate">{device.name}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  <div className="w-16 sm:w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 bg-${device.color}-500 rounded-full transition-all duration-500`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8 sm:w-12 text-right text-sm">
                    {device.percentage}%
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm w-6 sm:w-8 text-right">
                    {device.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Countries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700"
      >
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
          <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
          Top Quốc Gia
        </h3>
        
        {topCountries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCountries.map((country) => (
              <div key={country.country} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌍</span>
                  <span className="text-gray-300">{country.country}</span>
                </div>
                <span className="text-white font-medium">{country.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <GlobeAltIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Chưa có dữ liệu quốc gia</p>
          </div>
        )}
      </motion.div>

      {/* Real-time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Thống Kê Thời Gian Thực</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400 mb-2">
              {realTimeStats.recentViews || 0}
            </p>
            <p className="text-gray-300">Lượt xem hôm nay</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400 mb-2">
              {realTimeStats.recentClicks || 0}
            </p>
            <p className="text-gray-300">Lượt nhấp hôm nay</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400 mb-2">
              {realTimeStats.activeUsers || 0}
            </p>
            <p className="text-gray-300">Người dùng đang hoạt động</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
