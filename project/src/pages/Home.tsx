import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Map, Briefcase, BarChart2, Share2, Search, Plus, Filter } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import RoadmapCard from '../components/RoadmapCard';
import { Skill } from '../types';

const Home = () => {
  const { roadmaps } = useRoadmap();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const animationClasses = isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8';
  
  // Get all unique skills across all roadmaps
  const allSkills = roadmaps.reduce((skills: Set<string>, roadmap) => {
    roadmap.skills.forEach(skill => skills.add(skill.name));
    return skills;
  }, new Set<string>());
  
  // Filter roadmaps based on search query and skill filter
  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = 
      roadmap.goal.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.goal.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = !skillFilter || 
      roadmap.skills.some(skill => skill.name === skillFilter);
    
    return matchesSearch && matchesSkill;
  });
  
  return (
    <div className="pt-16">
      {roadmaps.length > 0 ? (
        <>
          {/* Search and Filter Section */}
          <div className={`transition-all duration-700 ease-out ${animationClasses} mb-8`}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-auto flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search roadmaps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Skills</option>
                  {Array.from(allSkills).sort().map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                
                <Link
                  to="/builder"
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Create New
                </Link>
              </div>
            </div>
          </div>
          
          {/* Roadmaps Grid */}
          <div className={`transition-all duration-700 delay-200 ease-out ${animationClasses}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map(roadmap => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
              ))}
            </div>
            
            {filteredRoadmaps.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No roadmaps match your search criteria
                </p>
                <Link
                  to="/builder"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Create New Roadmap
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        // Empty State
        <div className={`transition-all duration-700 ease-out ${animationClasses}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Build Your Perfect <span className="text-blue-600 dark:text-blue-400">Skill Roadmap</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Create customized learning paths tailored to your career goals. 
              Discover the skills you need, track your progress, and find the best resources.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/builder" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Create Your First Roadmap
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Features Section */}
          <section className="py-16 mt-16 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                Unlock Your Learning Potential
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    Career-Focused Paths
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Define your professional goals and get a tailored roadmap of skills needed to succeed in your chosen field.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    Track Your Progress
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Monitor your learning journey with visual progress indicators and mark skills as you master them.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    Curated Resources
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Discover the best YouTube tutorials and learning materials for each skill, filtered by difficulty and relevance.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
