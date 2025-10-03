-- Finance Tracker Tables Migration
-- Enable uuid extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create transaction categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    color text DEFAULT '#3B82F6',
    icon text DEFAULT 'category',
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    amount numeric(15,2) NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    description text,
    date timestamp with time zone DEFAULT now() NOT NULL,
    tags text[] DEFAULT '{}',
    location text,
    payment_method text,
    notes text,
    is_recurring boolean DEFAULT false,
    recurring_frequency text, -- 'daily', 'weekly', 'monthly', 'yearly'
    recurring_end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create savings goals table
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    target_amount numeric(15,2) NOT NULL,
    current_amount numeric(15,2) DEFAULT 0,
    target_date date,
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    color text DEFAULT '#10B981',
    icon text DEFAULT 'target',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create savings tools table
CREATE TABLE IF NOT EXISTS public.savings_tools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('bank_account', 'investment', 'crypto', 'real_estate', 'other')),
    current_value numeric(15,2) DEFAULT 0,
    initial_investment numeric(15,2) DEFAULT 0,
    description text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create monthly reports table
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL CHECK (month >= 1 AND month <= 12),
    total_income numeric(15,2) DEFAULT 0,
    total_expenses numeric(15,2) DEFAULT 0,
    net_savings numeric(15,2) DEFAULT 0,
    top_categories jsonb DEFAULT '{}',
    pdf_report_base64 text,
    generated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(user_id, year, month)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can manage their own categories" ON public.categories
    FOR ALL USING (true);

-- Create policies for transactions
CREATE POLICY "Users can manage their own transactions" ON public.transactions
    FOR ALL USING (true);

-- Create policies for savings goals
CREATE POLICY "Users can manage their own savings goals" ON public.savings_goals
    FOR ALL USING (true);

-- Create policies for savings tools
CREATE POLICY "Users can manage their own savings tools" ON public.savings_tools
    FOR ALL USING (true);

-- Create policies for monthly reports
CREATE POLICY "Users can view their own monthly reports" ON public.monthly_reports
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_status ON public.savings_goals(status);

CREATE INDEX IF NOT EXISTS idx_savings_tools_user_id ON public.savings_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_tools_type ON public.savings_tools(type);

CREATE INDEX IF NOT EXISTS idx_monthly_reports_user_id ON public.monthly_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_year_month ON public.monthly_reports(user_id, year, month);

-- Grant permissions
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.savings_goals TO authenticated;
GRANT ALL ON public.savings_tools TO authenticated;
GRANT ALL ON public.monthly_reports TO authenticated;

-- Default categories will be created per user during registration
