-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (id::text = current_setting('request.jwt.claims')::json->>'sub'); 