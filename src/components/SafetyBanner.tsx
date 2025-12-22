import { Card } from "@/components/ui/card";
import { Shield, Award, Package2, Truck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Genuine Sivakasi crackers with quality certification",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Top-grade materials ensuring spectacular displays",
  },
  {
    icon: Package2,
    title: "Safe Packaging",
    description: "Industry-standard packaging for safe transportation",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure delivery across India",
  },
];

const SafetyBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Why Choose KR Fireworks?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We prioritize your safety and satisfaction with every purchase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden animate-fade-in-up hover:shadow-[var(--glow-primary)]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="p-6 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12">
                      <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SafetyBanner;
