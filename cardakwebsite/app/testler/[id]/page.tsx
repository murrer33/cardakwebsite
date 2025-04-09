'use client';

import { useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type QuestionType = 'multiple-choice' | 'image-based' | 'open-ended';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options?: Option[];
}

interface Test {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  questions: Question[];
}

interface Answer {
  questionId: string;
  selectedOptionId?: string;
  openAnswer?: string;
}

// Mock test data for demonstration
const MOCK_TEST: Test = {
  id: '1',
  title: 'Genel Kültür Testi',
  description: 'Genel kültür bilginizi ölçen 10 soruluk kısa bir test.',
  createdBy: 'admin',
  createdAt: new Date('2024-04-01'),
  questions: [
    {
      id: '1',
      type: 'multiple-choice',
      text: 'Türkiye\'nin başkenti neresidir?',
      options: [
        { id: '1', text: 'İstanbul', isCorrect: false },
        { id: '2', text: 'Ankara', isCorrect: true },
        { id: '3', text: 'İzmir', isCorrect: false },
        { id: '4', text: 'Bursa', isCorrect: false },
      ],
    },
    {
      id: '2',
      type: 'multiple-choice',
      text: 'Hangisi bir gezegen değildir?',
      options: [
        { id: '1', text: 'Mars', isCorrect: false },
        { id: '2', text: 'Venüs', isCorrect: false },
        { id: '3', text: 'Plüton', isCorrect: true },
        { id: '4', text: 'Satürn', isCorrect: false },
      ],
    },
    {
      id: '3',
      type: 'image-based',
      text: 'Bu resimde hangi hayvan gösterilmektedir?',
      imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5',
      options: [
        { id: '1', text: 'Aslan', isCorrect: false },
        { id: '2', text: 'Kaplan', isCorrect: false },
        { id: '3', text: 'Tilki', isCorrect: true },
        { id: '4', text: 'Kurt', isCorrect: false },
      ],
    },
    {
      id: '4',
      type: 'open-ended',
      text: 'Albert Einstein\'ın en ünlü teorisi nedir?',
    },
  ],
};

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const [test] = useState<Test>(MOCK_TEST);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = test.questions[currentQuestionIndex];
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleOptionSelect = (optionId: string) => {
    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      answer => answer.questionId === currentQuestion.id
    );
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex].selectedOptionId = optionId;
    } else {
      updatedAnswers.push({
        questionId: currentQuestion.id,
        selectedOptionId: optionId
      });
    }
    
    setAnswers(updatedAnswers);
  };
  
  const handleOpenEndedAnswer = (answer: string) => {
    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      answer => answer.questionId === currentQuestion.id
    );
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex].openAnswer = answer;
    } else {
      updatedAnswers.push({
        questionId: currentQuestion.id,
        openAnswer: answer
      });
    }
    
    setAnswers(updatedAnswers);
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    
    test.questions.forEach((question) => {
      if (question.type === 'open-ended') return; // Skip open-ended questions for automatic scoring
      
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) return;
      
      const correctOption = question.options?.find(o => o.isCorrect);
      if (answer.selectedOptionId === correctOption?.id) {
        correctCount++;
      }
    });
    
    const scorePercent = Math.round((correctCount / test.questions.filter(q => q.type !== 'open-ended').length) * 100);
    setScore(scorePercent);
  };
  
  const getAnswerForCurrentQuestion = () => {
    return answers.find(answer => answer.questionId === currentQuestion.id);
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{test.title} - Sonuçlar</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl font-bold mb-2">%{score}</div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Başarı Oranı
            </p>
          </div>
          
          <div className="space-y-6">
            {test.questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              const isCorrect = question.type !== 'open-ended' && 
                question.options?.find(o => o.isCorrect)?.id === answer?.selectedOptionId;
              
              return (
                <div key={question.id} className={`p-4 border rounded-lg ${
                  question.type !== 'open-ended' ? 
                    (isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 
                                'border-red-500 bg-red-50 dark:bg-red-900/20') :
                    'border-gray-200 dark:border-gray-700'
                }`}>
                  <h3 className="font-medium mb-2">Soru {index + 1}: {question.text}</h3>
                  
                  {question.type === 'image-based' && question.imageUrl && (
                    <div className="relative h-48 w-full mb-4">
                      <Image
                        src={question.imageUrl}
                        alt={question.text}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  )}
                  
                  {(question.type === 'multiple-choice' || question.type === 'image-based') && (
                    <div className="space-y-2 mt-2">
                      {question.options?.map((option) => (
                        <div 
                          key={option.id} 
                          className={`p-2 rounded ${
                            option.isCorrect ? 'bg-green-100 dark:bg-green-900/30 font-medium' : 
                            option.id === answer?.selectedOptionId ? 'bg-red-100 dark:bg-red-900/30' : ''
                          }`}
                        >
                          {option.text}
                          {option.isCorrect && ' ✓'}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'open-ended' && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Sizin Cevabınız:</p>
                      <p className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        {answer?.openAnswer || 'Cevap verilmedi'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between mt-8">
            <Link
              href="/testler"
              className="text-primary hover:underline"
            >
              Testlere Dön
            </Link>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setAnswers([]);
              }}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Testi Tekrar Çöz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{test.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Soru {currentQuestionIndex + 1} / {test.questions.length}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
        
        {currentQuestion.type === 'image-based' && currentQuestion.imageUrl && (
          <div className="relative h-64 w-full mb-6">
            <Image
              src={currentQuestion.imageUrl}
              alt={currentQuestion.text}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
        
        {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'image-based') && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => {
              const answer = getAnswerForCurrentQuestion();
              const isSelected = answer?.selectedOptionId === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full p-3 rounded-md border ${
                    isSelected ? 
                    'border-primary bg-primary/10 dark:bg-primary/20' : 
                    'border-gray-300 dark:border-gray-600 hover:border-primary'
                  } transition-colors`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        )}
        
        {currentQuestion.type === 'open-ended' && (
          <div>
            <textarea
              value={getAnswerForCurrentQuestion()?.openAnswer || ''}
              onChange={(e) => handleOpenEndedAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Cevabınızı buraya yazın..."
              rows={4}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Önceki Soru
        </button>
        
        <button
          onClick={handleNextQuestion}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          {currentQuestionIndex === test.questions.length - 1 ? 'Testi Bitir' : 'Sonraki Soru'}
        </button>
      </div>
    </div>
  );
} 