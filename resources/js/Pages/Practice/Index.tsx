import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Check, 
    X, 
    RotateCcw, 
    Volume2,
    Trophy,
    BrainCircuit,
    ChevronRight
} from 'lucide-react';
import { Vocab } from '@/types';
import { pinyinToIndonesianReading } from '@/utils/pinyinPhonetic';

interface PracticeProps {
    vocabs: Vocab[];
    stats: {
        total: number;
        memorized: number;
    };
}

export default function Practice({ vocabs, stats }: PracticeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const currentVocab = vocabs[currentIndex];
    const isFinished = currentIndex >= vocabs.length || vocabs.length === 0;

    const progressPercentage = stats.total > 0 
        ? Math.round((stats.memorized / stats.total) * 100) 
        : 0;

    const playAudio = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!currentVocab) return;
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(currentVocab.hanzi);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleFlip = () => {
        if (!isFlipped && !isFinished) {
            setIsFlipped(true);
            playAudio();
        }
    };

    const handleAnswer = (status: 'learning' | 'memorized') => {
        if (isProcessing || !currentVocab) return;
        setIsProcessing(true);

        router.post(route('practice.status', currentVocab.id), { status }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsFlipped(false);
                setCurrentIndex(prev => prev + 1);
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
            <Head title="Latihan Kosakata Mandarin" />

            <div className="fixed inset-0 pointer-events-none -z-10 opacity-70"
                 style={{
                     backgroundImage: `
                         radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.15) 0%, transparent 50%),
                         radial-gradient(circle at 100% 100%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)
                     `
                 }}
            />

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link 
                        href={route('home')} 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold text-sm">Kembali ke Kamus</span>
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>{stats.memorized} / {stats.total} Dihafal</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 bg-slate-900 w-full">
                    <div 
                        className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl mx-auto w-full">
                
                {isFinished ? (
                    <div className="text-center space-y-6 animate-fadeIn">
                        <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <Trophy className="w-12 h-12 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">Latihan Selesai!</h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                Luar biasa! Anda telah mereview semua kata untuk sesi ini. Istirahat sejenak dan kembali lagi nanti untuk memperkuat ingatan Anda.
                            </p>
                        </div>
                        <Link 
                            href={route('home')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold transition-all hover:scale-105 active:scale-95"
                        >
                            Kembali ke Halaman Utama
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="w-full max-w-md w-full flex flex-col gap-6">
                        
                        {/* Status Bar */}
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                            <span>Sesi ini: {currentIndex + 1} / {vocabs.length}</span>
                            <span className="flex items-center gap-1.5 text-rose-400">
                                <BrainCircuit className="w-4 h-4" />
                                Sedang Latihan
                            </span>
                        </div>

                        {/* Flashcard */}
                        <div 
                            className="relative perspective-1000 w-full aspect-[4/5] sm:aspect-square group cursor-pointer"
                            onClick={handleFlip}
                        >
                            <div className={`w-full h-full transition-all duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
                                
                                {/* Front of Card (Hanzi) */}
                                <div className="absolute inset-0 backface-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl hover:border-rose-500/30 transition-colors">
                                    <div className="text-[120px] leading-none font-chinese font-black text-white mb-8 group-hover:scale-110 transition-transform duration-500">
                                        {currentVocab.hanzi}
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm animate-pulse flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4" />
                                        Ketuk untuk membalik
                                    </p>
                                </div>

                                {/* Back of Card (Pinyin & Meaning) */}
                                <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl shadow-rose-900/20 rotate-y-180">
                                    
                                    <button 
                                        onClick={playAudio}
                                        className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        <Volume2 className="w-6 h-6" />
                                    </button>

                                    <div className="text-5xl font-chinese font-black text-slate-700 mb-8 select-none">
                                        {currentVocab.hanzi}
                                    </div>
                                    
                                    <div className="text-center space-y-4 w-full">
                                        <div>
                                            <div className="text-4xl font-bold text-rose-400 mb-2">
                                                {currentVocab.pinyin}
                                            </div>
                                            <div className="text-sm font-mono text-amber-300/80 bg-amber-500/10 px-3 py-1 rounded-lg inline-block">
                                                Cara baca: {currentVocab.dibaca?.trim() || pinyinToIndonesianReading(currentVocab.pinyin)}
                                            </div>
                                        </div>
                                        
                                        <div className="w-16 h-px bg-slate-800 mx-auto my-6" />
                                        
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Arti Bahasa Indonesia
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                {currentVocab.meaning}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                            <button
                                onClick={() => handleAnswer('learning')}
                                disabled={isProcessing}
                                className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                                <span className="font-semibold text-sm">Lupa</span>
                            </button>
                            
                            <button
                                onClick={() => handleAnswer('memorized')}
                                disabled={isProcessing}
                                className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-emerald-400 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Check className="w-6 h-6" />
                                <span className="font-semibold text-sm">Sudah Hafal</span>
                            </button>
                        </div>

                    </div>
                )}
            </main>
            
            {/* Inject Custom CSS for 3D flip */}
            <style dangerouslySetInnerHTML={{__html: `
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
