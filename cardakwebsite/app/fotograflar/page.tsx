'use client';

import { useState } from 'react';
import Image from 'next/image';
import PhotoUpload from '../components/PhotoUpload';
import { Photo as PhotoType } from '../services/firebaseService';

// Mock photos for demonstration
const MOCK_PHOTOS: PhotoType[] = [
  {
    id: '1',
    title: 'Deniz Manzarası',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    uploadedBy: 'denizci',
    uploadedAt: new Date('2024-04-01'),
    likes: 24
  },
  {
    id: '2',
    title: 'Dağ Manzarası',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    uploadedBy: 'dagci',
    uploadedAt: new Date('2024-04-03'),
    likes: 18
  },
  {
    id: '3',
    title: 'Çiçekler',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
    uploadedBy: 'bahçıvan',
    uploadedAt: new Date('2024-04-05'),
    likes: 12
  },
  {
    id: '4',
    title: 'Mimari',
    url: 'https://images.unsplash.com/photo-1616578492900-ea5a8fc6c341',
    uploadedBy: 'mimar',
    uploadedAt: new Date('2024-04-07'),
    likes: 9
  },
  {
    id: '5',
    title: 'Yaban Hayatı',
    url: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131',
    uploadedBy: 'doğasever',
    uploadedAt: new Date('2024-04-09'),
    likes: 15
  },
  {
    id: '6',
    title: 'Şehir Manzarası',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    uploadedBy: 'şehirli',
    uploadedAt: new Date('2024-04-10'),
    likes: 22
  }
];

export default function FotograflarPage() {
  const [photos, setPhotos] = useState<PhotoType[]>(MOCK_PHOTOS);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handlePhotoUpload = async (file: File, title: string, username: string) => {
    setIsUploading(true);
    
    try {
      // In a real app, this would upload to Firebase
      // For now, we'll just simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPhoto: PhotoType = {
        id: Date.now().toString(),
        title,
        url: URL.createObjectURL(file),
        uploadedBy: username,
        uploadedAt: new Date(),
        likes: 0
      };
      
      setPhotos([newPhoto, ...photos]);
      setShowUploadForm(false);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleLike = (id: string) => {
    setPhotos(
      photos.map(photo => 
        photo.id === id ? { ...photo, likes: (photo.likes || 0) + 1 } : photo
      )
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fotoğraflar</h1>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          {showUploadForm ? 'İptal' : 'Yeni Fotoğraf Yükle'}
        </button>
      </div>
      
      {showUploadForm && (
        <div className="mb-8">
          <PhotoUpload onUpload={handlePhotoUpload} isUploading={isUploading} />
        </div>
      )}
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              onLike={() => handleLike(photo.id || '')} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Henüz hiç fotoğraf yüklenmemiş.</p>
          <button 
            onClick={() => setShowUploadForm(true)} 
            className="text-primary hover:underline"
          >
            İlk fotoğrafı siz yükleyin!
          </button>
        </div>
      )}
    </div>
  );
}

function PhotoCard({ photo, onLike }: { photo: PhotoType; onLike: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{photo.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {photo.uploadedBy} tarafından
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {photo.uploadedAt.toLocaleDateString('tr-TR')}
          </span>
        </div>
        <div className="flex items-center justify-end">
          <button 
            className="text-gray-500 hover:text-red-500 flex items-center"
            onClick={onLike}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{photo.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 