import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Menu, Trash2, MessageSquare, Star, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import krLogo from "@/assets/kr-fireworks-logo.png";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AdminReviews = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [adminUser, setAdminUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Reply State
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [replyText, setReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);

    // Expanded questions state
    const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        checkAdminAuth();
    }, [navigate]);

    const checkAdminAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            navigate('/admin');
            return;
        }

        const { data: isAdminData } = await supabase.rpc('is_admin', {
            _user_id: session.user.id
        });

        if (!isAdminData) {
            await supabase.auth.signOut();
            navigate('/admin');
            return;
        }

        const { data: adminDetails } = await supabase
            .from('admin')
            .select('username, email')
            .eq('user_id', session.user.id)
            .maybeSingle();

        setAdminUser({
            id: session.user.id,
            username: adminDetails?.username || 'Admin',
            email: adminDetails?.email || session.user.email
        });

        fetchReviews();
        fetchQuestions();
    };

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
          *,
          products(name),
          profiles:user_id(full_name, email)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast({
                title: "Error",
                description: "Failed to load reviews.",
                variant: "destructive",
            });
        }
    };

    const fetchQuestions = async () => {
        try {
            const { data: questionsData, error } = await supabase
                .from('product_questions')
                .select(`
          *,
          products(name),
          profiles:user_id(full_name, email),
          product_answers(*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Sort answers for each question
            const processedQuestions = questionsData?.map(q => ({
                ...q,
                product_answers: q.product_answers?.sort((a: any, b: any) =>
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
            }));

            setQuestions(processedQuestions || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast({
                title: "Error",
                description: "Failed to load questions.",
                variant: "destructive",
            });
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Review deleted successfully",
            });
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast({
                title: "Error",
                description: "Failed to delete review",
                variant: "destructive",
            });
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question? This will also delete all answers.")) return;

        try {
            const { error } = await supabase
                .from('product_questions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Question deleted successfully",
            });
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            toast({
                title: "Error",
                description: "Failed to delete question",
                variant: "destructive",
            });
        }
    };

    const handleDeleteAnswer = async (id: string) => {
        if (!confirm("Are you sure you want to delete this answer?")) return;

        try {
            const { error } = await supabase
                .from('product_answers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Answer deleted successfully",
            });
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting answer:', error);
            toast({
                title: "Error",
                description: "Failed to delete answer",
                variant: "destructive",
            });
        }
    };

    const openReplyDialog = (question: any) => {
        setSelectedQuestion(question);
        setReplyText("");
        setReplyDialogOpen(true);
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim()) return;

        setSubmittingReply(true);
        try {
            const { error } = await supabase
                .from('product_answers')
                .insert({
                    question_id: selectedQuestion.id,
                    user_id: adminUser.id,
                    answer: replyText.trim()
                });

            if (error) throw error;

            toast({
                title: "Success",
                description: "Reply submitted successfully",
            });
            setReplyDialogOpen(false);
            fetchQuestions();
        } catch (error) {
            console.error('Error submitting reply:', error);
            toast({
                title: "Error",
                description: "Failed to submit reply",
                variant: "destructive",
            });
        } finally {
            setSubmittingReply(false);
        }
    };

    const toggleQuestionExpand = (id: string) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast({
            title: "Logged Out",
            description: "You have been logged out successfully.",
        });
        navigate('/admin');
    };

    if (!adminUser) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Admin Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Title */}
                        <div className="flex flex-col items-start gap-1 select-none">
                            <img
                                src={krLogo}
                                alt="KR Fireworks"
                                className="h-10 md:h-12 object-contain"
                            />
                            <p className="text-sm font-semibold text-red-600 italic tracking-wide font-serif">
                                'n' joy with Every moments...
                            </p>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                                Dashboard
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/admin/products" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                                Products
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/admin/categories" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                                Categories
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/admin/orders" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                                Orders
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/admin/users" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group">
                                Users
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/admin/reviews" className="text-primary transition-all duration-300 font-medium relative">
                                Reviews
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                                    <p className="text-xs text-muted-foreground">{adminUser.email}</p>
                                </div>
                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                                    Admin
                                </Badge>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="hidden md:flex hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
                            >
                                <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                Logout
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300">
                            <div className="py-2 border-b border-border">
                                <p className="text-sm font-semibold text-foreground">{adminUser.username}</p>
                                <p className="text-xs text-muted-foreground">{adminUser.email}</p>
                            </div>
                            <Link to="/admin/dashboard" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                                Dashboard
                            </Link>
                            <Link to="/admin/products" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                                Products
                            </Link>
                            <Link to="/admin/categories" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                                Categories
                            </Link>
                            <Link to="/admin/orders" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                                Orders
                            </Link>
                            <Link to="/admin/users" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
                                Users
                            </Link>
                            <Link to="/admin/reviews" className="block py-2 text-primary transition-colors font-medium">
                                Reviews
                            </Link>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                                Reviews & Q&A
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-lg">Manage customer reviews and questions</p>
                        </div>
                    </div>

                    <Tabs defaultValue="reviews" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="reviews" className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Product Reviews
                            </TabsTrigger>
                            <TabsTrigger value="questions" className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Questions & Answers
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="reviews">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Reviews</CardTitle>
                                    <CardDescription>View and manage product reviews</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Rating</TableHead>
                                                <TableHead>Comment</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reviews.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        No reviews found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                reviews.map((review) => (
                                                    <TableRow key={review.id}>
                                                        <TableCell className="font-medium">{review.products?.name || 'Unknown Product'}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{review.profiles?.full_name || 'Anonymous'}</span>
                                                                <span className="text-xs text-muted-foreground">{review.profiles?.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center text-yellow-500">
                                                                {review.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-md truncate" title={review.comment}>{review.comment}</TableCell>
                                                        <TableCell className="text-xs text-muted-foreground">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteReview(review.id)}
                                                                className="hover:bg-destructive/10 hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="questions">
                            <div className="space-y-4">
                                {questions.length === 0 ? (
                                    <Card>
                                        <CardContent className="text-center py-10 text-muted-foreground">
                                            No questions found.
                                        </CardContent>
                                    </Card>
                                ) : (
                                    questions.map((question) => (
                                        <Card key={question.id} className="overflow-hidden">
                                            <div className="p-4 bg-muted/30 flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-xs">{question.products?.name}</Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            Asked by {question.profiles?.full_name || 'Anonymous'} on {new Date(question.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-lg">{question.question}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openReplyDialog(question)}
                                                        className="gap-1"
                                                    >
                                                        <Reply className="w-3 h-3" /> Reply
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                        className="hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleQuestionExpand(question.id)}
                                                    >
                                                        {expandedQuestions[question.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            {expandedQuestions[question.id] && (
                                                <div className="bg-card border-t border-border p-4 pl-8 space-y-3">
                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Answers</h4>
                                                    {question.product_answers && question.product_answers.length > 0 ? (
                                                        question.product_answers.map((answer: any) => (
                                                            <div key={answer.id} className="flex justify-between items-start group p-2 hover:bg-muted/50 rounded-md transition-colors">
                                                                <div>
                                                                    <p className="text-sm">{answer.answer}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {new Date(answer.created_at).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDeleteAnswer(answer.id)}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive h-6 w-6"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic">No answers yet.</p>
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Reply Dialog */}
            <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to Question</DialogTitle>
                        <DialogDescription>
                            Posting answer for question about <strong>{selectedQuestion?.products?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-muted/50 p-3 rounded-md mb-4 text-sm italic">
                            "{selectedQuestion?.question}"
                        </div>
                        <Textarea
                            placeholder="Type your answer here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmitReply} disabled={submittingReply || !replyText.trim()}>
                            {submittingReply ? "Posting..." : "Post Answer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminReviews;
