import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AnswerForm } from "./AnswerForm";

interface Answer {
    id: string;
    answer: string;
    created_at: string;
    user_id: string;
}

interface Question {
    id: string;
    question: string;
    created_at: string;
    user_id: string;
    answers: Answer[];
}

interface QuestionListProps {
    productId: string;
    refreshTrigger: number;
}

export const QuestionList = ({ productId, refreshTrigger }: QuestionListProps) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [answeringTo, setAnsweringTo] = useState<string | null>(null);

    const fetchQuestions = async () => {
        try {
            // First fetch questions
            const { data: questionsData, error: questionsError } = await supabase
                .from('product_questions')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (questionsError) throw questionsError;

            if (!questionsData) {
                setQuestions([]);
                return;
            }

            // Then fetch answers for these questions
            // Ideally we would use a join, but let's keep it simple with separate requests or client-side mapping for now
            // Actually, let's fetch all answers for these questions
            const questionIds = questionsData.map(q => q.id);

            const { data: answersData, error: answersError } = await supabase
                .from('product_answers')
                .select('*')
                .in('question_id', questionIds)
                .order('created_at', { ascending: true });

            if (answersError) throw answersError;

            // Group answers by question
            const questionsWithAnswers = questionsData.map(q => ({
                ...q,
                answers: answersData?.filter(a => a.question_id === q.id) || []
            }));

            setQuestions(questionsWithAnswers);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [productId, refreshTrigger]);

    if (loading) {
        return <div className="text-center py-4">Loading Q&A...</div>;
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No questions yet. Be the first to ask!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {questions.map((q) => (
                <div key={q.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-sm bg-muted w-6 h-6 flex items-center justify-center rounded">Q:</span>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{q.question}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Asked {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        <div className="ml-8 space-y-4">
                            {q.answers.map((a) => (
                                <div key={a.id} className="flex items-start gap-2">
                                    <span className="font-bold text-sm text-primary w-6 h-6 flex items-center justify-center rounded">A:</span>
                                    <div>
                                        <p className="text-sm text-foreground/90">{a.answer}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Answered {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {answeringTo === q.id ? (
                                <AnswerForm
                                    questionId={q.id}
                                    onAnswerSubmitted={() => {
                                        setAnsweringTo(null);
                                        fetchQuestions();
                                    }}
                                    onCancel={() => setAnsweringTo(null)}
                                />
                            ) : (
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
                                    onClick={() => setAnsweringTo(q.id)}
                                >
                                    Answer this question
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
