'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  options: Option[];
}

export default function CreateTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    type: 'multiple-choice',
    text: '',
    options: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false },
    ]
  });

  const addQuestion = () => {
    // Generate a unique ID
    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString(),
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      id: '',
      type: 'multiple-choice',
      text: '',
      imageUrl: '',
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false },
      ]
    });
  };
  
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const handleQuestionTypeChange = (type: QuestionType) => {
    setCurrentQuestion({
      ...currentQuestion,
      type,
      options: type === 'open-ended' ? [] : currentQuestion.options
    });
  };
  
  const handleOptionChange = (optionId: string, value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(option => 
        option.id === optionId ? { ...option, text: value } : option
      )
    });
  };
  
  const handleCorrectAnswerChange = (optionId: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(option => 
        ({ ...option, isCorrect: option.id === optionId })
      )
    });
  };
  
  const handleSubmit = () => {
    // Here we would typically save the test to a database
    // For now we'll just navigate back to the tests page
    alert('Test başarıyla oluşturuldu!');
    router.push('/testler');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Yeni Test Oluştur</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Bilgileri</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Test Başlığı
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Test başlığını girin"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Açıklama
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Test açıklamasını girin"
            rows={3}
            required
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Soru Ekle</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Soru Tipi
          </label>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${currentQuestion.type === 'multiple-choice' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              onClick={() => handleQuestionTypeChange('multiple-choice')}
            >
              Çoktan Seçmeli
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${currentQuestion.type === 'image-based' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              onClick={() => handleQuestionTypeChange('image-based')}
            >
              Görsel Tabanlı
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${currentQuestion.type === 'open-ended' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              onClick={() => handleQuestionTypeChange('open-ended')}
            >
              Açık Uçlu
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Soru Metni
          </label>
          <textarea
            id="question-text"
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Soru metnini girin"
            rows={2}
            required
          />
        </div>
        
        {currentQuestion.type === 'image-based' && (
          <div className="mb-4">
            <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Görsel URL'si
            </label>
            <input
              type="text"
              id="image-url"
              value={currentQuestion.imageUrl || ''}
              onChange={(e) => setCurrentQuestion({...currentQuestion, imageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Görsel URL'sini girin"
            />
          </div>
        )}
        
        {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'image-based') && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seçenekler
            </label>
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name="correct-option"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectAnswerChange(option.id)}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder={`Seçenek ${option.id}`}
                    required
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Doğru yanıtı radyo düğmesini seçerek belirleyin.
            </p>
          </div>
        )}
        
        <button
          type="button"
          onClick={addQuestion}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Soruyu Ekle
        </button>
      </div>
      
      {questions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Eklenen Sorular ({questions.length})</h2>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Soru {index + 1}: {question.text}</h3>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tip: {question.type === 'multiple-choice' ? 'Çoktan Seçmeli' : 
                       question.type === 'image-based' ? 'Görsel Tabanlı' : 'Açık Uçlu'}
                </p>
                {(question.type === 'multiple-choice' || question.type === 'image-based') && (
                  <div className="mt-2 pl-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Seçenekler:</p>
                    <ul className="list-disc pl-4 text-sm">
                      {question.options.map((option) => (
                        <li key={option.id} className={option.isCorrect ? 'text-green-600 font-semibold' : ''}>
                          {option.text} {option.isCorrect && '(Doğru)'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={questions.length === 0 || !title.trim() || !description.trim()}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Testi Oluştur
        </button>
      </div>
    </div>
  );
} 