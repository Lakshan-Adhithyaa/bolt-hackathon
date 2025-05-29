import { Goal, Skill, SkillLevel, SkillCategory, VideoResource } from '../types';

// Mock data for demonstration purposes
const generateMockVideoResources = (skillName: string, level: SkillLevel): VideoResource[] => {
  const difficultyMap: Record<SkillLevel, 'beginner' | 'intermediate' | 'advanced'> = {
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced',
    'expert': 'advanced'
  };
  
  const difficulty = difficultyMap[level];
  const now = new Date().toISOString();
  
  return [
    {
      id: `video-${Date.now()}-1`,
      title: `Complete ${skillName} Tutorial for ${level.charAt(0).toUpperCase() + level.slice(1)}s`,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      channel: 'Programming with Pro',
      duration: '45:21',
      publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      thumbnailUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
      difficulty,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 100000),
      addedAt: now
    },
    {
      id: `video-${Date.now()}-2`,
      title: `${skillName} Crash Course 2024`,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      channel: 'Tech Solutions',
      duration: '1:22:45',
      publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      thumbnailUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
      difficulty,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 100000),
      addedAt: now
    },
    {
      id: `video-${Date.now()}-3`,
      title: `Mastering ${skillName}: From Basics to Advanced`,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      channel: 'DevMastery',
      duration: '3:10:33',
      publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      thumbnailUrl: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=600',
      difficulty,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 100000),
      addedAt: now
    }
  ];
};

// Define skill templates by profession
const professionSkillTemplates: Record<string, Partial<Skill>[]> = {
  'data scientist': [
    {
      name: 'Python Programming',
      description: 'Master Python programming language and its data science libraries.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '8 weeks'
    },
    {
      name: 'Statistics and Probability',
      description: 'Learn fundamental statistical concepts and probability theory.',
      level: 'beginner',
      category: 'domain',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Data Preprocessing',
      description: 'Master data cleaning, transformation, and feature engineering.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Python Programming']
    },
    {
      name: 'Machine Learning',
      description: 'Learn supervised and unsupervised learning algorithms.',
      level: 'advanced',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '12 weeks',
      prerequisites: ['Statistics and Probability', 'Data Preprocessing']
    }
  ],
  'machine learning engineer': [
    {
      name: 'Deep Learning',
      description: 'Master neural networks and deep learning frameworks.',
      level: 'advanced',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '12 weeks'
    },
    {
      name: 'MLOps',
      description: 'Learn to deploy and maintain ML models in production.',
      level: 'advanced',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '8 weeks'
    }
  ],
  'devops engineer': [
    {
      name: 'Linux Administration',
      description: 'Master Linux system administration and shell scripting.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Docker',
      description: 'Learn containerization with Docker and container orchestration.',
      level: 'intermediate',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '4 weeks'
    },
    {
      name: 'Kubernetes',
      description: 'Master container orchestration with Kubernetes.',
      level: 'advanced',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '8 weeks',
      prerequisites: ['Docker']
    }
  ],
  'cloud engineer': [
    {
      name: 'AWS Fundamentals',
      description: 'Learn core AWS services and cloud concepts.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Infrastructure as Code',
      description: 'Master tools like Terraform for infrastructure automation.',
      level: 'intermediate',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    }
  ],
  'cybersecurity analyst': [
    {
      name: 'Network Security',
      description: 'Learn network protocols and security fundamentals.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '8 weeks'
    },
    {
      name: 'Security Tools',
      description: 'Master common security tools and penetration testing.',
      level: 'intermediate',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    }
  ],
  'game developer': [
    {
      name: 'Unity Fundamentals',
      description: 'Learn Unity game engine basics and C# programming.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '8 weeks'
    },
    {
      name: 'Game Design',
      description: 'Master principles of game design and mechanics.',
      level: 'intermediate',
      category: 'domain',
      importance: 8,
      estimatedTimeToLearn: '6 weeks'
    }
  ],
  'blockchain developer': [
    {
      name: 'Blockchain Fundamentals',
      description: 'Understand blockchain technology and cryptography basics.',
      level: 'beginner',
      category: 'domain',
      importance: 10,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Smart Contracts',
      description: 'Learn Solidity and smart contract development.',
      level: 'intermediate',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '8 weeks'
    }
  ],
  'ui/ux designer': [
    {
      name: 'Design Principles',
      description: 'Master fundamental principles of visual design.',
      level: 'beginner',
      category: 'domain',
      importance: 10,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Figma',
      description: 'Learn to create and prototype designs in Figma.',
      level: 'beginner',
      category: 'tool',
      importance: 9,
      estimatedTimeToLearn: '4 weeks'
    },
    {
      name: 'User Research',
      description: 'Master user research methods and usability testing.',
      level: 'intermediate',
      category: 'domain',
      importance: 8,
      estimatedTimeToLearn: '6 weeks'
    }
  ],
  'product manager': [
    {
      name: 'Product Strategy',
      description: 'Learn product strategy and roadmap planning.',
      level: 'intermediate',
      category: 'domain',
      importance: 10,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Agile Management',
      description: 'Master Agile methodologies and team leadership.',
      level: 'intermediate',
      category: 'domain',
      importance: 9,
      estimatedTimeToLearn: '4 weeks'
    }
  ],
  'digital marketing specialist': [
    {
      name: 'SEO Fundamentals',
      description: 'Learn search engine optimization techniques.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Social Media Marketing',
      description: 'Master social media strategy and content creation.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '4 weeks'
    },
    {
      name: 'Google Analytics',
      description: 'Learn to analyze and report on marketing metrics.',
      level: 'intermediate',
      category: 'tool',
      importance: 8,
      estimatedTimeToLearn: '4 weeks'
    }
  ],
  'content creator': [
    {
      name: 'Video Production',
      description: 'Learn video filming and editing techniques.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '8 weeks'
    },
    {
      name: 'Content Strategy',
      description: 'Master content planning and audience engagement.',
      level: 'intermediate',
      category: 'domain',
      importance: 9,
      estimatedTimeToLearn: '4 weeks'
    }
  ],
  'business analyst': [
    {
      name: 'Business Analysis',
      description: 'Learn requirements gathering and analysis techniques.',
      level: 'beginner',
      category: 'domain',
      importance: 10,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'SQL',
      description: 'Master database querying and data analysis.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Data Visualization',
      description: 'Learn to create effective data visualizations.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['SQL']
    }
  ]
};

