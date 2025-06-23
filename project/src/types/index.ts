export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tokens: number;
  streak: number;
  level: number;
  experience: number;
  isPremium: boolean;
  joinedAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
  achievements: Achievement[];
  referralCode?: string;
  referredBy?: string;
  stats: UserStats;
  socialProfile: SocialProfile;
}

export interface UserStats {
  totalVideosWatched: number;
  totalHoursLearned: number;
  skillsCompleted: number;
  averageSessionTime: number;
  learningVelocity: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
  longestStreak: number;
  currentWeekStreak: number;
  totalTokensEarned: number;
  challengesCompleted: number;
}

export interface SocialProfile {
  isPublic: boolean;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  followers: number;
  following: number;
  sharedAchievements: string[];
}

export interface UserPreferences {
  learningGoals: string[];
  preferredLanguages: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  reducedMotion: boolean;
  autoplay: boolean;
  offlineMode: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'progress' | 'milestone' | 'social' | 'challenge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isShared: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  videos: Video[];
  createdAt: Date;
  progress: number;
  tokensUsed: number;
  completed: boolean;
  isBookmarked: boolean;
  tags: string[];
  language: string;
  category: string;
  prerequisites: string[];
  learningObjectives: string[];
  skillTreePosition?: SkillTreeNode;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  channel: string;
  channelAvatar: string;
  publishedAt: Date;
  viewCount: number;
  likeCount: number;
  completed: boolean;
  notes?: string;
  bookmarks: VideoBookmark[];
  watchedAt?: Date;
  watchTime: number;
  rating?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  transcriptAvailable: boolean;
  subtitleLanguages: string[];
  relatedVideos: string[];
}

export interface VideoBookmark {
  id: string;
  timestamp: number;
  note: string;
  createdAt: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isPremium: boolean;
  subcategories: string[];
  skillTree: SkillTreeNode[];
  totalSkills: number;
  completedSkills: number;
}

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  prerequisites: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  children: string[];
  roadmapId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  participants: number;
  isActive: boolean;
  progress: number;
  completed: boolean;
}

export interface ChallengeRequirement {
  type: 'videos_watched' | 'hours_learned' | 'streak_days' | 'skills_completed';
  target: number;
  current: number;
}

export interface ChallengeReward {
  type: 'tokens' | 'badge' | 'experience' | 'premium_trial';
  amount: number;
  description: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  change: number;
  streak: number;
  level: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  nextReview: Date;
  interval: number;
  repetitions: number;
  easeFactor: number;
  videoId?: string;
  timestamp?: number;
  tags: string[];
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  videoId?: string;
  skillId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number;
  passingScore: number;
  attempts: QuizAttempt[];
  isCompleted: boolean;
  bestScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: number;
}

export interface QuizAttempt {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  answers: QuizAnswer[];
  timeSpent: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  tokenAllowance: number;
  maxRoadmaps: number;
  offlineAccess: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
}

export interface NotificationSettings {
  streakReminders: boolean;
  challengeUpdates: boolean;
  achievementUnlocks: boolean;
  weeklyProgress: boolean;
  socialActivity: boolean;
  emailDigest: boolean;
  pushNotifications: boolean;
}

export interface LearningSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  videosWatched: string[];
  totalWatchTime: number;
  tokensEarned: number;
  skillsProgressed: string[];
  notes: string[];
  mood?: 'excited' | 'focused' | 'tired' | 'frustrated' | 'accomplished';
}

export interface ReferralData {
  code: string;
  uses: number;
  maxUses?: number;
  bonusTokens: number;
  expiresAt?: Date;
  referredUsers: string[];
  totalEarnings: number;
}