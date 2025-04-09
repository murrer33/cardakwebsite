#!/usr/bin/env node

// This script seeds the Supabase database with initial data
// Run with: node scripts/seed-database.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample data
const sampleTests = [
  {
    title: 'Genel Kültür Testi',
    description: 'Genel kültür bilginizi ölçen 10 soruluk kısa bir test.',
    created_by: 'admin',
    created_at: new Date().toISOString(),
    questions: [
      {
        type: 'multiple-choice',
        text: 'Türkiye\'nin başkenti neresidir?',
        options: [
          { text: 'İstanbul', is_correct: false },
          { text: 'Ankara', is_correct: true },
          { text: 'İzmir', is_correct: false },
          { text: 'Bursa', is_correct: false },
        ],
      },
      {
        type: 'multiple-choice',
        text: 'Hangisi bir gezegen değildir?',
        options: [
          { text: 'Mars', is_correct: false },
          { text: 'Venüs', is_correct: false },
          { text: 'Plüton', is_correct: true },
          { text: 'Satürn', is_correct: false },
        ],
      },
      {
        type: 'open-ended',
        text: 'Albert Einstein\'ın en ünlü teorisi nedir?',
      },
    ],
  },
];

const samplePhotos = [
  {
    title: 'Deniz Manzarası',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    uploaded_by: 'denizci',
    uploaded_at: new Date().toISOString(),
    likes: 24
  },
  {
    title: 'Dağ Manzarası',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    uploaded_by: 'dagci',
    uploaded_at: new Date().toISOString(),
    likes: 18
  },
  {
    title: 'Çiçekler',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
    uploaded_by: 'bahçıvan',
    uploaded_at: new Date().toISOString(),
    likes: 12
  },
];

const sampleForumPosts = [
  {
    username: 'yolcu',
    content: 'Merhaba! Bu forum çok güzel olmuş.',
    created_at: new Date().toISOString()
  },
  {
    username: 'gezgin',
    content: 'Bugün hava çok güzeldi, dışarıda vakit geçirmek için harika bir gün.',
    created_at: new Date().toISOString()
  },
  {
    username: 'kitapsever',
    content: 'En son hangi kitabı okudunuz? Ben "Sapiens" okuyorum şu anda.',
    created_at: new Date().toISOString()
  },
];

// Seeding function
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed forum posts
    console.log('Seeding forum posts...');
    const { data: forumData, error: forumError } = await supabase
      .from('forum_posts')
      .insert(sampleForumPosts)
      .select();
    
    if (forumError) {
      console.error('Error seeding forum posts:', forumError);
    } else {
      console.log(`✅ Successfully seeded ${forumData.length} forum posts`);
    }
    
    // Seed photos
    console.log('Seeding photos...');
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .insert(samplePhotos)
      .select();
    
    if (photoError) {
      console.error('Error seeding photos:', photoError);
    } else {
      console.log(`✅ Successfully seeded ${photoData.length} photos`);
    }
    
    // Seed tests (more complex due to relations)
    console.log('Seeding tests...');
    for (const test of sampleTests) {
      const questions = test.questions;
      delete test.questions;
      
      // Insert test
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .insert([test])
        .select();
      
      if (testError) {
        console.error('Error seeding test:', testError);
        continue;
      }
      
      const testId = testData[0].id;
      
      // Insert questions
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const options = question.options;
        delete question.options;
        
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .insert([{
            test_id: testId,
            ...question,
            order: i
          }])
          .select();
        
        if (questionError) {
          console.error('Error seeding question:', questionError);
          continue;
        }
        
        const questionId = questionData[0].id;
        
        // Insert options if applicable
        if (options && options.length > 0) {
          const optionsToInsert = options.map(option => ({
            question_id: questionId,
            ...option
          }));
          
          const { error: optionsError } = await supabase
            .from('options')
            .insert(optionsToInsert);
          
          if (optionsError) {
            console.error('Error seeding options:', optionsError);
          }
        }
      }
      
      console.log(`✅ Successfully seeded test: ${test.title}`);
    }
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase(); 