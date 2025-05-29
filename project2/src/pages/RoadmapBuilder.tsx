import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Target, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { Goal } from '../types';

const RoadmapBuilder = () => {
  const navigate = useNavigate();
  const { createRoadmap, roadmaps } = useRoadmap();
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<Goal>({
    title: '',
    profession: '',
    shortTermGoals: '',
    longTermGoals: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    profession: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = () => {
    let valid = true;
    const newErrors = { title: '', profession: '' };

    if (currentStep === 1) {
      if (!goal.title.trim()) {
        newErrors.title = 'Goal title is required';
        valid = false;
      }
      
      if (!goal.profession.trim()) {
        newErrors.profession = 'Profession is required';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGoal(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep()) {
      setIsSubmitting(true);
      
      try {
        // Create the roadmap
        const newRoadmap = createRoadmap(goal);
        
        // Navigate to the roadmap view
        navigate(`/roadmap/${newRoadmap.id}`);
      } catch (error) {
        console.error('Error creating roadmap:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Create Your Skill Roadmap
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Let's build a personalized learning path to help you achieve your goals
        </p>
      </div>
      
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xs mt-2 text-slate-600 dark:text-slate-400">Career Goal</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs mt-2 text-slate-600 dark:text-slate-400">Specific Goals</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xs mt-2 text-slate-600 dark:text-slate-400">Create Roadmap</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Career Goal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Define Your Career Goal
              </h2>
              
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Profession *
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={goal.profession}
                  onChange={handleChange}
                  placeholder="e.g., Data Scientist, Web Developer, Digital Marketer"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.profession 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                />
                {errors.profession && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profession}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={goal.title}
                  onChange={handleChange}
                  placeholder="e.g., Become a Full-Stack Developer in 6 months"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.title 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                  } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  Next Step
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Specific Goals */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Define Your Specific Goals
              </h2>
              
              <div>
                <label htmlFor="shortTermGoals" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Short-Term Goals (3-6 months)
                </label>
                <textarea
                  id="shortTermGoals"
                  name="shortTermGoals"
                  value={goal.shortTermGoals}
                  onChange={handleChange}
                  placeholder="e.g., Learn React basics, Build a portfolio website"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="longTermGoals" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Long-Term Goals (1-2 years)
                </label>
                <textarea
                  id="longTermGoals"
                  name="longTermGoals"
                  value={goal.longTermGoals}
                  onChange={handleChange}
                  placeholder="e.g., Become proficient in full-stack development, Get a junior developer position"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  Next Step
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Create Roadmap */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Review & Create Your Roadmap
              </h2>
              
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Roadmap Summary
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Profession:</span>
                    <p className="text-slate-900 dark:text-white">{goal.profession}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Goal:</span>
                    <p className="text-slate-900 dark:text-white">{goal.title}</p>
                  </div>
                  
                  {goal.shortTermGoals && (
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Short-Term Goals:</span>
                      <p className="text-slate-900 dark:text-white">{goal.shortTermGoals}</p>
                    </div>
                  )}
                  
                  {goal.longTermGoals && (
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Long-Term Goals:</span>
                      <p className="text-slate-900 dark:text-white">{goal.longTermGoals}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  We'll generate a personalized skill roadmap based on your goals. You'll be able to track your progress, find resources, and update your roadmap as you learn.
                </p>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Roadmap
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {roadmaps.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Already have a roadmap?{' '}
            <button 
              onClick={() => navigate(`/roadmap/${roadmaps[roadmaps.length - 1].id}`)}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              View your latest roadmap
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default RoadmapBuilder;