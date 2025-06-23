import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, Play, Star, Clock, Users } from 'lucide-react';
import { SkillTreeNode } from '../../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

interface SkillTreeProps {
  nodes: SkillTreeNode[];
  onNodeSelect: (node: SkillTreeNode) => void;
  selectedNode?: SkillTreeNode;
  className?: string;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  nodes,
  onNodeSelect,
  selectedNode,
  className = '',
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 800 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nodes.length > 0) {
      const maxX = Math.max(...nodes.map(n => n.position.x));
      const maxY = Math.max(...nodes.map(n => n.position.y));
      setViewBox({ x: -50, y: -50, width: maxX + 200, height: maxY + 200 });
    }
  }, [nodes]);

  const getConnectionPath = (from: SkillTreeNode, to: SkillTreeNode) => {
    const dx = to.position.x - from.position.x;
    const dy = to.position.y - from.position.y;
    const midX = from.position.x + dx / 2;
    const midY = from.position.y + dy / 4;

    return `M ${from.position.x} ${from.position.y} 
            Q ${midX} ${midY} ${to.position.x} ${to.position.y}`;
  };

  const getNodeStatus = (node: SkillTreeNode) => {
    if (node.isCompleted) return 'completed';
    if (node.isUnlocked) return 'unlocked';
    return 'locked';
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'unlocked': return '#a855f7';
      case 'locked': return '#9ca3af';
      default: return '#9ca3af';
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-auto ${className}`}>
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full min-h-[600px]"
      >
        {/* Connection Lines */}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {nodes.map(node => 
          node.children.map(childId => {
            const childNode = nodes.find(n => n.id === childId);
            if (!childNode) return null;

            const isActive = node.isCompleted && childNode.isUnlocked;
            
            return (
              <motion.path
                key={`${node.id}-${childId}`}
                d={getConnectionPath(node, childNode)}
                stroke={isActive ? "url(#connectionGradient)" : "#e5e7eb"}
                strokeWidth="3"
                fill="none"
                strokeDasharray={isActive ? "0" : "5,5"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  stroke: isActive ? "url(#connectionGradient)" : "#e5e7eb"
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            );
          })
        )}

        {/* Skill Nodes */}
        {nodes.map((node, index) => {
          const status = getNodeStatus(node);
          const color = getNodeColor(status);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode?.id === node.id;

          return (
            <g key={node.id}>
              {/* Node Glow Effect */}
              {(isHovered || isSelected) && (
                <motion.circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r="35"
                  fill={color}
                  opacity="0.2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              )}

              {/* Main Node Circle */}
              <motion.circle
                cx={node.position.x}
                cy={node.position.y}
                r="25"
                fill={color}
                stroke="#ffffff"
                strokeWidth="3"
                style={{ cursor: node.isUnlocked ? 'pointer' : 'not-allowed' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={node.isUnlocked ? { 
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                } : {}}
                whileTap={node.isUnlocked ? { scale: 0.95 } : {}}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => node.isUnlocked && onNodeSelect(node)}
              />

              {/* Node Icon */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                {status === 'completed' ? (
                  <CheckCircle 
                    x={node.position.x - 8} 
                    y={node.position.y - 8} 
                    width="16" 
                    height="16" 
                    color="white"
                  />
                ) : status === 'locked' ? (
                  <Lock 
                    x={node.position.x - 8} 
                    y={node.position.y - 8} 
                    width="16" 
                    height="16" 
                    color="white"
                  />
                ) : (
                  <Play 
                    x={node.position.x - 8} 
                    y={node.position.y - 8} 
                    width="16" 
                    height="16" 
                    color="white"
                  />
                )}
              </motion.g>

              {/* Progress Ring */}
              {node.progress > 0 && node.progress < 100 && (
                <motion.circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r="30"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeDasharray={`${(node.progress / 100) * 188.5} 188.5`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${node.position.x} ${node.position.y})`}
                  initial={{ strokeDasharray: "0 188.5" }}
                  animate={{ strokeDasharray: `${(node.progress / 100) * 188.5} 188.5` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              )}

              {/* Node Label */}
              <motion.text
                x={node.position.x}
                y={node.position.y + 45}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
              >
                {node.name}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Node Details Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute top-4 right-4 z-10"
          >
            <Card className="p-4 max-w-xs">
              {(() => {
                const node = nodes.find(n => n.id === hoveredNode);
                if (!node) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{node.name}</h3>
                      <Badge variant={node.isCompleted ? 'success' : node.isUnlocked ? 'primary' : 'secondary'}>
                        {node.isCompleted ? 'Completed' : node.isUnlocked ? 'Available' : 'Locked'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{node.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{node.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{node.difficulty}</span>
                      </div>
                    </div>
                    {node.progress > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{node.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <motion.div
                            className="bg-purple-600 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${node.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl border-l border-gray-200 p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedNode.name}</h2>
                <p className="text-gray-600">{selectedNode.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{selectedNode.estimatedHours}h</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900 capitalize">{selectedNode.difficulty}</div>
                  <div className="text-xs text-gray-500">Level</div>
                </div>
              </div>

              {selectedNode.prerequisites.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
                  <div className="space-y-2">
                    {selectedNode.prerequisites.map(prereqId => {
                      const prereq = nodes.find(n => n.id === prereqId);
                      return prereq ? (
                        <div key={prereqId} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${prereq.isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className={prereq.isCompleted ? 'text-gray-900' : 'text-gray-500'}>
                            {prereq.name}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedNode.isUnlocked && (
                <Button 
                  className="w-full"
                  onClick={() => {
                    // Handle start learning
                  }}
                >
                  {selectedNode.isCompleted ? 'Review' : selectedNode.progress > 0 ? 'Continue' : 'Start Learning'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};