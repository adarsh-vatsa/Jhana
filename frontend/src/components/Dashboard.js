import React from 'react';
import { useApp } from '../context/AppContext';
import { moduleInfo } from '../mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Calendar, BarChart3, ArrowRight } from 'lucide-react';

const moduleIcons = {
  jhana: Brain,
  learning: BookOpen,
  routine: Calendar
};

const Dashboard = () => {
  const { recommendedModules, resetAssessment } = useApp();
  const navigate = useNavigate();

  const getModulePriority = (moduleId) => {
    const index = recommendedModules.indexOf(moduleId);
    if (index === 0) return { label: 'Primary Focus', color: 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900' };
    if (index === 1) return { label: 'Secondary', color: 'bg-neutral-700 dark:bg-neutral-300 text-white dark:text-neutral-900' };
    return { label: 'Supplementary', color: 'bg-neutral-500 dark:bg-neutral-500 text-white' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Personalized Journey</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Based on your assessment, here are your recommended modules
            </p>
          </div>
          <Button
            variant="outline"
            onClick={resetAssessment}
            className="border-neutral-300 dark:border-neutral-700"
          >
            Retake Assessment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Object.values(moduleInfo).map((module) => {
          const Icon = moduleIcons[module.id];
          const priority = getModulePriority(module.id);
          const isRecommended = recommendedModules.includes(module.id);

          return (
            <Card
              key={module.id}
              className={`border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:shadow-lg transition-all cursor-pointer group ${
                !isRecommended ? 'opacity-50' : ''
              }`}
              onClick={() => navigate(`/${module.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  {isRecommended && (
                    <span className={`text-xs px-2 py-1 rounded-full ${priority.color}`}>
                      {priority.label}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl mb-2">{module.name}</CardTitle>
                <CardDescription className="text-neutral-500 dark:text-neutral-400">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {module.benefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mr-2" />
                      {benefit}
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                >
                  Open Module
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Your Progress Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Meditation Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">45</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Learning Cards Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">7</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;