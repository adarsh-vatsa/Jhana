import React, { useState } from 'react';
import { mockAssessmentQuestions, getAIRecommendation } from '../mock';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { completeAssessment } = useApp();

  const handleAnswer = async (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < mockAssessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      const recommendation = getAIRecommendation(newAnswers);
      completeAssessment(recommendation.recommendedModules);
    }
  };

  const question = mockAssessmentQuestions[currentQuestion];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-12 w-12 animate-pulse mb-4 text-neutral-700 dark:text-neutral-300" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Analyzing your responses...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Question {currentQuestion + 1} of {mockAssessmentQuestions.length}
          </span>
          <div className="flex gap-2">
            {mockAssessmentQuestions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  idx <= currentQuestion
                    ? 'bg-neutral-900 dark:bg-neutral-100'
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <CardHeader>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            Select the option that best describes you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-neutral-900 dark:text-neutral-100">{option.label}</span>
                <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {currentQuestion > 0 && (
        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Previous Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default Assessment;