import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  Zap, 
  TrendingUp, 
  Play, 
  Clock,
  Star,
  Calendar,
  Award,
  ChevronRight,
  Plus,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { TypingText } from '../components/ui/TypingText';
import { Badge }  from '../components/ui/Badge';
import { RealTimeCounter } from '../components/ui/RealTimeCounter';
import { GlareCard } from '../components/ui/GlareCard';

const motivationalQuotes = [
  "Today is a great day to learn something new!",
  "Every expert was once a beginner.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your only limit is your mind.",
  "Success is the sum of small efforts repeated day in and day out.",
];

const dailyChallenges = [
  { id: 1, title: "Watch 30 minutes of learning content", progress: 45, target: 30, unit: "min" },
  { id: 2, title: "Complete 1 video from your roadmap", progress: 0, target: 1, unit: "video" },
  { id: 3, title: "Take notes on new concepts", progress: 0, target: 1, unit: "note" },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { roadmaps, addToast, updateVideoProgress } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const recentRoadmaps = roadmaps.slice(0, 3);
  const totalProgress = roadmaps.length > 0 
    ? roadmaps.reduce((sum, roadmap) => sum + roadmap.progress, 0) / roadmaps.length 
    : 0;

  const completedToday = Math.floor(Math.random() * 3); // Mock data
  const weeklyGoalProgress = 65; // Mock data

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleQuickAction = (action: string) => {
    addToast({
      type: 'info',
      title: 'Feature Coming Soon',
      message: `${action} will be available in the next update!`,
    });
  };

  const handleVideoClick = async (video: any, roadmap: any) => {
    if (!video.completed) {
      // Mark video as completed and simulate watch time
      const watchTime = Math.floor(video.duration * 0.8); // 80% watched
      await updateVideoProgress(video.id, true, watchTime);
    }
  };

  const stats = {
    totalHours: 156,
    completedRoadmaps: 8,
    currentStreak: user?.streak || 0,
    tokensEarned: 2450,
  };

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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <div className="text-lg text-gray-600 mt-2 h-8">
                <TypingText 
                  texts={motivationalQuotes}
                  speed={60}
                  pauseDuration={4000}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/create-roadmap">
                <Button className="px-6 py-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlareCard>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Learning Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <ProgressRing progress={totalProgress} size={100} />
                      <h3 className="font-semibold text-gray-900 mt-4">Overall Progress</h3>
                      <p className="text-gray-600 text-sm">Across all roadmaps</p>
                    </div>
                    <div className="text-center">
                      <ProgressRing progress={weeklyGoalProgress} size={100} color="#22c55e" />
                      <h3 className="font-semibold text-gray-900 mt-4">Weekly Goal</h3>
                      <p className="text-gray-600 text-sm">5 hours this week</p>
                    </div>
                    <div className="text-center">
                      <ProgressRing progress={(user?.streak || 0) * 14} size={100} color="#f59e0b" />
                      <h3 className="font-semibold text-gray-900 mt-4">Streak Power</h3>
                      <p className="text-gray-600 text-sm">{user?.streak} days strong</p>
                    </div>
                  </div>
                </Card>
              </GlareCard>
            </motion.div>

            {/* Learning Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <RealTimeCounter value={stats.totalHours} />
                    </div>
                    <p className="text-gray-600 text-sm">Hours Learned</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <RealTimeCounter value={stats.completedRoadmaps} />
                    </div>
                    <p className="text-gray-600 text-sm">Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <RealTimeCounter value={stats.currentStreak} />
                    </div>
                    <p className="text-gray-600 text-sm">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <RealTimeCounter value={stats.tokensEarned} />
                    </div>
                    <p className="text-gray-600 text-sm">Tokens Earned</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Roadmaps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                <Link to="/roadmaps" className="text-purple-600 hover:text-purple-700 font-medium">
                  View all
                </Link>
              </div>
              
              {recentRoadmaps.length > 0 ? (
                <div className="space-y-4">
                  {recentRoadmaps.map((roadmap, index) => (
                    <motion.div
                      key={roadmap.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <GlareCard>
                        <Link to={`/roadmap/${roadmap.id}`}>
                          <Card hover className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{roadmap.title}</h3>
                                  <Badge variant="primary">{roadmap.difficulty}</Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{roadmap.description}</p>
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Play className="w-4 h-4" />
                                    <span>{roadmap.videos?.length || 0} videos</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{roadmap.estimated_hours}h estimated</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{Math.round(roadmap.progress)}% complete</span>
                                  </div>
                                </div>
                                
                                {/* Show next video to watch */}
                                {roadmap.videos && roadmap.videos.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Next up:</h4>
                                    <div className="space-y-2">
                                      {roadmap.videos.slice(0, 2).map((video: any) => (
                                        <div 
                                          key={video.id}
                                          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                            video.completed ? 'bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100'
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleVideoClick(video, roadmap);
                                          }}
                                        >
                                          <div className={`w-2 h-2 rounded-full ${
                                            video.completed ? 'bg-green-500' : 'bg-blue-500'
                                          }`} />
                                          <span className={`text-sm ${
                                            video.completed ? 'text-green-700 line-through' : 'text-blue-700'
                                          }`}>
                                            {video.title}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-4">
                                <ProgressRing 
                                  progress={roadmap.progress} 
                                  size={60} 
                                  showText={false}
                                />
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </GlareCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmaps yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first learning roadmap to get started on your journey.
                  </p>
                  <Link to="/create-roadmap">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Roadmap
                    </Button>
                  </Link>
                </Card>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Target, title: 'Set Goals', action: 'Goal Setting' },
                  { icon: BookOpen, title: 'Browse Skills', action: 'Skill Browsing' },
                  { icon: Calendar, title: 'Schedule Study', action: 'Study Scheduling' },
                  { icon: BarChart3, title: 'View Analytics', action: 'Analytics View' },
                ].map((item) => (
                  <GlareCard key={item.title}>
                    <Card 
                      hover 
                      className="p-4 text-center cursor-pointer"
                      onClick={() => handleQuickAction(item.action)}
                    >
                      <item.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    </Card>
                  </GlareCard>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Challenges</h3>
                <div className="space-y-4">
                  {dailyChallenges.map((challenge) => (
                    <div key={challenge.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{challenge.title}</p>
                        <span className="text-xs text-gray-500">
                          {challenge.progress}/{challenge.target} {challenge.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Learning Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">Videos Completed</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      <RealTimeCounter value={completedToday + 12} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Hours Learned</span>
                    </div>
                    <span className="font-semibold text-gray-900">8.5h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-700">Skills Improved</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      <RealTimeCounter value={3} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">Tokens Earned</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      <RealTimeCounter value={50} />
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
                  <Link to="/achievements" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'First Steps', icon: '🎯', rarity: 'common' },
                    { name: 'Week Warrior', icon: '🔥', rarity: 'rare' },
                    { name: 'Knowledge Seeker', icon: '🏆', rarity: 'epic' },
                  ].map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{achievement.name}</h4>
                        <Badge 
                          variant={achievement.rarity === 'epic' ? 'primary' : 'secondary'}
                          size="sm"
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};