import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnswerFormProps {
    questionId: string;
    onAnswerSubmitted: () => void;
    onCancel: () => void;
}

export const AnswerForm = ({ questionId, onAnswerSubmitted, onCancel }: AnswerFormProps) => {
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim()) return;

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Login required",
                    description: "Please login to submit an answer",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase
                .from('product_answers')
                .insert({
                    question_id: questionId,
                    user_id: user.id,
                    answer: answer.trim(),
                });

            if (error) throw error;

            toast({
                title: "Answer submitted",
                description: "Thank you for contributing!",
            });

            setAnswer("");
            onAnswerSubmitted();
        } catch (error) {
            console.error('Error submitting answer:', error);
            toast({
                title: "Error",
                description: "Failed to submit answer. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mt-4 ml-4">
            <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[80px]"
            />
            <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isSubmitting || !answer.trim()}>
                    Submit Answer
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
