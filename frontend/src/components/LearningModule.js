import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from '../context/AppContext';
import { BookOpen, Plus, Play, Pause, RotateCcw, Clock, CheckCircle2, XCircle, Pencil } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

const LearningModule = () => {
  const { learningCards, setLearningCards, pomodoroSessions, setPomodoroSessions } = useApp();
  const [activeTab, setActiveTab] = useState('review');
  
  // Flashcard states
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  
  // Pomodoro states
  const [pomodoroTime, setPomodoroTime] = useState(1500); // 25 minutes
  const [isPomodorActive, setIsPomodorActive] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [pomodoroType, setPomodoroType] = useState('work'); // work or break

  // Pomodoro timer effect
  useEffect(() => {
    let interval = null;
    if (isPomodorActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      handlePomodoroComplete();
    }
    return () => clearInterval(interval);
  }, [isPomodorActive, pomodoroTime]);

  const handlePomodoroComplete = () => {
    if (pomodoroType === 'work') {
      const newSession = {
        id: Date.now(),
        duration: 1500,
        task: currentTask || 'Focused work',
        date: new Date().toISOString(),
        completed: true
      };
      setPomodoroSessions([newSession, ...pomodoroSessions]);
      setPomodoroType('break');
      setPomodoroTime(300); // 5 min break
    } else {
      setPomodoroType('work');
      setPomodoroTime(1500);
    }
    setIsPomodorActive(false);
  };

  const togglePomodoro = () => {
    setIsPomodorActive(!isPomodorActive);
  };

  const resetPomodoro = () => {
    setIsPomodorActive(false);
    setPomodoroTime(pomodoroType === 'work' ? 1500 : 300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Spaced repetition algorithm (simplified SM-2)
  const reviewCard = (quality) => {
    const card = learningCards[currentCardIndex];
    let newInterval = card.interval;
    let newEaseFactor = card.easeFactor;

    if (quality >= 3) {
      if (card.interval === 0) {
        newInterval = 1;
      } else if (card.interval === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
    } else {
      newInterval = 1;
    }

    newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    const updatedCard = {
      ...card,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview: Date.now() + newInterval * 86400000
    };

    const updatedCards = [...learningCards];
    updatedCards[currentCardIndex] = updatedCard;
    setLearningCards(updatedCards);
    
    setShowAnswer(false);
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const addCard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      const card = {
        id: Date.now(),
        front: newCard.front,
        back: newCard.back,
        nextReview: Date.now(),
        interval: 0,
        easeFactor: 2.5
      };
      setLearningCards([...learningCards, card]);
      setNewCard({ front: '', back: '' });
    }
  };

  const dueCards = learningCards.filter(card => card.nextReview <= Date.now());
  const currentCard = dueCards[currentCardIndex];

  const pomodoroProgress = ((pomodoroType === 'work' ? 1500 : 300) - pomodoroTime) / (pomodoroType === 'work' ? 1500 : 300) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Learning Module</h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Optimize learning with spaced repetition and focused work sessions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <TabsTrigger value="review" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950">
            Review Cards ({dueCards.length})
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950">
            Pomodoro Timer
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950">
            Create Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {dueCards.length === 0 ? (
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <CheckCircle2 className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-center">
                      No cards due for review. Create new cards or check back later.
                    </p>
                  </CardContent>
                </Card>
              ) : currentCard ? (
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Card {currentCardIndex + 1} of {dueCards.length}</CardTitle>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Interval: {currentCard.interval} days
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-[300px] flex flex-col justify-center">
                      <div className="mb-8">
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                          Question
                        </div>
                        <div className="text-2xl font-medium mb-8">
                          {currentCard.front}
                        </div>
                        
                        {showAnswer && (
                          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                              Answer
                            </div>
                            <div className="text-xl">
                              {currentCard.back}
                            </div>
                          </div>
                        )}
                      </div>

                      {!showAnswer ? (
                        <Button
                          onClick={() => setShowAnswer(true)}
                          className="w-full"
                        >
                          Show Answer
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-center text-neutral-600 dark:text-neutral-400 mb-3">
                            How well did you know this?
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            <Button
                              variant="outline"
                              onClick={() => reviewCard(1)}
                              className="border-neutral-300 dark:border-neutral-700 hover:border-red-500 hover:text-red-500"
                            >
                              Again
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => reviewCard(2)}
                              className="border-neutral-300 dark:border-neutral-700 hover:border-orange-500 hover:text-orange-500"
                            >
                              Hard
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => reviewCard(3)}
                              className="border-neutral-300 dark:border-neutral-700 hover:border-blue-500 hover:text-blue-500"
                            >
                              Good
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => reviewCard(4)}
                              className="border-neutral-300 dark:border-neutral-700 hover:border-green-500 hover:text-green-500"
                            >
                              Easy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle>Study Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold mb-1">{learningCards.length}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Cards</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">{dueCards.length}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Due for Review</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <CardHeader>
                  <CardTitle>Spaced Repetition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    This system optimizes your learning by showing cards at increasing intervals based on how well you know them.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pomodoro" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <CardHeader>
                  <CardTitle>
                    {pomodoroType === 'work' ? 'Focus Session' : 'Break Time'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-7xl font-bold mb-4">{formatTime(pomodoroTime)}</div>
                    <Progress value={pomodoroProgress} className="h-2 mb-8" />
                    
                    {pomodoroType === 'work' && (
                      <Input
                        placeholder="What are you working on?"
                        value={currentTask}
                        onChange={(e) => setCurrentTask(e.target.value)}
                        className="mb-6 text-center border-neutral-300 dark:border-neutral-700"
                        disabled={isPomodorActive}
                      />
                    )}

                    <div className="flex gap-3 justify-center">
                      <Button
                        size="lg"
                        onClick={togglePomodoro}
                        className=""
                      >
                        {isPomodorActive ? (
                          <>
                            <Pause className="mr-2 h-5 w-5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={resetPomodoro}
                        className="border-neutral-300 dark:border-neutral-700"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-6">
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {pomodoroSessions.length === 0 ? (
                    <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                      No sessions yet. Start your first pomodoro above.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pomodoroSessions.slice(0, 5).map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                        >
                          <div>
                            <div className="font-medium">{session.task}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              {new Date(session.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                            <Clock className="h-4 w-4" />
                            {Math.floor(session.duration / 60)} min
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle>Pomodoro Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold mb-1">{pomodoroSessions.length}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Completed Sessions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">
                      {Math.round(pomodoroSessions.reduce((acc, s) => acc + s.duration / 60, 0))}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Minutes Focused</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <CardHeader>
                  <CardTitle>About Pomodoro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    The Pomodoro Technique uses 25-minute focused work sessions followed by short breaks to maintain high productivity and prevent burnout.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <CardHeader>
                <CardTitle>Create New Flashcard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question</label>
                  <Textarea
                    placeholder="Enter the question or prompt..."
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                    className="min-h-[100px] border-neutral-300 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Answer</label>
                  <Textarea
                    placeholder="Enter the answer..."
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                    className="min-h-[100px] border-neutral-300 dark:border-neutral-700"
                  />
                </div>
                <Button
                  onClick={addCard}
                  className="w-full"
                  disabled={!newCard.front.trim() || !newCard.back.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-6">
              <CardHeader>
                <CardTitle>Your Cards ({learningCards.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {learningCards.length === 0 ? (
                  <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                    No cards yet. Create your first card above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {learningCards.map((card) => (
                      <div
                        key={card.id}
                        className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
                      >
                        <div className="font-medium mb-1">{card.front}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">{card.back}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningModule;