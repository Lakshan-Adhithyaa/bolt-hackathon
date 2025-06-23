import { useState, useEffect } from 'react';
import { AchievementService } from '../services/achievementService';
import { useAuth } from '../contexts/AuthContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: string;
  rarity: string;
  points: number;
  is_shared: boolean;
  unlocked_at: string;
}

interface AchievementProgress {
  template: any;
  progress: number;
  requirement: number;
  description: string;
}

interface AchievementStats {
  totalUnlocked: number;
  totalAvailable: number;
  totalPoints: number;
  rareAchievements: number;
  epicAchievements: number;
  legendaryAchievements: number;
  recentAchievements: Achievement[];
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<AchievementProgress[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load user achievements and progress
  useEffect(() => {
    if (user?.id) {
      loadAchievements();
    }
  }, [user?.id]);

  // Set up real-time subscription for new achievements
  useEffect(() => {
    if (user?.id) {
      const subscription = AchievementService.subscribeToAchievements(
        user.id,
        (achievement) => {
          setAchievements(prev => [achievement, ...prev]);
          setNewAchievement(achievement);
          
          // Refresh stats and progress
          loadAchievements();
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const loadAchievements = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [userAchievements, achievementProgress, achievementStats] = await Promise.all([
        AchievementService.getUserAchievements(user.id),
        AchievementService.getAchievementProgress(user.id),
        AchievementService.getAchievementStats(user.id),
      ]);

      setAchievements(userAchievements);
      setProgress(achievementProgress);
      setStats(achievementStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const shareAchievement = async (achievementId: string) => {
    try {
      await AchievementService.shareAchievement(achievementId);
      
      // Update local state
      setAchievements(prev => prev.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, is_shared: true }
          : achievement
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const checkForNewAchievements = async () => {
    if (!user?.id) return;

    try {
      const newCount = await AchievementService.checkAndAssignAchievements(user.id);
      if (newCount > 0) {
        // Refresh achievements to get the new ones
        await loadAchievements();
      }
      return newCount;
    } catch (err: any) {
      setError(err.message);
      return 0;
    }
  };

  const dismissNewAchievement = () => {
    setNewAchievement(null);
  };

  return {
    achievements,
    progress,
    stats,
    loading,
    error,
    newAchievement,
    shareAchievement,
    checkForNewAchievements,
    dismissNewAchievement,
    refetch: loadAchievements,
  };
};