import { Link } from 'react-router-dom';
import { Roadmap } from '../types';
import { ChevronRight, Clock } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const RoadmapCard = ({ roadmap }: RoadmapCardProps) => {
  // Calculate progress percentage
  const totalSkills = roadmap.skills.length;
  const masteredSkills = roadmap.skills.filter(skill => skill.progress === 'mastered').length;
  const inProgressSkills = roadmap.skills.filter(skill => skill.progress === 'in-progress').length;
  
  const progressPercentage = totalSkills > 0 
    ? Math.round((masteredSkills + (inProgressSkills * 0.5)) / totalSkills * 100) 
    : 0;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
            {roadmap.goal.profession}
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {roadmap.skills.length} skills
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {roadmap.goal.title}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Clock className="h-3 w-3 mr-1" />
          <span>Updated {formatDate(roadmap.updatedAt)}</span>
        </div>
        
        <Link 
          to={`/roadmap/${roadmap.id}`}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium"
        >
          View Roadmap
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default RoadmapCard;