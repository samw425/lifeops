-- Add night review columns to daily_checkins
ALTER TABLE daily_checkins
ADD COLUMN what_went_well TEXT,
ADD COLUMN what_broke TEXT,
ADD COLUMN ai_suggestion TEXT,
ADD COLUMN night_review_completed_at TIMESTAMPTZ;
