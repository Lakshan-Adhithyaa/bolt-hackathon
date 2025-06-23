import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Bookmark,
  BookmarkCheck,
  Settings,
  Captions,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { Video, VideoBookmark } from '../../types';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

interface VideoPlayerProps {
  video: Video;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onBookmark?: (timestamp: number, note: string) => void;
  onRate?: (rating: number) => void;
  autoplay?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onProgress,
  onComplete,
  onBookmark,
  onRate,
  autoplay = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBookmarkAdd = () => {
    if (bookmarkNote.trim()) {
      onBookmark?.(currentTime, bookmarkNote);
      setBookmarkNote('');
      setShowBookmarkDialog(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
      <Card className="overflow-hidden">
        {/* Video Container */}
        <div
          ref={containerRef}
          className="relative aspect-video bg-black"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full"
            poster={video.thumbnail}
            autoPlay={autoplay}
            onClick={togglePlay}
          >
            <source src={video.url} type="video/mp4" />
            {video.subtitleLanguages.map(lang => (
              <track
                key={lang}
                kind="subtitles"
                src={`${video.url}/subtitles/${lang}.vtt`}
                srcLang={lang}
                label={lang}
              />
            ))}
          </video>

          {/* Play/Pause Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                onClick={togglePlay}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
              >
                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-black bg-opacity-50 text-white">
                      {video.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-black bg-opacity-50 text-white">
                      {formatTime(duration)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                      onClick={() => setShowBookmarkDialog(true)}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <div className="w-full h-1 bg-white bg-opacity-30 rounded-full">
                        <motion.div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
                      />
                    </div>
                    
                    {/* Bookmarks */}
                    {video.bookmarks.map((bookmark) => (
                      <motion.div
                        key={bookmark.id}
                        className="absolute top-0 w-2 h-2 bg-yellow-400 rounded-full transform -translate-y-1/2 cursor-pointer"
                        style={{ left: `${(bookmark.timestamp / duration) * 100}%` }}
                        whileHover={{ scale: 1.5 }}
                        onClick={() => handleSeek(bookmark.timestamp)}
                        title={bookmark.note}
                      />
                    ))}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </motion.button>

                      <button
                        onClick={() => skip(-10)}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => skip(10)}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-purple-400 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-20 h-1 bg-white bg-opacity-30 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowCaptions(!showCaptions)}
                        className={`text-white hover:text-purple-400 transition-colors ${
                          showCaptions ? 'text-purple-400' : ''
                        }`}
                      >
                        <Captions className="w-5 h-5" />
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="absolute top-4 right-4 bg-black bg-opacity-90 rounded-lg p-4 text-white"
              >
                <h3 className="font-semibold mb-3">Playback Speed</h3>
                <div className="space-y-2">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 ${
                        playbackRate === rate ? 'bg-purple-600' : ''
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="mt-3 text-sm text-gray-300 hover:text-white"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span>{video.channel}</span>
                <span>•</span>
                <span>{video.viewCount.toLocaleString()} views</span>
                <span>•</span>
                <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {video.likeCount.toLocaleString()}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{video.description}</p>

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {video.topics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>

          {/* Bookmarks */}
          {video.bookmarks.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Your Bookmarks</h3>
              <div className="space-y-2">
                {video.bookmarks.map((bookmark) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSeek(bookmark.timestamp)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {formatTime(bookmark.timestamp)}
                      </button>
                      <span className="text-gray-700">{bookmark.note}</span>
                    </div>
                    <BookmarkCheck className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bookmark Dialog */}
      <AnimatePresence>
        {showBookmarkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookmarkDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Bookmark at {formatTime(currentTime)}
              </h3>
              <textarea
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="Add a note for this bookmark..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowBookmarkDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBookmarkAdd}>
                  Add Bookmark
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};