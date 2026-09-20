import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { 
    ArrowLeft, 
    Check, 
    X, 
    Volume2,
    Trophy,
    BrainCircuit,
    ChevronRight,
    ArrowRight,
    BookOpen,
    MessageCircle,
    Edit2,
    Trash2,
    PenTool
} from 'lucide-react';
import VocabFormModal from '@/Components/VocabFormModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import DrawingCanvas from '@/Components/DrawingCanvas';
import { Vocab } from '@/types';
import { pinyinToIndonesianReading } from '@/utils/pinyinPhonetic';

interface PracticeProps {
    vocabs: Vocab[];
    memorizedVocabs: Vocab[];
    stats: {
        total: number;
        memorized: number;
    };
}

type QuizMode = 'zh-id' | 'id-zh';
type ViewMode = 'quiz' | 'braindump';

const removeTonesAndSpaces = (pinyin: string) => {
    return pinyin
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z]/g, '')
        .toLowerCase();
};

export default function Practice({ vocabs, memorizedVocabs, stats }: PracticeProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('quiz');
    const [localStats, setLocalStats] = useState(stats);

    // ==========================================
    // QUIZ MODE STATES
    // ==========================================
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [quizMode, setQuizMode] = useState<QuizMode>('zh-id');
    const [userInput, setUserInput] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isWrongShake, setIsWrongShake] = useState(false);
    const [hasMistakes, setHasMistakes] = useState(false);

    const quizInputRef = useRef<HTMLInputElement>(null);
    const currentVocab = vocabs[currentIndex];
    const isFinished = currentIndex >= vocabs.length || vocabs.length === 0;

    const progressPercentage = localStats.total > 0 
        ? Math.round((localStats.memorized / localStats.total) * 100) 
        : 0;

    useEffect(() => {
        setQuizMode(Math.random() > 0.5 ? 'zh-id' : 'id-zh');
    }, []);

    useEffect(() => {
        if (viewMode === 'quiz' && currentVocab && !isAnswered) {
            setTimeout(() => quizInputRef.current?.focus(), 100);
        }
    }, [currentIndex, currentVocab, isAnswered, viewMode]);

    const playAudio = (text: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    const checkQuizAnswer = () => {
        if (!userInput.trim() || isAnswered || isProcessing) return;
        const normalizedInput = userInput.trim().toLowerCase();
        let correct = false;

        if (quizMode === 'zh-id') {
            const meanings = currentVocab.meaning.toLowerCase().split(/[\/,;]/).map(s => s.trim());
            correct = meanings.some(m => {
                if (m === normalizedInput) return true;
                const words = m.split(/\s+/).map(w => w.replace(/[()]/g, ''));
                return words.includes(normalizedInput);
            });
        } else {
            if (normalizedInput === currentVocab.hanzi) {
                correct = true;
            } else {
                const normalizedTargetPinyin = removeTonesAndSpaces(currentVocab.pinyin);
                const normalizedInputPinyin = removeTonesAndSpaces(normalizedInput);
                if (normalizedTargetPinyin === normalizedInputPinyin) {
                    correct = true;
                }
            }
        }

        if (correct) {
            setIsCorrect(true);
            setIsAnswered(true);
            playAudio(currentVocab.hanzi);
            if (!hasMistakes) {
                setLocalStats(prev => ({ ...prev, memorized: prev.memorized + 1 }));
            }
        } else {
            setHasMistakes(true);
            setIsWrongShake(true);
            setTimeout(() => setIsWrongShake(false), 500);
        }
    };

    const handleQuizKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isAnswered) {
                handleQuizNext();
            } else {
                checkQuizAnswer();
            }
        }
    };

    const handleQuizGiveUp = () => {
        if (isProcessing) return;
        setHasMistakes(true);
        setIsCorrect(false);
        setIsAnswered(true);
        playAudio(currentVocab.hanzi);
    };

    const handleQuizNext = () => {
        if (isProcessing || !currentVocab || !isAnswered) return;
        setIsProcessing(true);
        const status = hasMistakes ? 'learning' : 'memorized';
        
        router.post(route('practice.status', currentVocab.id), { status }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setCurrentIndex(prev => prev + 1);
                setQuizMode(Math.random() > 0.5 ? 'zh-id' : 'id-zh');
                setUserInput('');
                setIsAnswered(false);
                setIsCorrect(false);
                setHasMistakes(false);
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    };

    // ==========================================
    // BRAIN DUMP MODE STATES
    // ==========================================
    const [dumpHanzi, setDumpHanzi] = useState('');
    const [dumpPinyin, setDumpPinyin] = useState('');
    const [dumpMeaning, setDumpMeaning] = useState('');
    const [dumpProcessing, setDumpProcessing] = useState(false);
    const [dumpErrorShake, setDumpErrorShake] = useState(false);
    const [dumpSuccess, setDumpSuccess] = useState(false);
    const [historicalVocabs, setHistoricalVocabs] = useState<Vocab[]>(memorizedVocabs || []);
    const [editingVocab, setEditingVocab] = useState<Vocab | null>(null);
    const [deletingVocab, setDeletingVocab] = useState<Vocab | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [suggestedHanzi, setSuggestedHanzi] = useState<string | null>(null);
    const [showCanvas, setShowCanvas] = useState(false);

    // Update historicalVocabs when memorizedVocabs prop changes (e.g. after Edit/Delete)
    useEffect(() => {
        setHistoricalVocabs(memorizedVocabs || []);
    }, [memorizedVocabs]);
    
    // Focus on Pinyin input by default since Hanzi is optional
    const dumpPinyinRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (viewMode === 'braindump') {
            setTimeout(() => dumpPinyinRef.current?.focus(), 100);
        }
    }, [viewMode]);

    // Fetch Hanzi suggestion when Pinyin changes
    useEffect(() => {
        if (!dumpPinyin.trim()) {
            setSuggestedHanzi(null);
            setShowCanvas(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(route('practice.search-hanzi'), {
                    params: { pinyin: dumpPinyin }
                });
                if (response.data.hanzi) {
                    setSuggestedHanzi(response.data.hanzi);
                    setShowCanvas(true);
                } else {
                    setSuggestedHanzi(null);
                    setShowCanvas(false);
                }
            } catch (error) {
                console.error("Failed to fetch hanzi suggestion", error);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [dumpPinyin]);

    const handleBrainDumpSubmit = async () => {
        if (!dumpPinyin.trim() || !dumpMeaning.trim() || dumpProcessing) return;
        setDumpProcessing(true);
        setDumpSuccess(false);

        try {
            const response = await axios.post(route('practice.braindump'), { 
                hanzi: dumpHanzi,
                pinyin: dumpPinyin,
                meaning: dumpMeaning
            });
            
            if (response.data.success) {
                const vocab = response.data.vocab as Vocab;
                const newlyMemorized = !response.data.already_memorized;
                
                setDumpHanzi('');
                setDumpPinyin('');
                setDumpMeaning('');
                setDumpSuccess(true);
                
                if (vocab.hanzi !== '-') {
                    playAudio(vocab.hanzi);
                }
                
                // Add to discovered list if not already there in this session
                setHistoricalVocabs(prev => {
                    if (!prev.find(v => v.id === vocab.id)) {
                        return [vocab, ...prev];
                    }
                    return prev;
                });

                if (newlyMemorized) {
                    setLocalStats(prev => ({ ...prev, memorized: prev.memorized + 1 }));
                }

                setTimeout(() => setDumpSuccess(false), 1000);
            }
        } catch (error) {
            setDumpErrorShake(true);
            setTimeout(() => setDumpErrorShake(false), 500);
        } finally {
            setDumpProcessing(false);
            dumpPinyinRef.current?.focus();
        }
    };

    const handleBrainDumpKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBrainDumpSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white overflow-hidden">
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
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link 
                        href={route('home')} 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold text-sm hidden sm:inline">Selesai Latihan</span>
                    </Link>
                    
                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                        <button
                            onClick={() => setViewMode('quiz')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                                viewMode === 'quiz' 
                                    ? 'bg-rose-500 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <BrainCircuit className="w-4 h-4" />
                            <span className="hidden sm:inline">Mode Kuis</span>
                        </button>
                        <button
                            onClick={() => setViewMode('braindump')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                                viewMode === 'braindump' 
                                    ? 'bg-emerald-500 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">Tulis Bebas</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">{localStats.memorized} / {localStats.total} Dihafal</span>
                            <span className="sm:hidden">{localStats.memorized}</span>
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

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-4 sm:p-8 max-w-2xl mx-auto w-full">
                
                {/* ==================================================== */}
                {/* QUIZ MODE UI */}
                {/* ==================================================== */}
                {viewMode === 'quiz' && (
                    <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn">
                        {isFinished ? (
                            <div className="text-center space-y-6">
                                <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                    <Trophy className="w-12 h-12 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white mb-2">Sesi Kuis Selesai!</h2>
                                    <p className="text-slate-400 max-w-md mx-auto">
                                        Anda telah menjawab semua kosakata acak di sesi ini. Coba Mode Tulis Bebas untuk menguji perbendaharaan Anda sendiri!
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setViewMode('braindump')}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all hover:scale-105 active:scale-95"
                                >
                                    Coba Mode Tulis Bebas
                                    <BookOpen className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-6 relative mt-10">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                                    <span>Kosakata {currentIndex + 1} dari {vocabs.length}</span>
                                    <span className="flex items-center gap-1.5 text-rose-400">
                                        <BrainCircuit className="w-4 h-4" />
                                        {quizMode === 'zh-id' ? 'Terjemahkan ke Indonesia' : 'Tulis Pinyin atau Hanzi'}
                                    </span>
                                </div>

                                {/* Question Card */}
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500 opacity-50" />
                                    
                                    <button 
                                        onClick={(e) => playAudio(currentVocab.hanzi, e)}
                                        className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        <Volume2 className="w-5 h-5" />
                                    </button>

                                    {quizMode === 'zh-id' ? (
                                        <div className="text-center w-full">
                                            <div className="text-7xl sm:text-[100px] leading-tight font-chinese font-black text-white mb-4 select-text">
                                                {currentVocab.hanzi}
                                            </div>
                                            <div className="text-xl sm:text-2xl font-bold text-rose-400 tracking-wider">
                                                {currentVocab.pinyin}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center w-full">
                                            <div className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                                                {currentVocab.meaning}
                                            </div>
                                            <div className="text-slate-400 font-medium text-sm">
                                                Bahasa Mandarinnya adalah?
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className={`relative ${isWrongShake ? 'animate-shake' : ''}`}>
                                    <input
                                        ref={quizInputRef}
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={handleQuizKeyDown}
                                        disabled={isAnswered || isProcessing}
                                        placeholder={quizMode === 'zh-id' ? "Ketik arti bahasa Indonesia..." : "Ketik Pinyin (tanpa nada) atau Hanzi..."}
                                        className={`w-full bg-slate-900/50 border-2 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg font-medium outline-none transition-all placeholder:text-slate-600 disabled:opacity-90
                                            ${isAnswered 
                                                ? isCorrect 
                                                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' 
                                                    : 'border-rose-500 text-rose-400 bg-rose-500/10'
                                                : 'border-slate-700 text-white focus:border-rose-500 focus:bg-slate-900'
                                            }`}
                                    />
                                    
                                    {!isAnswered && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <button
                                                onClick={checkQuizAnswer}
                                                disabled={!userInput.trim() || isProcessing}
                                                className="p-2 sm:p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 transition-colors"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Answer Feedback Area */}
                                {isAnswered && (
                                    <div className={`p-5 sm:p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} animate-fadeIn flex flex-col gap-4`}>
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div>
                                                <div className={`text-xl sm:text-2xl font-bold flex items-center gap-2 mb-3 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {isCorrect ? <Check className="w-6 h-6 sm:w-7 sm:h-7" /> : <X className="w-6 h-6 sm:w-7 sm:h-7" />}
                                                    {isCorrect ? 'Benar!' : 'Jawaban yang benar:'}
                                                </div>
                                                <div className="text-white space-y-1.5">
                                                    <div className="text-3xl font-chinese font-bold">{currentVocab.hanzi}</div>
                                                    <div className="text-lg font-medium text-rose-400">{currentVocab.pinyin}</div>
                                                    <div className="text-sm font-mono text-amber-300/80">baca: {currentVocab.dibaca?.trim() || pinyinToIndonesianReading(currentVocab.pinyin)}</div>
                                                    <div className="text-base text-slate-300 mt-2 font-medium">{currentVocab.meaning}</div>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={handleQuizNext}
                                                disabled={isProcessing}
                                                className={`w-full sm:w-auto px-6 py-4 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                                    isCorrect 
                                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                                                        : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'
                                                }`}
                                            >
                                                Lanjut
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!isAnswered && (
                                    <div className="flex justify-center mt-2">
                                        <button
                                            onClick={handleQuizGiveUp}
                                            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors px-4 py-2"
                                        >
                                            Tidak Tahu (Lihat Jawaban)
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}


                {/* ==================================================== */}
                {/* BRAIN DUMP MODE UI */}
                {/* ==================================================== */}
                {viewMode === 'braindump' && (
                    <div className="w-full flex flex-col gap-6 animate-fadeIn mt-6">
                        
                        <div className="text-center space-y-3 mb-4">
                            <h2 className="text-2xl sm:text-3xl font-black text-white">Catatan Kosakata</h2>
                            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                                Tambahkan kosakata yang baru Anda pelajari atau ingat hari ini. Sistem akan menambahkannya ke dalam perbendaharaan Anda.
                            </p>
                        </div>

                        <div className={`relative ${dumpErrorShake ? 'animate-shake' : ''}`}>
                            <div className="bg-slate-900 border-2 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 transition-all duration-300
                                ${dumpSuccess 
                                    ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-500/5' 
                                    : dumpErrorShake 
                                        ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-500/5'
                                        : 'border-slate-700'
                                }"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-400 block">Pinyin <span className="text-rose-500">*</span></label>
                                        <input
                                            ref={dumpPinyinRef}
                                            type="text"
                                            value={dumpPinyin}
                                            onChange={(e) => setDumpPinyin(e.target.value)}
                                            onKeyDown={handleBrainDumpKeyDown}
                                            disabled={dumpProcessing}
                                            placeholder="misal: zao shang"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-400 block">Arti (Indonesia) <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            value={dumpMeaning}
                                            onChange={(e) => setDumpMeaning(e.target.value)}
                                            onKeyDown={handleBrainDumpKeyDown}
                                            disabled={dumpProcessing}
                                            placeholder="misal: pagi hari"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-400 block flex items-center justify-between">
                                        <span>Hanzi (Opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={dumpHanzi}
                                        onChange={(e) => setDumpHanzi(e.target.value)}
                                        onKeyDown={handleBrainDumpKeyDown}
                                        disabled={dumpProcessing}
                                        placeholder="misal: 早上"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-chinese"
                                    />
                                </div>

                                <button
                                    onClick={handleBrainDumpSubmit}
                                    disabled={!dumpPinyin.trim() || !dumpMeaning.trim() || dumpProcessing}
                                    className="w-full py-3.5 mt-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    {dumpProcessing ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Simpan ke Catatan Hafalan
                                        </>
                                    )}
                                </button>
                                
                                {showCanvas && suggestedHanzi && (
                                    <div className="mt-6 pt-6 border-t border-slate-700/50 animate-fadeIn">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                <PenTool className="w-4 h-4 text-emerald-400" />
                                                Latihan Tracing
                                            </h3>
                                            <button 
                                                onClick={() => {
                                                    setDumpHanzi(suggestedHanzi);
                                                }}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                            >
                                                Gunakan Hanzi Ini
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4">
                                            Hanzi yang sesuai dengan pinyin Anda ditemukan. Anda dapat menggunakan <i>mouse</i> atau layar sentuh untuk melatih goresan di atas cetakan berikut:
                                        </p>
                                        <DrawingCanvas 
                                            backgroundText={suggestedHanzi} 
                                            onDrawStart={() => {
                                                if (dumpHanzi !== suggestedHanzi) {
                                                    setDumpHanzi(suggestedHanzi);
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* List of successfully remembered words */}
                        {historicalVocabs.length > 0 && (
                            <div className="mt-8 animate-fadeIn overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl shadow-xl">
                                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest p-4 border-b border-slate-700/80 bg-slate-950/50">
                                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                                    Riwayat Kosakata Hafalan ({historicalVocabs.length})
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-300">
                                        <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                            <tr>
                                                <th className="py-4 px-6 font-semibold">Hanzi</th>
                                                <th className="py-4 px-6 font-semibold">Pinyin</th>
                                                <th className="py-4 px-6 font-semibold">Arti / Makna</th>
                                                <th className="py-4 px-6 font-semibold text-center">Audio</th>
                                                <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {historicalVocabs.map((v) => (
                                                <tr key={v.id} className="hover:bg-slate-800/40 transition-colors animate-slideIn">
                                                    <td className="py-3 px-6 font-chinese text-2xl font-bold text-white">
                                                        {v.hanzi}
                                                    </td>
                                                    <td className="py-3 px-6 font-medium text-emerald-400">
                                                        {v.pinyin}
                                                    </td>
                                                    <td className="py-3 px-6 text-slate-200">
                                                        {v.meaning}
                                                    </td>
                                                    <td className="py-3 px-6 text-center">
                                                        {v.hanzi !== '-' && (
                                                            <button 
                                                                onClick={(e) => playAudio(v.hanzi, e)}
                                                                className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center justify-center"
                                                                title="Dengarkan Suara"
                                                            >
                                                                <Volume2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6 text-right">
                                                        <div className="inline-flex items-center gap-1 justify-end">
                                                            <button
                                                                onClick={() => { setEditingVocab(v); setIsFormOpen(true); }}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingVocab(v)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </main>
            
            <style dangerouslySetInnerHTML={{__html: `
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                .animate-slideIn { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}} />

            <VocabFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                vocab={editingVocab}
            />

            <DeleteConfirmModal
                isOpen={Boolean(deletingVocab)}
                onClose={() => setDeletingVocab(null)}
                vocab={deletingVocab}
            />
        </div>
    );
}
