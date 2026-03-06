import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps {
    width?: number;
    height?: number;
    className?: string;
    squaresClassName?: string;
}

export function InteractiveGridPattern({
    width = 80,
    height = 80,
    className,
    squaresClassName,
}: InteractiveGridPatternProps) {
    const [squares, setSquares] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastUpdateRef = useRef(0);
    const rafCleanupRef = useRef<number | null>(null);
    const squaresRef = useRef(squares);
    squaresRef.current = squares;

    // Throttled square updater — max 1 update every 150ms
    const updateSquare = useCallback((clientX: number, clientY: number) => {
        const now = Date.now();
        if (now - lastUpdateRef.current < 150) return;
        lastUpdateRef.current = now;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) return;

        const newX = Math.floor(relX / width) * width;
        const newY = Math.floor(relY / height) * height;

        setSquares((prev) => {
            // Avoid duplicates
            if (prev.some(s => s.x === newX && s.y === newY && now - s.id < 150)) return prev;
            // Cap at 20 squares max to limit DOM nodes
            const updated = [...prev, { x: newX, y: newY, id: now }];
            return updated.length > 20 ? updated.slice(-20) : updated;
        });
    }, [width, height]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            updateSquare(e.clientX, e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [updateSquare]);

    // RAF-based cleanup instead of setInterval
    useEffect(() => {
        let lastCleanup = 0;

        const cleanup = (time: number) => {
            // Only run cleanup every 500ms instead of 100ms
            if (time - lastCleanup > 500) {
                lastCleanup = time;
                const now = Date.now();
                setSquares((prev) => {
                    const filtered = prev.filter(s => now - s.id < 1000);
                    // Skip update if nothing changed
                    return filtered.length === prev.length ? prev : filtered;
                });
            }
            rafCleanupRef.current = requestAnimationFrame(cleanup);
        };

        rafCleanupRef.current = requestAnimationFrame(cleanup);

        return () => {
            if (rafCleanupRef.current !== null) {
                cancelAnimationFrame(rafCleanupRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn("inset-0 pointer-events-none select-none", className)}
        >
            <svg
                className="absolute inset-0 w-full h-full stroke-black/5"
                style={{ stroke: 'rgba(0, 0, 0, 0.04)' }}
            >
                <defs>
                    <pattern
                        id="grid-pattern"
                        width={width}
                        height={height}
                        patternUnits="userSpaceOnUse"
                        x={-1}
                        y={-1}
                    >
                        <path
                            d={`M.5 ${height}V.5H${width}`}
                            fill="none"
                            strokeWidth={1}
                        />
                    </pattern>
                    <style>
                        {`
                            @keyframes grid-fade-out {
                                0% { opacity: 1; }
                                100% { opacity: 0; }
                            }
                            @keyframes grid-color-shift {
                                0% { fill: rgba(34, 197, 94, 0.4); }
                                100% { fill: rgba(255, 255, 255, 1); }
                            }
                            .grid-square-fade {
                                animation: grid-fade-out 1s ease-out forwards, grid-color-shift 1s linear forwards;
                            }
                        `}
                    </style>
                </defs>

                {/* Trail Rects */}
                {squares.map(({ x, y, id }) => (
                    <rect
                        key={id}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        className="grid-square-fade"
                        style={{ pointerEvents: 'none' }}
                    />
                ))}

                <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
            </svg>
        </div>
    );
}
