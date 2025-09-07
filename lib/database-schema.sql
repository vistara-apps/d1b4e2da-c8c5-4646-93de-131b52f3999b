-- NicheConnect Database Schema for Supabase
-- This file contains the complete database schema for the NicheConnect application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    wallet_address VARCHAR(42),
    profile JSONB NOT NULL DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'founders-circle')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    opportunity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('grant', 'competition', 'investor', 'accelerator')),
    deadline DATE NOT NULL,
    eligibility TEXT[] NOT NULL,
    url VARCHAR(500) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    amount VARCHAR(100),
    location VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Masterclasses table
CREATE TABLE IF NOT EXISTS masterclasses (
    masterclass_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(500) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    duration VARCHAR(50),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructor VARCHAR(255),
    thumbnail VARCHAR(500),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
    connection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- Feedback sessions table
CREATE TABLE IF NOT EXISTS feedback_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    participants UUID[] DEFAULT '{}',
    topic VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    feedback JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed')),
    max_participants INTEGER DEFAULT 5,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User submissions table (for tracking applications to opportunities)
CREATE TABLE IF NOT EXISTS user_submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(opportunity_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')),
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- User progress table (for tracking masterclass progress)
CREATE TABLE IF NOT EXISTS user_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    masterclass_id UUID NOT NULL REFERENCES masterclasses(masterclass_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, masterclass_id)
);

-- Saved opportunities table
CREATE TABLE IF NOT EXISTS saved_opportunities (
    save_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(opportunity_id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- User notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(featured);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_tags ON opportunities USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_masterclasses_difficulty ON masterclasses(difficulty);
CREATE INDEX IF NOT EXISTS idx_masterclasses_is_premium ON masterclasses(is_premium);
CREATE INDEX IF NOT EXISTS idx_masterclasses_tags ON masterclasses USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_connections_user1_id ON connections(user1_id);
CREATE INDEX IF NOT EXISTS idx_connections_user2_id ON connections(user2_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);

CREATE INDEX IF NOT EXISTS idx_feedback_sessions_creator_id ON feedback_sessions(creator_id);
CREATE INDEX IF NOT EXISTS idx_feedback_sessions_status ON feedback_sessions(status);
CREATE INDEX IF NOT EXISTS idx_feedback_sessions_participants ON feedback_sessions USING GIN(participants);

CREATE INDEX IF NOT EXISTS idx_user_submissions_user_id ON user_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_opportunity_id ON user_submissions(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_status ON user_submissions(status);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_masterclass_id ON user_progress(masterclass_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user_id ON saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_opportunity_id ON saved_opportunities(opportunity_id);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_masterclasses_updated_at BEFORE UPDATE ON masterclasses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_sessions_updated_at BEFORE UPDATE ON feedback_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_submissions_updated_at BEFORE UPDATE ON user_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile and public profiles of others
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Connection policies
CREATE POLICY "Users can view their connections" ON connections FOR SELECT USING (
    auth.uid()::text = user1_id::text OR auth.uid()::text = user2_id::text
);
CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (
    auth.uid()::text = user1_id::text
);
CREATE POLICY "Users can update their connections" ON connections FOR UPDATE USING (
    auth.uid()::text = user1_id::text OR auth.uid()::text = user2_id::text
);

-- Feedback session policies
CREATE POLICY "Users can view feedback sessions they're involved in" ON feedback_sessions FOR SELECT USING (
    auth.uid()::text = creator_id::text OR auth.uid()::text = ANY(participants)
);
CREATE POLICY "Users can create feedback sessions" ON feedback_sessions FOR INSERT WITH CHECK (
    auth.uid()::text = creator_id::text
);
CREATE POLICY "Creators can update their feedback sessions" ON feedback_sessions FOR UPDATE USING (
    auth.uid()::text = creator_id::text
);

-- User submission policies
CREATE POLICY "Users can view their own submissions" ON user_submissions FOR SELECT USING (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can create their own submissions" ON user_submissions FOR INSERT WITH CHECK (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can update their own submissions" ON user_submissions FOR UPDATE USING (
    auth.uid()::text = user_id::text
);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT USING (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can create their own progress" ON user_progress FOR INSERT WITH CHECK (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (
    auth.uid()::text = user_id::text
);

-- Saved opportunities policies
CREATE POLICY "Users can view their saved opportunities" ON saved_opportunities FOR SELECT USING (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can save opportunities" ON saved_opportunities FOR INSERT WITH CHECK (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can remove saved opportunities" ON saved_opportunities FOR DELETE USING (
    auth.uid()::text = user_id::text
);

-- User notifications policies
CREATE POLICY "Users can view their own notifications" ON user_notifications FOR SELECT USING (
    auth.uid()::text = user_id::text
);
CREATE POLICY "Users can update their own notifications" ON user_notifications FOR UPDATE USING (
    auth.uid()::text = user_id::text
);

-- Insert sample data for development
INSERT INTO opportunities (title, description, type, deadline, eligibility, url, tags, amount, location, featured) VALUES
('Student Startup Grant 2024', 'Up to $50,000 in funding for innovative student-led startups focusing on sustainability and social impact.', 'grant', '2024-03-15', ARRAY['Currently enrolled student', 'Team of 2-4 members'], 'https://example.com/grant', ARRAY['Sustainability', 'Social Impact', 'Early Stage'], '$50,000', 'Global', true),
('TechCrunch Startup Battlefield', 'Compete for $100,000 and the chance to present at TechCrunch Disrupt.', 'competition', '2024-02-28', ARRAY['Early-stage startup', 'Less than $2M raised'], 'https://example.com/competition', ARRAY['Technology', 'Competition', 'Pitch'], '$100,000', 'San Francisco', false),
('Y Combinator W24', 'Join the world''s most successful startup accelerator program.', 'accelerator', '2024-01-31', ARRAY['Early-stage startup', 'Scalable business model'], 'https://example.com/yc', ARRAY['Accelerator', 'Mentorship', 'Funding'], '$500,000', 'San Francisco', true);

INSERT INTO masterclasses (title, description, url, tags, duration, difficulty, instructor, is_premium) VALUES
('Lean Canvas Fundamentals', 'Learn to create and validate your business model using the Lean Canvas methodology.', 'https://example.com/masterclass1', ARRAY['Business Model', 'Validation', 'Strategy'], '45 min', 'beginner', 'Sarah Chen', false),
('Advanced Fundraising Strategies', 'Master the art of raising capital from angels, VCs, and strategic investors.', 'https://example.com/masterclass2', ARRAY['Fundraising', 'Investors', 'Pitch Deck'], '90 min', 'advanced', 'Michael Rodriguez', true),
('Product-Market Fit Essentials', 'Discover how to find and validate product-market fit for your startup.', 'https://example.com/masterclass3', ARRAY['Product Management', 'Market Research', 'Validation'], '60 min', 'intermediate', 'Alex Kim', false);

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'connections', (
            SELECT COUNT(*) FROM connections 
            WHERE (user1_id = user_uuid OR user2_id = user_uuid) AND status = 'accepted'
        ),
        'submissions', (
            SELECT COUNT(*) FROM user_submissions WHERE user_id = user_uuid
        ),
        'completed_masterclasses', (
            SELECT COUNT(*) FROM user_progress 
            WHERE user_id = user_uuid AND status = 'completed'
        ),
        'feedback_sessions_created', (
            SELECT COUNT(*) FROM feedback_sessions WHERE creator_id = user_uuid
        ),
        'feedback_sessions_joined', (
            SELECT COUNT(*) FROM feedback_sessions WHERE user_uuid = ANY(participants)
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
