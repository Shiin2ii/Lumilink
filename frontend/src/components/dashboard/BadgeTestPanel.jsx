import React, { useState } from 'react';
import { badgeService } from '../../services/badgeService';
import { useAuth } from '../../contexts/AuthContext';

const BadgeTestPanel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testGetAllBadges = async () => {
    setLoading(true);
    try {
      const response = await badgeService.getAllBadges();
      setResult({ type: 'getAllBadges', data: response });

    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGetUserBadges = async () => {
    if (!user?.id) {
      setResult({ type: 'error', data: 'Người dùng chưa đăng nhập' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await badgeService.getUserBadges(user.id);
      setResult({ type: 'getUserBadges', data: response });

    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCheckBadges = async () => {
    if (!user?.id) {
      setResult({ type: 'error', data: 'Người dùng chưa đăng nhập' });
      return;
    }
    
    setLoading(true);
    try {
      const activityData = {
        linksCount: 5,
        totalClicks: 150,
        profileViews: 50,
        profileCompletion: 80,
        socialLinksCount: 3
      };
      
      const response = await badgeService.checkAndAwardBadges(user.id, activityData);
      setResult({ type: 'checkBadges', data: response });

    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGetBadgeProgress = async () => {
    if (!user?.id) {
      setResult({ type: 'error', data: 'Người dùng chưa đăng nhập' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await badgeService.getBadgeProgress(user.id);
      setResult({ type: 'getBadgeProgress', data: response });

    } catch (error) {
      setResult({ type: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Bảng Kiểm Tra Hệ Thống Huy Hiệu</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={testGetAllBadges}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
        >
          Kiểm tra Tất cả Huy hiệu
        </button>

        <button
          onClick={testGetUserBadges}
          disabled={loading || !user?.id}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
        >
          Kiểm tra Huy hiệu Người dùng
        </button>

        <button
          onClick={testCheckBadges}
          disabled={loading || !user?.id}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
        >
          Kiểm tra Huy hiệu Mới
        </button>

        <button
          onClick={testGetBadgeProgress}
          disabled={loading || !user?.id}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50"
        >
          Kiểm tra Tiến độ Huy hiệu
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-2">Đang tải...</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">
            Kết quả ({result.type}):
          </h4>
          <pre className="text-gray-300 text-sm overflow-auto max-h-96">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BadgeTestPanel;
