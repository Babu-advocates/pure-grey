import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted: () => void;
}

export const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Login required",
                    description: "Please login to submit a review",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase
                .from('reviews')
                .insert({
                    product_id: productId,
                    user_id: user.id,
                    rating,
                    comment,
                });

            if (error) throw error;

            toast({
                title: "Review submitted",
                description: "Thank you for your feedback!",
            });

            setRating(0);
            setComment("");
            onReviewSubmitted();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold">Write a Review</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-6 h-6 cursor-pointer transition-colors ${star <= (hoverRating || rating)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="min-h-[100px]"
                />
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
};
