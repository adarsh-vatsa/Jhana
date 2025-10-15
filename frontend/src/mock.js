// Mock data for the mental wellness platform

export const mockAssessmentQuestions = [
  {
    id: 1,
    question: "What's your primary goal?",
    options: [
      { id: "focus", label: "Improve focus and productivity", modules: ["learning", "routine"] },
      { id: "mindfulness", label: "Develop mindfulness and meditation practice", modules: ["jhana", "routine"] },
      { id: "habits", label: "Build better daily habits", modules: ["routine", "learning"] },
      { id: "stress", label: "Manage stress and anxiety", modules: ["jhana", "routine"] },
      { id: "learning", label: "Learn more effectively", modules: ["learning", "routine"] }
    ]
  },
  {
    id: 2,
    question: "How would you describe your current state?",
    options: [
      { id: "overwhelmed", label: "Overwhelmed with tasks", modules: ["routine", "jhana"] },
      { id: "unfocused", label: "Difficulty focusing", modules: ["learning", "jhana"] },
      { id: "stressed", label: "High stress levels", modules: ["jhana", "routine"] },
      { id: "unmotivated", label: "Lacking motivation", modules: ["routine", "learning"] },
      { id: "scattered", label: "Feel scattered/disorganized", modules: ["routine", "learning"] }
    ]
  },
  {
    id: 3,
    question: "What's your biggest challenge?",
    options: [
      { id: "consistency", label: "Maintaining consistency", modules: ["routine", "learning"] },
      { id: "mind-wandering", label: "Mind wandering/distraction", modules: ["jhana", "learning"] },
      { id: "time-management", label: "Time management", modules: ["learning", "routine"] },
      { id: "mental-clarity", label: "Lack of mental clarity", modules: ["jhana", "learning"] },
      { id: "procrastination", label: "Procrastination", modules: ["learning", "routine"] }
    ]
  }
];

export const moduleInfo = {
  jhana: {
    id: "jhana",
    name: "Jhana Meditation",
    description: "Deep concentration practice for mental clarity and calm",
    benefits: ["Enhanced focus", "Reduced anxiety", "Improved emotional regulation", "Deep relaxation"],
    evidenceBase: "Jhana states are ancient meditation techniques backed by modern neuroscience research showing increased gamma wave activity and enhanced well-being."
  },
  learning: {
    id: "learning",
    name: "Learning Module",
    description: "Optimize learning with spaced repetition and focused work sessions",
    benefits: ["Better retention", "Efficient studying", "Improved focus", "Reduced burnout"],
    evidenceBase: "Spaced repetition is supported by decades of cognitive psychology research. Pomodoro technique is proven to enhance focus and prevent mental fatigue."
  },
  routine: {
    id: "routine",
    name: "Routine Builder",
    description: "Build powerful habits through habit stacking and consistent routines",
    benefits: ["Automatic behaviors", "Increased consistency", "Reduced decision fatigue", "Goal achievement"],
    evidenceBase: "Habit stacking, introduced by James Clear, leverages existing habits as triggers for new behaviors, making habit formation significantly easier."
  }
};

export const mockJhanaSessions = [
  { id: 1, duration: 600, type: "Breath Focus", date: new Date().toISOString(), completed: true },
  { id: 2, duration: 900, type: "Body Scan", date: new Date(Date.now() - 86400000).toISOString(), completed: true },
  { id: 3, duration: 1200, type: "Open Awareness", date: new Date(Date.now() - 172800000).toISOString(), completed: true }
];

export const mockLearningCards = [
  { id: 1, front: "What is neuroplasticity?", back: "The brain's ability to reorganize itself by forming new neural connections", nextReview: Date.now() + 86400000, interval: 1, easeFactor: 2.5 },
  { id: 2, front: "Pomodoro technique duration?", back: "25 minutes of focused work followed by 5 minute break", nextReview: Date.now() - 3600000, interval: 1, easeFactor: 2.5 },
  { id: 3, front: "What is spaced repetition?", back: "A learning technique that involves reviewing information at increasing intervals", nextReview: Date.now() + 172800000, interval: 3, easeFactor: 2.8 }
];

export const mockPomodoroSessions = [
  { id: 1, duration: 1500, task: "Study React", date: new Date().toISOString(), completed: true },
  { id: 2, duration: 1500, task: "Read research paper", date: new Date().toISOString(), completed: true }
];

export const mockRoutines = [
  {
    id: 1,
    name: "Morning Routine",
    habits: [
      { id: "h1", name: "Wake up", anchor: true, time: "06:00" },
      { id: "h2", name: "Drink water", anchor: false, stackedAfter: "h1" },
      { id: "h3", name: "5-min meditation", anchor: false, stackedAfter: "h2" },
      { id: "h4", name: "Exercise", anchor: false, stackedAfter: "h3" },
      { id: "h5", name: "Healthy breakfast", anchor: false, stackedAfter: "h4" }
    ],
    completions: {}
  },
  {
    id: 2,
    name: "Evening Routine",
    habits: [
      { id: "e1", name: "Dinner", anchor: true, time: "19:00" },
      { id: "e2", name: "Review day", anchor: false, stackedAfter: "e1" },
      { id: "e3", name: "Plan tomorrow", anchor: false, stackedAfter: "e2" },
      { id: "e4", name: "Read book", anchor: false, stackedAfter: "e3" },
      { id: "e5", name: "Sleep prep", anchor: false, stackedAfter: "e4" }
    ],
    completions: {}
  }
];

// Simulate AI recommendation
export const getAIRecommendation = (answers) => {
  const moduleScores = { jhana: 0, learning: 0, routine: 0 };
  
  answers.forEach(answer => {
    answer.modules.forEach(module => {
      moduleScores[module]++;
    });
  });
  
  const sortedModules = Object.entries(moduleScores)
    .sort((a, b) => b[1] - a[1])
    .map(([module]) => module);
  
  return {
    recommendedModules: sortedModules,
    message: `Based on your responses, we recommend focusing on ${sortedModules[0]} to start, followed by ${sortedModules[1]} and ${sortedModules[2]}.`
  };
};