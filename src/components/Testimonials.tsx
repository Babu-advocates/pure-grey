import { Card, CardContent } from "@/components/ui/card";
import { Star, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 5,
    text: "Amazing quality! The fireworks were spectacular and the delivery was on time. Made our Diwali celebration truly memorable.",
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "Best fireworks shop online! Authentic Sivakasi crackers, safe packaging, and excellent customer service. Highly recommended!",
  },
  {
    name: "Amit Patel",
    location: "Bangalore",
    rating: 5,
    text: "The combo packs are great value for money. Every item was of premium quality. Will definitely order again next year!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(10)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-primary animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
            size={20}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              What Our Customers Say
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of happy customers celebrating with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 relative group animate-fade-in-up hover:shadow-[var(--glow-gold)]"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Customer info */}
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>

                {/* Decorative sparkle */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
