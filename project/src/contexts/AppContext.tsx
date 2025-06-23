import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Mock data for demo mode
const mockSkills = [
  {
    id: '1',
    name: 'Programming',
    description: 'Learn coding languages and frameworks',
    category: 'technology',
    icon: 'Code2',
    color: 'bg-blue-500',
    is_premium: false,
    subcategories: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'],
    total_skills: 15,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Design',
    description: 'UI/UX design and creative skills',
    category: 'creative',
    icon: 'Palette',
    color: 'bg-pink-500',
    is_premium: false,
    subcategories: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design', 'UX Research'],
    total_skills: 12,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Business',
    description: 'Entrepreneurship and business skills',
    category: 'business',
    icon: 'TrendingUp',
    color: 'bg-green-500',
    is_premium: false,
    subcategories: ['Marketing', 'Finance', 'Leadership', 'Strategy', 'Sales'],
    total_skills: 18,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Data Science',
    description: 'Analytics and machine learning',
    category: 'technology',
    icon: 'BarChart3',
    color: 'bg-purple-500',
    is_premium: true,
    subcategories: ['Machine Learning', 'Statistics', 'R', 'SQL', 'Tableau'],
    total_skills: 20,
    difficulty: 'intermediate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Web Development',
    description: 'Frontend and backend web technologies',
    category: 'technology',
    icon: 'Globe',
    color: 'bg-indigo-500',
    is_premium: false,
    subcategories: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular'],
    total_skills: 25,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Mobile Development',
    description: 'iOS and Android app development',
    category: 'technology',
    icon: 'Smartphone',
    color: 'bg-cyan-500',
    is_premium: true,
    subcategories: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin'],
    total_skills: 16,
    difficulty: 'intermediate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Digital Marketing',
    description: 'Online marketing and social media strategies',
    category: 'business',
    icon: 'Megaphone',
    color: 'bg-orange-500',
    is_premium: false,
    subcategories: ['SEO', 'Social Media', 'Content Marketing', 'PPC', 'Email Marketing'],
    total_skills: 14,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Photography',
    description: 'Digital photography and photo editing',
    category: 'creative',
    icon: 'Camera',
    color: 'bg-rose-500',
    is_premium: false,
    subcategories: ['Portrait', 'Landscape', 'Street Photography', 'Lightroom', 'Photoshop'],
    total_skills: 11,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface Toast {
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

interface Roadmap {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  skill_id: string | null;
  difficulty: string;
  estimated_hours: number;
  progress: number;
  tokens_used: number;
  completed: boolean;
  is_bookmarked: boolean;
  tags: string[];
  language: string;
  prerequisites: string[];
  learning_objectives: string[];
  created_at: string;
  updated_at: string;
  videos?: any[];
  format?: 'short' | 'long';
  learning_style?: 'project' | 'theory';
}

interface RoadmapPreferences {
  skillId: string;
  skillName: string;
  format: 'short' | 'long';
  learningStyle: 'project' | 'theory';
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  customTitle?: string;
}

interface AppContextType {
  skills: any[];
  roadmaps: Roadmap[];
  notifications: any[];
  toasts: Toast[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  
  // Actions
  createRoadmap: (preferences: RoadmapPreferences) => Promise<string>;
  updateVideoProgress: (videoId: string, completed: boolean, watchTime: number) => Promise<void>;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;

    try {
      setIsSyncing(true);

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Use mock data for demo mode
        setSkills(mockSkills);
        
        // Load roadmaps from localStorage
        const savedRoadmaps = localStorage.getItem(`roadmaps-${user.id}`);
        if (savedRoadmaps) {
          setRoadmaps(JSON.parse(savedRoadmaps));
        }
        
        setLastSync(new Date());
        return;
      }

      // Use Supabase
      const { supabase } = await import('../lib/supabase');

      // Load skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (skillsError) throw skillsError;
      setSkills(skillsData || mockSkills);

      // Load user's roadmaps
      const { data: roadmapsData, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select(`
          *,
          videos (
            id,
            title,
            description,
            thumbnail,
            duration,
            channel,
            completed,
            order_index,
            watch_time
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (roadmapsError) {
        console.error('Error loading roadmaps:', roadmapsError);
        setRoadmaps([]);
      } else {
        setRoadmaps(roadmapsData || []);
      }

      // Load notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) throw notificationsError;
      setNotifications(notificationsData || []);

      setLastSync(new Date());
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback to mock data
      setSkills(mockSkills);
      addToast({
        type: 'warning',
        title: 'Demo Mode',
        message: 'Using demo data. Connect to Supabase for full functionality.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const createRoadmap = async (preferences: RoadmapPreferences): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsSyncing(true);
      
      const tokenCost = calculateTokenCost(preferences);
      
      if (user.tokens < tokenCost) {
        throw new Error('Insufficient tokens');
      }

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Demo mode - create mock roadmap
        const mockRoadmap: Roadmap = {
          id: Math.random().toString(36).substr(2, 9),
          user_id: user.id,
          title: preferences.customTitle || `Learn ${preferences.skillName}`,
          description: `Personalized ${preferences.skillName} learning path with ${preferences.format} videos and ${preferences.learningStyle}-based approach`,
          skill_id: preferences.skillId,
          difficulty: preferences.level,
          estimated_hours: calculateEstimatedHours(preferences),
          progress: 0,
          tokens_used: tokenCost,
          completed: false,
          is_bookmarked: false,
          tags: [preferences.skillName, preferences.level, preferences.format],
          language: preferences.language,
          prerequisites: [],
          learning_objectives: generateLearningObjectives(preferences),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          videos: generateMockVideos(preferences),
          format: preferences.format,
          learning_style: preferences.learningStyle,
        };

        // Save to localStorage
        const existingRoadmaps = JSON.parse(localStorage.getItem(`roadmaps-${user.id}`) || '[]');
        existingRoadmaps.unshift(mockRoadmap);
        localStorage.setItem(`roadmaps-${user.id}`, JSON.stringify(existingRoadmaps));
        
        setRoadmaps(existingRoadmaps);

        return mockRoadmap.id;
      }

      // Use Supabase
      const { supabase } = await import('../lib/supabase');
      
      const { data: roadmap, error: roadmapError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user.id,
          title: preferences.customTitle || `Learn ${preferences.skillName}`,
          skill_id: preferences.skillId,
          difficulty: preferences.level,
          tokens_used: tokenCost,
          description: `Personalized ${preferences.skillName} learning path`,
          estimated_hours: calculateEstimatedHours(preferences),
          language: preferences.language,
          tags: [preferences.skillName, preferences.level, preferences.format],
          learning_objectives: generateLearningObjectives(preferences),
        })
        .select()
        .single();

      if (roadmapError) {
        throw new Error(roadmapError.message);
      }

      // Generate videos for the roadmap
      const videos = generateMockVideos(preferences);
      const videoInserts = videos.map((video, index) => ({
        roadmap_id: roadmap.id,
        youtube_id: `mock_${Math.random().toString(36).substr(2, 11)}`,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        duration: video.duration,
        channel: video.channel,
        difficulty: preferences.level,
        order_index: index,
      }));

      await supabase.from('videos').insert(videoInserts);

      // Refresh roadmaps
      await loadInitialData();

      return roadmap.id;
    } catch (error: any) {
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const calculateTokenCost = (preferences: RoadmapPreferences): number => {
    const baseCost = preferences.level === 'advanced' ? 400 : 
                    preferences.level === 'intermediate' ? 300 : 200;
    const formatMultiplier = preferences.format === 'long' ? 1.5 : 1;
    return Math.round(baseCost * formatMultiplier);
  };

  const calculateEstimatedHours = (preferences: RoadmapPreferences): number => {
    const baseHours = preferences.level === 'advanced' ? 20 : 
                     preferences.level === 'intermediate' ? 15 : 10;
    const formatMultiplier = preferences.format === 'long' ? 1.5 : 1;
    return Math.round(baseHours * formatMultiplier);
  };

  const generateLearningObjectives = (preferences: RoadmapPreferences): string[] => {
    const objectives = [
      `Master the fundamentals of ${preferences.skillName}`,
      `Apply ${preferences.learningStyle === 'project' ? 'practical' : 'theoretical'} concepts`,
      `Build confidence in ${preferences.level}-level techniques`,
      `Complete hands-on exercises and projects`,
    ];

    if (preferences.level === 'advanced') {
      objectives.push(`Explore advanced ${preferences.skillName} patterns and best practices`);
    }

    return objectives;
  };

  const generateMockVideos = (preferences: RoadmapPreferences) => {
    const videoCount = user?.isPremium 
      ? (preferences.format === 'long' ? 12 : 8)
      : (preferences.format === 'long' ? 8 : 5);
    
    const videos = [];
    
    for (let i = 0; i < videoCount; i++) {
      videos.push({
        id: Math.random().toString(36).substr(2, 9),
        title: generateVideoTitle(preferences, i),
        description: `Learn ${preferences.skillName} with this ${preferences.format === 'long' ? 'comprehensive' : 'focused'} tutorial covering ${preferences.learningStyle === 'project' ? 'practical implementation' : 'core concepts'}.`,
        thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
        duration: preferences.format === 'long' 
          ? Math.floor(Math.random() * 1800) + 1200  // 20-50 minutes
          : Math.floor(Math.random() * 900) + 300,   // 5-20 minutes
        channel: getRandomChannel(),
        completed: false,
        watch_time: 0,
        order_index: i,
      });
    }
    
    return videos;
  };

  const generateVideoTitle = (preferences: RoadmapPreferences, index: number): string => {
    const { skillName, level, learningStyle, format } = preferences;
    
    const titleTemplates = {
      beginner: {
        project: [
          `${skillName} Basics - Your First Project`,
          `Getting Started with ${skillName}`,
          `Build Your First ${skillName} Application`,
          `${skillName} Fundamentals Through Practice`,
          `Hands-On ${skillName} for Beginners`,
        ],
        theory: [
          `Introduction to ${skillName} Concepts`,
          `Understanding ${skillName} Fundamentals`,
          `${skillName} Theory and Principles`,
          `Core ${skillName} Knowledge`,
          `Essential ${skillName} Concepts Explained`,
        ],
      },
      intermediate: {
        project: [
          `Intermediate ${skillName} Project`,
          `Building Real-World ${skillName} Apps`,
          `${skillName} Best Practices in Action`,
          `Advanced ${skillName} Techniques`,
          `Professional ${skillName} Development`,
        ],
        theory: [
          `Advanced ${skillName} Concepts`,
          `Deep Dive into ${skillName}`,
          `${skillName} Architecture Patterns`,
          `Mastering ${skillName} Theory`,
          `Complex ${skillName} Principles`,
        ],
      },
      advanced: {
        project: [
          `Expert-Level ${skillName} Project`,
          `${skillName} Mastery Through Practice`,
          `Professional ${skillName} Solutions`,
          `Advanced ${skillName} Implementation`,
          `${skillName} Expert Techniques`,
        ],
        theory: [
          `${skillName} Expert Knowledge`,
          `Advanced ${skillName} Theory`,
          `${skillName} Research and Innovation`,
          `Cutting-Edge ${skillName} Concepts`,
          `${skillName} Thought Leadership`,
        ],
      },
    };

    const templates = titleTemplates[level][learningStyle];
    const baseTitle = templates[index % templates.length];
    
    return `${baseTitle} ${format === 'long' ? '- Complete Guide' : '- Quick Tutorial'}`;
  };

  const getRandomChannel = (): string => {
    const channels = [
      'TechEdu Academy',
      'CodeMaster Pro',
      'Learning Hub',
      'Skill Builder',
      'Expert Tutorials',
      'Knowledge Base',
      'Dev Academy',
      'Learn Fast',
      'Pro Learning',
      'Skill Forge',
    ];
    return channels[Math.floor(Math.random() * channels.length)];
  };

  const updateVideoProgress = async (videoId: string, completed: boolean, watchTime: number) => {
    if (!user) return;

    try {
      // Update local state first for immediate feedback
      setRoadmaps(prev => prev.map(roadmap => ({
        ...roadmap,
        videos: roadmap.videos?.map(video => 
          video.id === videoId 
            ? { ...video, completed, watch_time: watchTime }
            : video
        ),
        progress: roadmap.videos ? 
          (roadmap.videos.filter(v => v.completed || v.id === videoId).length / roadmap.videos.length) * 100 
          : 0,
      })));

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Demo mode - save to localStorage
        const savedRoadmaps = localStorage.getItem(`roadmaps-${user.id}`);
        if (savedRoadmaps) {
          const roadmaps = JSON.parse(savedRoadmaps);
          const updatedRoadmaps = roadmaps.map((roadmap: any) => ({
            ...roadmap,
            videos: roadmap.videos?.map((video: any) => 
              video.id === videoId 
                ? { ...video, completed, watch_time: watchTime }
                : video
            ),
            progress: roadmap.videos ? 
              (roadmap.videos.filter((v: any) => v.completed || v.id === videoId).length / roadmap.videos.length) * 100 
              : 0,
          }));
          localStorage.setItem(`roadmaps-${user.id}`, JSON.stringify(updatedRoadmaps));
        }

        if (completed) {
          addToast({
            type: 'success',
            title: 'Video Completed!',
            message: 'Great job! Keep up the learning momentum.',
          });
        }
        return;
      }

      // Use Supabase
      const { supabase } = await import('../lib/supabase');
      
      const updates: any = {
        completed,
        watch_time: watchTime,
        updated_at: new Date().toISOString(),
      };

      if (completed) {
        updates.watched_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', videoId);

      if (error) {
        throw new Error(error.message);
      }

      if (completed) {
        addToast({
          type: 'success',
          title: 'Video Completed!',
          message: 'Great job! Keep up the learning momentum.',
        });
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update progress.',
      });
    }
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const markNotificationRead = async (id: string) => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { supabase } = await import('../lib/supabase');
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
      }

      setNotifications(prev => prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  return (
    <AppContext.Provider value={{
      skills,
      roadmaps,
      notifications,
      toasts,
      isOnline,
      isSyncing,
      lastSync,
      createRoadmap,
      updateVideoProgress,
      addToast,
      removeToast,
      markNotificationRead,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
};