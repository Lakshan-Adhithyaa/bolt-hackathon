import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, X, Brain, Clock, Star, TrendingUp } from 'lucide-react';
import { Flashcard } from '../../types';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

interface FlashcardSystemProps {
  flashcards: Flashcard[];
  onAnswer: (cardId: string, quality: number) => void;
  onComplete?: () => void;
  className?: string;
}

export const FlashcardSystem: React.FC<FlashcardSystemProps> = ({
  flashcards,
  onAnswer,
  onComplete,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    startTime: new Date(),
  });

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  useEffect(() => {
    setSessionStats(prev => ({ ...prev, total: flashcards.length }));
  }, [flashcards.length]);

  const handleAnswer = (quality: number) => {
    if (!currentCard) return;

    onAnswer(currentCard.id, quality);
    
    setSessionStats(prev => ({
      ...prev,
      correct: quality >= 3 ? prev.correct + 1 : prev.correct,
      incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
    }));

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete?.();
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 2) return 'text-green-600 bg-green-100';
    if (difficulty < 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 2) return 'Easy';
    if (difficulty < 4) return 'Medium';
    return 'Hard';
  };

  const getNextReviewText = (nextReview: Date) => {
    const now = new Date();
    const diff = nextReview.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return 'Due now';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  if (!currentCard) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No flashcards available</h3>
        <p className="text-gray-600">Create some flashcards to start studying!</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">{sessionStats.correct}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5 text-red-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">{sessionStats.incorrect}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-gray-900">
                {Math.floor((new Date().getTime() - sessionStats.startTime.getTime()) / 60000)}m
              </div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <motion.div
            className="relative h-96 perspective-1000"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="relative w-full h-full preserve-3d cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front of card */}
              <Card className="absolute inset-0 backface-hidden p-8 flex flex-col justify-center items-center text-center">
                <div className="mb-4">
                  <Badge className={getDifficultyColor(currentCard.difficulty)}>
                    {getDifficultyLabel(currentCard.difficulty)}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentCard.front}
                </h2>
                
                <div className="mt-auto">
                  <p className="text-sm text-gray-500 mb-2">
                    Card {currentIndex + 1} of {flashcards.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getNextReviewText(currentCard.nextReview)}
                  </p>
                </div>
                
                <motion.div
                  className="absolute bottom-4 right-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                </motion.div>
              </Card>

              {/* Back of card */}
              <Card className="absolute inset-0 backface-hidden p-8 flex flex-col justify-center items-center text-center rotate-y-180">
                <div className="mb-4">
                  <Badge variant="success">Answer</Badge>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl text-gray-900 leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
                
                {currentCard.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentCard.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>

          {/* Answer Buttons */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                <Button
                  variant="danger"
                  onClick={() => handleAnswer(1)}
                  className="flex flex-col items-center py-4"
                >
                  <X className="w-5 h-5 mb-1" />
                  <span className="text-sm">Again</span>
                  <span className="text-xs opacity-75">&lt;1m</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleAnswer(2)}
                  className="flex flex-col items-center py-4 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span className="text-sm">Hard</span>
                  <span className="text-xs opacity-75">6m</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleAnswer(3)}
                  className="flex flex-col items-center py-4 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Check className="w-5 h-5 mb-1" />
                  <span className="text-sm">Good</span>
                  <span className="text-xs opacity-75">1d</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleAnswer(4)}
                  className="flex flex-col items-center py-4 border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Star className="w-5 h-5 mb-1" />
                  <span className="text-sm">Easy</span>
                  <span className="text-xs opacity-75">4d</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint */}
          {!isFlipped && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-4"
            >
              Click the card to reveal the answer
            </motion.p>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <kbd className="px-2 py-1 bg-white rounded border">Space</kbd>
            <span className="ml-2">Flip card</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white rounded border">1</kbd>
            <span className="ml-2">Again</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white rounded border">2</kbd>
            <span className="ml-2">Hard</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white rounded border">3</kbd>
            <span className="ml-2">Good</span>
          </div>
        </div>
      </Card>
    </div>
  );
};