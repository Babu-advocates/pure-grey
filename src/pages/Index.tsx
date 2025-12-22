import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import PromotionalBanners from "@/components/PromotionalBanners";
import Testimonials from "@/components/Testimonials";
import SafetyBanner from "@/components/SafetyBanner";
import Footer from "@/components/Footer";
import FireworksBurst from "@/components/FireworksBurst";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <FireworksBurst />
      <Navbar />
      <Hero />
      <Categories />
      <PromotionalBanners />
      <SafetyBanner />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
