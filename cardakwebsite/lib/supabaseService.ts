import supabase from './supabaseClient';
import { 
  Test, 
  Question, 
  Option,
  Photo,
  ForumPost
} from './types';

// Tests Service
export const testsService = {
  async getAllTests(): Promise<Test[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
    
    return data as Test[];
  },
  
  async getTestById(id: string): Promise<Test> {
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
    
    return test as Test;
  },
  
  async createTest(test: Test): Promise<string> {
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
    if (test.questions) {
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
    }
    
    return testId;
  },
  
  async uploadTestImage(file: File, testId: string): Promise<string> {
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
  async getAllPhotos(): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('uploaded_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
    
    return data as Photo[];
  },
  
  async uploadPhoto(photo: Omit<Photo, 'id' | 'url' | 'uploaded_at' | 'likes'>, file: File): Promise<string> {
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
  
  async likePhoto(id: string): Promise<void> {
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
  async getPosts(limitCount: number = 50): Promise<ForumPost[]> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);
      
    if (error) {
      console.error('Error fetching forum posts:', error);
      throw error;
    }
    
    return data as ForumPost[];
  },
  
  async createPost(post: Omit<ForumPost, 'id' | 'created_at'>): Promise<string> {
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