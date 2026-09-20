import React, { useState } from 'react';
import { Volume2, Edit2, Trash2, Copy, Check, BookOpen } from 'lucide-react';
import { pinyinToIndonesianReading } from '@/utils/pinyinPhonetic';
import { Vocab } from '@/types';

interface VocabCardProps {
    vocab: Vocab;
    canManage?: boolean;
    showPhonetics?: boolean;
    onEdit?: (vocab: Vocab) => void;
    onDelete?: (vocab: Vocab) => void;
}

export default function VocabCard({
    vocab,
    canManage = false,
    showPhonetics = true,
    onEdit,
    onDelete
}: VocabCardProps) {
    const [copied, setCopied] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const playAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(vocab.hanzi);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.85;

            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(vocab.hanzi);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="group relative glass-card rounded-2xl p-6 flex flex-col justify-between overflow-hidden border border-slate-800/80 bg-slate-900/60 hover:border-rose-500/40 hover:bg-slate-900/90 transition-all duration-300">
            {/* Top glowing ambient accent (CSS radial gradient for zero GPU blur overhead) */}
            <div
                className="absolute -top-12 -right-12 w-32 h-32 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, transparent 70%)' }}
            />

            <div>
                {/* Header: Action icons */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={playAudio}
                            className={`p-2 rounded-xl border transition-all ${
                                isPlaying
                                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-105'
                                    : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                            }`}
                            title="Dengarkan Pengucapan (Audio TTS)"
                        >
                            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                        </button>

                        <button
                            type="button"
                            onClick={copyToClipboard}
                            className="p-2 rounded-xl bg-slate-800/70 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white transition-all"
                            title="Salin Karakter Hanzi"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {canManage && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={() => onEdit(vocab)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                                    title="Edit Kosakata"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(vocab)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                                    title="Hapus Kosakata"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Character (Hanzi) */}
                <div className="text-center my-3">
                    <h2 className="font-chinese text-4xl sm:text-5xl font-bold tracking-wide text-white drop-shadow-sm select-text transition-transform group-hover:scale-105 duration-200">
                        {vocab.hanzi}
                    </h2>
                    <p className="mt-2 text-lg font-medium text-rose-400 tracking-wider">
                        {vocab.pinyin}
                    </p>
                    {showPhonetics && (
                        <div
                            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-amber-300/95 shadow-sm"
                            title="Cara baca latin untuk lidah Indonesia"
                        >
                            <span className="text-slate-500 font-sans text-[10px] uppercase font-semibold">baca:</span>
                            <span className="font-bold tracking-wide">[ {vocab.dibaca?.trim() || pinyinToIndonesianReading(vocab.pinyin)} ]</span>
                        </div>
                    )}
                </div>

                {/* Meaning / Arti */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                        Arti
                    </div>
                    <p className="text-base font-medium text-slate-200 leading-snug">
                        {vocab.meaning}
                    </p>
                </div>

                {/* Optional Notes */}
                {vocab.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed line-clamp-3">{vocab.notes}</span>
                    </div>
                )}
            </div>

            {/* Bottom meta tag */}
            <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>ID: #{vocab.id}</span>
                <span>
                    {new Date(vocab.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                    })}
                </span>
            </div>
        </div>
    );
}
