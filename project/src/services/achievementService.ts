import { supabase, trackEvent } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Achievement = Database['public']['Tables']['achievements']['Row'];
type AchievementTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: string;
  rarity: string;
  points: number;
  conditions: any;
  created_at: string;
  updated_at: string;
};

export class AchievementService {
  /**
   * Get all available achievement templates
   */
  static async getAchievementTemplates(): Promise<AchievementTemplate[]> {
    const { data, error } = await supabase
      .from('achievement_templates')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  /**
   * Get user's unlocked achievements
   */
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  /**
   * Manually assign an achievement from template (for testing or admin use)
   */
  static async assignAchievementFromTemplate(
    userId: string, 
    achievementName: string
  ): Promise<void> {
    const { error } = await supabase.rpc('assign_achievement_from_template', {
      target_user_id: userId,
      achievement_name: achievementName,
    });

    if (error) {
      throw new Error(error.message);
    }

    await trackEvent('achievement_manually_assigned', {
      user_id: userId,
      achievement_name: achievementName,
    });
  }

  /**
   * Check and assign achievements based on current user activity
   */
  static async checkAndAssignAchievements(userId: string): Promise<number> {
    const { data: achievementsAssigned, error } = await supabase.rpc('check_and_assign_achievements', {
      target_user_id: userId,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (achievementsAssigned > 0) {
      await trackEvent('achievements_auto_assigned', {
        user_id: userId,
        count: achievementsAssigned,
      });
    }

    return achievementsAssigned || 0;
  }

  /**
   * Share an achievement (mark as shared and potentially post to social)
   */
  static async shareAchievement(achievementId: string): Promise<void> {
    const { error } = await supabase
      .from('achievements')
      .update({ is_shared: true })
      .eq('id', achievementId);

    if (error) {
      throw new Error(error.message);
    }

    await trackEvent('achievement_shared', {
      achievement_id: achievementId,
    });
  }

  /**
   * Get achievement progress for a user (what they're close to unlocking)
   */
  static async getAchievementProgress(userId: string): Promise<{
    template: AchievementTemplate;
    progress: number;
    requirement: number;
    description: string;
  }[]> {
    // Get user's current stats
    const { data: userStats, error: statsError } = await supabase
      .from('profiles')
      .select(`
        streak,
        experience,
        id
      `)
      .eq('id', userId)
      .single();

    if (statsError || !userStats) {
      throw new Error('Failed to fetch user stats');
    }

    // Get additional stats
    const [videosResult, roadmapsResult, tokensResult] = await Promise.all([
      supabase
        .from('videos')
        .select('id')
        .eq('completed', true)
        .in('roadmap_id', 
          supabase
            .from('roadmaps')
            .select('id')
            .eq('user_id', userId)
        ),
      
      supabase
        .from('roadmaps')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true),
      
      supabase
        .from('streaks')
        .select('tokens_earned')
        .eq('user_id', userId)
    ]);

    const videosCompleted = videosResult.data?.length || 0;
    const roadmapsCompleted = roadmapsResult.data?.length || 0;
    const tokensEarned = tokensResult.data?.reduce((sum, streak) => sum + streak.tokens_earned, 0) || 0;

    // Get user's current achievements
    const { data: userAchievements } = await supabase
      .from('achievements')
      .select('name')
      .eq('user_id', userId);

    const unlockedNames = new Set(userAchievements?.map(a => a.name) || []);

    // Get all templates
    const templates = await this.getAchievementTemplates();

    // Calculate progress for each unlocked achievement
    const progress = templates
      .filter(template => !unlockedNames.has(template.name))
      .map(template => {
        let current = 0;
        let required = 0;
        let description = '';

        switch (template.name) {
          case 'First Steps':
            current = videosCompleted;
            required = 1;
            description = `Complete ${required - current} more video${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Week Warrior':
            current = userStats.streak;
            required = 7;
            description = `Maintain streak for ${required - current} more day${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Knowledge Seeker':
            current = roadmapsCompleted;
            required = 1;
            description = `Complete ${required - current} more roadmap${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Dedicated Learner':
            current = videosCompleted;
            required = 10;
            description = `Watch ${required - current} more video${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Monthly Master':
            current = userStats.streak;
            required = 30;
            description = `Maintain streak for ${required - current} more day${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Centurion':
            current = userStats.streak;
            required = 100;
            description = `Maintain streak for ${required - current} more day${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Token Collector':
            current = tokensEarned;
            required = 1000;
            description = `Earn ${required - current} more token${required - current !== 1 ? 's' : ''}`;
            break;
          
          case 'Skill Master':
            current = roadmapsCompleted;
            required = 5;
            description = `Complete ${required - current} more roadmap${required - current !== 1 ? 's' : ''}`;
            break;
          
          default:
            return null;
        }

        if (current >= required) {
          return null; // Should be unlocked already
        }

        return {
          template,
          progress: Math.min((current / required) * 100, 100),
          requirement: required,
          description,
        };
      })
      .filter(Boolean) as {
        template: AchievementTemplate;
        progress: number;
        requirement: number;
        description: string;
      }[];

    return progress.sort((a, b) => b.progress - a.progress);
  }

  /**
   * Get achievement statistics for a user
   */
  static async getAchievementStats(userId: string): Promise<{
    totalUnlocked: number;
    totalAvailable: number;
    totalPoints: number;
    rareAchievements: number;
    epicAchievements: number;
    legendaryAchievements: number;
    recentAchievements: Achievement[];
  }> {
    const [userAchievements, allTemplates] = await Promise.all([
      this.getUserAchievements(userId),
      this.getAchievementTemplates(),
    ]);

    const totalPoints = userAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
    const rareAchievements = userAchievements.filter(a => a.rarity === 'rare').length;
    const epicAchievements = userAchievements.filter(a => a.rarity === 'epic').length;
    const legendaryAchievements = userAchievements.filter(a => a.rarity === 'legendary').length;
    const recentAchievements = userAchievements.slice(0, 5);

    return {
      totalUnlocked: userAchievements.length,
      totalAvailable: allTemplates.length,
      totalPoints,
      rareAchievements,
      epicAchievements,
      legendaryAchievements,
      recentAchievements,
    };
  }

  /**
   * Create a new achievement template (admin function)
   */
  static async createAchievementTemplate(template: {
    name: string;
    description: string;
    icon?: string;
    category?: string;
    rarity?: string;
    points?: number;
    conditions?: any;
  }): Promise<AchievementTemplate> {
    const { data, error } = await supabase
      .from('achievement_templates')
      .insert({
        name: template.name,
        description: template.description,
        icon: template.icon || 'Award',
        category: template.category || 'milestone',
        rarity: template.rarity || 'common',
        points: template.points || 10,
        conditions: template.conditions || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await trackEvent('achievement_template_created', {
      template_name: template.name,
      category: template.category,
      rarity: template.rarity,
    });

    return data;
  }

  /**
   * Subscribe to real-time achievement updates
   */
  static subscribeToAchievements(userId: string, callback: (achievement: Achievement) => void) {
    return supabase
      .channel('user-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'achievements',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Achievement);
        }
      )
      .subscribe();
  }

  /**
   * Get leaderboard of users by achievement points
   */
  static async getAchievementLeaderboard(limit: number = 50): Promise<{
    userId: string;
    userName: string;
    avatar: string | null;
    totalPoints: number;
    achievementCount: number;
    rank: number;
  }[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select(`
        user_id,
        points,
        profiles!inner (
          name,
          avatar_url
        )
      `);

    if (error) {
      throw new Error(error.message);
    }

    // Group by user and calculate totals
    const userStats = new Map();
    
    data.forEach(achievement => {
      const userId = achievement.user_id;
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          userId,
          userName: achievement.profiles.name,
          avatar: achievement.profiles.avatar_url,
          totalPoints: 0,
          achievementCount: 0,
        });
      }
      
      const stats = userStats.get(userId);
      stats.totalPoints += achievement.points;
      stats.achievementCount += 1;
    });

    // Convert to array and sort by points
    const leaderboard = Array.from(userStats.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return leaderboard;
  }
}