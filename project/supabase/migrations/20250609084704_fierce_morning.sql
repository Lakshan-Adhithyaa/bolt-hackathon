/*
  # Initial Schema for Learner Source Platform

  1. New Tables
    - `profiles` - User profile data and preferences
    - `skills` - Available skills and categories
    - `roadmaps` - User-generated learning roadmaps
    - `videos` - YouTube video metadata and progress
    - `streaks` - Daily activity and streak tracking
    - `referrals` - Referral system and rewards
    - `achievements` - Badge system and unlocks
    - `analytics_events` - User behavior tracking
    - `notifications` - System messages and alerts
    - `flashcards` - Spaced repetition learning cards
    - `quizzes` - Assessment and knowledge testing
    - `leaderboard_entries` - Competition and rankings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  tokens integer DEFAULT 1000,
  streak integer DEFAULT 0,
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  last_login_at timestamptz DEFAULT now(),
  referral_code text UNIQUE,
  referred_by text,
  preferences jsonb DEFAULT '{}',
  stats jsonb DEFAULT '{}',
  social_profile jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  icon text,
  color text,
  is_premium boolean DEFAULT false,
  subcategories text[] DEFAULT '{}',
  total_skills integer DEFAULT 0,
  difficulty text DEFAULT 'beginner',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  skill_id uuid REFERENCES skills(id),
  difficulty text DEFAULT 'beginner',
  estimated_hours integer DEFAULT 0,
  progress real DEFAULT 0,
  tokens_used integer DEFAULT 0,
  completed boolean DEFAULT false,
  is_bookmarked boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  language text DEFAULT 'English',
  prerequisites text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id uuid REFERENCES roadmaps(id) ON DELETE CASCADE,
  youtube_id text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail text,
  duration integer DEFAULT 0,
  channel text,
  channel_avatar text,
  published_at timestamptz,
  view_count bigint DEFAULT 0,
  like_count bigint DEFAULT 0,
  completed boolean DEFAULT false,
  notes text,
  watched_at timestamptz,
  watch_time integer DEFAULT 0,
  rating integer,
  difficulty text DEFAULT 'beginner',
  topics text[] DEFAULT '{}',
  transcript_available boolean DEFAULT false,
  subtitle_languages text[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Video bookmarks table
CREATE TABLE IF NOT EXISTS video_bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  timestamp integer NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Streaks table
CREATE TABLE IF NOT EXISTS streaks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  has_activity boolean DEFAULT false,
  minutes_learned integer DEFAULT 0,
  videos_watched integer DEFAULT 0,
  tokens_earned integer DEFAULT 0,
  achievements text[] DEFAULT '{}',
  completed_goal boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  bonus_tokens integer DEFAULT 200,
  status text DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text,
  category text DEFAULT 'milestone',
  rarity text DEFAULT 'common',
  points integer DEFAULT 0,
  is_shared boolean DEFAULT false,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  action_url text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  difficulty real DEFAULT 2.5,
  next_review timestamptz DEFAULT now(),
  interval_days integer DEFAULT 1,
  repetitions integer DEFAULT 0,
  ease_factor real DEFAULT 2.5,
  timestamp integer,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id),
  title text NOT NULL,
  description text,
  questions jsonb DEFAULT '[]',
  difficulty text DEFAULT 'beginner',
  time_limit integer,
  passing_score integer DEFAULT 70,
  attempts jsonb DEFAULT '[]',
  is_completed boolean DEFAULT false,
  best_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leaderboard entries table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  timeframe text NOT NULL, -- 'weekly', 'monthly', 'all-time'
  score integer DEFAULT 0,
  rank integer DEFAULT 0,
  change integer DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, timeframe, period_start)
);

-- Learning sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  videos_watched text[] DEFAULT '{}',
  total_watch_time integer DEFAULT 0,
  tokens_earned integer DEFAULT 0,
  skills_progressed text[] DEFAULT '{}',
  notes text[] DEFAULT '{}',
  mood text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Skills policies (public read)
CREATE POLICY "Anyone can read skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

-- Roadmaps policies
CREATE POLICY "Users can manage own roadmaps"
  ON roadmaps
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Videos policies
CREATE POLICY "Users can manage videos in own roadmaps"
  ON videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = videos.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

-- Video bookmarks policies
CREATE POLICY "Users can manage own bookmarks"
  ON video_bookmarks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can manage own streaks"
  ON streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can read referrals they're involved in"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

-- Achievements policies
CREATE POLICY "Users can manage own achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can create own analytics events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can manage own flashcards"
  ON flashcards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quizzes policies
CREATE POLICY "Users can manage own quizzes"
  ON quizzes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Users can read leaderboard entries"
  ON leaderboard_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own leaderboard entries"
  ON leaderboard_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Learning sessions policies
CREATE POLICY "Users can manage own learning sessions"
  ON learning_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE ON leaderboard_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8))
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to calculate streak
CREATE OR REPLACE FUNCTION calculate_user_streak(user_uuid uuid)
RETURNS integer AS $$
DECLARE
  current_streak integer := 0;
  check_date date := CURRENT_DATE;
BEGIN
  -- Check consecutive days backwards from today
  LOOP
    IF EXISTS (
      SELECT 1 FROM streaks 
      WHERE user_id = user_uuid 
      AND date = check_date 
      AND has_activity = true
    ) THEN
      current_streak := current_streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN current_streak;
END;
$$ language 'plpgsql';

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void AS $$
BEGIN
  -- Update weekly leaderboard
  INSERT INTO leaderboard_entries (user_id, timeframe, score, period_start, period_end)
  SELECT 
    p.id,
    'weekly',
    COALESCE(p.experience, 0) + COALESCE(p.streak, 0) * 10,
    DATE_TRUNC('week', CURRENT_DATE),
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days'
  FROM profiles p
  ON CONFLICT (user_id, timeframe, period_start)
  DO UPDATE SET 
    score = EXCLUDED.score,
    updated_at = now();

  -- Update ranks
  WITH ranked_users AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
    FROM leaderboard_entries
    WHERE timeframe = 'weekly' 
    AND period_start = DATE_TRUNC('week', CURRENT_DATE)
  )
  UPDATE leaderboard_entries 
  SET rank = ranked_users.new_rank
  FROM ranked_users
  WHERE leaderboard_entries.user_id = ranked_users.id
  AND timeframe = 'weekly'
  AND period_start = DATE_TRUNC('week', CURRENT_DATE);
END;
$$ language 'plpgsql';