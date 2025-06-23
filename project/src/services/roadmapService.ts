import { supabase, trackEvent } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Roadmap = Database['public']['Tables']['roadmaps']['Row'];
type Video = Database['public']['Tables']['videos']['Row'];

export class RoadmapService {
  static async createRoadmap(
    userId: string,
    skillId: string,
    title: string,
    difficulty: string,
    language: string = 'English'
  ): Promise<Roadmap> {
    // Calculate token cost based on difficulty and premium status
    const { data: profile } = await supabase
      .from('profiles')
      .select('tokens, is_premium')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const tokenCost = difficulty === 'advanced' ? 400 : difficulty === 'intermediate' ? 300 : 200;
    
    if (profile.tokens < tokenCost) {
      throw new Error('Insufficient tokens');
    }

    // Create roadmap
    const { data: roadmap, error: roadmapError } = await supabase
      .from('roadmaps')
      .insert({
        user_id: userId,
        title,
        skill_id: skillId,
        difficulty,
        language,
        tokens_used: tokenCost,
        description: `Learn ${title} with curated YouTube videos`,
        estimated_hours: difficulty === 'advanced' ? 20 : difficulty === 'intermediate' ? 15 : 10,
      })
      .select()
      .single();

    if (roadmapError) {
      throw new Error(roadmapError.message);
    }

    // Generate mock videos (in production, this would call YouTube API)
    const videos = await this.generateMockVideos(roadmap.id, title, difficulty, profile.is_premium);

    // Deduct tokens
    await supabase
      .from('profiles')
      .update({ tokens: profile.tokens - tokenCost })
      .eq('id', userId);

    await trackEvent('roadmap_created', {
      roadmap_id: roadmap.id,
      skill_id: skillId,
      difficulty,
      token_cost: tokenCost,
    });

    return roadmap;
  }

  static async generateMockVideos(
    roadmapId: string,
    skill: string,
    difficulty: string,
    isPremium: boolean
  ): Promise<Video[]> {
    const videoCount = isPremium ? (difficulty === 'advanced' ? 15 : 12) : (difficulty === 'advanced' ? 8 : 6);
    
    const mockVideos = [];
    
    for (let i = 0; i < videoCount; i++) {
      const video = {
        roadmap_id: roadmapId,
        youtube_id: `mock_${Math.random().toString(36).substr(2, 11)}`,
        title: `${skill} - Part ${i + 1}: ${this.getVideoTitle(skill, i, difficulty)}`,
        description: `Learn ${skill} fundamentals in this comprehensive tutorial.`,
        thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
        duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        channel: this.getRandomChannel(),
        channel_avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face`,
        published_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        view_count: Math.floor(Math.random() * 1000000) + 10000,
        like_count: Math.floor(Math.random() * 50000) + 1000,
        difficulty,
        topics: this.getVideoTopics(skill, i),
        transcript_available: Math.random() > 0.3,
        subtitle_languages: ['en', 'es', 'fr'],
        order_index: i,
      };
      
      mockVideos.push(video);
    }

    const { data: insertedVideos, error } = await supabase
      .from('videos')
      .insert(mockVideos)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return insertedVideos;
  }

  static getVideoTitle(skill: string, index: number, difficulty: string): string {
    const titles = {
      beginner: [
        'Getting Started',
        'Basic Concepts',
        'Your First Project',
        'Essential Tools',
        'Common Patterns',
        'Best Practices',
        'Fundamentals',
        'Introduction',
      ],
      intermediate: [
        'Advanced Techniques',
        'Performance Optimization',
        'Real-world Applications',
        'Problem Solving',
        'Integration Patterns',
        'Testing Strategies',
        'Debugging',
        'Optimization',
      ],
      advanced: [
        'Expert-level Concepts',
        'Architecture Patterns',
        'Scalability Solutions',
        'Advanced Debugging',
        'Performance Tuning',
        'Industry Standards',
        'Complex Scenarios',
        'Mastery',
      ],
    };

    const titleList = titles[difficulty as keyof typeof titles] || titles.beginner;
    return titleList[index % titleList.length];
  }

  static getRandomChannel(): string {
    const channels = [
      'TechEdu Academy',
      'CodeMaster Pro',
      'Learning Hub',
      'Skill Builder',
      'Expert Tutorials',
      'Knowledge Base',
      'Dev Academy',
      'Learn Fast',
    ];
    return channels[Math.floor(Math.random() * channels.length)];
  }

  static getVideoTopics(skill: string, index: number): string[] {
    const baseTopics = [skill.toLowerCase()];
    const additionalTopics = [
      'tutorial',
      'beginner',
      'guide',
      'tips',
      'tricks',
      'best practices',
      'examples',
      'hands-on',
    ];
    
    return [
      ...baseTopics,
      ...additionalTopics.slice(0, Math.floor(Math.random() * 3) + 1),
    ];
  }

  static async getUserRoadmaps(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select(`
          *,
          videos (
            id,
            title,
            completed,
            duration,
            order_index,
            watch_time
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      return [];
    }
  }

  static async updateVideoProgress(
    videoId: string,
    completed: boolean,
    watchTime: number,
    notes?: string
  ): Promise<void> {
    const updates: any = {
      completed,
      watch_time: watchTime,
      updated_at: new Date().toISOString(),
    };

    if (completed) {
      updates.watched_at = new Date().toISOString();
    }

    if (notes) {
      updates.notes = notes;
    }

    const { error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId);

    if (error) {
      throw new Error(error.message);
    }

    // Update roadmap progress
    const { data: video } = await supabase
      .from('videos')
      .select('roadmap_id')
      .eq('id', videoId)
      .single();

    if (video) {
      await this.updateRoadmapProgress(video.roadmap_id);
    }

    await trackEvent('video_progress_updated', {
      video_id: videoId,
      completed,
      watch_time: watchTime,
    });
  }

  static async updateRoadmapProgress(roadmapId: string): Promise<void> {
    const { data: videos } = await supabase
      .from('videos')
      .select('completed')
      .eq('roadmap_id', roadmapId);

    if (videos) {
      const completedCount = videos.filter(v => v.completed).length;
      const progress = videos.length > 0 ? (completedCount / videos.length) * 100 : 0;
      const completed = progress === 100;

      await supabase
        .from('roadmaps')
        .update({ progress, completed })
        .eq('id', roadmapId);

      if (completed) {
        await trackEvent('roadmap_completed', { roadmap_id: roadmapId });
      }
    }
  }

  static async addVideoBookmark(
    videoId: string,
    userId: string,
    timestamp: number,
    note: string
  ): Promise<void> {
    const { error } = await supabase
      .from('video_bookmarks')
      .insert({
        video_id: videoId,
        user_id: userId,
        timestamp,
        note,
      });

    if (error) {
      throw new Error(error.message);
    }

    await trackEvent('video_bookmark_added', {
      video_id: videoId,
      timestamp,
    });
  }
}