import supabase from './supabaseClient';

// Types (for TypeScript reference)
/*
export interface Test {
  id?: string;
  title: string;
  description: string;
  created_by: string;
  created_at: Date;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'image-based' | 'open-ended';
  text: string;
  image_url?: string;
  options?: Option[];
}

export interface Option {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Photo {
  id?: string;
  title: string;
  url: string;
  uploaded_by: string;
  uploaded_at: Date;
  likes: number;
}

export interface ForumPost {
  id?: string;
  username: string;
  content: string;
  created_at: Date;
}
*/

// Tests Service
export const testsService = {
  async getAllTests() {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
    
    return data;
  },
  
  async getTestById(id) {
    // First get the test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (testError) {
      console.error('Error fetching test:', testError);
      throw testError;
    }
    
    // Then get the questions for this test
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', id)
      .order('order', { ascending: true });
    
    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      throw questionsError;
    }
    
    // For each question, get its options if applicable
    for (const question of questions) {
      if (question.type !== 'open-ended') {
        const { data: options, error: optionsError } = await supabase
          .from('options')
          .select('*')
          .eq('question_id', question.id);
        
        if (optionsError) {
          console.error('Error fetching options:', optionsError);
          throw optionsError;
        }
        
        question.options = options;
      }
    }
    
    // Combine test and questions
    test.questions = questions;
    
    return test;
  },
  
  async createTest(test) {
    // First insert the test
    const { data: newTest, error: testError } = await supabase
      .from('tests')
      .insert([{
        title: test.title,
        description: test.description,
        created_by: test.created_by,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (testError) {
      console.error('Error creating test:', testError);
      throw testError;
    }
    
    const testId = newTest[0].id;
    
    // Then insert each question
    for (let i = 0; i < test.questions.length; i++) {
      const question = test.questions[i];
      
      const { data: newQuestion, error: questionError } = await supabase
        .from('questions')
        .insert([{
          test_id: testId,
          type: question.type,
          text: question.text,
          image_url: question.image_url || null,
          order: i
        }])
        .select();
      
      if (questionError) {
        console.error('Error creating question:', questionError);
        throw questionError;
      }
      
      const questionId = newQuestion[0].id;
      
      // Insert options if applicable
      if (question.options && question.options.length > 0) {
        const optionsToInsert = question.options.map(option => ({
          question_id: questionId,
          text: option.text,
          is_correct: option.is_correct
        }));
        
        const { error: optionsError } = await supabase
          .from('options')
          .insert(optionsToInsert);
        
        if (optionsError) {
          console.error('Error creating options:', optionsError);
          throw optionsError;
        }
      }
    }
    
    return testId;
  },
  
  async uploadTestImage(file, testId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${testId}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('test-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading test image:', error);
      throw error;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('test-images')
      .getPublicUrl(fileName);
      
    return data.publicUrl;
  }
};

// Photos Service
export const photosService = {
  async getAllPhotos() {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('uploaded_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
    
    return data;
  },
  
  async uploadPhoto(photo, file) {
    // Upload the image first
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);
    
    // Save the photo metadata to the database
    const { data, error } = await supabase
      .from('photos')
      .insert([{
        title: photo.title,
        url: urlData.publicUrl,
        uploaded_by: photo.uploaded_by,
        uploaded_at: new Date().toISOString(),
        likes: 0
      }])
      .select();
      
    if (error) {
      console.error('Error saving photo metadata:', error);
      throw error;
    }
    
    return data[0].id;
  },
  
  async likePhoto(id) {
    // First get the current likes count
    const { data: photo, error: getError } = await supabase
      .from('photos')
      .select('likes')
      .eq('id', id)
      .single();
      
    if (getError) {
      console.error('Error getting photo likes:', getError);
      throw getError;
    }
    
    // Then update with incremented count
    const { error: updateError } = await supabase
      .from('photos')
      .update({ likes: (photo.likes || 0) + 1 })
      .eq('id', id);
      
    if (updateError) {
      console.error('Error updating photo likes:', updateError);
      throw updateError;
    }
  }
};

// Forum Service
export const forumService = {
  async getPosts(limitCount = 50) {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);
      
    if (error) {
      console.error('Error fetching forum posts:', error);
      throw error;
    }
    
    return data;
  },
  
  async createPost(post) {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([{
        username: post.username,
        content: post.content,
        created_at: new Date().toISOString()
      }])
      .select();
      
    if (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
    
    return data[0].id;
  }
}; 