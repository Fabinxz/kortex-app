-- Add questions_count column to daily_bio_logs
ALTER TABLE daily_bio_logs ADD COLUMN IF NOT EXISTS questions_count INT DEFAULT 0;

-- Update existing bio log entries with question counts
UPDATE daily_bio_logs SET questions_count = 45 WHERE date::date = (now() - interval '13 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 30 WHERE date::date = (now() - interval '12 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 55 WHERE date::date = (now() - interval '11 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 40 WHERE date::date = (now() - interval '10 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 70 WHERE date::date = (now() - interval '9 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 20 WHERE date::date = (now() - interval '8 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 60 WHERE date::date = (now() - interval '7 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 35 WHERE date::date = (now() - interval '6 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 50 WHERE date::date = (now() - interval '5 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 25 WHERE date::date = (now() - interval '4 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 65 WHERE date::date = (now() - interval '3 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 55 WHERE date::date = (now() - interval '2 days')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 40 WHERE date::date = (now() - interval '1 day')::date AND user_id = '00000000-0000-0000-0000-000000000001';
UPDATE daily_bio_logs SET questions_count = 50 WHERE date::date = now()::date AND user_id = '00000000-0000-0000-0000-000000000001';
