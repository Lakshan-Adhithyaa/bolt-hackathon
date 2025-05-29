import React, { createContext, useContext, useState, useEffect } from 'react';
import { Roadmap, Goal, Skill, SkillProgress, VideoResource } from '../types';
import { generateSkillRoadmap } from '../utils/roadmapGenerator';

interface RoadmapContextType {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  saveRoadmap: (roadmap: Roadmap) => void;
  createRoadmap: (goal: Goal) => Roadmap;
  getRoadmap: (id: string) => Roadmap | undefined;
  updateSkillProgress: (roadmapId: string, skillId: string, progress: SkillProgress) => void;
  deleteRoadmap: (id: string) => void;
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
      }
    }
  }, []);

  // Save roadmaps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  const createRoadmap = (goal: Goal): Roadmap => {
    const id = `roadmap-${Date.now()}`;
    const skills = generateSkillRoadmap(goal);
    
    const newRoadmap: Roadmap = {
      id,
      goal,
      skills,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setRoadmaps(prev => [...prev, newRoadmap]);
    setCurrentRoadmap(newRoadmap);
    return newRoadmap;
  };

  const saveRoadmap = (roadmap: Roadmap) => {
    setRoadmaps(prev => {
      const index = prev.findIndex(r => r.id === roadmap.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...roadmap,
          updatedAt: new Date().toISOString()
        };
        return updated;
      }
      return [...prev, {
        ...roadmap,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    });
    setCurrentRoadmap(roadmap);
  };

  const getRoadmap = (id: string) => {
    return roadmaps.find(roadmap => roadmap.id === id);
  };

  const updateSkillProgress = (roadmapId: string, skillId: string, progress: SkillProgress) => {
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
            updatedAt: new Date().toISOString()
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
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const deleteRoadmap = (id: string) => {
    setRoadmaps(prev => prev.filter(roadmap => roadmap.id !== id));
    if (currentRoadmap?.id === id) {
      setCurrentRoadmap(null);
    }
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
        deleteRoadmap
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