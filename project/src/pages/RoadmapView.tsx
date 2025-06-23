import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  Star, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  Download,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { GlareCard } from '../components/ui/GlareCard';
import confetti from 'canvas-confetti';

export const RoadmapView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { roadmaps, updateVideoProgress, addToast } = useApp();
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const roadmap = roadmaps.find(r => r.id === id);

  useEffect(() => {
    if (!roadmap) {
      navigate('/roadmaps');
    }
  }, [roadmap, navigate]);

  const handleVideoClick = async (video: any) => {
    if (!video.completed) {
      // Mark video as completed
      const watchTime = Math.floor(video.duration * 0.8); // 80% watched
      await updateVideoProgress(video.id, true, watchTime);
      
      // Check if roadmap is now complete
      const completedVideos = roadmap?.videos?.filter(v => v.completed || v.id === video.id).length || 0;
      const totalVideos = roadmap?.videos?.length || 0;
      
      if (completedVideos === totalVideos) {
        setShowCelebration(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#3b82f6', '#f59e0b', '#10b981'],
        });
        
        addToast({
          type: 'achievement',
          title: 'Roadmap Completed!',
          message: 'Congratulations! You\'ve finished your learning roadmap.',
        });
      }
    }
    
    setSelectedVideo(video);
  };

  const handleRegenerateRoadmap = () => {
    addToast({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Roadmap regeneration will be available in the next update!',
    });
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap not found</h2>
          <p className="text-gray-600 mb-4">The roadmap you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/roadmaps')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roadmaps
          </Button>
        </div>
      </div>
    );
  }

  const completedVideos = roadmap.videos?.filter(v => v.completed).length || 0;
  const totalVideos = roadmap.videos?.length || 0;
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

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
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/roadmaps')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Roadmaps</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleRegenerateRoadmap}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Roadmap Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{roadmap.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{roadmap.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <Badge variant="primary">{roadmap.difficulty}</Badge>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{roadmap.estimated_hours}h estimated</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Play className="w-4 h-4" />
                  <span>{totalVideos} videos</span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div>
              <GlareCard>
                <Card className="p-6 text-center">
                  <ProgressRing progress={progressPercentage} size={120} />
                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {Math.round(progressPercentage)}% Complete
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {completedVideos} of {totalVideos} videos completed
                  </p>
                  
                  {progressPercentage === 100 ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Trophy className="w-5 h-5" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {totalVideos - completedVideos} videos remaining
                    </div>
                  )}
                </Card>
              </GlareCard>
            </div>
          </div>
        </motion.div>

        {/* Video List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Learning Path</h2>
            <div className="text-sm text-gray-600">
              {completedVideos}/{totalVideos} completed
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.videos?.map((video: any, index: number) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <GlareCard>
                  <Card
                    className={`p-6 cursor-pointer transition-all duration-200 ${
                      video.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Video Number & Status */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          video.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {video.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span className="font-semibold">{index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold mb-1 ${
                          video.completed ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {video.title}
                        </h3>
                        <p className={`text-sm mb-2 line-clamp-2 ${
                          video.completed ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {video.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{video.channel}</span>
                          </div>
                          {video.completed && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={video.completed ? 'secondary' : 'primary'}
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {video.completed ? 'Rewatch' : 'Watch'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </GlareCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Completion Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCelebration(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-md w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Congratulations! 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  You've successfully completed your {roadmap.title} roadmap!
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{totalVideos}</div>
                    <div className="text-sm text-purple-600">Videos Watched</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{roadmap.estimated_hours}h</div>
                    <div className="text-sm text-green-600">Time Invested</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCelebration(false)}
                  >
                    Continue
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => navigate('/achievements')}
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    View Achievements
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};