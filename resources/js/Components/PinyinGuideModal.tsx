import React, { useState, useMemo } from 'react';
import {
    X,
    Volume2,
    Search,
    BookOpen,
    Sparkles,
    CheckCircle2,
    VolumeX,
    HelpCircle,
    Music,
    Layers
} from 'lucide-react';
import {
    PINYIN_INITIALS,
    PINYIN_FINALS,
    PINYIN_TONES,
    PhoneticItem,
    ToneItem
} from '@/utils/pinyinPhonetic';

interface PinyinGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PinyinGuideModal({ isOpen, onClose }: PinyinGuideModalProps) {
    const [activeTab, setActiveTab] = useState<'initials' | 'finals' | 'tones' | 'cheatSheet'>('initials');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    const playAudio = (text: string, lang: 'zh-CN' | 'id-ID' = 'zh-CN', e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = lang === 'id-ID' ? 0.9 : 0.8;

            const audioKey = `${lang}:${text}`;
            utterance.onstart = () => setPlayingAudio(audioKey);
            utterance.onend = () => setPlayingAudio(null);
            utterance.onerror = () => setPlayingAudio(null);

            window.speechSynthesis.speak(utterance);
        }
    };
    // Filter initials by search query
    const filteredInitials = useMemo(() => {
        if (!searchQuery.trim()) return PINYIN_INITIALS;
        const q = searchQuery.toLowerCase().trim();
        return PINYIN_INITIALS.filter(
            (item) =>
                item.letter.toLowerCase().includes(q) ||
                item.soundAs.toLowerCase().includes(q) ||
                item.explanation.toLowerCase().includes(q) ||
                item.examplePinyin.toLowerCase().includes(q) ||
                item.exampleMeaning.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Filter finals by search query
    const filteredFinals = useMemo(() => {
        if (!searchQuery.trim()) return PINYIN_FINALS;
        const q = searchQuery.toLowerCase().trim();
        return PINYIN_FINALS.filter(
            (item) =>
                item.letter.toLowerCase().includes(q) ||
                item.soundAs.toLowerCase().includes(q) ||
                item.explanation.toLowerCase().includes(q) ||
                item.examplePinyin.toLowerCase().includes(q) ||
                item.exampleMeaning.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-chinese text-2xl font-bold shadow-lg shadow-rose-600/30 flex-shrink-0">
                            音
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Panduan Bunyi & Huruf Pinyin
                                </h2>
                                <span className="px-2 py-0.5 text-[11px] font-semibold uppercase rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 hidden sm:inline-block">
                                    汉语拼音
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-0.5">
                                Pelajari cara melafalkan huruf konsonan, vokal, dan nada Mandarin sesuai ejaan bunyi latin Indonesia.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-white rounded-xl hover:bg-slate-100 dark:bg-slate-800 transition-colors"
                        title="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Rule Banner (The user's key highlight: p->ph, g->k, d->t, b->p) */}
                <div className="px-6 py-3 bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="font-semibold text-rose-300">Kunci Pelafalan Utama:</span>
                        <span className="text-slate-300">
                            <strong className="text-white font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">p</strong> dibaca <span className="text-amber-300 font-bold">ph</span> •{' '}
                            <strong className="text-white font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">g</strong> dibaca <span className="text-amber-300 font-bold">k</span> •{' '}
                            <strong className="text-white font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">d</strong> dibaca <span className="text-amber-300 font-bold">t</span> •{' '}
                            <strong className="text-white font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">b</strong> dibaca <span className="text-amber-300 font-bold">p</span>
                        </span>
                    </div>
                </div>

                {/* Navigation Tabs & Search */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Tabs */}
                    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('initials')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                activeTab === 'initials'
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-white'
                            }`}
                        >
                            Konsonan ({PINYIN_INITIALS.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('finals')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                activeTab === 'finals'
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-white'
                            }`}
                        >
                            Vokal ({PINYIN_FINALS.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('tones')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                activeTab === 'tones'
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-white'
                            }`}
                        >
                            4 Nada (声调)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('cheatSheet')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                activeTab === 'cheatSheet'
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-white'
                            }`}
                        >
                            Tips Kilat
                        </button>
                    </div>

                    {/* Search Input for Initials/Finals */}
                    {(activeTab === 'initials' || activeTab === 'finals') && (
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari huruf (misal: p, g, d)..."
                                className="w-full pl-9 pr-8 py-1.5 bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-400 dark:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* TAB 1: KONSONAN / INITIALS */}
                    {activeTab === 'initials' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredInitials.map((item) => {
                                    const isPlayingLetter = playingAudio === `zh-CN:${item.audioText}`;
                                    const isPlayingMandarin = playingAudio === `zh-CN:${item.exampleHanzi}`;
                                    const isPlayingIndoReading = playingAudio === `id-ID:${item.exampleIndoReading}`;
                                    const cleanMeaning = item.exampleMeaning.replace(/\s*\/\s*/g, ' atau ');
                                    const isPlayingMeaning = playingAudio === `id-ID:${cleanMeaning}`;

                                    return (
                                        <div
                                            key={item.letter}
                                            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:border-slate-700 transition-all flex flex-col justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-white font-mono text-2xl font-bold text-rose-400">
                                                            {item.letter}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-slate-400">
                                                                    Dibaca latin:
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-sm border border-amber-500/30">
                                                                    {item.soundAs}
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] text-slate-500">
                                                                Grup: {item.group}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => playAudio(item.audioText, 'zh-CN', e)}
                                                        className={`p-2.5 rounded-xl border transition-all ${
                                                            isPlayingLetter
                                                                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 scale-105'
                                                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-rose-500/20 hover:text-rose-400'
                                                        }`}
                                                        title={`Dengarkan bunyi huruf konsonan '${item.letter}'`}
                                                    >
                                                        <Volume2 className={`w-4 h-4 ${isPlayingLetter ? 'animate-pulse' : ''}`} />
                                                    </button>
                                                </div>

                                                <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {item.explanation}
                                                </p>
                                            </div>

                                            {/* Dedicated Sound Buttons for Mandarin, Latin Reading & Meaning */}
                                            <div className="pt-3 border-t border-slate-900/90 bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl space-y-2">
                                                {/* Row 1: Mandarin Sample Word + Clickable Latin Reading + Sound Button */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="font-chinese text-base font-bold text-white">
                                                            {item.exampleHanzi}
                                                        </span>
                                                        <span className="font-medium text-rose-400 text-xs">
                                                            {item.examplePinyin}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => playAudio(item.exampleIndoReading, 'id-ID', e)}
                                                            className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-all inline-flex items-center gap-1 cursor-pointer ${
                                                                isPlayingIndoReading
                                                                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 scale-105 shadow-sm'
                                                                    : 'bg-slate-100 dark:bg-slate-950 text-amber-300/90 border-slate-200 dark:border-slate-800 hover:bg-amber-500/20 hover:text-amber-200'
                                                            }`}
                                                            title={`Klik untuk mendengarkan lafal bacaan latin Indonesia: ${item.exampleIndoReading}`}
                                                        >
                                                            <span>[ {item.exampleIndoReading} ]</span>
                                                            <Volume2 className={`w-2.5 h-2.5 ${isPlayingIndoReading ? 'animate-pulse' : 'opacity-70'}`} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => playAudio(item.exampleHanzi, 'zh-CN', e)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex-shrink-0 ${
                                                            isPlayingMandarin
                                                                ? 'bg-rose-600 text-white border-rose-400 shadow-md scale-105'
                                                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50'
                                                        }`}
                                                        title={`Dengarkan pelafalan Mandarin asli: ${item.exampleHanzi} (${item.examplePinyin})`}
                                                    >
                                                        <Volume2 className={`w-3.5 h-3.5 ${isPlayingMandarin ? 'animate-pulse' : ''}`} />
                                                        <span>Suara Mandarin</span>
                                                    </button>
                                                </div>

                                                {/* Row 2: Indonesian Meaning + Sound Button */}
                                                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-900">
                                                    <span className="text-slate-700 dark:text-slate-300 text-xs font-medium truncate" title={item.exampleMeaning}>
                                                        Arti: <strong className="text-slate-100">{item.exampleMeaning}</strong>
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => playAudio(cleanMeaning, 'id-ID', e)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex-shrink-0 ${
                                                            isPlayingMeaning
                                                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                                                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
                                                        }`}
                                                        title={`Dengarkan suara arti dalam Bahasa Indonesia: ${item.exampleMeaning}`}
                                                    >
                                                        <Volume2 className={`w-3.5 h-3.5 ${isPlayingMeaning ? 'animate-pulse' : ''}`} />
                                                        <span>Suara Arti</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: VOKAL / FINALS */}
                    {activeTab === 'finals' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredFinals.map((item) => {
                                    const isPlayingLetter = playingAudio === `zh-CN:${item.audioText}`;
                                    const isPlayingMandarin = playingAudio === `zh-CN:${item.exampleHanzi}`;
                                    const isPlayingIndoReading = playingAudio === `id-ID:${item.exampleIndoReading}`;
                                    const cleanMeaning = item.exampleMeaning.replace(/\s*\/\s*/g, ' atau ');
                                    const isPlayingMeaning = playingAudio === `id-ID:${cleanMeaning}`;

                                    return (
                                        <div
                                            key={item.letter}
                                            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:border-slate-700 transition-all flex flex-col justify-between gap-3"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-white font-mono text-2xl font-bold text-amber-400">
                                                            {item.letter}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-slate-400">
                                                                    Dibaca latin:
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-sm border border-rose-500/30">
                                                                    {item.soundAs}
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] text-slate-500">
                                                                Grup: {item.group}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => playAudio(item.audioText, 'zh-CN', e)}
                                                        className={`p-2.5 rounded-xl border transition-all ${
                                                            isPlayingLetter
                                                                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30 scale-105'
                                                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-amber-500/20 hover:text-amber-400'
                                                        }`}
                                                        title={`Dengarkan bunyi huruf vokal '${item.letter}'`}
                                                    >
                                                        <Volume2 className={`w-4 h-4 ${isPlayingLetter ? 'animate-pulse' : ''}`} />
                                                    </button>
                                                </div>

                                                <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {item.explanation}
                                                </p>
                                            </div>

                                            {/* Dedicated Sound Buttons for Mandarin, Latin Reading & Meaning */}
                                            <div className="pt-3 border-t border-slate-900/90 bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl space-y-2">
                                                {/* Row 1: Mandarin Sample Word + Clickable Latin Reading + Sound Button */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="font-chinese text-base font-bold text-white">
                                                            {item.exampleHanzi}
                                                        </span>
                                                        <span className="font-medium text-amber-400 text-xs">
                                                            {item.examplePinyin}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => playAudio(item.exampleIndoReading, 'id-ID', e)}
                                                            className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-all inline-flex items-center gap-1 cursor-pointer ${
                                                                isPlayingIndoReading
                                                                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 scale-105 shadow-sm'
                                                                    : 'bg-slate-100 dark:bg-slate-950 text-amber-300/90 border-slate-200 dark:border-slate-800 hover:bg-amber-500/20 hover:text-amber-200'
                                                            }`}
                                                            title={`Klik untuk mendengarkan lafal bacaan latin Indonesia: ${item.exampleIndoReading}`}
                                                        >
                                                            <span>[ {item.exampleIndoReading} ]</span>
                                                            <Volume2 className={`w-2.5 h-2.5 ${isPlayingIndoReading ? 'animate-pulse' : 'opacity-70'}`} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => playAudio(item.exampleHanzi, 'zh-CN', e)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex-shrink-0 ${
                                                            isPlayingMandarin
                                                                ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-105'
                                                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50'
                                                        }`}
                                                        title={`Dengarkan pelafalan Mandarin asli: ${item.exampleHanzi} (${item.examplePinyin})`}
                                                    >
                                                        <Volume2 className={`w-3.5 h-3.5 ${isPlayingMandarin ? 'animate-pulse' : ''}`} />
                                                        <span>Suara Mandarin</span>
                                                    </button>
                                                </div>

                                                {/* Row 2: Indonesian Meaning + Sound Button */}
                                                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-900">
                                                    <span className="text-slate-700 dark:text-slate-300 text-xs font-medium truncate" title={item.exampleMeaning}>
                                                        Arti: <strong className="text-slate-100">{item.exampleMeaning}</strong>
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => playAudio(cleanMeaning, 'id-ID', e)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex-shrink-0 ${
                                                            isPlayingMeaning
                                                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                                                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
                                                        }`}
                                                        title={`Dengarkan suara arti dalam Bahasa Indonesia: ${item.exampleMeaning}`}
                                                    >
                                                        <Volume2 className={`w-3.5 h-3.5 ${isPlayingMeaning ? 'animate-pulse' : ''}`} />
                                                        <span>Suara Arti</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: 4 NADA (TONES) */}
                    {activeTab === 'tones' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 to-slate-900 border border-slate-800">
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                    <Music className="w-4 h-4 text-rose-400" />
                                    Pentingnya 4 Nada Bahasa Mandarin
                                </h3>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Bahasa Mandarin adalah bahasa bernada (*tonal language*). Satu suku kata yang sama (misal <strong>ma</strong>) dapat memiliki arti yang sepenuhnya berbeda tergantung pada nada yang digunakan!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {PINYIN_TONES.map((tone) => {
                                    const isPlaying = playingAudio === tone.sampleHanzi;
                                    return (
                                        <div
                                            key={tone.toneNumber}
                                            className="p-5 rounded-2xl bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                                                        {tone.name}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                                                        {tone.contour}
                                                    </span>
                                                </div>

                                                <div className="my-3 flex items-center justify-between bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-chinese text-3xl font-bold text-white">
                                                            {tone.sampleHanzi}
                                                        </span>
                                                        <div>
                                                            <div className="text-lg font-bold text-amber-300">
                                                                {tone.samplePinyin}
                                                            </div>
                                                            <div className="text-xs text-slate-400">
                                                                Artinya: {tone.sampleMeaning}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => playAudio(tone.sampleHanzi)}
                                                        className={`p-2 rounded-xl border transition-all ${
                                                            isPlaying
                                                                ? 'bg-rose-600 text-white border-rose-500'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-rose-500/20 hover:text-rose-400'
                                                        }`}
                                                        title={`Dengarkan nada '${tone.samplePinyin}'`}
                                                    >
                                                        <Volume2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {tone.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: TIPS KILAT & PERANGKUMAN */}
                    {activeTab === 'cheatSheet' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Tabel Hafalan Kilat Bagi Orang Indonesia
                                </h3>
                                <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                                    Berikut rumus paling mudah untuk mengingat bunyi konsonan Pinyin yang berpasangan:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-800">
                                        <div className="text-rose-400 font-bold mb-1">1. Pasangan B & P</div>
                                        <div className="text-slate-300">
                                            • <strong className="text-white">B</strong> dibaca seperti <span className="text-amber-300 font-bold">P</span> (tanpa angin)<br />
                                            • <strong className="text-white">P</strong> dibaca seperti <span className="text-amber-300 font-bold">PH</span> (ada letupan nafas)
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-800">
                                        <div className="text-rose-400 font-bold mb-1">2. Pasangan D & T</div>
                                        <div className="text-slate-300">
                                            • <strong className="text-white">D</strong> dibaca seperti <span className="text-amber-300 font-bold">T</span> (tanpa angin)<br />
                                            • <strong className="text-white">T</strong> dibaca seperti <span className="text-amber-300 font-bold">TH</span> (ada letupan nafas)
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-800">
                                        <div className="text-rose-400 font-bold mb-1">3. Pasangan G & K</div>
                                        <div className="text-slate-300">
                                            • <strong className="text-white">G</strong> dibaca seperti <span className="text-amber-300 font-bold">K</span> (tanpa angin)<br />
                                            • <strong className="text-white">K</strong> dibaca seperti <span className="text-amber-300 font-bold">KH</span> (ada letupan nafas)
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-800">
                                        <div className="text-rose-400 font-bold mb-1">4. Pasangan J & Q & X</div>
                                        <div className="text-slate-300">
                                            • <strong className="text-white">J</strong> dibaca seperti <span className="text-amber-300 font-bold">C</span> (senyum lebar)<br />
                                            • <strong className="text-white">Q</strong> dibaca seperti <span className="text-amber-300 font-bold">CH</span> (senyum + nafas kuat)<br />
                                            • <strong className="text-white">X</strong> dibaca seperti <span className="text-amber-300 font-bold">SY / S</span> (halus)
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2">
                                        <div className="text-rose-400 font-bold mb-1">5. Huruf "E" Mandarin</div>
                                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            Huruf <strong className="text-white">E</strong> dalam bahasa Mandarin hampir selalu dibaca sebagai <strong>"e pepet"</strong> (seperti pada kata <em>teman, belum, senang</em>), BUKAN seperti "e taling" (pada kata <em>bebek, lele</em>).
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        Tips: Anda juga dapat mendengarkan pelafalan langsung pada setiap kartu kosakata.
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                    >
                        Tutup Panduan
                    </button>
                </div>
            </div>
        </div>
    );
}
