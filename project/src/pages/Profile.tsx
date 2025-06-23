import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Settings, 
  Crown, 
  Gift, 
  LogOut,
  Trophy,
  Coins,
  Flame,
  Clock,
  Target,
  Shield,
  Key,
  Globe,
  Bell,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RealTimeCounter } from '../components/ui/RealTimeCounter';
import { ProgressRing } from '../components/ui/ProgressRing';

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
  ];

  const handleSaveProfile = async () => {
    try {
      await updateUser({ 
        name: editedName,
        avatar: selectedAvatar || user?.avatar 
      });
      setIsEditing(false);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setShowAvatarUpload(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedAvatar(e.target?.result as string);
        setShowAvatarUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = {
    totalRoadmaps: 12,
    completionRate: 78,
    totalHours: 156,
    weeklyGoal: 85,
  };

  const achievements = [
    { name: 'First Steps', icon: 'Play', rarity: 'common' },
    { name: 'Week Warrior', icon: 'Flame', rarity: 'rare' },
    { name: 'Knowledge Seeker', icon: 'Trophy', rarity: 'epic' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-lg text-gray-600">Manage your account and learning preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 text-center relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
              
              {/* Avatar Section */}
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  <img
                    src={selectedAvatar || user.avatar || defaultAvatars[0]}
                    alt={user.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAvatarUpload(true)}
                    className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Name Section */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                    />
                    <div className="flex justify-center space-x-2">
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(user.name);
                          setSelectedAvatar(null);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                    <p className="text-gray-600 mb-3">{user.email}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>

              {/* Premium Badge */}
              {user.isPremium && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mb-4"
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium Member
                  </Badge>
                </motion.div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    <RealTimeCounter value={user.level} />
                  </div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    <RealTimeCounter value={user.streak} />
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                {!user.isPremium && (
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Gift className="w-4 h-4 mr-2" />
                  Referrals
                </Button>
                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Learning Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <ProgressRing progress={stats.completionRate} size={80} />
                    <h4 className="font-semibold text-gray-900 mt-3">Completion Rate</h4>
                    <p className="text-gray-600 text-sm">Overall progress</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-blue-100 rounded-full">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <RealTimeCounter value={stats.totalRoadmaps} />
                    </div>
                    <p className="text-gray-600 text-sm">Roadmaps Created</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-green-100 rounded-full">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <RealTimeCounter value={stats.totalHours} />
                    </div>
                    <p className="text-gray-600 text-sm">Hours Learned</p>
                  </div>
                  <div className="text-center">
                    <ProgressRing progress={stats.weeklyGoal} size={80} color="#22c55e" />
                    <h4 className="font-semibold text-gray-900 mt-3">Weekly Goal</h4>
                    <p className="text-gray-600 text-sm">5 hours target</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Token Wallet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Token Wallet</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    History
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      <RealTimeCounter value={user.tokens} />
                    </div>
                    <p className="text-yellow-700 text-sm">Available Tokens</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      <RealTimeCounter value={2450} />
                    </div>
                    <p className="text-green-700 text-sm">Tokens Earned</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      <RealTimeCounter value={1450} />
                    </div>
                    <p className="text-purple-700 text-sm">Tokens Spent</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Achievements Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Achievements</h3>
                  <Button variant="outline" size="sm">
                    <Trophy className="w-4 h-4 mr-1" />
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        achievement.rarity === 'epic' ? 'bg-purple-100' :
                        achievement.rarity === 'rare' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Trophy className={`w-6 h-6 ${
                          achievement.rarity === 'epic' ? 'text-purple-600' :
                          achievement.rarity === 'rare' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{achievement.name}</h4>
                      <Badge 
                        variant={achievement.rarity === 'epic' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {achievement.rarity}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Account Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Avatar Upload Modal */}
        <AnimatePresence>
          {showAvatarUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAvatarUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Avatar</h3>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {defaultAvatars.map((avatar, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAvatarSelect(avatar)}
                      className="relative"
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="w-full aspect-square rounded-full object-cover border-2 border-gray-200 hover:border-purple-500 transition-colors"
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Custom Avatar
                  </Button>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="ghost" onClick={() => setShowAvatarUpload(false)}>
                    Cancel
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