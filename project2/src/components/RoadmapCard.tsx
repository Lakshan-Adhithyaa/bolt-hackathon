import { Link } from 'react-router-dom';
import { Roadmap } from '../types';
import { ChevronRight, Clock, Trash2, Edit, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import ConfirmDialog from './ConfirmDialog';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const RoadmapCard = ({ roadmap }: RoadmapCardProps) => {
  const { deleteRoadmap } = useRoadmap();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
  
  const handleDelete = () => {
    deleteRoadmap(roadmap.id);
    setShowDeleteConfirm(false);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
              {roadmap.goal.profession}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              {roadmap.goal.title}
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg py-1 z-10">
                <Link
                  to={`/roadmap/${roadmap.id}`}
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Roadmap
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Roadmap
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {roadmap.skills.slice(0, 3).map(skill => (
            <span
              key={skill.id}
              className={`text-xs px-2 py-1 rounded-full ${
                skill.progress === 'mastered'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : skill.progress === 'in-progress'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {skill.name}
            </span>
          ))}
          {roadmap.skills.length > 3 && (
            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
              +{roadmap.skills.length - 3} more
            </span>
          )}
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
      
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Roadmap"
          message="Are you sure you want to delete this roadmap? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default RoadmapCard;
