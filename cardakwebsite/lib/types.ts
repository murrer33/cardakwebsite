// TypeScript interfaces for our application models

export interface Test {
  id?: string;
  title: string;
  description: string;
  created_by: string;
  created_at: Date | string;
  questions?: Question[];
}

export interface Question {
  id?: string;
  test_id?: string;
  type: 'multiple-choice' | 'image-based' | 'open-ended';
  text: string;
  image_url?: string;
  order?: number;
  options?: Option[];
}

export interface Option {
  id?: string;
  question_id?: string;
  text: string;
  is_correct: boolean;
}

export interface Photo {
  id?: string;
  title: string;
  url: string;
  uploaded_by: string;
  uploaded_at: Date | string;
  likes: number;
}

export interface ForumPost {
  id?: string;
  username: string;
  content: string;
  created_at: Date | string;
}

export interface User {
  id: string;
  email?: string;
  username?: string;
  created_at?: Date | string;
}

export interface TestResult {
  id?: string;
  test_id: string;
  user_id?: string;
  score: number;
  answers: Answer[];
  created_at: Date | string;
}

export interface Answer {
  question_id: string;
  selected_option_id?: string;
  open_answer?: string;
  is_correct?: boolean;
} 