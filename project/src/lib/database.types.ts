export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          tokens: number;
          streak: number;
          level: number;
          experience: number;
          is_premium: boolean;
          joined_at: string;
          last_login_at: string;
          referral_code: string | null;
          referred_by: string | null;
          preferences: any;
          stats: any;
          social_profile: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          tokens?: number;
          streak?: number;
          level?: number;
          experience?: number;
          is_premium?: boolean;
          joined_at?: string;
          last_login_at?: string;
          referral_code?: string | null;
          referred_by?: string | null;
          preferences?: any;
          stats?: any;
          social_profile?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          tokens?: number;
          streak?: number;
          level?: number;
          experience?: number;
          is_premium?: boolean;
          joined_at?: string;
          last_login_at?: string;
          referral_code?: string | null;
          referred_by?: string | null;
          preferences?: any;
          stats?: any;
          social_profile?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          icon: string | null;
          color: string | null;
          is_premium: boolean;
          subcategories: string[];
          total_skills: number;
          difficulty: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          icon?: string | null;
          color?: string | null;
          is_premium?: boolean;
          subcategories?: string[];
          total_skills?: number;
          difficulty?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          icon?: string | null;
          color?: string | null;
          is_premium?: boolean;
          subcategories?: string[];
          total_skills?: number;
          difficulty?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      roadmaps: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          skill_id?: string | null;
          difficulty?: string;
          estimated_hours?: number;
          progress?: number;
          tokens_used?: number;
          completed?: boolean;
          is_bookmarked?: boolean;
          tags?: string[];
          language?: string;
          prerequisites?: string[];
          learning_objectives?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          skill_id?: string | null;
          difficulty?: string;
          estimated_hours?: number;
          progress?: number;
          tokens_used?: number;
          completed?: boolean;
          is_bookmarked?: boolean;
          tags?: string[];
          language?: string;
          prerequisites?: string[];
          learning_objectives?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          roadmap_id: string;
          youtube_id: string;
          title: string;
          description: string | null;
          thumbnail: string | null;
          duration: number;
          channel: string | null;
          channel_avatar: string | null;
          published_at: string | null;
          view_count: number;
          like_count: number;
          completed: boolean;
          notes: string | null;
          watched_at: string | null;
          watch_time: number;
          rating: number | null;
          difficulty: string;
          topics: string[];
          transcript_available: boolean;
          subtitle_languages: string[];
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          roadmap_id: string;
          youtube_id: string;
          title: string;
          description?: string | null;
          thumbnail?: string | null;
          duration?: number;
          channel?: string | null;
          channel_avatar?: string | null;
          published_at?: string | null;
          view_count?: number;
          like_count?: number;
          completed?: boolean;
          notes?: string | null;
          watched_at?: string | null;
          watch_time?: number;
          rating?: number | null;
          difficulty?: string;
          topics?: string[];
          transcript_available?: boolean;
          subtitle_languages?: string[];
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          roadmap_id?: string;
          youtube_id?: string;
          title?: string;
          description?: string | null;
          thumbnail?: string | null;
          duration?: number;
          channel?: string | null;
          channel_avatar?: string | null;
          published_at?: string | null;
          view_count?: number;
          like_count?: number;
          completed?: boolean;
          notes?: string | null;
          watched_at?: string | null;
          watch_time?: number;
          rating?: number | null;
          difficulty?: string;
          topics?: string[];
          transcript_available?: boolean;
          subtitle_languages?: string[];
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          has_activity: boolean;
          minutes_learned: number;
          videos_watched: number;
          tokens_earned: number;
          achievements: string[];
          completed_goal: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          has_activity?: boolean;
          minutes_learned?: number;
          videos_watched?: number;
          tokens_earned?: number;
          achievements?: string[];
          completed_goal?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          has_activity?: boolean;
          minutes_learned?: number;
          videos_watched?: number;
          tokens_earned?: number;
          achievements?: string[];
          completed_goal?: boolean;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          category: string;
          rarity: string;
          points: number;
          is_shared: boolean;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          category?: string;
          rarity?: string;
          points?: number;
          is_shared?: boolean;
          unlocked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          category?: string;
          rarity?: string;
          points?: number;
          is_shared?: boolean;
          unlocked_at?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          action_url: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          read?: boolean;
          action_url?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
          action_url?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      leaderboard_entries: {
        Row: {
          id: string;
          user_id: string;
          timeframe: string;
          score: number;
          rank: number;
          change: number;
          period_start: string;
          period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timeframe: string;
          score?: number;
          rank?: number;
          change?: number;
          period_start: string;
          period_end: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timeframe?: string;
          score?: number;
          rank?: number;
          change?: number;
          period_start?: string;
          period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_user_streak: {
        Args: {
          user_uuid: string;
        };
        Returns: number;
      };
      update_leaderboard: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}