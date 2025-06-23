import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  Code2,
  Palette,
  BarChart3,
  Shield,
  Link,
  Smartphone,
  Globe,
  Camera,
  Music,
  Gamepad2,
  Crown,
  Zap
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const iconMap = {
  Code2,
  Palette,
  TrendingUp,
  BarChart3,
  Shield,
  Link,
  Smartphone,
  Globe,
  Camera,
  Music,
  Gamepad2,
};

export const Skills: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { skills, addToast, createRoadmap } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'difficulty'>('name');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapDifficulty, setRoadmapDifficulty] = useState('beginner');
  const [isCreating, setIsCreating] = useState(false);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.subcategories.some((sub: string) => sub.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'premium' && skill.is_premium) ||
                         (filterType === 'free' && !skill.is_premium);
    
    return matchesSearch && matchesFilter;
  });

  const handleSkillSelect = (skill: any) => {
    if (skill.is_premium && !user?.isPremium) {
      addToast({
        type: 'warning',
        title: 'Premium Feature',
        message: 'This skill category requires a premium subscription.',
        action: {
          label: 'Upgrade',
          onClick: () => {
            // Navigate to premium page
          }
        }
      });
      return;
    }

    setSelectedSkill(skill);
    setRoadmapTitle(`Learn ${skill.name}`);
    setShowCreateModal(true);
  };

  const handleCreateRoadmap = async () => {
    if (!selectedSkill || !roadmapTitle.trim() || !user) return;

    const tokenCost = roadmapDifficulty === 'advanced' ? 400 : roadmapDifficulty === 'intermediate' ? 300 : 200;
    
    if (user.tokens < tokenCost) {
      addToast({
        type: 'error',
        title: 'Insufficient Tokens',
        message: `You need ${tokenCost} tokens to create this roadmap. You have ${user.tokens} tokens.`,
      });
      return;
    }

    try {
      setIsCreating(true);
      await createRoadmap(selectedSkill.id, roadmapTitle, roadmapDifficulty);
      
      // Update user tokens locally
      await updateUser({ tokens: user.tokens - tokenCost });
      
      setShowCreateModal(false);
      setSelectedSkill(null);
      setRoadmapTitle('');
    } catch (error) {
      console.error('Error creating roadmap:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Code2 className="w-6 h-6" />;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Skills</h1>
          <p className="text-lg text-gray-600">
            Choose from {skills.length} skill categories and create your personalized learning roadmap
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search skills, technologies, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'free' | 'premium')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Skills</option>
                  <option value="free">Free Only</option>
                  <option value="premium">Premium Only</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'popularity' | 'difficulty')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="popularity">Sort by Popularity</option>
                  <option value="difficulty">Sort by Difficulty</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Skill Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                hover 
                className="p-6 h-full cursor-pointer relative overflow-hidden"
                onClick={() => handleSkillSelect(skill)}
              >
                {/* Premium Badge */}
                {skill.is_premium && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}

                {/* Category Icon */}
                <div className={`w-12 h-12 ${skill.color || 'bg-purple-500'} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {getIcon(skill.icon || 'Code2')}
                </div>

                {/* Category Info */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{skill.name}</h3>
                <p className="text-gray-600 mb-4">{skill.description}</p>

                {/* Subcategories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {skill.subcategories.slice(0, 3).map((sub: string) => (
                    <Badge key={sub} variant="secondary" size="sm">
                      {sub}
                    </Badge>
                  ))}
                  {skill.subcategories.length > 3 && (
                    <Badge variant="secondary" size="sm">
                      +{skill.subcategories.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 10000) + 1000} learners</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{(4.2 + Math.random() * 0.8).toFixed(1)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Roadmap Modal */}
        <AnimatePresence>
          {showCreateModal && selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => !isCreating && setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Create {selectedSkill.name} Roadmap
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roadmap Title
                    </label>
                    <input
                      type="text"
                      value={roadmapTitle}
                      onChange={(e) => setRoadmapTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter roadmap title"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={roadmapDifficulty}
                      onChange={(e) => setRoadmapDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isCreating}
                    >
                      <option value="beginner">Beginner (200 tokens)</option>
                      <option value="intermediate">Intermediate (300 tokens)</option>
                      <option value="advanced">Advanced (400 tokens)</option>
                    </select>
                  </div>

                  {user && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span>Your tokens:</span>
                        <span className="font-semibold">{user.tokens}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Cost:</span>
                        <span className="font-semibold">
                          {roadmapDifficulty === 'advanced' ? 400 : roadmapDifficulty === 'intermediate' ? 300 : 200}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>Remaining:</span>
                        <span className={
                          user.tokens - (roadmapDifficulty === 'advanced' ? 400 : roadmapDifficulty === 'intermediate' ? 300 : 200) < 0 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }>
                          {user.tokens - (roadmapDifficulty === 'advanced' ? 400 : roadmapDifficulty === 'intermediate' ? 300 : 200)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowCreateModal(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateRoadmap}
                      disabled={!roadmapTitle.trim() || isCreating || (user && user.tokens < (roadmapDifficulty === 'advanced' ? 400 : roadmapDifficulty === 'intermediate' ? 300 : 200))}
                      loading={isCreating}
                    >
                      Create Roadmap
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="text-center">
              <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
              <p className="text-purple-100 mb-6">
                Choose any skill above to create your personalized learning roadmap with AI-curated YouTube videos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 text-purple-100">
                  <Clock className="w-5 h-5" />
                  <span>Takes 30 seconds</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-100">
                  <Star className="w-5 h-5" />
                  <span>Personalized content</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-100">
                  <TrendingUp className="w-5 h-5" />
                  <span>Track progress</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};