import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Generate a simple user ID for this session
const getUserId = () => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

// Assessment API
export const submitAssessment = async (answers) => {
  try {
    const response = await axios.post(`${API}/assessment/submit`, answers);
    return response.data;
  } catch (error) {
    console.error('Assessment submission error:', error);
    throw error;
  }
};

// Jhana Meditation APIs
export const createJhanaSession = async (duration, type) => {
  try {
    const response = await axios.post(`${API}/jhana/sessions`, {
      user_id: getUserId(),
      duration,
      type
    });
    return response.data;
  } catch (error) {
    console.error('Create jhana session error:', error);
    throw error;
  }
};

export const getJhanaSessions = async () => {
  try {
    const response = await axios.get(`${API}/jhana/sessions`, {
      params: { user_id: getUserId() }
    });
    return response.data;
  } catch (error) {
    console.error('Get jhana sessions error:', error);
    return [];
  }
};

export const getJhanaStats = async () => {
  try {
    const response = await axios.get(`${API}/jhana/stats`, {
      params: { user_id: getUserId() }
    });
    return response.data;
  } catch (error) {
    console.error('Get jhana stats error:', error);
    return { total_sessions: 0, total_minutes: 0 };
  }
};

// Learning Module APIs
export const getLearningCards = async () => {
  try {
    const response = await axios.get(`${API}/learning/cards`, {
      params: { user_id: getUserId() }
    });
    return response.data;
  } catch (error) {
    console.error('Get learning cards error:', error);
    return [];
  }
};

export const createLearningCard = async (front, back) => {
  try {
    const response = await axios.post(`${API}/learning/cards`, {
      user_id: getUserId(),
      front,
      back
    });
    return response.data;
  } catch (error) {
    console.error('Create learning card error:', error);
    throw error;
  }
};

export const reviewLearningCard = async (cardId, interval, easeFactor, nextReview) => {
  try {
    const response = await axios.put(`${API}/learning/cards/${cardId}/review`, {
      interval,
      ease_factor: easeFactor,
      next_review: nextReview
    });
    return response.data;
  } catch (error) {
    console.error('Review learning card error:', error);
    throw error;
  }
};

export const getPomodoroSessions = async () => {
  try {
    const response = await axios.get(`${API}/pomodoro/sessions`, {
      params: { user_id: getUserId() }
    });
    return response.data;
  } catch (error) {
    console.error('Get pomodoro sessions error:', error);
    return [];
  }
};

export const createPomodoroSession = async (duration, task) => {
  try {
    const response = await axios.post(`${API}/pomodoro/sessions`, {
      user_id: getUserId(),
      duration,
      task
    });
    return response.data;
  } catch (error) {
    console.error('Create pomodoro session error:', error);
    throw error;
  }
};

// Routine Builder APIs
export const getRoutines = async () => {
  try {
    const response = await axios.get(`${API}/routines`, {
      params: { user_id: getUserId() }
    });
    return response.data;
  } catch (error) {
    console.error('Get routines error:', error);
    return [];
  }
};

export const createRoutine = async (name) => {
  try {
    const response = await axios.post(`${API}/routines`, {
      user_id: getUserId(),
      name
    });
    return response.data;
  } catch (error) {
    console.error('Create routine error:', error);
    throw error;
  }
};

export const updateRoutine = async (routineId, updates) => {
  try {
    const response = await axios.put(`${API}/routines/${routineId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Update routine error:', error);
    throw error;
  }
};

export const completeHabits = async (routineId, date, habitIds) => {
  try {
    const response = await axios.post(`${API}/routines/${routineId}/complete`, {
      date,
      habit_ids: habitIds
    });
    return response.data;
  } catch (error) {
    console.error('Complete habits error:', error);
    throw error;
  }
};
