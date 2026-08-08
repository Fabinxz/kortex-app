-- Kortex Database Schema

-- Enums
CREATE TYPE topic_status AS ENUM ('TODO', 'IN_PROGRESS', 'MASTERED');
CREATE TYPE error_type AS ENUM ('INTERPRETATION', 'CONCEPTUAL', 'CALCULATION', 'TIME', 'EMOTIONAL', 'DISTRACTION');

-- Users
CREATE TABLE IF NOT EXISTS kortex_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects (Materias Gerais)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kortex_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight INT DEFAULT 1,
  color TEXT DEFAULT '#00ff41',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Topics (Topicos Especificos)
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  difficulty_level INT DEFAULT 1,
  is_wall_of_stone BOOLEAN DEFAULT false,
  status topic_status DEFAULT 'TODO',
  mastery_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kortex_users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  feynman_explanation TEXT
);

-- Simulations
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kortex_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  total_score INT NOT NULL
);

-- Question Errors (Sniper de Erros)
CREATE TABLE IF NOT EXISTS question_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES simulations(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  correction TEXT NOT NULL,
  error_type error_type NOT NULL,
  date TIMESTAMPTZ DEFAULT now()
);

-- Daily Bio Logs
CREATE TABLE IF NOT EXISTS daily_bio_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kortex_users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ DEFAULT now(),
  sleep_hours FLOAT NOT NULL,
  sleep_quality INT NOT NULL,
  exercise BOOLEAN DEFAULT false,
  clean_diet BOOLEAN DEFAULT false,
  mood INT NOT NULL
);

-- Flashcards (SRS)
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kortex_users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  next_review TIMESTAMPTZ NOT NULL,
  interval_days INT DEFAULT 1,
  ease_factor FLOAT DEFAULT 2.5
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic ON study_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_question_errors_topic ON question_errors(topic_id);
CREATE INDEX IF NOT EXISTS idx_daily_bio_logs_user ON daily_bio_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_user ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_topic ON flashcards(topic_id);
