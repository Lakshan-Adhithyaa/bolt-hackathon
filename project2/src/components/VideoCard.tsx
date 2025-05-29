import { Play, ThumbsUp, Eye, Clock, ExternalLink } from 'lucide-react';
import { VideoResource } from '../types';

interface VideoCardProps {
  resource: VideoResource;
}

const VideoCard = ({ resource }: VideoCardProps) => {
  const formatNumber = (num?: number) => {
    if (num === undefined) return '';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
  };
  
  return (
    <div className="flex flex-col md:flex-row bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative md:w-48 h-36 md:h-auto flex-shrink-0">
        <img 
          src={resource.thumbnailUrl} 
          alt={resource.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-red-600 rounded-full"
          >
            <Play className="h-5 w-5 text-white" fill="white" />
          </a>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
          {resource.duration}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-slate-900 dark:text-white line-clamp-2 mb-1">
            {resource.title}
          </h4>
          
          <span className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
            resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            resource.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {resource.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          {resource.channel}
        </p>
        
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-4">
          {resource.views !== undefined && (
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{formatNumber(resource.views)} views</span>
            </div>
          )}
          
          {resource.likes !== undefined && (
            <div className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>{formatNumber(resource.likes)}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{new Date(resource.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            Watch on YouTube
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;