import { supabase, trackEvent } from '../lib/supabase';
import { Database } from '../lib/database.types';

type LeaderboardEntry = Database['public']['Tables']['leaderboard_entries']['Row'];

export class LeaderboardService {
  static async getLeaderboard(
    timeframe: 'weekly' | 'monthly' | 'all-time',
    limit: number = 50
  ): Promise<LeaderboardEntry[]> {
    let periodStart: string;
    let periodEnd: string;

    const now = new Date();

    switch (timeframe) {
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        periodStart = startOfWeek.toISOString().split('T')[0];
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        periodEnd = endOfWeek.toISOString().split('T')[0];
        break;

      case 'monthly':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        break;

      case 'all-time':
        periodStart = '2024-01-01';
        periodEnd = '2099-12-31';
        break;
    }

    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        profiles!inner (
          name,
          avatar_url,
          level,
          streak
        )
      `)
      .eq('timeframe', timeframe)
      .eq('period_start', periodStart)
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data.map(entry => ({
      ...entry,
      username: entry.profiles.name,
      avatar: entry.profiles.avatar_url,
      level: entry.profiles.level,
      streak: entry.profiles.streak,
    }));
  }

  static async updateUserScore(userId: string): Promise<void> {
    // Get user's current stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('experience, streak, level')
      .eq('id', userId)
      .single();

    if (!profile) return;

    // Calculate score based on experience, streak, and level
    const score = profile.experience + (profile.streak * 10) + (profile.level * 100);

    // Update weekly leaderboard
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    await supabase
      .from('leaderboard_entries')
      .upsert({
        user_id: userId,
        timeframe: 'weekly',
        score,
        period_start: startOfWeek.toISOString().split('T')[0],
        period_end: endOfWeek.toISOString().split('T')[0],
      }, {
        onConflict: 'user_id,timeframe,period_start',
      });

    // Update monthly leaderboard
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    await supabase
      .from('leaderboard_entries')
      .upsert({
        user_id: userId,
        timeframe: 'monthly',
        score,
        period_start: startOfMonth.toISOString().split('T')[0],
        period_end: endOfMonth.toISOString().split('T')[0],
      }, {
        onConflict: 'user_id,timeframe,period_start',
      });

    // Update all-time leaderboard
    await supabase
      .from('leaderboard_entries')
      .upsert({
        user_id: userId,
        timeframe: 'all-time',
        score,
        period_start: '2024-01-01',
        period_end: '2099-12-31',
      }, {
        onConflict: 'user_id,timeframe,period_start',
      });

    // Update ranks using the database function
    await supabase.rpc('update_leaderboard');

    await trackEvent('leaderboard_updated', { user_id: userId, score });
  }

  static async getUserRank(userId: string, timeframe: 'weekly' | 'monthly' | 'all-time'): Promise<number | null> {
    let periodStart: string;

    const now = new Date();

    switch (timeframe) {
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        periodStart = startOfWeek.toISOString().split('T')[0];
        break;

      case 'monthly':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        break;

      case 'all-time':
        periodStart = '2024-01-01';
        break;
    }

    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('rank')
      .eq('user_id', userId)
      .eq('timeframe', timeframe)
      .eq('period_start', periodStart)
      .single();

    if (error || !data) {
      return null;
    }

    return data.rank;
  }
}