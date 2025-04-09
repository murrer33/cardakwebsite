'use client';

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp, 
  where,
  updateDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

// Types
export interface Test {
  id?: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'image-based' | 'open-ended';
  text: string;
  imageUrl?: string;
  options?: Option[];
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Photo {
  id?: string;
  title: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  likes: number;
}

export interface ForumPost {
  id?: string;
  username: string;
  content: string;
  createdAt: Date;
}

// Tests Service
export const testsService = {
  async getAllTests(): Promise<Test[]> {
    const testsCollection = collection(db, 'tests');
    const testsQuery = query(testsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(testsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    } as Test));
  },
  
  async getTestById(id: string): Promise<Test | null> {
    const testDoc = doc(db, 'tests', id);
    const snapshot = await getDoc(testDoc);
    
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: (snapshot.data().createdAt as Timestamp).toDate()
    } as Test;
  },
  
  async createTest(test: Test): Promise<string> {
    const testsCollection = collection(db, 'tests');
    const docRef = await addDoc(testsCollection, {
      ...test,
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  },
  
  async updateTest(id: string, test: Partial<Test>): Promise<void> {
    const testDoc = doc(db, 'tests', id);
    await updateDoc(testDoc, { ...test });
  },
  
  async deleteTest(id: string): Promise<void> {
    const testDoc = doc(db, 'tests', id);
    await deleteDoc(testDoc);
  },
  
  async uploadTestImage(file: File, testId: string): Promise<string> {
    const storageRef = ref(storage, `tests/${testId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
};

// Photos Service
export const photosService = {
  async getAllPhotos(): Promise<Photo[]> {
    const photosCollection = collection(db, 'photos');
    const photosQuery = query(photosCollection, orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(photosQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: (doc.data().uploadedAt as Timestamp).toDate()
    } as Photo));
  },
  
  async uploadPhoto(photo: Omit<Photo, 'id' | 'url'>, file: File): Promise<string> {
    // Upload the image first
    const storageRef = ref(storage, `photos/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    // Save the photo metadata to Firestore
    const photosCollection = collection(db, 'photos');
    const photoData = {
      ...photo,
      url,
      uploadedAt: Timestamp.fromDate(new Date()),
      likes: 0
    };
    
    const docRef = await addDoc(photosCollection, photoData);
    return docRef.id;
  },
  
  async likePhoto(id: string): Promise<void> {
    const photoDoc = doc(db, 'photos', id);
    const snapshot = await getDoc(photoDoc);
    
    if (snapshot.exists()) {
      const currentLikes = snapshot.data().likes || 0;
      await updateDoc(photoDoc, { likes: currentLikes + 1 });
    }
  }
};

// Forum Service
export const forumService = {
  async getPosts(limitCount: number = 50): Promise<ForumPost[]> {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(postsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    } as ForumPost));
  },
  
  async createPost(post: Omit<ForumPost, 'id' | 'createdAt'>): Promise<string> {
    const postsCollection = collection(db, 'posts');
    const postData = {
      ...post,
      createdAt: Timestamp.fromDate(new Date())
    };
    
    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
  }
}; 