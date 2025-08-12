-- Create itineraries table with proper structure and RLS
create table itineraries (
  id uuid default uuid_generate_v4() primary key,
  clerk_user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  data jsonb not null,
  destination text not null,
  start_date date not null,
  end_date date not null
);

-- Add Row Level Security (RLS) policies
alter table itineraries enable row level security;

-- Allow users to see only their own itineraries
create policy "Users can view their own itineraries"
  on itineraries for select
  using (clerk_user_id::text = current_setting('request.headers')::json->>'x-clerk-user-id');

-- Allow users to insert their own itineraries
create policy "Users can insert their own itineraries"
  on itineraries for insert
  with check (clerk_user_id::text = current_setting('request.headers')::json->>'x-clerk-user-id');

-- Create indexes for better query performance
create index itineraries_clerk_user_id_idx on itineraries(clerk_user_id);
create index itineraries_destination_idx on itineraries(destination);
create index itineraries_dates_idx on itineraries(start_date, end_date); 