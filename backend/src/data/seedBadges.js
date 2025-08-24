/**
 * =============================================================================
 * BADGE SEEDER
 * =============================================================================
 * Seeds initial badges into the database
 */

const { supabase } = require('../config/supabase');

const badges = [
  // Huy hiệu Bắt đầu
  {
    id: 'welcome',
    name: 'Chào mừng',
    description: 'Chào mừng bạn đến với LumiLink!',
    icon: '👋',
    category: 'thanh-tuu',
    target_value: 1,
    color: '#3B82F6',
    is_active: true
  },
  {
    id: 'first-link',
    name: 'Liên kết đầu tiên',
    description: 'Đã thêm liên kết đầu tiên',
    icon: '🔗',
    category: 'thanh-tuu',
    target_value: 1,
    color: '#10B981',
    is_active: true
  },
  {
    id: 'profile-complete',
    name: 'Chuyên gia hồ sơ',
    description: 'Hoàn thành hồ sơ cá nhân',
    icon: '👤',
    category: 'thanh-tuu',
    target_value: 100,
    color: '#8B5CF6',
    is_active: true
  },

  // Huy hiệu Mạng xã hội
  {
    id: 'social-starter',
    name: 'Người mới mạng xã hội',
    description: 'Thêm 5 liên kết mạng xã hội',
    icon: '📱',
    category: 'thanh-tuu',
    target_value: 5,
    color: '#F59E0B',
    is_active: true
  },
  {
    id: 'social-butterfly',
    name: 'Bướm mạng xã hội',
    description: 'Thêm 10 liên kết mạng xã hội',
    icon: '🦋',
    category: 'thanh-tuu',
    target_value: 10,
    color: '#EC4899',
    is_active: true
  },

  // Huy hiệu Tương tác
  {
    id: 'first-click',
    name: 'Nhấp chuột đầu tiên',
    description: 'Nhận được lượt nhấp đầu tiên',
    icon: '👆',
    category: 'luot-nhap',
    target_value: 1,
    color: '#06B6D4',
    is_active: true
  },
  {
    id: 'click-collector',
    name: 'Người thu thập nhấp chuột',
    description: 'Nhận được 100 lượt nhấp',
    icon: '💯',
    category: 'luot-nhap',
    target_value: 100,
    color: '#84CC16',
    is_active: true
  },
  {
    id: 'click-master',
    name: 'Bậc thầy nhấp chuột',
    description: 'Nhận được 1000 lượt nhấp',
    icon: '🏆',
    category: 'luot-nhap',
    target_value: 1000,
    color: '#F97316',
    is_active: true
  },

  // Huy hiệu Lượt xem
  {
    id: 'first-view',
    name: 'Lượt xem đầu tiên',
    description: 'Nhận được lượt xem hồ sơ đầu tiên',
    icon: '👁️',
    category: 'luot-xem',
    target_value: 1,
    color: '#6366F1',
    is_active: true
  },
  {
    id: 'popular',
    name: 'Nổi tiếng',
    description: 'Nhận được 100 lượt xem hồ sơ',
    icon: '🌟',
    category: 'luot-xem',
    target_value: 100,
    color: '#EF4444',
    is_active: true
  },
  {
    id: 'viral',
    name: 'Lan truyền',
    description: 'Nhận được 1000 lượt xem hồ sơ',
    icon: '🚀',
    category: 'luot-xem',
    target_value: 1000,
    color: '#DC2626',
    is_active: true
  },

  // Huy hiệu Đặc biệt
  {
    id: 'early-adopter',
    name: 'Người dùng sớm',
    description: 'Tham gia LumiLink từ phiên bản beta',
    icon: '🚀',
    category: 'dac-biet',
    target_value: 1,
    color: '#7C3AED',
    is_active: true
  },
  {
    id: 'beta-tester',
    name: 'Người thử nghiệm Beta',
    description: 'Giúp thử nghiệm các tính năng mới',
    icon: '🧪',
    category: 'dac-biet',
    target_value: 1,
    color: '#059669',
    is_active: true
  },
  {
    id: 'customization-guru',
    name: 'Chuyên gia tùy chỉnh',
    description: 'Tùy chỉnh hoàn toàn hồ sơ của bạn',
    icon: '🎨',
    category: 'thanh-tuu',
    target_value: 1,
    color: '#DB2777',
    is_active: true
  }
];

/**
 * Seed badges into database
 */
const seedBadges = async () => {
  try {

    // First, check if badges table exists and has data
    const { data: existingBadges, error: checkError } = await supabase
      .from('badges')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking badges table:', checkError);
      return false;
    }

    if (existingBadges && existingBadges.length > 0) {
      
      // Update existing badges
      for (const badge of badges) {
        const { error: upsertError } = await supabase
          .from('badges')
          .upsert(badge, { onConflict: 'id' });

        if (upsertError) {
          console.error(`❌ Error upserting badge ${badge.id}:`, upsertError);
        } else {
        }
      }
    } else {
      
      // Insert all badges
      const { data, error } = await supabase
        .from('badges')
        .insert(badges);

      if (error) {
        console.error('❌ Error inserting badges:', error);
        return false;
      }

    }

    return true;

  } catch (error) {
    console.error('❌ Badge seeding failed:', error);
    return false;
  }
};

/**
 * Run seeder if called directly
 */
if (require.main === module) {
  seedBadges()
    .then((success) => {
      if (success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { seedBadges, badges };
