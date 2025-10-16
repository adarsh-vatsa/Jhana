import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import { Brain, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Progress } from './ui/progress';

const meditationTypes = [
  { id: 'breath', name: 'Breath Focus', duration: 600, description: 'Focus on breath to develop concentration' },
  { id: 'body', name: 'Body Scan', duration: 900, description: 'Progressive awareness through body' },
  { id: 'open', name: 'Open Awareness', duration: 1200, description: 'Cultivate spacious awareness' }
];

const JhanaMeditation = () => {
  const { jhanaSessions, setJhanaSessions } = useApp();
  const [selectedType, setSelectedType] = useState(meditationTypes[0]);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(selectedType.duration);
  const [showGuidance, setShowGuidance] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    const newSession = {
      id: Date.now(),
      duration: selectedType.duration,
      type: selectedType.name,
      date: new Date().toISOString(),
      completed: true
    };
    setJhanaSessions([newSession, ...jhanaSessions]);
    setIsActive(false);
    setTimeLeft(selectedType.duration);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    setShowGuidance(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedType.duration);
    setShowGuidance(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedType.duration - timeLeft) / selectedType.duration) * 100;

  const totalMinutes = jhanaSessions.reduce((acc, s) => acc + s.duration / 60, 0);
  const totalSessions = jhanaSessions.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Jhana Meditation</h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Deep concentration practice for mental clarity and inner peace
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
              <CardTitle>Practice Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex gap-3 mb-6">
                  {meditationTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedType.id === type.id ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedType(type);
                        setTimeLeft(type.duration);
                        setIsActive(false);
                        setShowGuidance(true);
                      }}
                      disabled={isActive}
                      className=""
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>

                <div className="text-center py-12">
                  <div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
                  <Progress value={progress} className="h-2 mb-6" />
                  
                  {showGuidance && (
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      {selectedType.description}
                    </p>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className=""
                    >
                      {isActive ? (
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
                      onClick={resetTimer}
                      className="border-neutral-300 dark:border-neutral-700"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {jhanaSessions.length === 0 ? (
                <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                  No sessions yet. Start your first meditation above.
                </p>
              ) : (
                <div className="space-y-3">
                  {jhanaSessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                    >
                      <div>
                        <div className="font-medium">{session.type}</div>
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
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold mb-1">{totalSessions}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Sessions</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{Math.round(totalMinutes)}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Minutes Practiced</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
              <CardTitle>About Jhana</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Jhana states are deep meditative absorptions that develop through sustained concentration. 
                Modern neuroscience shows these practices increase gamma wave activity and enhance emotional regulation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JhanaMeditation;