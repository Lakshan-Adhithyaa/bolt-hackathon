export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillProgress = 'not-started' | 'in-progress' | 'mastered';
export type SkillCategory = 'technical' | 'soft' | 'domain' | 'tool';

export interface Goal {
  title: string;
  profession: string;
  shortTermGoals?: string;
  longTermGoals?: string;
  deadline: number; // in months
  description?: string;
  createdAt: string;
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  channel: string;
  duration: string;
  publishedAt: string;
  thumbnailUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views?: number;
  likes?: number;
  addedBy?: string;
  addedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: SkillLevel;
  category: SkillCategory;
  progress: SkillProgress;
  importance: number;
  prerequisites?: string[];
  resources: VideoResource[];
  estimatedTimeToLearn?: string;
  targetCompletionMonth?: number;
  order: number;
}

export interface Roadmap {
  id: string;
  goal: Goal;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
}