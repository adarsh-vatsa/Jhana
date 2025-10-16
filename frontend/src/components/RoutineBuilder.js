import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Plus, Check, Trash2, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';

const RoutineBuilder = () => {
  const { routines, setRoutines } = useApp();
  const [selectedRoutine, setSelectedRoutine] = useState(routines[0] || null);
  const [newHabitName, setNewHabitName] = useState('');
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewRoutineDialog, setShowNewRoutineDialog] = useState(false);

  const addHabitToRoutine = () => {
    if (!newHabitName.trim() || !selectedRoutine) return;

    const lastHabit = selectedRoutine.habits[selectedRoutine.habits.length - 1];
    const newHabit = {
      id: `h${Date.now()}`,
      name: newHabitName,
      anchor: false,
      stackedAfter: lastHabit ? lastHabit.id : null
    };

    const updatedRoutine = {
      ...selectedRoutine,
      habits: [...selectedRoutine.habits, newHabit]
    };

    const updatedRoutines = routines.map(r => 
      r.id === selectedRoutine.id ? updatedRoutine : r
    );

    setRoutines(updatedRoutines);
    setSelectedRoutine(updatedRoutine);
    setNewHabitName('');
  };

  const createNewRoutine = () => {
    if (!newRoutineName.trim()) return;

    const newRoutine = {
      id: Date.now(),
      name: newRoutineName,
      habits: [],
      completions: {}
    };

    setRoutines([...routines, newRoutine]);
    setSelectedRoutine(newRoutine);
    setNewRoutineName('');
    setShowNewRoutineDialog(false);
  };

  const deleteHabit = (habitId) => {
    const updatedRoutine = {
      ...selectedRoutine,
      habits: selectedRoutine.habits.filter(h => h.id !== habitId)
    };

    const updatedRoutines = routines.map(r => 
      r.id === selectedRoutine.id ? updatedRoutine : r
    );

    setRoutines(updatedRoutines);
    setSelectedRoutine(updatedRoutine);
  };

  const toggleHabitCompletion = (habitId, date) => {
    const dateKey = date.toISOString().split('T')[0];
    const completions = selectedRoutine.completions[dateKey] || [];
    
    const updatedCompletions = completions.includes(habitId)
      ? completions.filter(id => id !== habitId)
      : [...completions, habitId];

    const updatedRoutine = {
      ...selectedRoutine,
      completions: {
        ...selectedRoutine.completions,
        [dateKey]: updatedCompletions
      }
    };

    const updatedRoutines = routines.map(r => 
      r.id === selectedRoutine.id ? updatedRoutine : r
    );

    setRoutines(updatedRoutines);
    setSelectedRoutine(updatedRoutine);
  };

  const isHabitCompleted = (habitId, date) => {
    const dateKey = date.toISOString().split('T')[0];
    return selectedRoutine?.completions[dateKey]?.includes(habitId) || false;
  };

  const getCompletionRate = (routine) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const totalPossible = last7Days.length * routine.habits.length;
    const totalCompleted = last7Days.reduce((sum, dateKey) => {
      return sum + (routine.completions[dateKey]?.length || 0);
    }, 0);

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

  const getCurrentStreak = (routine) => {
    let streak = 0;
    let date = new Date();
    
    while (true) {
      const dateKey = date.toISOString().split('T')[0];
      const completions = routine.completions[dateKey]?.length || 0;
      
      if (completions >= routine.habits.length) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const dateKey = selectedDate.toISOString().split('T')[0];
  const todayCompletions = selectedRoutine?.completions[dateKey] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8" />
            <h2 className="text-3xl font-bold">Routine Builder</h2>
          </div>
          <Dialog open={showNewRoutineDialog} onOpenChange={setShowNewRoutineDialog}>
            <DialogTrigger asChild>
              <Button className="">
                <Plus className="mr-2 h-4 w-4" />
                New Routine
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
              <DialogHeader>
                <DialogTitle>Create New Routine</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Routine name (e.g., Morning Routine)"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  className="border-neutral-300 dark:border-neutral-700"
                />
                <Button
                  onClick={createNewRoutine}
                  className="w-full"
                  disabled={!newRoutineName.trim()}
                >
                  Create Routine
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Build powerful habits through habit stacking and consistent routines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Routine List */}
        <div className="lg:col-span-1">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
              <CardTitle>Your Routines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {routines.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => setSelectedRoutine(routine)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRoutine?.id === routine.id
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium mb-1">{routine.name}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {routine.habits.length} habits
                      </div>
                    </div>
                    {selectedRoutine?.id === routine.id && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedRoutine ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-1">{selectedRoutine.habits.length}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Habits</div>
                  </CardContent>
                </Card>
                <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-1">{getCurrentStreak(selectedRoutine)}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Day Streak</div>
                  </CardContent>
                </Card>
                <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-1">{getCompletionRate(selectedRoutine)}%</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">7-Day Completion</div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Habits */}
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedRoutine.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-neutral-300 dark:border-neutral-700">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {selectedDate.toLocaleDateString()}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                          <DialogHeader>
                            <DialogTitle>Select Date</DialogTitle>
                          </DialogHeader>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border border-neutral-200 dark:border-neutral-800"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedRoutine.habits.length === 0 ? (
                    <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                      No habits yet. Add your first habit below.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedRoutine.habits.map((habit, index) => (
                        <div
                          key={habit.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <button
                              onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                isHabitCompleted(habit.id, selectedDate)
                                  ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
                                  : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                              }`}
                            >
                              {isHabitCompleted(habit.id, selectedDate) && (
                                <Check className="h-4 w-4 text-white dark:text-neutral-900" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="font-medium">{habit.name}</div>
                              {index > 0 && habit.stackedAfter && (
                                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                  After: {selectedRoutine.habits.find(h => h.id === habit.stackedAfter)?.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteHabit(habit.id)}
                            className="text-neutral-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add New Habit */}
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <CardHeader>
                  <CardTitle>Add Habit to Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New habit name..."
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHabitToRoutine()}
                      className="border-neutral-300 dark:border-neutral-700"
                    />
                    <Button
                      onClick={addHabitToRoutine}
                      className=""
                      disabled={!newHabitName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                    💡 Tip: Stack new habits after existing ones to build a strong routine chain
                  </p>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle>About Habit Stacking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Habit stacking is a strategy where you link a new habit to an existing one. By creating a chain of habits, 
                    each completed action triggers the next, making it easier to build and maintain multiple habits consistently.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Routine Selected</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                  Select a routine from the sidebar or create a new one to get started.
                </p>
                <Button
                  onClick={() => setShowNewRoutineDialog(true)}
                  className=""
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Routine
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineBuilder;