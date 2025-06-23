import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck,
  MoreVertical,
  Archive,
  Trash2,
  Download,
  Share2,
  Star,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';

export const MyRoadmaps: React.FC = () => {
  const { roadmaps } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');
  const [selectedRoadmaps, setSelectedRoadmaps] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredRoadmaps = roadmaps
    .filter(roadmap => {
      const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           roadmap.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'completed' && roadmap.completed) ||
                           (filterStatus === 'in-progress' && !roadmap.completed && roadmap.progress > 0);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on roadmaps:`, selectedRoadmaps);
    setSelectedRoadmaps([]);
  };

  const toggleRoadmapSelection = (roadmapId: string) => {
    setSelectedRoadmaps(prev => 
      prev.includes(roadmapId) 
        ? prev.filter(id => id !== roadmapId)
        : [...prev, roadmapId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Roadmaps</h1>
              <p className="text-lg text-gray-600">
                Manage and track your learning journey across {roadmaps.length} roadmaps
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Link to="/create-roadmap">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="progress">By Progress</option>
                  <option value="name">By Name</option>
                </select>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedRoadmaps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center justify-between"
              >
                <span className="text-purple-700 font-medium">
                  {selectedRoadmaps.length} roadmap{selectedRoadmaps.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedRoadmaps([])}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Roadmaps Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full relative group hover:shadow-lg transition-all duration-300">
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedRoadmaps.includes(roadmap.id)}
                        onChange={() => toggleRoadmapSelection(roadmap.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setShowActions(showActions === roadmap.id ? null : roadmap.id)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      <AnimatePresence>
                        {showActions === roadmap.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                          >
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Progress Ring */}
                    <div className="flex justify-center mb-4">
                      <ProgressRing progress={roadmap.progress} size={80} />
                    </div>

                    {/* Content */}
                    <div className="text-center mb-4">
                      <Link to={`/roadmap/${roadmap.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                          {roadmap.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{roadmap.description}</p>
                      
                      <div className="flex justify-center space-x-2 mb-3">
                        <Badge className={getDifficultyColor(roadmap.difficulty)}>
                          {roadmap.difficulty}
                        </Badge>
                        {roadmap.completed && (
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600 mb-4">
                      <div>
                        <div className="font-semibold text-gray-900">{roadmap.videos?.length || 0}</div>
                        <div>Videos</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{roadmap.estimated_hours}h</div>
                        <div>Duration</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(roadmap.created_at)}</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700">
                        {roadmap.is_bookmarked ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredRoadmaps.map((roadmap, index) => (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Selection */}
                      <input
                        type="checkbox"
                        checked={selectedRoadmaps.includes(roadmap.id)}
                        onChange={() => toggleRoadmapSelection(roadmap.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />

                      {/* Progress */}
                      <div className="flex-shrink-0">
                        <ProgressRing progress={roadmap.progress} size={60} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link to={`/roadmap/${roadmap.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-purple-600 transition-colors">
                              {roadmap.title}
                            </h3>
                          </Link>
                          <Badge className={getDifficultyColor(roadmap.difficulty)}>
                            {roadmap.difficulty}
                          </Badge>
                          {roadmap.completed && (
                            <Badge variant="success">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">{roadmap.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Play className="w-3 h-3" />
                            <span>{roadmap.videos?.length || 0} videos</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{roadmap.estimated_hours}h</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(roadmap.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="text-purple-600 hover:text-purple-700">
                          {roadmap.is_bookmarked ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setShowActions(showActions === roadmap.id ? null : roadmap.id)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredRoadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmaps found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first learning roadmap to get started'
              }
            </p>
            <Link to="/create-roadmap">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Roadmap
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};