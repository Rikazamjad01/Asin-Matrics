-- 1. Add email to profiles (if missing)
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- 2. Create Amazon Accounts Table
CREATE TABLE IF NOT EXISTS public.amazon_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id text NOT NULL,
    marketplace_id text NOT NULL,
    region text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, seller_id)
);

-- 3. Create Amazon Tokens Table
CREATE TABLE IF NOT EXISTS public.amazon_tokens (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    amazon_account_id uuid REFERENCES public.amazon_accounts(id) ON DELETE CASCADE,
    refresh_token text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(amazon_account_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.amazon_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amazon_tokens ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for amazon_accounts
-- Users can only see their own accounts
CREATE POLICY "Users can view their own Amazon accounts"
ON public.amazon_accounts FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own accounts
CREATE POLICY "Users can insert their own Amazon accounts"
ON public.amazon_accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own accounts
CREATE POLICY "Users can update their own Amazon accounts"
ON public.amazon_accounts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own accounts
CREATE POLICY "Users can delete their own Amazon accounts"
ON public.amazon_accounts FOR DELETE
USING (auth.uid() = user_id);


-- 6. RLS Policies for amazon_tokens
-- Note: Often, you don't want users directly selecting refresh tokens from the frontend,
-- but we allow it here restricted to their own account just in case it's needed for UI checks.
-- Edge Functions bypass RLS because they use the Service Role Key.
CREATE POLICY "Users can view their own tokens through accounts"
ON public.amazon_tokens FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.amazon_accounts
    WHERE amazon_accounts.id = amazon_tokens.amazon_account_id
    AND amazon_accounts.user_id = auth.uid()
));

CREATE POLICY "Users can update their own tokens through accounts"
ON public.amazon_tokens FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.amazon_accounts
    WHERE amazon_accounts.id = amazon_tokens.amazon_account_id
    AND amazon_accounts.user_id = auth.uid()
));

-- 7. Add an updated_at trigger for amazon_tokens
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_amazon_tokens_modtime ON public.amazon_tokens;
CREATE TRIGGER update_amazon_tokens_modtime
BEFORE UPDATE ON public.amazon_tokens
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
