import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Sliders, MessageSquare, Play, Pause } from "lucide-react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

const TYPEWRITER_TEXT = "Você é um especialista em vendas consultivas. Seu objetivo é entender a dor do cliente e propor a melhor solução...";

export const AgentCustomizationAnimation = () => {
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const arrowLottieRef = useRef<LottieRefCurrentProps | null>(null);
    const playLottieRef = useRef<LottieRefCurrentProps | null>(null);
    const [arrowAnimation, setArrowAnimation] = useState<any>(null);
    const [playAnimation, setPlayAnimation] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Viewport-aware Lottie and Typing control
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    arrowLottieRef.current?.play();
                    playLottieRef.current?.play();
                    setIsTyping(true);
                } else {
                    arrowLottieRef.current?.pause();
                    playLottieRef.current?.pause();
                    setIsTyping(false);
                    setDisplayedText(""); // Reset typing when off-screen
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [arrowAnimation, playAnimation]);

    // Typewriter effect
    useEffect(() => {
        if (!isTyping) return;

        // Add artificial delay before starting typing
        const timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                // To avoid React stale closures we can use functional update, 
                // but since we rely on `i` in the interval closure, it's fine.
                i++;
                setDisplayedText(TYPEWRITER_TEXT.slice(0, i));
                if (i >= TYPEWRITER_TEXT.length) clearInterval(interval);
            }, 30);
            return () => clearInterval(interval);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isTyping]);

    // Initialize audio
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const audio = new Audio("/audio/agente_ia_demo.mp3");
        audio.onended = () => setIsPlaying(false);
        audio.onerror = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
        };
        audioRef.current = audio;

        return () => {
            window.removeEventListener('resize', checkMobile);
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    // Load Lottie animations
    useEffect(() => {
        fetch("/lotties/arrowgreen2.json")
            .then(res => res.json())
            .then(data => setArrowAnimation(data))
            .catch(e => console.error("Error loading arrow animation:", e));

        fetch("/lotties/PlayOutlier.json")
            .then(res => res.json())
            .then(data => setPlayAnimation(data))
            .catch(e => console.error("Error loading play animation:", e));
    }, []);

    const handlePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Play failed:", e));
        }
    };

    const greenFilter = "brightness(0) saturate(100%) invert(29%) sepia(85%) saturate(1638%) hue-rotate(113deg) brightness(93%) contrast(103%)";

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2 md:p-4 relative">
            <AnimatePresence>
                {audioEnabled && arrowAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute w-16 h-16 md:w-20 md:h-20 pointer-events-none z-50"
                        style={{
                            top: isMobile ? '250px' : '360px',
                            left: isMobile ? '-5px' : '30px',
                            transform: "scaleY(-1)",
                            filter: greenFilter
                        }}
                    >
                        <Lottie
                            lottieRef={arrowLottieRef}
                            animationData={arrowAnimation}
                            loop={true}
                            autoplay={false}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="w-full max-w-[320px] md:max-w-[380px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transform scale-[0.85] md:scale-100 origin-center relative z-10">
                {/* Header */}
                <div className="bg-slate-900 p-4 flex items-center justify-between">
                    <span className="text-white font-semibold flex items-center gap-2">
                        <Sliders size={16} className="text-[#00A947]" />
                        Configurar Agente
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-6">
                    {/* Prompt Input */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium text-sm">
                            <MessageSquare size={16} />
                            <span>Persona</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 h-24 font-mono text-xs text-slate-600 leading-relaxed overflow-hidden relative">
                            <span>{displayedText}</span>
                            <span className="inline-block w-[6px] h-[12px] bg-[#00A947] ml-[2px] align-middle typewriter-cursor" />
                            <style>{`
                                .typewriter-cursor {
                                    animation: cursor-blink 0.8s step-end infinite;
                                }
                                @keyframes cursor-blink {
                                    0%, 100% { opacity: 0; }
                                    50% { opacity: 1; }
                                }
                            `}</style>
                        </div>
                    </div>

                    {/* Voice Toggle & Player */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 overflow-hidden transition-all duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#00A947]">
                                    <Mic size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-700">Respostas em Áudio</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">TTS Neural</span>
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <div
                                className="relative cursor-pointer"
                                onClick={() => setAudioEnabled(!audioEnabled)}
                            >
                                <motion.div
                                    animate={{ backgroundColor: audioEnabled ? "#00A947" : "#cbd5e1" }}
                                    className="w-11 h-6 rounded-full"
                                >
                                    <motion.div
                                        animate={{ x: audioEnabled ? 22 : 4 }}
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Player (Appears when enabled) */}
                        <AnimatePresence>
                            {audioEnabled && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="border-t border-slate-200/60 pt-3"
                                >
                                    <div className="bg-white rounded-xl p-2.5 flex items-center gap-3 shadow-sm border border-slate-100 relative">
                                        <button
                                            onClick={handlePlay}
                                            className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 transition-colors relative z-20 overflow-hidden
                                                ${isPlaying ? 'bg-[#00A947] hover:bg-[#008f3c]' : 'bg-transparent'}
                                            `}
                                        >
                                            {isPlaying ? (
                                                <Pause size={14} fill="currentColor" />
                                            ) : playAnimation ? (
                                                <div className="w-full h-full scale-150">
                                                    <Lottie
                                                        lottieRef={playLottieRef}
                                                        animationData={playAnimation}
                                                        loop={true}
                                                        autoplay={false}
                                                        style={{ width: '100%', height: '100%' }}
                                                    />
                                                </div>
                                            ) : (
                                                <Play size={14} fill="currentColor" />
                                            )}
                                        </button>

                                        {/* Waveform Visualization — CSS-only when not playing */}
                                        <div className="flex-1 h-8 flex items-center justify-between gap-2 px-1">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(12)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="waveform-bar w-1 rounded-full"
                                                        style={{
                                                            height: isPlaying ? undefined : 4,
                                                            backgroundColor: isPlaying ? "#00A947" : "#cbd5e1",
                                                            animationDelay: isPlaying ? `${i * 0.05}s` : undefined,
                                                            animationPlayState: isPlaying ? 'running' : 'paused',
                                                            ['--bar-height' as any]: `${[8, 24, 12, 32, 16, 8][i % 6]}px`
                                                        }}
                                                    />
                                                ))}
                                                <style>{`
                                                    .waveform-bar {
                                                        animation: waveform-bounce 0.4s ease-in-out infinite alternate;
                                                        animation-play-state: paused;
                                                    }
                                                    @keyframes waveform-bounce {
                                                        from { height: 4px; }
                                                        to { height: var(--bar-height, 16px); }
                                                    }
                                                `}</style>
                                            </div>

                                            {!isPlaying && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-[10px] text-slate-400 font-medium mr-1 truncate max-w-[80px] md:max-w-none"
                                                >
                                                    Ouvir exemplo
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
