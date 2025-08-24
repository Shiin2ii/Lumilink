const { supabase } = require('../config/supabase');

class Subscription {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.planId = data.plan_id;
    this.status = data.status; // active, expired, cancelled
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.orderId = data.order_id;
    this.transactionId = data.transaction_id;
    this.amount = data.amount;
    this.paymentMethod = data.payment_method;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create subscription table if not exists
  static async createTable() {
    try {
      const { error } = await supabase.rpc('create_subscriptions_table');
      if (error && !error.message.includes('already exists')) {
        throw error;
      }

    } catch (error) {
      console.error('❌ Error creating subscriptions table:', error);
      throw error;
    }
  }

  // Create new subscription
  static async create(subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: subscriptionData.userId,
          plan_id: subscriptionData.planId,
          status: subscriptionData.status || 'active',
          start_date: subscriptionData.startDate || new Date().toISOString(),
          end_date: subscriptionData.endDate,
          order_id: subscriptionData.orderId,
          transaction_id: subscriptionData.transactionId,
          amount: subscriptionData.amount,
          payment_method: subscriptionData.paymentMethod || 'momo'
        }])
        .select()
        .single();

      if (error) throw error;
      

      return new Subscription(data);
    } catch (error) {
      console.error('❌ Error creating subscription:', error);
      throw error;
    }
  }

  // Get user's active subscription
  static async getActiveByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No active subscription found
          return null;
        }
        throw error;
      }

      return new Subscription(data);
    } catch (error) {
      console.error('❌ Error getting active subscription:', error);
      return null;
    }
  }

  // Get all user subscriptions
  static async getAllByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(sub => new Subscription(sub));
    } catch (error) {
      console.error('❌ Error getting user subscriptions:', error);
      throw error;
    }
  }

  // Update subscription status
  static async updateStatus(subscriptionId, status) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;

      return new Subscription(data);
    } catch (error) {
      console.error('❌ Error updating subscription status:', error);
      throw error;
    }
  }

  // Check if user has premium access
  static async hasPremiumAccess(userId) {
    try {
      const activeSubscription = await this.getActiveByUserId(userId);
      return !!activeSubscription;
    } catch (error) {
      console.error('❌ Error checking premium access:', error);
      return false;
    }
  }

  // Expire old subscriptions (cleanup job)
  static async expireOldSubscriptions() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('status', 'active')
        .lt('end_date', new Date().toISOString())
        .select();

      if (error) throw error;


      return data.length;
    } catch (error) {
      console.error('❌ Error expiring old subscriptions:', error);
      throw error;
    }
  }

  // Get subscription by order ID
  static async getByOrderId(orderId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return new Subscription(data);
    } catch (error) {
      console.error('❌ Error getting subscription by order ID:', error);
      return null;
    }
  }

  // Instance methods
  isActive() {
    return this.status === 'active' && new Date(this.endDate) > new Date();
  }

  isExpired() {
    return this.status === 'expired' || new Date(this.endDate) <= new Date();
  }

  daysRemaining() {
    if (this.isExpired()) return 0;
    const now = new Date();
    const endDate = new Date(this.endDate);
    const diffTime = endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      planId: this.planId,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      orderId: this.orderId,
      transactionId: this.transactionId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      isActive: this.isActive(),
      daysRemaining: this.daysRemaining(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Subscription;
