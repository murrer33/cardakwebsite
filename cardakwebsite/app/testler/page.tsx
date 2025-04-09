'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock tests for demonstration
const MOCK_TESTS = [
  {
    id: 1,
    title: 'Genel Kültür Testi',
    description: 'Genel kültür bilginizi ölçen 10 soruluk kısa bir test.',
    createdBy: 'admin',
    createdAt: new Date('2024-04-01'),
    questionsCount: 10,
    completions: 24
  },
  {
    id: 2,
    title: 'Türkçe Dil Bilgisi',
    description: 'Türkçe dil bilgisi kurallarını ne kadar biliyorsunuz?',
    createdBy: 'turkolog',
    createdAt: new Date('2024-04-03'),
    questionsCount: 15,
    completions: 18
  },
  {
    id: 3,
    title: 'Tarih Bilginizi Test Edin',
    description: 'Tarih bilginizi sınayacak sorular içeren test.',
    createdBy: 'tarihçi',
    createdAt: new Date('2024-04-05'),
    questionsCount: 12,
    completions: 7
  }
];

export default function TestlerPage() {
  const [tests] = useState(MOCK_TESTS);
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Testler</h1>
        <Link 
          href="/testler/olustur"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Yeni Test Oluştur
        </Link>
      </div>
      
      {tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Henüz hiç test oluşturulmamış.</p>
          <Link 
            href="/testler/olustur"
            className="text-primary hover:underline"
          >
            İlk testi siz oluşturun!
          </Link>
        </div>
      )}
    </div>
  );
}

interface Test {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  questionsCount: number;
  completions: number;
}

function TestCard({ test }: { test: Test }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{test.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{test.description}</p>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{test.questionsCount} Soru</span>
          <span>{test.completions} Katılım</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {test.createdBy} tarafından
          </span>
          <Link
            href={`/testler/${test.id}`}
            className="text-primary hover:underline"
          >
            Teste Katıl
          </Link>
        </div>
      </div>
    </div>
  );
} 