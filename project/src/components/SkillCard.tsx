import { CheckCircle, PlayCircle, CircleDashed } from 'lucide-react';
import { Skill, SkillProgress } from '../types';

interface SkillCardProps {
  skill: Skill;
  isSelected: boolean;
  onSelect: () => void;
  onProgressUpdate: (skillId: string, progress: SkillProgress) => void;
}

const SkillCard = ({ skill, isSelected, onSelect, onProgressUpdate }: SkillCardProps) => {
  const handleProgressClick = (e: React.MouseEvent, progress: SkillProgress) => {
    e.stopPropagation();
    onProgressUpdate(skill.id, progress);
  };
  
  return (
    <div 
      onClick={onSelect}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400' 
          : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-l-4 border-transparent'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-white'}`}>
            {skill.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {skill.description}
          </p>
        </div>
        
        <div className="flex">
          <button 
            onClick={(e) => handleProgressClick(e, 'not-started')}
            className={`p-1 rounded-full ${
              skill.progress === 'not-started' 
                ? 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-white' 
                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title="Not Started"
          >
            <CircleDashed className="h-4 w-4" />
          </button>
          
          <button 
            onClick={(e) => handleProgressClick(e, 'in-progress')}
            className={`p-1 rounded-full ${
              skill.progress === 'in-progress' 
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' 
                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title="In Progress"
          >
            <PlayCircle className="h-4 w-4" />
          </button>
          
          <button 
            onClick={(e) => handleProgressClick(e, 'mastered')}
            className={`p-1 rounded-full ${
              skill.progress === 'mastered' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title="Mastered"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center mt-2">
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
          skill.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
          skill.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
          skill.level === 'advanced' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        }`}>
          {skill.level}
        </span>
        
        <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
          {skill.resources.length} resources
        </span>
      </div>
    </div>
  );
};

export default SkillCard;