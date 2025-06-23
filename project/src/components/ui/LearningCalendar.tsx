import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Flame, Trophy, Target } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

interface CalendarDay {
  date: Date;
  hasActivity: boolean;
  streakDay: boolean;
  completedGoal: boolean;
  minutesLearned: number;
  videosWatched: number;
  tokensEarned: number;
  achievements: string[];
}

interface LearningCalendarProps {
  data: CalendarDay[];
  currentStreak: number;
  longestStreak: number;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export const LearningCalendar: React.FC<LearningCalendarProps> = ({
  data,
  currentStreak,
  longestStreak,
  onDateSelect,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getCalendarData = (date: Date): CalendarDay | null => {
    return data.find(d => 
      d.date.toDateString() === date.toDateString()
    ) || null;
  };

  const getIntensityColor = (minutesLearned: number) => {
    if (minutesLearned === 0) return 'bg-gray-100';
    if (minutesLearned < 15) return 'bg-green-200';
    if (minutesLearned < 30) return 'bg-green-300';
    if (minutesLearned < 60) return 'bg-green-400';
    return 'bg-green-500';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">{currentStreak}</span>
          </div>
          <p className="text-sm text-gray-600">Current Streak</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">{longestStreak}</span>
          </div>
          <p className="text-sm text-gray-600">Longest Streak</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900">
              {data.filter(d => d.completedGoal).length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Goals Met</p>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="aspect-square" />;
            }

            const dayData = getCalendarData(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            const intensityColor = dayData ? getIntensityColor(dayData.minutesLearned) : 'bg-gray-100';

            return (
              <motion.div
                key={day.toDateString()}
                className="aspect-square relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.button
                  className={`
                    w-full h-full rounded-lg border-2 transition-all duration-200 relative
                    ${intensityColor}
                    ${isToday ? 'border-purple-500' : 'border-transparent'}
                    ${isSelected ? 'ring-2 ring-purple-500' : ''}
                    ${dayData?.hasActivity ? 'hover:shadow-md' : ''}
                  `}
                  onClick={() => {
                    setSelectedDate(day);
                    onDateSelect?.(day);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <span className="text-xs font-medium text-gray-700">
                    {day.getDate()}
                  </span>
                  
                  {/* Streak Indicator */}
                  {dayData?.streakDay && (
                    <motion.div
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Flame className="w-3 h-3 text-orange-500" />
                    </motion.div>
                  )}
                  
                  {/* Achievement Indicator */}
                  {dayData?.achievements && dayData.achievements.length > 0 && (
                    <motion.div
                      className="absolute -bottom-1 -right-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Trophy className="w-3 h-3 text-yellow-500" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex space-x-1">
              {['bg-gray-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'].map((color, i) => (
                <div key={i} className={`w-3 h-3 rounded ${color}`} />
              ))}
            </div>
            <span>More</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Streak Day</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-3 h-3 text-yellow-500" />
              <span>Achievement</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {(() => {
                const dayData = getCalendarData(selectedDate);
                if (!dayData || !dayData.hasActivity) {
                  return (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No learning activity on this day</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{dayData.minutesLearned}</div>
                        <div className="text-xs text-blue-600">Minutes</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{dayData.videosWatched}</div>
                        <div className="text-xs text-green-600">Videos</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{dayData.tokensEarned}</div>
                        <div className="text-xs text-yellow-600">Tokens</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{dayData.achievements.length}</div>
                        <div className="text-xs text-purple-600">Achievements</div>
                      </div>
                    </div>

                    {dayData.achievements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Achievements Unlocked</h4>
                        <div className="flex flex-wrap gap-2">
                          {dayData.achievements.map((achievement, index) => (
                            <motion.div
                              key={achievement}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Badge variant="success" animate>
                                {achievement}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {dayData.completedGoal && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg"
                      >
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Daily goal completed!</span>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};