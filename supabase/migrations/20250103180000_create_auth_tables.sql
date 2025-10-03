-- Enable uuid extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    token_hash text UNIQUE NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Refresh tokens are viewable by owners" ON public.refresh_tokens;
DROP POLICY IF EXISTS "Refresh tokens can be inserted by owners" ON public.refresh_tokens;
DROP POLICY IF EXISTS "Refresh tokens can be deleted by owners" ON public.refresh_tokens;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
ON public.users FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own data"
ON public.users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own data"
ON public.users FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create policies for refresh_tokens table
CREATE POLICY "Refresh tokens are viewable by owners"
ON public.refresh_tokens FOR SELECT
USING (true);

CREATE POLICY "Refresh tokens can be inserted by owners"
ON public.refresh_tokens FOR INSERT
WITH CHECK (true);

CREATE POLICY "Refresh tokens can be deleted by owners"
ON public.refresh_tokens FOR DELETE
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON public.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON public.refresh_tokens(expires_at);

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.refresh_tokens TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