// Generic skills that apply to all tech roles
const genericTechSkills: Partial<Skill>[] = [
  {
    name: 'Project Management',
    description: 'Learn to manage projects effectively using modern methodologies.',
    level: 'intermediate',
    category: 'soft',
    importance: 8,
    estimatedTimeToLearn: '4 weeks'
  },
  {
    name: 'Communication Skills',
    description: 'Develop effective written and verbal communication.',
    level: 'beginner',
    category: 'soft',
    importance: 9,
    estimatedTimeToLearn: '4 weeks'
  },
  {
    name: 'Problem Solving',
    description: 'Master analytical thinking and problem-solving techniques.',
    level: 'intermediate',
    category: 'soft',
    importance: 9,
    estimatedTimeToLearn: '6 weeks'
  }
];

// Find the best matching profession template
const findProfessionTemplate = (profession: string): Partial<Skill>[] => {
  const lowerProfession = profession.toLowerCase();
  
  // Try to find an exact match
  if (professionSkillTemplates[lowerProfession]) {
    return [...professionSkillTemplates[lowerProfession], ...genericTechSkills];
  }
  
  // Try to find a partial match
  for (const key in professionSkillTemplates) {
    if (lowerProfession.includes(key) || key.includes(lowerProfession)) {
      return [...professionSkillTemplates[key], ...genericTechSkills];
    }
  }
  
  // Return generic skills if no match found
  return genericTechSkills;
};

export const generateSkillRoadmap = (goal: Goal): Skill[] => {
  const skillTemplates = findProfessionTemplate(goal.profession);
  const now = new Date().toISOString();
  
  // Calculate target completion month for each skill based on goal deadline
  const totalSkills = skillTemplates.length;
  const monthsPerSkill = goal.deadline / totalSkills;
  
  // Create skills with unique IDs, progress status, and target months
  return skillTemplates.map((template, index) => {
    const skillId = `skill-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const targetMonth = Math.ceil((index + 1) * monthsPerSkill);
    
    return {
      id: skillId,
      name: template.name || 'Unnamed Skill',
      description: template.description || 'No description provided',
      level: template.level || 'beginner',
      category: template.category || 'technical',
      progress: 'not-started',
      importance: template.importance || 5,
      prerequisites: template.prerequisites,
      estimatedTimeToLearn: template.estimatedTimeToLearn,
      resources: generateMockVideoResources(template.name || 'Skill', template.level || 'beginner'),
      targetCompletionMonth: targetMonth,
      order: index
    };
  });
};