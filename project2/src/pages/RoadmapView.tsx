import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Trash2, Clock, CheckCircle, CircleDashed, PlayCircle, Filter, Search } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { Skill, SkillProgress, VideoResource, Roadmap } from '../types';
import SkillCard from '../components/SkillCard';
import VideoCard from '../components/VideoCard';
import ConfirmDialog from '../components/ConfirmDialog';

const RoadmapView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoadmap, updateSkillProgress, deleteRoadmap, markRoadmapAsAccessed } = useRoadmap();
  const accessedIdRef = useRef<string | null>(null);
  
  const [roadmap, setRoadmap] = useState<Roadmap | undefined>(undefined);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [progressFilter, setProgressFilter] = useState<string>('all');
  
  useEffect(() => {
    if (id) {
      const fetchedRoadmap = getRoadmap(id);
      setRoadmap(fetchedRoadmap);
      
      // Only mark as accessed if we haven't already done so for this ID
      if (accessedIdRef.current !== id) {
        markRoadmapAsAccessed(id);
        accessedIdRef.current = id;
      }
      
      if (fetchedRoadmap && !selectedSkill) {
        setSelectedSkill(fetchedRoadmap.skills[0] || null);
      }
    }
  }, [id, getRoadmap, markRoadmapAsAccessed, selectedSkill]);
  
  if (!roadmap) {
    return (
      <div className="pt-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Roadmap Not Found</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          The roadmap you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate('/builder')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Create New Roadmap
        </button>
      </div>
    );
  }
  
  const handleProgressUpdate = (skillId: string, progress: SkillProgress) => {
    if (roadmap) {
      updateSkillProgress(roadmap.id, skillId, progress);
      
      // Update local state
      setRoadmap(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          skills: prev.skills.map(skill => {
            if (skill.id === skillId) {
              return { ...skill, progress };
            }
            return skill;
          })
        };
      });
      
      if (selectedSkill && selectedSkill.id === skillId) {
        setSelectedSkill(prev => {
          if (!prev) return prev;
          return { ...prev, progress };
        });
      }
    }
  };
  
  const handleDeleteRoadmap = () => {
    if (roadmap) {
      deleteRoadmap(roadmap.id);
      navigate('/');
    }
  };
  
  const filteredSkills = roadmap.skills.filter(skill => {
    // Filter by search query
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by level
    const matchesLevel = levelFilter === 'all' || skill.level === levelFilter;
    
    // Filter by progress
    const matchesProgress = progressFilter === 'all' || skill.progress === progressFilter;
    
    return matchesSearch && matchesLevel && matchesProgress;
  });
  
  // Calculate progress stats
  const totalSkills = roadmap.skills.length;
  const masteredSkills = roadmap.skills.filter(skill => skill.progress === 'mastered').length;
  const inProgressSkills = roadmap.skills.filter(skill => skill.progress === 'in-progress').length;
  const notStartedSkills = roadmap.skills.filter(skill => skill.progress === 'not-started').length;
  
  const progressPercentage = totalSkills > 0 
    ? Math.round((masteredSkills + (inProgressSkills * 0.5)) / totalSkills * 100) 
    : 0;
  
  return (
    <div className="pt-20">
      {/* Roadmap Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {roadmap.goal.profession}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            {roadmap.goal.title}
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Share roadmap"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Export roadmap"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Delete roadmap"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall Progress</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{progressPercentage}%</p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12" viewBox="0 0 36 36">
                <circle 
                  cx="18" cy="18" r="16" 
                  fill="none" 
                  className="stroke-slate-200 dark:stroke-slate-700" 
                  strokeWidth="3" 
                />
                <circle 
                  cx="18" cy="18" r="16" 
                  fill="none" 
                  className="stroke-blue-600 dark:stroke-blue-500" 
                  strokeWidth="3" 
                  strokeDasharray={100}
                  strokeDashoffset={100 - progressPercentage}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Mastered</h3>
          <div className="flex items-center mt-1">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{masteredSkills}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 ml-2">skills</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</h3>
          <div className="flex items-center mt-1">
            <PlayCircle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{inProgressSkills}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 ml-2">skills</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Not Started</h3>
          <div className="flex items-center mt-1">
            <CircleDashed className="h-5 w-5 text-slate-500 mr-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{notStartedSkills}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 ml-2">skills</p>
          </div>
        </div>
      </div>
      
      {/* Roadmap Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills ({filteredSkills.length})</h2>
              
              <div className="relative">
                <button
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                  title="Filter skills"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                
                <select
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Progress</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="mastered">Mastered</option>
                </select>
              </div>
            </div>
            
            {/* Skills List */}
            <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkill?.id === skill.id}
                    onSelect={() => setSelectedSkill(skill)}
                    onProgressUpdate={handleProgressUpdate}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">No skills match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Skill Detail & Resources */}
        <div className="lg:col-span-2">
          {selectedSkill ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSkill.name}</h2>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        selectedSkill.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        selectedSkill.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        selectedSkill.level === 'advanced' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {selectedSkill.level.charAt(0).toUpperCase() + selectedSkill.level.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                      {selectedSkill.description}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleProgressUpdate(selectedSkill.id, 'not-started')}
                      className={`p-1.5 rounded-full ${
                        selectedSkill.progress === 'not-started' 
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white' 
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title="Not Started"
                    >
                      <CircleDashed className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleProgressUpdate(selectedSkill.id, 'in-progress')}
                      className={`p-1.5 rounded-full ${
                        selectedSkill.progress === 'in-progress' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200' 
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title="In Progress"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleProgressUpdate(selectedSkill.id, 'mastered')}
                      className={`p-1.5 rounded-full ${
                        selectedSkill.progress === 'mastered' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title="Mastered"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {selectedSkill.estimatedTimeToLearn && (
                  <div className="flex items-center mt-4 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Estimated time to learn: {selectedSkill.estimatedTimeToLearn}</span>
                  </div>
                )}
                
                {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Prerequisites:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSkill.prerequisites.map((prereq, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Recommended Resources
                </h3>
                
                <div className="space-y-4">
                  {selectedSkill.resources.length > 0 ? (
                    selectedSkill.resources.map((resource) => (
                      <VideoCard key={resource.id} resource={resource} />
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">
                      No resources available for this skill yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400">
                Select a skill to view details and resources
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Roadmap"
          message="Are you sure you want to delete this roadmap? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteRoadmap}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default RoadmapView;
