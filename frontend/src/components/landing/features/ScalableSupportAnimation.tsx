import { useState, useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

export const ScalableSupportAnimation = () => {
    const [animationData, setAnimationData] = useState<any>(null);
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Lazy load JSON instead of static import (saves ~143KB from bundle)
    useEffect(() => {
        import("../../../assets/animations/scalable-support.json")
            .then((module) => setAnimationData(module.default))
            .catch((e) => console.error("Error loading scalable support animation:", e));
    }, []);

    // Viewport-aware play/pause
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !animationData) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    lottieRef.current?.play();
                } else {
                    lottieRef.current?.pause();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [animationData]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center p-0 md:p-4">
            <div className="w-full max-w-[400px] md:max-w-full scale-110 md:scale-100 origin-center">
                {animationData ? (
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={animationData}
                        loop={true}
                        autoplay={false}
                        className="w-full h-full"
                    />
                ) : (
                    <div className="w-full h-64 bg-slate-50 rounded-2xl animate-pulse" />
                )}
            </div>
        </div>
    );
};
