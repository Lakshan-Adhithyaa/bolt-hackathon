import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Fallback auth context for when Supabase is not configured
interface User {
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
  preferences: any;
  achievements: any[];
  referralCode?: string;
  referredBy?: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null; // Add profile for compatibility
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string, referralCode?: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured, using fallback auth');
      // Check for existing session in localStorage
      const savedUser = localStorage.getItem('learner-source-user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Ensure dates are properly converted
          parsedUser.joinedAt = new Date(parsedUser.joinedAt);
          parsedUser.lastLoginAt = new Date(parsedUser.lastLoginAt);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('learner-source-user');
        }
      }
      setIsLoading(false);
      return;
    }

    // Initialize Supabase auth
    initializeSupabaseAuth();
  }, []);

  const initializeSupabaseAuth = async () => {
    try {
      const { supabase, trackEvent } = await import('../lib/supabase');
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            await loadUserProfile(session.user.id);
            
            // Update last login
            try {
              await supabase
                .from('profiles')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', session.user.id);
                
              await trackEvent('user_login');
            } catch (error) {
              console.error('Error updating last login:', error);
            }
          } else {
            setUser(null);
            localStorage.removeItem('learner-source-user');
          }
          
          setIsLoading(false);
        }
      );

      setIsLoading(false);
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Failed to initialize Supabase auth:', error);
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar_url,
          tokens: profile.tokens,
          streak: profile.streak,
          level: profile.level,
          experience: profile.experience,
          isPremium: profile.is_premium,
          joinedAt: new Date(profile.joined_at),
          lastLoginAt: new Date(profile.last_login_at),
          preferences: profile.preferences || {
            learningGoals: [],
            preferredLanguages: ['English'],
            skillLevel: 'beginner',
            dailyGoalMinutes: 30,
            notificationsEnabled: true,
          },
          achievements: [],
          referralCode: profile.referral_code,
          referredBy: profile.referred_by,
        };
        
        setUser(userData);
        localStorage.setItem('learner-source-user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Fallback mock login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('learner-source-users') || '[]');
        const existingUser = existingUsers.find((u: any) => u.email === email);
        
        if (existingUser) {
          const userData: User = {
            ...existingUser,
            lastLoginAt: new Date(),
            joinedAt: new Date(existingUser.joinedAt),
          };
          setUser(userData);
          localStorage.setItem('learner-source-user', JSON.stringify(userData));
          return true;
        } else {
          throw new Error('Invalid email or password');
        }
      }

      // Use Supabase auth
      const { supabase, trackEvent } = await import('../lib/supabase');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
      }

      await trackEvent('user_signin', { email });
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Fallback mock Google login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: 'user@gmail.com',
          name: 'Google User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
          tokens: 1000,
          streak: 0,
          level: 1,
          experience: 0,
          isPremium: false,
          joinedAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            learningGoals: [],
            preferredLanguages: ['English'],
            skillLevel: 'beginner',
            dailyGoalMinutes: 30,
            notificationsEnabled: true,
          },
          achievements: [],
          referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
        };

        setUser(mockUser);
        localStorage.setItem('learner-source-user', JSON.stringify(mockUser));
        return true;
      }

      // Use Supabase Google OAuth
      const { supabase, trackEvent } = await import('../lib/supabase');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw new Error(error.message);
      }

      await trackEvent('user_signin_google');
      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Starting signup process...', { email, name, referralCode });
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Fallback mock signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('learner-source-users') || '[]');
        if (existingUsers.find((u: any) => u.email === email)) {
          throw new Error('User already exists with this email');
        }
        
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          tokens: referralCode ? 1200 : 1000,
          streak: 0,
          level: 1,
          experience: 0,
          isPremium: false,
          joinedAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            learningGoals: [],
            preferredLanguages: ['English'],
            skillLevel: 'beginner',
            dailyGoalMinutes: 30,
            notificationsEnabled: true,
          },
          achievements: [],
          referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
          referredBy: referralCode,
        };

        // Save to users list
        existingUsers.push(mockUser);
        localStorage.setItem('learner-source-users', JSON.stringify(existingUsers));
        
        // Set as current user
        setUser(mockUser);
        localStorage.setItem('learner-source-user', JSON.stringify(mockUser));
        return true;
      }

      // Use Supabase auth - rely on database trigger to create profile
      const { supabase, trackEvent } = await import('../lib/supabase');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            referred_by: referralCode,
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from signup');
      }

      console.log('Auth signup successful, user ID:', authData.user.id);

      // Track the signup event
      await trackEvent('user_signup', { email, has_referral: !!referralCode });
      console.log('Signup completed successfully');
      return true;
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { supabase, trackEvent } = await import('../lib/supabase');
        await trackEvent('user_signout');
        await supabase.auth.signOut();
      }
      
      setUser(null);
      localStorage.removeItem('learner-source-user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if Supabase logout fails
      setUser(null);
      localStorage.removeItem('learner-source-user');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user?.id) return;

    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { supabase, trackEvent } = await import('../lib/supabase');
        
        const profileUpdates: any = {};
        
        if (updates.name) profileUpdates.name = updates.name;
        if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
        if (updates.tokens !== undefined) profileUpdates.tokens = updates.tokens;
        if (updates.streak !== undefined) profileUpdates.streak = updates.streak;
        if (updates.level !== undefined) profileUpdates.level = updates.level;
        if (updates.experience !== undefined) profileUpdates.experience = updates.experience;
        if (updates.isPremium !== undefined) profileUpdates.is_premium = updates.isPremium;
        if (updates.preferences) profileUpdates.preferences = updates.preferences;

        const { data, error } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Update profile error:', error);
          throw new Error(error.message);
        }

        await trackEvent('profile_updated', updates);
      }

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('learner-source-user', JSON.stringify(updatedUser));
      
      // Update users list in localStorage for demo mode
      const existingUsers = JSON.parse(localStorage.getItem('learner-source-users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('learner-source-users', JSON.stringify(existingUsers));
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile: user, // Add profile for compatibility
      login,
      loginWithGoogle,
      logout,
      signup,
      updateUser,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};