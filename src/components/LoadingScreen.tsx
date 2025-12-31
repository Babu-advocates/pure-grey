import { useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
};

export default LoadingScreen;
