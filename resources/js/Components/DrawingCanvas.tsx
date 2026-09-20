import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { RefreshCcw, CheckCircle2 } from 'lucide-react';

interface DrawingCanvasProps {
    backgroundText?: string;
    onDrawStart?: () => void;
    onClear?: () => void;
}

export default function DrawingCanvas({ backgroundText, onDrawStart, onClear }: DrawingCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [writers, setWriters] = useState<HanziWriter[]>([]);
    const [completedChars, setCompletedChars] = useState<boolean[]>([]);
    const [allCompleted, setAllCompleted] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !backgroundText) return;

        // Clear existing writers
        containerRef.current.innerHTML = '';
        const chars = Array.from(backgroundText);
        setCompletedChars(new Array(chars.length).fill(false));
        setAllCompleted(false);

        const newWriters = chars.map((char, index) => {
            // Create a wrapper div for each character
            const div = document.createElement('div');
            div.className = "relative bg-slate-900 rounded-xl border border-slate-700/50 shadow-inner shrink-0 transition-colors duration-300";
            
            // Add Tian Zi Ge grid background
            div.innerHTML = `
                <div class="absolute inset-0 pointer-events-none opacity-20 z-0">
                    <div class="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-400"></div>
                    <div class="absolute left-1/2 top-0 h-full border-l border-dashed border-slate-400"></div>
                    <div class="absolute inset-0 border-2 border-slate-500 rounded-xl"></div>
                </div>
            `;
            
            // Add SVG container for HanziWriter
            const svgContainer = document.createElement('div');
            svgContainer.className = "relative z-10";
            svgContainer.id = `hanzi-writer-${Math.random().toString(36).substr(2, 9)}-${index}`;
            div.appendChild(svgContainer);
            
            containerRef.current?.appendChild(div);

            const writer = HanziWriter.create(svgContainer.id, char, {
                width: 200,
                height: 200,
                padding: 10,
                strokeColor: '#f8fafc', // slate-50 (bright white for drawn strokes)
                radicalColor: '#f8fafc', // also bright white
                outlineColor: '#334155', // slate-700 (faded background)
                drawingColor: '#e2e8f0', // slate-200 (color while drawing)
                drawingWidth: 15,
                showOutline: true,
                strokeAnimationSpeed: 2,
                delayBetweenStrokes: 100,
                highlightColor: '#f43f5e', // rose-500 (for mistakes)
                highlightOnComplete: false
            });

            writer.quiz({
                onMistake: function(strokeData) {
                    if (onDrawStart) onDrawStart();
                    
                    // Visual feedback for mistake
                    div.style.borderColor = '#f43f5e'; // rose-500
                    div.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
                    setTimeout(() => {
                        div.style.borderColor = 'rgba(51, 65, 85, 0.5)'; // slate-700/50
                        div.style.backgroundColor = '';
                    }, 400);
                },
                onCorrectStroke: function(strokeData) {
                    if (onDrawStart) onDrawStart();
                },
                onComplete: function(summaryData) {
                    // Visual feedback for character completion
                    div.style.borderColor = '#10b981'; // emerald-500
                    div.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
                    
                    setCompletedChars(prev => {
                        const next = [...prev];
                        next[index] = true;
                        if (next.every(c => c)) {
                            setAllCompleted(true);
                        }
                        return next;
                    });
                }
            });

            return writer;
        });

        setWriters(newWriters);

        return () => {
            // Cleanup on unmount or when text changes
            newWriters.forEach(w => w.cancelQuiz());
        };
    }, [backgroundText]);

    const handleRestart = () => {
        writers.forEach(w => {
            w.hideCharacter();
            w.quiz();
        });
        setCompletedChars(new Array(writers.length).fill(false));
        setAllCompleted(false);
        
        // Reset container styles
        if (containerRef.current) {
            const divs = containerRef.current.children;
            for (let i = 0; i < divs.length; i++) {
                const div = divs[i] as HTMLElement;
                div.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                div.style.backgroundColor = '';
            }
        }
        
        if (onClear) onClear();
    };

    if (!backgroundText) return null;

    return (
        <div className="w-full">
            <div 
                ref={containerRef}
                className="flex gap-4 overflow-x-auto pb-4 justify-start sm:justify-center items-center touch-pan-x"
                style={{ scrollbarWidth: 'thin' }}
            >
                {/* HanziWriter instances will be injected here */}
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
                {allCompleted && (
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold animate-fadeIn bg-emerald-500/10 px-4 py-2 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                        Hebat! Semua goresan sempurna!
                    </div>
                )}
                
                <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white transition-all font-medium text-sm"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Ulangi Kuis Goresan
                </button>
            </div>
        </div>
    );
}
