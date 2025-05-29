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
      likes: Math.floor(Math.random() * 100000)
    },
    {
      id: `video-${Date.now()}-2`,
      title: `${skillName} Crash Course 2023`,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      channel: 'Tech Solutions',
      duration: '1:22:45',
      publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      thumbnailUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
      difficulty,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 100000)
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
      likes: Math.floor(Math.random() * 100000)
    }
  ];
};

// Define skill templates by profession
const professionSkillTemplates: Record<string, Partial<Skill>[]> = {
  'web developer': [
    {
      name: 'HTML Fundamentals',
      description: 'Learn the basics of HTML, including document structure, elements, attributes, and semantic markup.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '2 weeks'
    },
    {
      name: 'CSS Styling',
      description: 'Master CSS for styling web pages, including selectors, properties, layouts, and responsive design.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['HTML Fundamentals']
    },
    {
      name: 'JavaScript Basics',
      description: 'Learn JavaScript fundamentals including variables, data types, functions, and control flow.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['HTML Fundamentals', 'CSS Styling']
    },
    {
      name: 'DOM Manipulation',
      description: 'Learn to interact with and modify the Document Object Model using JavaScript.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['JavaScript Basics']
    },
    {
      name: 'Responsive Web Design',
      description: 'Create websites that work across different screen sizes and devices using media queries and flexible layouts.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['CSS Styling']
    },
    {
      name: 'CSS Frameworks',
      description: 'Learn popular CSS frameworks like Bootstrap or Tailwind CSS to streamline development.',
      level: 'intermediate',
      category: 'tool',
      importance: 7,
      estimatedTimeToLearn: '2 weeks',
      prerequisites: ['CSS Styling', 'Responsive Web Design']
    },
    {
      name: 'JavaScript ES6+',
      description: 'Master modern JavaScript features like arrow functions, destructuring, modules, and promises.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['JavaScript Basics']
    },
    {
      name: 'Git Version Control',
      description: 'Learn to use Git for tracking changes, collaborating, and managing code versions.',
      level: 'beginner',
      category: 'tool',
      importance: 8,
      estimatedTimeToLearn: '2 weeks'
    },
    {
      name: 'React Fundamentals',
      description: 'Learn the basics of React, including components, props, state, and lifecycle methods.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['JavaScript ES6+', 'DOM Manipulation']
    },
    {
      name: 'API Integration',
      description: 'Learn to interact with APIs, fetch data, and handle responses in web applications.',
      level: 'intermediate',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['JavaScript ES6+']
    },
    {
      name: 'Web Accessibility',
      description: 'Learn principles and techniques for creating accessible websites for users with disabilities.',
      level: 'intermediate',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '2 weeks',
      prerequisites: ['HTML Fundamentals', 'CSS Styling']
    },
    {
      name: 'Testing Web Applications',
      description: 'Learn testing methodologies and frameworks for ensuring quality web applications.',
      level: 'advanced',
      category: 'technical',
      importance: 6,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['React Fundamentals']
    },
    {
      name: 'Web Performance Optimization',
      description: 'Techniques for improving website speed, load times, and overall performance.',
      level: 'advanced',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['JavaScript ES6+', 'CSS Styling']
    }
  ],
  'data scientist': [
    {
      name: 'Python Programming',
      description: 'Learn Python programming fundamentals, a must-have language for data science.',
      level: 'beginner',
      category: 'technical',
      importance: 10,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Mathematics for Data Science',
      description: 'Understand the essential mathematical concepts including statistics, linear algebra, and calculus.',
      level: 'beginner',
      category: 'domain',
      importance: 9,
      estimatedTimeToLearn: '8 weeks'
    },
    {
      name: 'Data Cleaning and Preprocessing',
      description: 'Learn techniques for handling missing data, outliers, and preparing datasets for analysis.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Python Programming']
    },
    {
      name: 'Exploratory Data Analysis',
      description: 'Master techniques for initial data investigations to discover patterns and anomalies.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '5 weeks',
      prerequisites: ['Data Cleaning and Preprocessing', 'Mathematics for Data Science']
    },
    {
      name: 'Data Visualization',
      description: 'Learn to create effective visual representations of data using libraries like Matplotlib and Seaborn.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Python Programming', 'Exploratory Data Analysis']
    },
    {
      name: 'Machine Learning Fundamentals',
      description: 'Understand core ML concepts, algorithms, and the machine learning workflow.',
      level: 'intermediate',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '8 weeks',
      prerequisites: ['Mathematics for Data Science', 'Data Cleaning and Preprocessing']
    },
    {
      name: 'SQL for Data Science',
      description: 'Learn SQL for data extraction, manipulation, and analysis from databases.',
      level: 'beginner',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '4 weeks'
    },
    {
      name: 'Deep Learning Basics',
      description: 'Introduction to neural networks, deep learning frameworks, and applications.',
      level: 'advanced',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '8 weeks',
      prerequisites: ['Machine Learning Fundamentals']
    },
    {
      name: 'Natural Language Processing',
      description: 'Learn techniques for processing and analyzing text data using machine learning.',
      level: 'advanced',
      category: 'technical',
      importance: 6,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Machine Learning Fundamentals', 'Deep Learning Basics']
    },
    {
      name: 'Big Data Technologies',
      description: 'Introduction to tools and frameworks for processing large-scale datasets.',
      level: 'advanced',
      category: 'tool',
      importance: 6,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Python Programming', 'SQL for Data Science']
    },
    {
      name: 'Data Science Project Management',
      description: 'Learn to plan, execute, and deliver data science projects effectively.',
      level: 'intermediate',
      category: 'soft',
      importance: 7,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['Exploratory Data Analysis', 'Machine Learning Fundamentals']
    },
    {
      name: 'Ethics in Data Science',
      description: 'Understand ethical considerations, biases, and responsible AI practices.',
      level: 'intermediate',
      category: 'domain',
      importance: 8,
      estimatedTimeToLearn: '2 weeks',
      prerequisites: ['Machine Learning Fundamentals']
    }
  ],
  'digital marketer': [
    {
      name: 'Marketing Fundamentals',
      description: 'Understand core marketing principles, customer behavior, and marketing strategies.',
      level: 'beginner',
      category: 'domain',
      importance: 10,
      estimatedTimeToLearn: '4 weeks'
    },
    {
      name: 'Content Marketing',
      description: 'Learn to create valuable content that attracts and engages target audiences.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '5 weeks'
    },
    {
      name: 'Social Media Marketing',
      description: 'Master strategies for effective marketing across different social media platforms.',
      level: 'beginner',
      category: 'technical',
      importance: 9,
      estimatedTimeToLearn: '5 weeks',
      prerequisites: ['Marketing Fundamentals']
    },
    {
      name: 'SEO Fundamentals',
      description: 'Learn search engine optimization techniques to improve website visibility in search results.',
      level: 'beginner',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Email Marketing',
      description: 'Learn to create effective email campaigns, automation, and list management.',
      level: 'intermediate',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['Content Marketing']
    },
    {
      name: 'Digital Analytics',
      description: 'Learn to measure, analyze, and report on marketing performance using tools like Google Analytics.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Marketing Fundamentals']
    },
    {
      name: 'Paid Advertising',
      description: 'Master paid advertising strategies across platforms like Google Ads and social media.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Marketing Fundamentals', 'Digital Analytics']
    },
    {
      name: 'Conversion Rate Optimization',
      description: 'Learn techniques to improve website and landing page conversion rates.',
      level: 'advanced',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Digital Analytics', 'SEO Fundamentals']
    },
    {
      name: 'Marketing Automation',
      description: 'Master tools and strategies for automating marketing workflows and processes.',
      level: 'advanced',
      category: 'tool',
      importance: 7,
      estimatedTimeToLearn: '5 weeks',
      prerequisites: ['Email Marketing', 'Digital Analytics']
    },
    {
      name: 'Video Marketing',
      description: 'Learn to create and optimize video content for marketing purposes.',
      level: 'intermediate',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Content Marketing']
    },
    {
      name: 'Influencer Marketing',
      description: 'Understand how to work with influencers to promote brands and products.',
      level: 'intermediate',
      category: 'technical',
      importance: 6,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['Social Media Marketing']
    },
    {
      name: 'Marketing Strategy',
      description: 'Learn to develop comprehensive digital marketing strategies aligned with business goals.',
      level: 'advanced',
      category: 'domain',
      importance: 9,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Marketing Fundamentals', 'Digital Analytics', 'Paid Advertising']
    }
  ],
  'graphic designer': [
    {
      name: 'Design Principles',
      description: 'Understand core design principles including color theory, typography, composition, and visual hierarchy.',
      level: 'beginner',
      category: 'domain',
      importance: 10,
      estimatedTimeToLearn: '5 weeks'
    },
    {
      name: 'Adobe Photoshop',
      description: 'Learn to use Photoshop for image editing, manipulation, and digital compositions.',
      level: 'beginner',
      category: 'tool',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Adobe Illustrator',
      description: 'Master vector graphics creation and editing for logos, illustrations, and typography.',
      level: 'beginner',
      category: 'tool',
      importance: 9,
      estimatedTimeToLearn: '6 weeks'
    },
    {
      name: 'Typography',
      description: 'Learn the art and technique of arranging type for effective communication.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Design Principles']
    },
    {
      name: 'Logo Design',
      description: 'Learn to create memorable, distinctive logos that effectively represent brands.',
      level: 'intermediate',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '5 weeks',
      prerequisites: ['Adobe Illustrator', 'Design Principles']
    },
    {
      name: 'UI/UX Design Basics',
      description: 'Understand the fundamentals of designing user interfaces and experiences.',
      level: 'intermediate',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Design Principles']
    },
    {
      name: 'Adobe InDesign',
      description: 'Learn to create print layouts, publications, and multi-page documents.',
      level: 'intermediate',
      category: 'tool',
      importance: 7,
      estimatedTimeToLearn: '5 weeks',
      prerequisites: ['Typography']
    },
    {
      name: 'Print Design',
      description: 'Master techniques for creating effective designs for physical print media.',
      level: 'intermediate',
      category: 'technical',
      importance: 6,
      estimatedTimeToLearn: '4 weeks',
      prerequisites: ['Adobe InDesign', 'Adobe Illustrator']
    },
    {
      name: 'Digital Illustration',
      description: 'Develop skills for creating original illustrations and artwork.',
      level: 'advanced',
      category: 'technical',
      importance: 7,
      estimatedTimeToLearn: '8 weeks',
      prerequisites: ['Adobe Illustrator', 'Adobe Photoshop']
    },
    {
      name: 'Motion Graphics',
      description: 'Learn to create animated graphics and visual effects for digital media.',
      level: 'advanced',
      category: 'technical',
      importance: 6,
      estimatedTimeToLearn: '8 weeks',
      prerequisites: ['Adobe Photoshop', 'Adobe Illustrator']
    },
    {
      name: 'Brand Identity Design',
      description: 'Learn to develop comprehensive visual branding systems for organizations.',
      level: 'advanced',
      category: 'technical',
      importance: 8,
      estimatedTimeToLearn: '6 weeks',
      prerequisites: ['Logo Design', 'Typography']
    },
    {
      name: 'Design Portfolio Development',
      description: 'Learn to curate and present your design work effectively to potential clients or employers.',
      level: 'intermediate',
      category: 'soft',
      importance: 9,
      estimatedTimeToLearn: '3 weeks',
      prerequisites: ['Design Principles']
    }
  ]
};

