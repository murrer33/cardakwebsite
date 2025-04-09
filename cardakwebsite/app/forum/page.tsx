'use client';

import { useState, FormEvent } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Mock comments for demonstration
const MOCK_COMMENTS = [
  {
    id: 1,
    username: 'filozof',
    content: 'Bugün hava gerçekten çok güzel, parkta yürüyüş yapmak için ideal bir gün!',
    createdAt: new Date('2024-04-09T09:15:00'),
  },
  {
    id: 2,
    username: 'gezgin',
    content: 'Yeni bir kitap okumaya başladım, herkese tavsiye ederim: "Yüzyıllık Yalnızlık"',
    createdAt: new Date('2024-04-09T10:22:00'),
  },
  {
    id: 3,
    username: 'müzisyen',
    content: 'Bu akşam şehir merkezinde ücretsiz bir konser var, katılmak isteyen var mı?',
    createdAt: new Date('2024-04-09T11:05:00'),
  },
  {
    id: 4,
    username: 'aşçı',
    content: 'Bugün yeni bir tarif denedim, çok lezzetli oldu. İsteyen olursa tarifi paylaşabilirim.',
    createdAt: new Date('2024-04-09T12:30:00'),
  },
  {
    id: 5,
    username: 'sporcu',
    content: 'Sabah koşusu yapmak günün geri kalanını daha enerjik geçirmemi sağlıyor. Siz de deneyin!',
    createdAt: new Date('2024-04-09T13:45:00'),
  },
];

interface Comment {
  id: number;
  username: string;
  content: string;
  createdAt: Date;
}

export default function ForumPage() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !content.trim()) return;
    
    const newComment: Comment = {
      id: comments.length + 1,
      username: username.trim(),
      content: content.trim(),
      createdAt: new Date(),
    };
    
    setComments([...comments, newComment]);
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Günlük Kısa Forum</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Yorum Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Yorum
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Yorumunuzu yazın"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Yorum Gönder
          </button>
        </form>
      </div>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{comment.username}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(comment.createdAt, 'PPpp', { locale: tr })}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
    </div>
  );
} 