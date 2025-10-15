import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRoutines, mockLearningCards, mockJhanaSessions } from '../mock';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(() => {
    return localStorage.getItem('hasCompletedAssessment') === 'true';
  });
  
  const [recommendedModules, setRecommendedModules] = useState(() => {
    const saved = localStorage.getItem('recommendedModules');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('routines');
    return saved ? JSON.parse(saved) : mockRoutines;
  });
  
  const [learningCards, setLearningCards] = useState(() => {
    const saved = localStorage.getItem('learningCards');
    return saved ? JSON.parse(saved) : mockLearningCards;
  });
  
  const [jhanaSessions, setJhanaSessions] = useState(() => {
    const saved = localStorage.getItem('jhanaSessions');
    return saved ? JSON.parse(saved) : mockJhanaSessions;
  });
  
  const [pomodoroSessions, setPomodoroSessions] = useState(() => {
    const saved = localStorage.getItem('pomodoroSessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('learningCards', JSON.stringify(learningCards));
  }, [learningCards]);

  useEffect(() => {
    localStorage.setItem('jhanaSessions', JSON.stringify(jhanaSessions));
  }, [jhanaSessions]);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(pomodoroSessions));
  }, [pomodoroSessions]);

  const completeAssessment = (modules) => {
    setRecommendedModules(modules);
    setHasCompletedAssessment(true);
    localStorage.setItem('hasCompletedAssessment', 'true');
    localStorage.setItem('recommendedModules', JSON.stringify(modules));
  };

  const resetAssessment = () => {
    setHasCompletedAssessment(false);
    setRecommendedModules([]);
    localStorage.removeItem('hasCompletedAssessment');
    localStorage.removeItem('recommendedModules');
  };

  const value = {
    hasCompletedAssessment,
    recommendedModules,
    completeAssessment,
    resetAssessment,
    routines,
    setRoutines,
    learningCards,
    setLearningCards,
    jhanaSessions,
    setJhanaSessions,
    pomodoroSessions,
    setPomodoroSessions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};