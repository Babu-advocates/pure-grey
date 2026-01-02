import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    // We'll try to fetch profile data if possible, or just show generic user
}

interface ReviewListProps {
    productId: string;
    refreshTrigger: number;
}

export const ReviewList = ({ productId, refreshTrigger }: ReviewListProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('product_id', productId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setReviews(data || []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, refreshTrigger]);

    if (loading) {
        return <div className="text-center py-4">Loading reviews...</div>;
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-muted rounded-full p-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Customer</p>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 ${star <= review.rating
                                                    ? "fill-primary text-primary"
                                                    : "text-muted-foreground/30"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};
