-- Drop existing itineraries table
DROP TABLE IF EXISTS itineraries;

-- Create updated itineraries table
CREATE TABLE itineraries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    destination TEXT NOT NULL,
    dates JSONB NOT NULL,
    header_image TEXT NOT NULL,
    overview JSONB NOT NULL,
    airport JSONB NOT NULL,
    hotels JSONB NOT NULL,
    activities JSONB NOT NULL,
    transportation JSONB NOT NULL,
    estimated_cost JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own itineraries" 
    ON itineraries FOR SELECT 
    USING (clerk_user_id = current_setting('request.headers')::json->>'x-clerk-user-id');

CREATE POLICY "Users can insert their own itineraries" 
    ON itineraries FOR INSERT 
    WITH CHECK (clerk_user_id = current_setting('request.headers')::json->>'x-clerk-user-id');

CREATE POLICY "Users can update their own itineraries" 
    ON itineraries FOR UPDATE 
    USING (clerk_user_id = current_setting('request.headers')::json->>'x-clerk-user-id');

CREATE POLICY "Users can delete their own itineraries" 
    ON itineraries FOR DELETE 
    USING (clerk_user_id = current_setting('request.headers')::json->>'x-clerk-user-id'); 