-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create product_questions table
CREATE TABLE IF NOT EXISTS public.product_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create product_answers table
CREATE TABLE IF NOT EXISTS public.product_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES public.product_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_answers ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own reviews" 
ON public.reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for questions
CREATE POLICY "Questions are viewable by everyone" 
ON public.product_questions FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert questions" 
ON public.product_questions FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policies for answers
CREATE POLICY "Answers are viewable by everyone" 
ON public.product_answers FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert answers" 
ON public.product_answers FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create a view to easily get user names with reviews if needed, 
-- or we can just join with profiles in the frontend query.
-- For now, we will rely on joining in the client.
