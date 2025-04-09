-- Schema for Çardak Supabase Database

-- Tests table
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'image-based', 'open-ended')),
  text TEXT NOT NULL,
  image_url TEXT,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Options table (for multiple choice and image-based questions)
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  likes INTEGER DEFAULT 0
);

-- Forum posts table
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test results table
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  user_id UUID, -- Can be NULL for anonymous test takers
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test answers table
CREATE TABLE test_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES options(id) ON DELETE SET NULL,
  open_answer TEXT,
  is_correct BOOLEAN
);

-- Create RLS policies

-- Enable RLS on all tables
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;

-- Tests policies
CREATE POLICY "Tests are viewable by everyone" 
ON tests FOR SELECT USING (true);

CREATE POLICY "Tests can be created by anyone" 
ON tests FOR INSERT WITH CHECK (true);

CREATE POLICY "Tests can be updated by their creator" 
ON tests FOR UPDATE USING (auth.uid()::text = created_by);

CREATE POLICY "Tests can be deleted by their creator" 
ON tests FOR DELETE USING (auth.uid()::text = created_by);

-- Questions policies (follow test access)
CREATE POLICY "Questions are viewable by everyone" 
ON questions FOR SELECT USING (true);

-- Options policies (follow question access)
CREATE POLICY "Options are viewable by everyone" 
ON options FOR SELECT USING (true);

-- Photos policies
CREATE POLICY "Photos are viewable by everyone" 
ON photos FOR SELECT USING (true);

CREATE POLICY "Photos can be created by anyone" 
ON photos FOR INSERT WITH CHECK (true);

-- Forum posts policies
CREATE POLICY "Forum posts are viewable by everyone" 
ON forum_posts FOR SELECT USING (true);

CREATE POLICY "Forum posts can be created by anyone" 
ON forum_posts FOR INSERT WITH CHECK (true);

-- Test results policies
CREATE POLICY "Test results are viewable by their creator" 
ON test_results FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

CREATE POLICY "Test results can be created by anyone" 
ON test_results FOR INSERT WITH CHECK (true);

-- Test answers policies
CREATE POLICY "Test answers are viewable by the test result creator" 
ON test_answers FOR SELECT USING (
  test_result_id IN (
    SELECT id FROM test_results WHERE auth.uid()::text = user_id::text OR user_id IS NULL
  )
);

-- Create storage buckets
-- Note: This needs to be done via the Supabase dashboard or API, not in SQL
-- Create two buckets: 'photos' and 'test-images' with public read access 