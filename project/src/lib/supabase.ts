import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config Check:', {
  url: supabaseUrl ? 'Present' : 'Missing',
  key: supabaseAnonKey ? 'Present' : 'Missing',
  urlValue: supabaseUrl,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env file and ensure you have:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  
  throw new Error('Supabase configuration missing. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Add these settings for better auth handling
    flowType: 'pkce',
    storage: window?.localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // Add global configuration
  global: {
    headers: {
      'X-Client-Info': 'learner-source-web',
    },
  },
});

// Enhanced connection test
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection with auth session check
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase auth error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to test Supabase connection:', error.message);
    return false;
  }
};

// Initialize connection test
testConnection();

// Enhanced real-time subscriptions helper
export const subscribeToUserData = (userId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`user-data-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        console.log('Profile update received:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('User data subscription status:', status);
    });

  return channel;
};

export const subscribeToStreaks = (userId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`user-streaks-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'streaks',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Streak update received:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('Streaks subscription status:', status);
    });

  return channel;
};

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`user-notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('New notification received:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('Notifications subscription status:', status);
    });

  return channel;
};

// Enhanced analytics helper with better error handling
export const trackEvent = async (eventType: string, eventData: any = {}) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.warn('Cannot track event - user not authenticated:', eventType);
      return;
    }
    
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
        session_id: getSessionId(),
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error tracking event:', insertError);
    } else {
      console.log('Event tracked:', eventType, eventData);
    }
  } catch (error) {
    console.error('Error in trackEvent:', error);
  }
};

// Helper function to get or create session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Enhanced error handling helper
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error details:', error);
  
  // Email confirmation errors
  if (error.message?.includes('Email not confirmed') || error.code === 'email_not_confirmed') {
    return 'Please check your email and click the confirmation link before signing in. If you haven\'t received the email, please check your spam folder or try signing up again.';
  }
  
  // Authentication errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  
  if (error.message?.includes('User not found')) {
    return 'No account found with this email address.';
  }
  
  if (error.message?.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists.';
  }
  
  // Database errors
  if (error.code === 'PGRST301') {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.code === '23505') {
    return 'This item already exists.';
  }
  
  if (error.code === '23503') {
    return 'Cannot delete this item because it is referenced by other data.';
  }
  
  // JWT/Session errors
  if (error.message?.includes('JWT') || error.message?.includes('token')) {
    return 'Your session has expired. Please sign in again.';
  }
  
  // Network errors
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Row Level Security errors
  if (error.message?.includes('row-level security')) {
    return 'Access denied. Please make sure you are logged in.';
  }
  
  // Generic fallback
  return error.message || 'An unexpected error occurred. Please try again.';
};

// Helper function to check if user is authenticated
export const checkAuth = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth check error:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

// Helper function to refresh session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      return false;
    }
    
    console.log('Session refreshed successfully');
    return true;
  } catch (error) {
    console.error('Session refresh failed:', error);
    return false;
  }
};

// Export configured supabase client as default
export default supabase;