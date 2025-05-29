import React, { createContext, useContext, useState, useEffect } from 'react';
import { Roadmap, Goal, Skill, SkillProgress, VideoResource } from '../types';
import { generateSkillRoadmap } from '../utils/roadmapGenerator';
import { toast } from 'sonner';

interface RoadmapContextType {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  saveRoadmap: (roadmap: Roadmap) => void;
  createRoadmap: (goal: Goal) => Roadmap;
  getRoadmap: (id: string) => Roadmap | undefined;
  updateSkillProgress: (roadmapId: string, skillId: string, progress: SkillProgress) => void;
  deleteRoadmap: (id: string) => void;
  updateSkillOrder: (roadmapId: string, skills: Skill[]) => void;
  addVideoResource: (roadmapId: string, skillId: string, resource: Omit<VideoResource, 'id' | 'addedAt'>) => void;
  removeVideoResource: (roadmapId: string, skillId: string, resourceId: string) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);

  // Load roadmaps from localStorage on initial render
  useEffect(() => {
    const savedRoadmaps = localStorage.getItem('roadmaps');
    if (savedRoadmaps) {
      try {
        setRoadmaps(JSON.parse(savedRoadmaps));
      } catch (error) {
        console.error('Failed to parse roadmaps from localStorage', error);
        toast.error('Failed to load saved roadmaps');
      }
    }
  }, []);

  // Save roadmaps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  const createRoadmap = (goal: Goal): Roadmap => {
    const id = `roadmap-${Date.now()}`;
    const now = new Date().toISOString();
    const skills = generateSkillRoadmap(goal);
    
    const newRoadmap: Roadmap = {
      id,
      goal: {
        ...goal,
        createdAt: now
      },
      skills,
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: now
    };
    
    setRoadmaps(prev => [...prev, newRoadmap]);
    setCurrentRoadmap(newRoadmap);
    toast.success('Roadmap created successfully');
    return newRoadmap;
  };

  const saveRoadmap = (roadmap: Roadmap) => {
    const now = new Date().toISOString();
    
    setRoadmaps(prev => {
      const index = prev.findIndex(r => r.id === roadmap.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...roadmap,
          updatedAt: now,
          lastAccessedAt: now
        };
        return updated;
      }
      return [...prev, {
        ...roadmap,
        createdAt: now,
        updatedAt: now,
        lastAccessedAt: now
      }];
    });
    
    setCurrentRoadmap(roadmap);
    toast.success('Roadmap saved successfully');
  };

  const getRoadmap = (id: string) => {
    const roadmap = roadmaps.find(r => r.id === id);
    if (roadmap) {
      // Update last accessed timestamp
      const now = new Date().toISOString();
      setRoadmaps(prev => 
        prev.map(r => 
          r.id === id ? { ...r, lastAccessedAt: now } : r
        )
      );
    }
    return roadmap;
  };

  const updateSkillProgress = (roadmapId: string, skillId: string, progress: SkillProgress) => {
    const now = new Date().toISOString();
    
    setRoadmaps(prev => {
      return prev.map(roadmap => {
        if (roadmap.id === roadmapId) {
          const updatedSkills = roadmap.skills.map(skill => {
            if (skill.id === skillId) {
              return { ...skill, progress };
            }
            return skill;
          });
          
          return {
            ...roadmap,
            skills: updatedSkills,
            updatedAt: now,
            lastAccessedAt: now
          };
        }
        return roadmap;
      });
    });
    
    // Also update currentRoadmap if it's the one being modified
    if (currentRoadmap?.id === roadmapId) {
      setCurrentRoadmap(prev => {
        if (!prev) return prev;
        
        const updatedSkills = prev.skills.map(skill => {
          if (skill.id === skillId) {
            return { ...skill, progress };
          }
          return skill;
        });
        
        return {
          ...prev,
          skills: updatedSkills,
          updatedAt: now,
          lastAccessedAt: now
        };
      });
    }
    
    toast.success('Progress updated');
  };

  const updateSkillOrder = (roadmapId: string, skills: Skill[]) => {
    const now = new Date().toISOString();
    
    setRoadmaps(prev => {
      return prev.map(roadmap => {
        if (roadmap.id === roadmapId) {
          return {
            ...roadmap,
            skills: skills.map((skill, index) => ({ ...skill, order: index })),
            updatedAt: now,
            lastAccessedAt: now
          };
        }
        return roadmap;
      });
    });
    
    if (currentRoadmap?.id === roadmapId) {
      setCurrentRoadmap(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          skills: skills.map((skill, index) => ({ ...skill, order: index })),
          updatedAt: now,
          lastAccessedAt: now
        };
      });
    }
  };

  const addVideoResource = (
    roadmapId: string, 
    skillId: string, 
    resource: Omit<VideoResource, 'id' | 'addedAt'>
  ) => {
    const now = new Date().toISOString();
    const newResource: VideoResource = {
      ...resource,
      id: `video-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      addedAt: now
    };
    
    setRoadmaps(prev => {
      return prev.map(roadmap => {
        if (roadmap.id === roadmapId) {
          const updatedSkills = roadmap.skills.map(skill => {
            if (skill.id === skillId) {
              return {
                ...skill,
                resources: [...skill.resources, newResource]
              };
            }
            return skill;
          });
          
          return {
            ...roadmap,
            skills: updatedSkills,
            updatedAt: now,
            lastAccessedAt: now
          };
        }
        return roadmap;
      });
    });
    
    toast.success('Resource added successfully');
  };

  const removeVideoResource = (roadmapId: string, skillId: string, resourceId: string) => {
    const now = new Date().toISOString();
    
    setRoadmaps(prev => {
      return prev.map(roadmap => {
        if (roadmap.id === roadmapId) {
          const updatedSkills = roadmap.skills.map(skill => {
            if (skill.id === skillId) {
              return {
                ...skill,
                resources: skill.resources.filter(r => r.id !== resourceId)
              };
            }
            return skill;
          });
          
          return {
            ...roadmap,
            skills: updatedSkills,
            updatedAt: now,
            lastAccessedAt: now
          };
        }
        return roadmap;
      });
    });
    
    toast.success('Resource removed');
  };

  const deleteRoadmap = (id: string) => {
    setRoadmaps(prev => prev.filter(roadmap => roadmap.id !== id));
    if (currentRoadmap?.id === id) {
      setCurrentRoadmap(null);
    }
    toast.success('Roadmap deleted');
  };

  return (
    <RoadmapContext.Provider
      value={{
        roadmaps,
        currentRoadmap,
        saveRoadmap,
        createRoadmap,
        getRoadmap,
        updateSkillProgress,
        deleteRoadmap,
        updateSkillOrder,
        addVideoResource,
        removeVideoResource
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = (): RoadmapContextType => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};