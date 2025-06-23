/*
  # Insert Sample Data for Learner Source

  1. Sample Skills
    - Programming, Design, Business, Data Science, etc.
  
  2. Sample Achievement Templates
    - Global templates used to generate user achievements later
*/

-- Insert sample skills
INSERT INTO skills (name, description, category, icon, color, is_premium, subcategories, total_skills) VALUES
('Programming', 'Learn coding languages and frameworks', 'technology', 'Code2', 'bg-blue-500', false, ARRAY['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'], 15),
('Design', 'UI/UX design and creative skills', 'creative', 'Palette', 'bg-pink-500', false, ARRAY['Figma', 'Adobe XD', 'Photoshop', 'UI Design', 'UX Research'], 12),
('Business', 'Entrepreneurship and business skills', 'business', 'TrendingUp', 'bg-green-500', false, ARRAY['Marketing', 'Finance', 'Leadership', 'Strategy', 'Sales'], 18),
('Data Science', 'Analytics and machine learning', 'technology', 'BarChart3', 'bg-purple-500', true, ARRAY['Machine Learning', 'Statistics', 'R', 'SQL', 'Tableau'], 20),
('Cybersecurity', 'Information security and ethical hacking', 'technology', 'Shield', 'bg-red-500', true, ARRAY['Penetration Testing', 'Network Security', 'Cryptography', 'Risk Assessment'], 14),
('Blockchain', 'Cryptocurrency and decentralized technologies', 'technology', 'Link', 'bg-orange-500', true, ARRAY['Smart Contracts', 'DeFi', 'Web3', 'Solidity', 'Bitcoin'], 10),
('Mobile Development', 'iOS and Android app development', 'technology', 'Smartphone', 'bg-indigo-500', true, ARRAY['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin'], 16),
('Languages', 'Learn new languages and cultures', 'education', 'Globe', 'bg-teal-500', false, ARRAY['Spanish', 'French', 'German', 'Japanese', 'Mandarin'], 25);

-- Create achievement_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievement_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  rarity TEXT,
  points INTEGER
);

-- Insert global achievement templates
INSERT INTO achievement_templates (name, description, icon, category, rarity, points)
SELECT 'First Steps', 'Complete your first video', 'Play', 'milestone', 'common', 10
WHERE NOT EXISTS (SELECT 1 FROM achievement_templates WHERE name = 'First Steps');

INSERT INTO achievement_templates (name, description, icon, category, rarity, points)
SELECT 'Week Warrior', 'Maintain a 7-day learning streak', 'Flame', 'streak', 'rare', 50
WHERE NOT EXISTS (SELECT 1 FROM achievement_templates WHERE name = 'Week Warrior');

INSERT INTO achievement_templates (name, description, icon, category, rarity, points)
SELECT 'Knowledge Seeker', 'Complete your first roadmap', 'Trophy', 'milestone', 'rare', 100
WHERE NOT EXISTS (SELECT 1 FROM achievement_templates WHERE name = 'Knowledge Seeker');

INSERT INTO achievement_templates (name, description, icon, category, rarity, points)
SELECT 'Social Learner', 'Share your first achievement', 'Share2', 'social', 'common', 25
WHERE NOT EXISTS (SELECT 1 FROM achievement_templates WHERE name = 'Social Learner');
