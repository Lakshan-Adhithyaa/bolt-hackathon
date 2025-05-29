import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Map, Briefcase, BarChart2, Share2 } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import RoadmapCard from '../components/RoadmapCard';

const Home = () => {
  const { roadmaps } = useRoadmap();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const animationClasses = isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8';
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className={`transition-all duration-700 ease-out ${animationClasses} py-16 md:py-24`}>
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
              Create Your Roadmap
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            {roadmaps.length > 0 && (
              <Link 
                to={`/roadmap/${roadmaps[roadmaps.length - 1].id}`}
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-800 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <Map className="mr-2 h-5 w-5" />
                View Latest Roadmap
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`transition-all duration-700 delay-200 ease-out ${animationClasses} py-16 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900`}>
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
      
      {/* Recent Roadmaps Section */}
      {roadmaps.length > 0 && (
        <section className={`transition-all duration-700 delay-400 ease-out ${animationClasses} py-16`}>
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-white">
              Your Roadmaps
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
              Continue where you left off or create a new learning path
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.slice(-3).reverse().map(roadmap => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
              ))}
            </div>
            
            {roadmaps.length > 3 && (
              <div className="mt-8 text-center">
                <Link 
                  to="/builder" 
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  View all roadmaps
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className={`transition-all duration-700 delay-600 ease-out ${animationClasses} py-16 bg-blue-600 dark:bg-blue-800 rounded-lg my-16`}>
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Create your personalized skill roadmap in minutes and take the first step toward achieving your goals.
          </p>
          <Link 
            to="/builder" 
            className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Create Your Roadmap Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;