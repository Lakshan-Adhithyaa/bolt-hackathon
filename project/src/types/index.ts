export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillProgress = 'not-started' | 'in-progress' | 'mastered';
export type SkillCategory = 'technical' | 'soft' | 'domain' | 'tool';

export interface Goal {
  title: string;
  profession: string;
  shortTermGoals?: string;
  longTermGoals?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  channel: string;
  duration: string; // in minutes
  publishedAt: string;
  thumbnailUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views?: number;
  likes?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: SkillLevel;
  category: SkillCategory;
  progress: SkillProgress;
  importance: number; // 1-10 scale
  prerequisites?: string[];
  resources: VideoResource[];
  estimatedTimeToLearn?: string; // e.g., "2 weeks", "3 months"
}

export interface Roadmap {
  id: string;
  goal: Goal;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}