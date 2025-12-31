import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    icon: string | null;
}

const TARGET_CATEGORIES = [
    "Flower Pots",
    "Sparklers",
    "Chakkars",
    "Bombs",
    "Fancy Shots",
    "Gift Box",
    "Festival Celebration",
    "Rockets"
];

// Helper to normalize names for matching (e.g. "Ground Chakkars" -> "Chakkars")
const normalizeName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("chakkar")) return "Chakkars";
    if (n.includes("sparkler")) return "Sparklers";
    if (n.includes("rocket")) return "Rockets";
    if (n.includes("gift")) return "Gift Box";
    if (n.includes("festival")) return "Festival Celebration";
    return name;
};

// Helper to get a random animation style
const getRandomAnimationStyle = () => {
    const animations = [
        "spin 1s ease-out 1",
        "bounce 1s ease-out 1",
        "pulse 1.5s ease-out 1",
        "ping 1s ease-out 1"
    ];
    return animations[Math.floor(Math.random() * animations.length)];
};

const OurCollections = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    // Store animation styles in state
    const [animationStyles, setAnimationStyles] = useState<string[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*');

            if (error) throw error;

            // Filter and sort categories based on TARGET_CATEGORIES order
            const filtered = (data || []).filter(cat => {
                const normalized = normalizeName(cat.name);
                return TARGET_CATEGORIES.some(target =>
                    normalized.toLowerCase().includes(target.toLowerCase()) ||
                    target.toLowerCase().includes(normalized.toLowerCase())
                );
            });

            // Sort to match the target order
            const sorted = filtered.sort((a, b) => {
                const nameA = normalizeName(a.name);
                const nameB = normalizeName(b.name);
                const indexA = TARGET_CATEGORIES.findIndex(t =>
                    nameA.toLowerCase().includes(t.toLowerCase()) ||
                    t.toLowerCase().includes(nameA.toLowerCase())
                );
                const indexB = TARGET_CATEGORIES.findIndex(t =>
                    nameB.toLowerCase().includes(t.toLowerCase()) ||
                    t.toLowerCase().includes(nameB.toLowerCase())
                );
                return indexA - indexB;
            });

            // Remove duplicates
            const unique = sorted.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

            // Limit to 8
            const finalCategories = unique.slice(0, 8);
            setCategories(finalCategories);

            // Generate random animation styles for each category
            setAnimationStyles(finalCategories.map(() => getRandomAnimationStyle()));
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        const categoryParam = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/[()]/g, '');
        navigate(`/shop?category=${categoryParam}`);
    };

    if (loading) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <section className="py-8 container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 justify-items-center">
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        className="flex flex-col items-center gap-3 cursor-pointer group w-full max-w-[150px] transition-all duration-300 hover:-translate-y-2"
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        {/* Wrapper for Hover Scale */}
                        <div className="w-20 h-20 md:w-24 md:h-24 relative transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-xl">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Inner Wrapper for Entrance Animation */}
                            <div className="w-full h-full" style={{ animation: animationStyles[index] }}>
                                {category.icon ? (
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-full h-full object-contain drop-shadow-md relative z-10 group-hover:animate-pulse"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-xs text-center p-2">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="text-sm md:text-base font-medium text-teal-700 text-center leading-tight group-hover:text-primary transition-colors duration-300 group-hover:font-bold">
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurCollections;
