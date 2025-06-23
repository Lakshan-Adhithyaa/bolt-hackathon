import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Crown, 
  Award, 
  Share2, 
  Lock,
  CheckCircle,
  Flame,
  Play,
  BookOpen,
  Zap,
  GraduationCap,
  Coins
} from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

const iconMap = {
  Trophy,
  Star,
  Crown,
  Award,
  Flame,
  Play,
  BookOpen,
  Zap,
  GraduationCap,
  Coins,
  Share2,
};

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

interface AchievementTemplate {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: string;
  rarity: string;
  points: number;
}

interface AchievementCardProps {
  achievement?: Achievement;
  template?: AchievementTemplate;
  progress?: number;
  requirement?: number;
  progressDescription?: string;
  isUnlocked?: boolean;
  onShare?: (achievementId: string) => void;
  className?: string;
  showProgress?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  template,
  progress = 0,
  requirement,
  progressDescription,
  isUnlocked = false,
  onShare,
  className = '',
  showProgress = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShareAnimation, setShowShareAnimation] = useState(false);

  const data = achievement || template;
  if (!data) return null;

  const getIcon = (iconName: string | null) => {
    if (!iconName) return <Award className="w-6 h-6" />;
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Award className="w-6 h-6" />;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShare = () => {
    if (achievement && onShare) {
      setShowShareAnimation(true);
      onShare(achievement.id);
      setTimeout(() => setShowShareAnimation(false), 1000);
    }
  };

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-6 h-full relative overflow-hidden ${
        isUnlocked ? 'bg-white' : 'bg-gray-50'
      }`}>
        {/* Background glow effect for unlocked achievements */}
        {isUnlocked && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(data.rarity)} opacity-5`}
            animate={{ opacity: isHovered ? 0.1 : 0.05 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Lock overlay for locked achievements */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Achievement icon */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRarityColor(data.rarity)} 
              flex items-center justify-center text-white shadow-lg`}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isUnlocked && isHovered ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {getIcon(data.icon)}
          </motion.div>

          <div className="flex flex-col items-end space-y-2">
            <Badge className={getRarityBadgeColor(data.rarity)} size="sm">
              {data.rarity}
            </Badge>
            {isUnlocked && achievement && (
              <motion.button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Achievement details */}
        <div className="space-y-3">
          <div>
            <h3 className={`text-lg font-semibold ${
              isUnlocked ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {data.name}
            </h3>
            <p className={`text-sm ${
              isUnlocked ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {data.description}
            </p>
          </div>

          {/* Progress bar for locked achievements */}
          {!isUnlocked && showProgress && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              {progressDescription && (
                <p className="text-xs text-gray-500">{progressDescription}</p>
              )}
            </div>
          )}

          {/* Points and unlock date */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className={`text-sm font-medium ${
                isUnlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {data.points} XP
              </span>
            </div>
            
            {isUnlocked && achievement && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500">
                  {new Date(achievement.unlocked_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Share animation */}
        <AnimatePresence>
          {showShareAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center rounded-xl"
            >
              <div className="text-center text-white">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Shared!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};