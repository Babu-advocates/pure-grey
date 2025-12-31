
import { ShoppingCart, Sparkles, PartyPopper, Package, BadgeCheck, Headset, CreditCard } from "lucide-react";

const services = [
    {
        title: "Online Crackers Ordering",
        description: "Order genuine Sivakasi fireworks easily through our online platform.",
        icon: ShoppingCart,
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Wide Range of Fireworks",
        description: "Sparklers, flower pots, rockets, ground chakkars, kids crackers, and fancy fireworks.",
        icon: Sparkles,
        color: "bg-yellow-100 text-yellow-600",
    },
    {
        title: "Festival & Bulk Orders",
        description: "Special orders for Diwali, weddings, temple festivals, and bulk requirements.",
        icon: PartyPopper,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Safe & Secured Packaging",
        description: "Fireworks are packed carefully to ensure safety and prevent damage during delivery.",
        icon: Package,
        color: "bg-green-100 text-green-600",
    },
    {
        title: "Quality-Checked Products",
        description: "All crackers are quality tested and sourced directly from trusted Sivakasi manufacturers.",
        icon: BadgeCheck,
        color: "bg-red-100 text-red-600",
    },
    {
        title: "Customer Support",
        description: "Friendly support via call or WhatsApp for orders, queries, and assistance.",
        icon: Headset,
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        title: "Easy Payment Options",
        description: "UPI, Google Pay, PhonePe, and bank transfer for secure payments.",
        icon: CreditCard,
        color: "bg-teal-100 text-teal-600",
    },
];

const Services = () => {
    return (
        <section className="relative py-12 bg-yellow-400">
            {/* Top Border */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[length:20px_20px] bg-repeat-x"
                style={{
                    backgroundImage: "radial-gradient(circle at 10px 0, transparent 6px, #b91c1c 7px, #b91c1c 9px, transparent 10px)"
                }}
            />
            <div className="absolute top-2 left-0 right-0 h-1 bg-[#b91c1c]"></div>

            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-teal-700 mb-12 uppercase tracking-wide">
                    Our Services
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className="group flex flex-col items-center text-center p-2 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 shadow-md ${service.color}`}>
                                <service.icon className="w-8 h-8 md:w-10 md:h-10" />
                            </div>

                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors uppercase">
                                {service.title}
                            </h3>

                            <p className="text-gray-800 text-xs md:text-sm leading-tight max-w-[200px]">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Border */}
            <div className="absolute bottom-2 left-0 right-0 h-1 bg-[#b91c1c]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[length:20px_20px] bg-repeat-x rotate-180"
                style={{
                    backgroundImage: "radial-gradient(circle at 10px 0, transparent 6px, #b91c1c 7px, #b91c1c 9px, transparent 10px)"
                }}
            />
        </section>
    );
};

export default Services;
