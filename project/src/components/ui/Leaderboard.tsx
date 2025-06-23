import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Crown, Star, Zap } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  timeframe: 'weekly' | 'monthly' | 'all-time';
  onTimeframeChange: (timeframe: 'weekly' | 'monthly' | 'all-time') => void;
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUserId,
  timeframe,
  onTimeframeChange,
  className = '',
}) => {
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank <= 10) return 'bg-gradient-to-r from-purple-400 to-purple-600';
    if (rank <= 50) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  const currentUserEntry = entries.find(entry => entry.userId === currentUserId);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
        <div className="flex space-x-2">
          {(['weekly', 'monthly', 'all-time'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onTimeframeChange(period)}
            >
              {period === 'all-time' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Current User Position */}
      {currentUserEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                  {getRankIcon(currentUserEntry.rank)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Position</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Rank #{currentUserEntry.rank}</span>
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(currentUserEntry.change)}
                      <span className={getChangeColor(currentUserEntry.change)}>
                        {Math.abs(currentUserEntry.change)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {currentUserEntry.score.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">points</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="grid grid-cols-3 gap-4">
            {entries.slice(0, 3).map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={`text-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
              >
                <div className={`relative mx-auto mb-3 ${index === 0 ? 'w-20 h-20' : 'w-16 h-16'}`}>
                  <div className={`w-full h-full rounded-full overflow-hidden border-4 ${
                    index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-400' : 'border-amber-600'
                  }`}>
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-white font-bold ${
                        getRankBadgeColor(entry.rank)
                      }`}>
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    {getRankIcon(entry.rank)}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 truncate">{entry.username}</h4>
                <p className="text-sm text-gray-600">{entry.score.toLocaleString()} pts</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-gray-600">{entry.streak}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-gray-600">L{entry.level}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Full Leaderboard */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Rankings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  entry.userId === currentUserId ? 'bg-purple-50' : ''
                }`}
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className="text-sm font-bold text-gray-600">#{entry.rank}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {entry.avatar ? (
                          <img src={entry.avatar} alt={entry.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-white font-bold ${
                            getRankBadgeColor(entry.rank)
                          }`}>
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">{entry.username}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-orange-500" />
                            <span>{entry.streak} day streak</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-purple-500" />
                            <span>Level {entry.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">points</div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(entry.change)}
                      <span className={`text-sm ${getChangeColor(entry.change)}`}>
                        {Math.abs(entry.change)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                  {selectedEntry.avatar ? (
                    <img src={selectedEntry.avatar} alt={selectedEntry.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white font-bold text-2xl ${
                      getRankBadgeColor(selectedEntry.rank)
                    }`}>
                      {selectedEntry.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedEntry.username}</h3>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {getRankIcon(selectedEntry.rank)}
                  <span className="text-lg font-semibold text-gray-700">Rank #{selectedEntry.rank}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedEntry.score.toLocaleString()}</div>
                  <div className="text-sm text-purple-600">Total Points</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedEntry.streak}</div>
                  <div className="text-sm text-orange-600">Day Streak</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedEntry.level}</div>
                  <div className="text-sm text-blue-600">Level</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEntry.change > 0 ? '+' : ''}{selectedEntry.change}
                  </div>
                  <div className="text-sm text-green-600">Rank Change</div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedEntry(null)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};