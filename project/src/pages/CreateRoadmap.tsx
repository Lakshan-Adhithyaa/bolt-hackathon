import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Clock, 
  Target, 
  Globe, 
  BookOpen,
  Play,
  Zap,
  Star,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { GlowButton } from '../components/ui/GlowButton';
import { StarBorder } from '../components/ui/StarBorder';

interface RoadmapPreferences {
  skillId: string;
  skillName: string;
  format: 'short' | 'long';
  learningStyle: 'project' | 'theory';
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  customTitle?: string;
}

const steps = [
  { id: 1, title: 'Choose Skill', description: 'What would you like to learn?' },
  { id: 2, title: 'Course Format', description: 'How do you prefer to learn?' },
  { id: 3, title: 'Learning Style', description: 'What\'s your approach?' },
  { id: 4, title: 'Skill Level', description: 'Where are you starting?' },
  { id: 5, title: 'Customize', description: 'Final touches' },
];

export const CreateRoadmap: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { skills, createRoadmap, addToast } = useApp();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<RoadmapPreferences>({
    skillId: '',
    skillName: '',
    format: 'short',
    learningStyle: 'project',
    level: 'beginner',
    language: user?.preferences?.preferredLanguages?.[0] || 'English',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTokenCost = () => {
    const baseCost = preferences.level === 'advanced' ? 400 : 
                    preferences.level === 'intermediate' ? 300 : 200;
    const formatMultiplier = preferences.format === 'long' ? 1.5 : 1;
    return Math.round(baseCost * formatMultiplier);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return preferences.skillId !== '';
      case 2: return preferences.format !== '';
      case 3: return preferences.learningStyle !== '';
      case 4: return preferences.level !== '';
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillSelect = (skill: any) => {
    setPreferences(prev => ({
      ...prev,
      skillId: skill.id,
      skillName: skill.name,
      customTitle: `Learn ${skill.name}`,
    }));
  };

  const handleGenerate = async () => {
    if (!user) return;

    const tokenCost = getTokenCost();
    
    if (user.tokens < tokenCost) {
      addToast({
        type: 'error',
        title: 'Insufficient Tokens',
        message: `You need ${tokenCost} tokens to create this roadmap. You have ${user.tokens} tokens.`,
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Create the roadmap with preferences
      await createRoadmap(
        preferences.skillId,
        preferences.customTitle || `Learn ${preferences.skillName}`,
        preferences.level
      );

      // Update user tokens
      await updateUser({ tokens: user.tokens - tokenCost });

      addToast({
        type: 'success',
        title: 'Roadmap Created!',
        message: 'Your personalized learning roadmap is ready.',
      });

      // Navigate to roadmaps page
      navigate('/roadmaps');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create roadmap. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What skill would you like to learn?</h2>
              <p className="text-gray-600">Choose from our curated collection of skills</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      preferences.skillId === skill.id
                        ? 'ring-2 ring-purple-500 bg-purple-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleSkillSelect(skill)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${skill.color || 'bg-purple-500'} rounded-lg flex items-center justify-center text-white`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{skill.description}</p>
                      </div>
                      {preferences.skillId === skill.id && (
                        <Check className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferred course format</h2>
              <p className="text-gray-600">How do you like to consume learning content?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    preferences.format === 'short'
                      ? 'ring-2 ring-purple-500 bg-purple-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setPreferences(prev => ({ ...prev, format: 'short' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Short Crash Videos</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Quick, focused videos (5-15 minutes) that get straight to the point
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="secondary">Fast-paced</Badge>
                      <Badge variant="secondary">Concise</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    preferences.format === 'long'
                      ? 'ring-2 ring-purple-500 bg-purple-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setPreferences(prev => ({ ...prev, format: 'long' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Long Detailed Courses</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Comprehensive videos (30+ minutes) with deep explanations and examples
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="secondary">In-depth</Badge>
                      <Badge variant="secondary">Thorough</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning preference</h2>
              <p className="text-gray-600">What's your preferred learning approach?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    preferences.learningStyle === 'project'
                      ? 'ring-2 ring-purple-500 bg-purple-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setPreferences(prev => ({ ...prev, learningStyle: 'project' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Project-Based</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Learn by building real projects and practical applications
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="secondary">Hands-on</Badge>
                      <Badge variant="secondary">Practical</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    preferences.learningStyle === 'theory'
                      ? 'ring-2 ring-purple-500 bg-purple-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setPreferences(prev => ({ ...prev, learningStyle: 'theory' }))}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Theory-First</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Start with fundamentals and concepts before applying them
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="secondary">Conceptual</Badge>
                      <Badge variant="secondary">Structured</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your starting level</h2>
              <p className="text-gray-600">Where are you in your learning journey?</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  level: 'beginner',
                  title: 'Beginner',
                  description: 'New to this skill, starting from the basics',
                  color: 'bg-green-100 text-green-600',
                  cost: 200,
                },
                {
                  level: 'intermediate',
                  title: 'Intermediate',
                  description: 'Some experience, looking to build upon existing knowledge',
                  color: 'bg-yellow-100 text-yellow-600',
                  cost: 300,
                },
                {
                  level: 'advanced',
                  title: 'Advanced',
                  description: 'Experienced, seeking advanced techniques and mastery',
                  color: 'bg-red-100 text-red-600',
                  cost: 400,
                },
              ].map((option) => (
                <motion.div
                  key={option.level}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all duration-200 ${
                      preferences.level === option.level
                        ? 'ring-2 ring-purple-500 bg-purple-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, level: option.level as any }))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center`}>
                          <Star className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{option.cost} tokens</div>
                        {preferences.level === option.level && (
                          <Check className="w-5 h-5 text-purple-600 ml-auto mt-1" />
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize your roadmap</h2>
              <p className="text-gray-600">Final touches to make it perfect</p>
            </div>

            <div className="space-y-6">
              {/* Custom Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roadmap Title
                </label>
                <input
                  type="text"
                  value={preferences.customTitle || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, customTitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Learn ${preferences.skillName}`}
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mandarin">Mandarin</option>
                </select>
              </div>

              {/* Summary */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Roadmap Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Skill:</span>
                    <span className="ml-2 font-medium">{preferences.skillName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="ml-2 font-medium capitalize">{preferences.format} videos</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <span className="ml-2 font-medium capitalize">{preferences.learningStyle}-based</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <span className="ml-2 font-medium capitalize">{preferences.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Language:</span>
                    <span className="ml-2 font-medium">{preferences.language}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 font-medium text-purple-600">{getTokenCost()} tokens</span>
                  </div>
                </div>
              </Card>

              {/* Token Check */}
              {user && user.tokens < getTokenCost() && (
                <Card className="p-4 bg-red-50 border border-red-200">
                  <div className="flex items-center space-x-2 text-red-700">
                    <span className="font-medium">Insufficient tokens!</span>
                    <span>You need {getTokenCost()} tokens but have {user.tokens}.</span>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <StarBorder>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>AI-Powered Roadmap Creator</span>
              </div>
            </StarBorder>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Learning Roadmap</h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to get a personalized YouTube learning path
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                  }}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-8">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-between items-center"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                Available tokens: <span className="font-semibold">{user.tokens}</span>
              </div>
            )}
            
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <GlowButton
                onClick={handleGenerate}
                disabled={isGenerating || (user && user.tokens < getTokenCost())}
                className="flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Roadmap</span>
                  </>
                )}
              </GlowButton>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};