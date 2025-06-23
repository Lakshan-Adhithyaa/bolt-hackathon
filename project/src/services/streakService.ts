import { supabase, trackEvent } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Streak = Database['public']['Tables']['streaks']['Row'];

export class StreakService {
  static async updateDailyActivity(
    userId: string,
    minutesLearned: number,
    videosWatched: number,
    tokensEarned: number
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Upsert today's streak record
    const { error } = await supabase
      .from('streaks')
      .upsert({
        user_id: userId,
        date: today,
        has_activity: true,
        minutes_learned: minutesLearned,
        videos_watched: videosWatched,
        tokens_earned: tokensEarned,
        completed_goal: minutesLearned >= 30, // Default daily goal
      }, {
        onConflict: 'user_id,date',
      });

    if (error) {
      throw new Error(error.message);
    }

    // Calculate and update user's current streak
    await this.updateUserStreak(userId);

    await trackEvent('daily_activity_updated', {
      minutes_learned: minutesLearned,
      videos_watched: videosWatched,
      tokens_earned: tokensEarned,
    });
  }

  static async updateUserStreak(userId: string): Promise<number> {
    // Use the database function to calculate streak
    const { data: streakData, error } = await supabase
      .rpc('calculate_user_streak', { user_uuid: userId });

    if (error) {
      throw new Error(error.message);
    }

    const currentStreak = streakData || 0;

    // Update user's streak in profile
    await supabase
      .from('profiles')
      .update({ streak: currentStreak })
      .eq('id', userId);

    // Check for streak achievements
    await this.checkStreakAchievements(userId, currentStreak);

    return currentStreak;
  }

  static async checkStreakAchievements(userId: string, streak: number): Promise<void> {
    const achievements = [];

    if (streak === 7) {
      achievements.push({
        user_id: userId,
        name: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: 'Flame',
        category: 'streak',
        rarity: 'rare',
        points: 50,
      });
    }

    if (streak === 30) {
      achievements.push({
        user_id: userId,
        name: 'Monthly Master',
        description: 'Maintained a 30-day learning streak',
        icon: 'Trophy',
        category: 'streak',
        rarity: 'epic',
        points: 200,
      });
    }

    if (streak === 100) {
      achievements.push({
        user_id: userId,
        name: 'Centurion',
        description: 'Maintained a 100-day learning streak',
        icon: 'Crown',
        category: 'streak',
        rarity: 'legendary',
        points: 500,
      });
    }

    if (achievements.length > 0) {
      const { error } = await supabase
        .from('achievements')
        .insert(achievements);

      if (error) {
        console.error('Error inserting achievements:', error);
      } else {
        // Send notifications for new achievements
        for (const achievement of achievements) {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: 'Achievement Unlocked!',
              message: `You've earned the "${achievement.name}" badge!`,
              type: 'achievement',
            });
        }

        await trackEvent('achievements_unlocked', {
          count: achievements.length,
          streak,
        });
      }
    }
  }

  static async getStreakCalendar(userId: string, year: number, month: number): Promise<Streak[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getStreakStats(userId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    averageMinutes: number;
  }> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak')
      .eq('id', userId)
      .single();

    const { data: streaks } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('has_activity', true);

    if (!streaks) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        averageMinutes: 0,
      };
    }

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreakCount = 0;
    let totalMinutes = 0;

    const sortedStreaks = streaks.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < sortedStreaks.length; i++) {
      const currentDate = new Date(sortedStreaks[i].date);
      const prevDate = i > 0 ? new Date(sortedStreaks[i - 1].date) : null;

      totalMinutes += sortedStreaks[i].minutes_learned;

      if (!prevDate || currentDate.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000) {
        currentStreakCount++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreakCount);
        currentStreakCount = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreakCount);

    return {
      currentStreak: profile?.streak || 0,
      longestStreak,
      totalDays: streaks.length,
      averageMinutes: streaks.length > 0 ? Math.round(totalMinutes / streaks.length) : 0,
    };
  }
}