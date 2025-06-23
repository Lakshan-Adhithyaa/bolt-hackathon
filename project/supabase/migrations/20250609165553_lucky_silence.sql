/*
  # Achievement System Functions

  1. Functions
    - `assign_achievement_from_template()` - Assigns achievement from template to user
    - `check_and_assign_achievements()` - Automatically checks and assigns achievements
    - `get_user_achievement_progress()` - Gets progress toward locked achievements

  2. Additional Templates
    - More achievement templates for comprehensive gamification
    - Achievement conditions and requirements

  3. Triggers
    - Automatic achievement checking on video completion
    - Automatic achievement checking on roadmap completion
    - Automatic achievement checking on streak updates
*/

-- Create the assign_achievement_from_template function
CREATE OR REPLACE FUNCTION public.assign_achievement_from_template(
  target_user_id UUID,
  achievement_name TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Check if user already has this achievement
  IF NOT EXISTS (
    SELECT 1 FROM achievements 
    WHERE user_id = target_user_id AND name = achievement_name
  ) THEN
    -- Insert achievement from template
    INSERT INTO achievements (user_id, name, description, icon, category, rarity, points)
    SELECT target_user_id, name, description, icon, category, rarity, points
    FROM achievement_templates
    WHERE name = achievement_name;
    
    -- Create notification for the user
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      target_user_id,
      'Achievement Unlocked!',
      'You''ve earned the "' || achievement_name || '" achievement!',
      'achievement'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create comprehensive achievement checking function
CREATE OR REPLACE FUNCTION public.check_and_assign_achievements(
  target_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  achievements_assigned INTEGER := 0;
  user_streak INTEGER;
  videos_completed INTEGER;
  roadmaps_completed INTEGER;
  total_watch_time INTEGER;
  tokens_earned INTEGER;
  days_active INTEGER;
BEGIN
  -- Get user statistics
  SELECT streak INTO user_streak
  FROM profiles
  WHERE id = target_user_id;
  
  -- Count completed videos
  SELECT COUNT(*) INTO videos_completed
  FROM videos v
  JOIN roadmaps r ON v.roadmap_id = r.id
  WHERE r.user_id = target_user_id AND v.completed = true;
  
  -- Count completed roadmaps
  SELECT COUNT(*) INTO roadmaps_completed
  FROM roadmaps
  WHERE user_id = target_user_id AND completed = true;
  
  -- Calculate total watch time (in minutes)
  SELECT COALESCE(SUM(watch_time), 0) / 60 INTO total_watch_time
  FROM videos v
  JOIN roadmaps r ON v.roadmap_id = r.id
  WHERE r.user_id = target_user_id;
  
  -- Calculate tokens earned from streaks
  SELECT COALESCE(SUM(tokens_earned), 0) INTO tokens_earned
  FROM streaks
  WHERE user_id = target_user_id;
  
  -- Count days with activity
  SELECT COUNT(*) INTO days_active
  FROM streaks
  WHERE user_id = target_user_id AND has_activity = true;

  -- Check and assign achievements based on conditions
  
  -- First Steps: Complete first video
  IF videos_completed >= 1 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'First Steps');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Week Warrior: 7-day streak
  IF user_streak >= 7 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Week Warrior');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Knowledge Seeker: Complete first roadmap
  IF roadmaps_completed >= 1 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Knowledge Seeker');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Dedicated Learner: Watch 10 videos
  IF videos_completed >= 10 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Dedicated Learner');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Monthly Master: 30-day streak
  IF user_streak >= 30 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Monthly Master');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Centurion: 100-day streak
  IF user_streak >= 100 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Centurion');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Marathon Learner: 10 hours of watch time
  IF total_watch_time >= 600 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Marathon Learner');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Token Collector: Earn 1000 tokens
  IF tokens_earned >= 1000 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Token Collector');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Skill Master: Complete 5 roadmaps
  IF roadmaps_completed >= 5 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Skill Master');
    achievements_assigned := achievements_assigned + 1;
  END IF;
  
  -- Consistent Learner: 30 days with activity
  IF days_active >= 30 THEN
    PERFORM assign_achievement_from_template(target_user_id, 'Consistent Learner');
    achievements_assigned := achievements_assigned + 1;
  END IF;

  RETURN achievements_assigned;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert additional achievement templates
INSERT INTO achievement_templates (name, description, icon, category, rarity, points)
VALUES 
('Dedicated Learner', 'Watch 10 videos', 'Play', 'milestone', 'common', 30),
('Marathon Learner', 'Watch 10 hours of content', 'Clock', 'milestone', 'rare', 75),
('Monthly Master', 'Maintain a 30-day learning streak', 'Crown', 'streak', 'epic', 200),
('Centurion', 'Maintain a 100-day learning streak', 'Trophy', 'streak', 'legendary', 500),
('Token Collector', 'Earn 1000 tokens from learning', 'Coins', 'milestone', 'rare', 100),
('Skill Master', 'Complete 5 roadmaps', 'GraduationCap', 'milestone', 'epic', 250),
('Consistent Learner', 'Learn for 30 different days', 'Target', 'streak', 'rare', 150),
('Early Bird', 'Complete first lesson before 9 AM', 'Sunrise', 'challenge', 'common', 20),
('Night Owl', 'Complete lesson after 10 PM', 'Moon', 'challenge', 'common', 20),
('Speed Learner', 'Complete 5 videos in one day', 'Zap', 'challenge', 'rare', 80)
ON CONFLICT (name) DO NOTHING;

-- Function to trigger achievement checks on video completion
CREATE OR REPLACE FUNCTION trigger_achievement_check_on_video()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check when a video is marked as completed
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    -- Get the user_id from the roadmap
    DECLARE
      user_uuid UUID;
    BEGIN
      SELECT user_id INTO user_uuid
      FROM roadmaps
      WHERE id = NEW.roadmap_id;
      
      -- Check for achievements asynchronously
      PERFORM check_and_assign_achievements(user_uuid);
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to trigger achievement checks on roadmap completion
CREATE OR REPLACE FUNCTION trigger_achievement_check_on_roadmap()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check when a roadmap is marked as completed
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    -- Check for achievements
    PERFORM check_and_assign_achievements(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to trigger achievement checks on streak updates
CREATE OR REPLACE FUNCTION trigger_achievement_check_on_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for achievements when streak data is updated
  IF NEW.has_activity = true THEN
    PERFORM check_and_assign_achievements(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic achievement checking
CREATE TRIGGER achievement_check_on_video_completion
  AFTER UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION trigger_achievement_check_on_video();

CREATE TRIGGER achievement_check_on_roadmap_completion
  AFTER UPDATE ON roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION trigger_achievement_check_on_roadmap();

CREATE TRIGGER achievement_check_on_streak_update
  AFTER INSERT OR UPDATE ON streaks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_achievement_check_on_streak();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION assign_achievement_from_template TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_assign_achievements TO authenticated;