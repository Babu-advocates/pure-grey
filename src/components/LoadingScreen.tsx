import { useEffect, useState } from "react";
import loadingVideo from "@/assets/loading-fireworks.mp4";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile (width < 640px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    // If mobile, skip loading video immediately
    if (window.innerWidth < 640) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const video = document.getElementById('loading-video') as HTMLVideoElement;

    const handleVideoEnd = () => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    // Fallback timeout in case video doesn't load or play
    const fallbackTimeout = setTimeout(() => {
      handleVideoEnd();
    }, 5000);

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        clearTimeout(fallbackTimeout);
      };
    }

    return () => clearTimeout(fallbackTimeout);
  }, [onComplete]);

  // Don't show loading screen on mobile
  if (!isVisible || isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center animate-fade-in">
      <video
        id="loading-video"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={loadingVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />
    </div>
  );
};

export default LoadingScreen;
