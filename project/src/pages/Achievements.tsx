import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Crown, 
  Award, 
  TrendingUp,
  Users,
  Target,
  Filter
} from 'lucide-react';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementCard } from '../components/ui/AchievementCard';
import { AchievementNotification } from '../components/ui/AchievementNotification';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const Achievements: React.FC = () => {
  const {
    achievements,
    progress,
    stats,
    loading,
    newAchievement,
    shareAchievement,
    checkForNewAchievements,
    dismissNewAchievement,
  } = useAchievements();

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const categories = ['all', 'milestone', 'streak', 'social', 'challenge'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const filteredAchievements = achievements.filter(achievement => {
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
    if (rarityFilter !== 'all' && achievement.rarity !== rarityFilter) return false;
    return true;
  });

  const filteredProgress = progress.filter(item => {
    if (categoryFilter !== 'all' && item.template.category !== categoryFilter) return false;
    if (rarityFilter !== 'all' && item.template.rarity !== rarityFilter) return false;
    return true;
  });

  const displayItems = filter === 'unlocked' ? filteredAchievements :
                     filter === 'locked' ? filteredProgress :
                     [...filteredAchievements, ...filteredProgress];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
              <p className="text-lg text-gray-600">
                Track your learning milestones and unlock rewards
              </p>
            </div>
            <Button
              onClick={checkForNewAchievements}
              className="flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Check Progress</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUnlocked}</div>
              <div className="text-sm text-gray-600">of {stats.totalAvailable} unlocked</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">total XP earned</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.rareAchievements + stats.epicAchievements + stats.legendaryAchievements}</div>
              <div className="text-sm text-gray-600">rare+ achievements</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((stats.totalUnlocked / stats.totalAvailable) * 100)}%
              </div>
              <div className="text-sm text-gray-600">completion rate</div>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex space-x-2">
                {(['all', 'unlocked', 'locked'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(status)}
                  >
                    {status === 'all' ? 'All' : status === 'unlocked' ? 'Unlocked' : 'Locked'}
                  </Button>
                ))}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Rarity Filter */}
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {rarities.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Achievement Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Unlocked Achievements */}
          {filter !== 'locked' && filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AchievementCard
                achievement={achievement}
                isUnlocked={true}
                onShare={shareAchievement}
              />
            </motion.div>
          ))}

          {/* Progress Achievements */}
          {filter !== 'unlocked' && filteredProgress.map((item, index) => (
            <motion.div
              key={item.template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (filteredAchievements.length + index) * 0.1 }}
            >
              <AchievementCard
                template={item.template}
                progress={item.progress}
                requirement={item.requirement}
                progressDescription={item.description}
                isUnlocked={false}
                showProgress={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {displayItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try adjusting your filters or start learning to unlock achievements!</p>
          </motion.div>
        )}

        {/* Achievement Notification */}
        <AchievementNotification
          achievement={newAchievement}
          onClose={dismissNewAchievement}
        />
      </div>
    </div>
  );
};