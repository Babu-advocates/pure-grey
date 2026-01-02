import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuestionFormProps {
    productId: string;
    onQuestionSubmitted: () => void;
}

export const QuestionForm = ({ productId, onQuestionSubmitted }: QuestionFormProps) => {
    const [question, setQuestion] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Login required",
                    description: "Please login to ask a question",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase
                .from('product_questions')
                .insert({
                    product_id: productId,
                    user_id: user.id,
                    question: question.trim(),
                });

            if (error) throw error;

            toast({
                title: "Question submitted",
                description: "Your question has been posted.",
            });

            setQuestion("");
            onQuestionSubmitted();
        } catch (error) {
            console.error('Error submitting question:', error);
            toast({
                title: "Error",
                description: "Failed to submit question. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Have a question? Search for answers"
                className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting || !question.trim()}>
                Ask Question
            </Button>
        </form>
    );
};
