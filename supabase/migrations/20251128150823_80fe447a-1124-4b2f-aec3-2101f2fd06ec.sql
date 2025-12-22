-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories are viewable by everyone
CREATE POLICY "Categories are viewable by everyone"
ON public.categories
FOR SELECT
USING (true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories based on existing product categories
INSERT INTO public.categories (name, icon, color) VALUES
  ('Sparklers', 'Sparkles', 'text-primary'),
  ('Rockets', 'Rocket', 'text-secondary'),
  ('Flower Pots', 'FlowerIcon', 'text-accent'),
  ('Ground Chakkars', 'Flame', 'text-primary'),
  ('Combo Packs', 'Package', 'text-secondary'),
  ('Family Boxes', 'Gift', 'text-accent'),
  ('Night Sky', 'Lightbulb', 'text-primary');