// Generic skills for when profession is not recognized
const genericSkills: Partial<Skill>[] = [
  {
    name: 'Time Management',
    description: 'Learn effective techniques for managing your time, setting priorities, and improving productivity.',
    level: 'beginner',
    category: 'soft',
    importance: 9,
    estimatedTimeToLearn: '3 weeks'
  },
  {
    name: 'Communication Skills',
    description: 'Develop clear and effective verbal and written communication for professional success.',
    level: 'beginner',
    category: 'soft',
    importance: 10,
    estimatedTimeToLearn: '4 weeks'
  },
  {
    name: 'Project Management',
    description: 'Learn fundamentals of planning, executing, and completing projects efficiently.',
    level: 'intermediate',
    category: 'soft',
    importance: 8,
    estimatedTimeToLearn: '5 weeks'
  },
  {
    name: 'Problem Solving',
    description: 'Develop analytical thinking and creative problem-solving techniques.',
    level: 'intermediate',
    category: 'soft',
    importance: 9,
    estimatedTimeToLearn: '4 weeks'
  },
  {
    name: 'Digital Literacy',
    description: 'Build essential skills for working with digital tools, software, and online platforms.',
    level: 'beginner',
    category: 'technical',
    importance: 8,
    estimatedTimeToLearn: '4 weeks'
  },
  {
    name: 'Networking',
    description: 'Learn strategies for building and maintaining professional relationships and connections.',
    level: 'intermediate',
    category: 'soft',
    importance: 7,
    estimatedTimeToLearn: '3 weeks'
  },
  {
    name: 'Critical Thinking',
    description: 'Develop skills to analyze information, evaluate evidence, and make reasoned judgments.',
    level: 'intermediate',
    category: 'soft',
    importance: 8,
    estimatedTimeToLearn: '5 weeks'
  },
  {
    name: 'Presentation Skills',
    description: 'Learn to create and deliver effective presentations for various audiences.',
    level: 'intermediate',
    category: 'soft',
    importance: 7,
    estimatedTimeToLearn: '4 weeks',
    prerequisites: ['Communication Skills']
  },
  {
    name: 'Emotional Intelligence',
    description: 'Develop awareness and understanding of emotions in yourself and others for better interactions.',
    level: 'advanced',
    category: 'soft',
    importance: 8,
    estimatedTimeToLearn: '6 weeks'
  },
  {
    name: 'Leadership',
    description: 'Learn skills for leading teams, making decisions, and inspiring others.',
    level: 'advanced',
    category: 'soft',
    importance: 7,
    estimatedTimeToLearn: '8 weeks',
    prerequisites: ['Communication Skills', 'Emotional Intelligence']
  }
];

// Find the best matching profession template
const findProfessionTemplate = (profession: string): Partial<Skill>[] => {
  // Convert to lowercase for case-insensitive matching
  const lowerProfession = profession.toLowerCase();
  
  // Try to find an exact match
  if (professionSkillTemplates[lowerProfession]) {
    return professionSkillTemplates[lowerProfession];
  }
  
  // Try to find a partial match
  for (const key in professionSkillTemplates) {
    if (lowerProfession.includes(key) || key.includes(lowerProfession)) {
      return professionSkillTemplates[key];
    }
  }
  
  // Return generic skills if no match found
  return genericSkills;
};

export const generateSkillRoadmap = (goal: Goal): Skill[] => {
  const skillTemplates = findProfessionTemplate(goal.profession);
  
  // Create skills with unique IDs and progress status
  return skillTemplates.map(template => {
    const skillId = `skill-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
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
      resources: generateMockVideoResources(template.name || 'Skill', template.level || 'beginner')
    };
  });
};