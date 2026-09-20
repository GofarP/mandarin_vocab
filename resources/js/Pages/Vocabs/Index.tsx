import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    BookMarked,
    Sparkles,
    LayoutGrid,
    Table as TableIcon,
    Volume2,
    CheckCircle2,
    X,
    Edit2,
    Trash2,
    LogIn,
    UserPlus,
    LogOut,
    User as UserIcon,
    Shield,
    Loader2,
    BookOpen,
    BrainCircuit
} from 'lucide-react';
import VocabCard from '@/Components/VocabCard';
import VocabFormModal from '@/Components/VocabFormModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import GuestAuthPromptModal from '@/Components/GuestAuthPromptModal';
import PinyinGuideModal from '@/Components/PinyinGuideModal';
import Pagination from '@/Components/Pagination';
import { pinyinToIndonesianReading } from '@/utils/pinyinPhonetic';
import { Vocab, Filters, Stats, Flash, User, PaginatedData } from '@/types';

interface IndexProps {
    auth?: {
        user: User | null;
    };
    vocabs: PaginatedData<Vocab>;
    filters: Filters;
    stats: Stats;
    flash: Flash;
}

export default function Index({
    auth = { user: null },
    vocabs,
    filters = {},
    stats = { total: 0 },
    flash = {}
}: IndexProps) {
    const isUserLoggedIn = Boolean(auth?.user);

    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(filters.search || '');
    const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showPhonetics, setShowPhonetics] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isPinyinGuideOpen, setIsPinyinGuideOpen] = useState<boolean>(false);
    const [isAuthPromptOpen, setIsAuthPromptOpen] = useState<boolean>(false);
    const [editingVocab, setEditingVocab] = useState<Vocab | null>(null);
    const [deletingVocab, setDeletingVocab] = useState<Vocab | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(flash.success || null);

    // Auto-dismiss toast
    useEffect(() => {
        if (flash.success) {
            setToastMessage(flash.success);
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    // 300ms Debounce for search input
    useEffect(() => {
        if (searchQuery !== debouncedSearchQuery) {
            setIsDebouncing(true);
        }
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setIsDebouncing(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Sync debounced search query with URL query string without reloading page
    useEffect(() => {
        const currentUrlParam = new URLSearchParams(window.location.search).get('search') || '';
        const targetSearch = debouncedSearchQuery.trim();

        if (targetSearch !== currentUrlParam) {
            router.get(
                route('home'),
                targetSearch ? { search: targetSearch } : {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['vocabs', 'filters'],
                }
            );
        }
    }, [debouncedSearchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setIsDebouncing(false);
    };

    const handleOpenAddModal = () => {
        if (!isUserLoggedIn) {
            setIsAuthPromptOpen(true);
            return;
        }
        setEditingVocab(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (vocab: Vocab) => {
        if (!isUserLoggedIn) {
            setIsAuthPromptOpen(true);
            return;
        }
        setEditingVocab(vocab);
        setIsFormOpen(true);
    };

    const handleOpenDeleteModal = (vocab: Vocab) => {
        if (!isUserLoggedIn) {
            setIsAuthPromptOpen(true);
            return;
        }
        setDeletingVocab(vocab);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const playAudio = (hanzi: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(hanzi);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
            <Head title="Buku Kosakata Mandarin - Hanzi, Pinyin & Arti" />

            {/* High-performance ambient background glows via zero-cost CSS radial gradients */}
            <div
                className="fixed inset-0 pointer-events-none -z-10 opacity-70"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 25% 0%, rgba(225, 29, 72, 0.12) 0%, transparent 45%),
                        radial-gradient(circle at 85% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 40%),
                        radial-gradient(circle at 35% 85%, rgba(79, 70, 229, 0.09) 0%, transparent 45%)
                    `
                }}
            />

            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 rounded-2xl shadow-xl shadow-black/50 backdrop-blur-md animate-slideUp">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="p-1 hover:text-white rounded transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header & Navigation */}
            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-xl shadow-lg shadow-black/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 font-chinese text-2xl font-bold group-hover:scale-105 transition-transform">
                                汉
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                        Hanzi<span className="text-rose-500">Vocab</span>
                                    </h1>
                                    <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                        华语生词本
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Catatan kosakata bahasa Mandarin (Hanzi · Pinyin · Arti)
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {/* Pinyin Phonetic Guide Button */}
                        <button
                            type="button"
                            onClick={() => setIsPinyinGuideOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300 text-xs sm:text-sm font-semibold shadow-sm transition-all"
                            title="Buka Panduan Bunyi Huruf Pinyin (Konsonan, Vokal & 4 Nada)"
                        >
                            <Volume2 className="w-4 h-4 text-amber-400" />
                            <span className="hidden sm:inline">Panduan Bunyi</span>
                            <span className="sm:hidden font-chinese text-sm">拼音</span>
                        </button>

                        {isUserLoggedIn ? (
                            <>
                                <Link
                                    href={route('practice.index')}
                                    className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <BrainCircuit className="w-4 h-4" />
                                    <span className="hidden sm:inline">Mulai Latihan</span>
                                    <span className="sm:hidden">Latihan</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleOpenAddModal}
                                    className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-semibold text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tambah Kosakata</span>
                                    <span className="sm:hidden">Tambah</span>
                                </button>

                                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                                            {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="font-medium max-w-[120px] truncate">
                                            {auth.user?.name}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-xs font-semibold transition-all"
                                        title="Keluar (Logout)"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Keluar</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Masuk</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-0 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero / Statistics Banner */}
                <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Pembelajaran Bahasa Mandarin Lebih Mudah
                                </div>

                                {!isUserLoggedIn && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
                                        <Shield className="w-3.5 h-3.5" />
                                        Mode Tamu (Hanya Baca)
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Kuasai Kosakata Mandarin Harian Anda
                            </h2>
                            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                                {isUserLoggedIn
                                    ? `Halo ${auth.user?.name}! Anda dapat menambah, mengedit, mendengarkan audio pelafalan, serta menghapus kosakata sesuka Anda.`
                                    : 'Jelajahi koleksi kosakata Mandarin lengkap dengan Hanzi, Pinyin, dan artinya. Masuk ke akun Anda untuk mulai menambah, mengubah, atau menghapus kata.'}
                            </p>
                        </div>

                        {/* Quick Stats Counter */}
                        <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <BookMarked className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-black text-white">
                                    {stats.total ?? vocabs.total}
                                </div>
                                <div className="text-xs font-medium text-slate-400">
                                    Total Kosakata Tersimpan
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Bar: Search & View Switcher */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari Hanzi (你好), Pinyin (ni hao / nihao / nǐ hǎo), atau Arti (halo)..."
                            className="w-full pl-11 pr-12 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-inner"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            {isDebouncing && (
                                <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
                            )}
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                                    title="Bersihkan pencarian"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* View Switcher & Result Count & Phonetics Toggle */}
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3">
                        {/* Toggle Cara Baca Latin */}
                        <button
                            type="button"
                            onClick={() => setShowPhonetics(!showPhonetics)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                                showPhonetics
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title="Tampilkan / sembunyikan bantuan cara baca latin Indonesia"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Cara Baca:</span>
                            <span className="text-[11px] font-bold">{showPhonetics ? 'ON' : 'OFF'}</span>
                        </button>

                        <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                            <span className="text-white font-bold">{vocabs.total}</span> kata
                        </span>

                        <div className="inline-flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-rose-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                                title="Tampilan Kartu (Grid)"
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                Kartu
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-rose-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                                title="Tampilan Tabel (List)"
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                Tabel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vocabs Display */}
                {vocabs.data.length > 0 ? (
                    <div className="space-y-8">
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {vocabs.data.map((vocab) => (
                                    <VocabCard
                                        key={vocab.id}
                                        vocab={vocab}
                                        canManage={isUserLoggedIn}
                                        showPhonetics={showPhonetics}
                                        onEdit={handleOpenEditModal}
                                        onDelete={handleOpenDeleteModal}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Compact Table View */
                            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-300">
                                        <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                            <tr>
                                                <th className="py-4 px-6 font-semibold">Hanzi (汉字)</th>
                                                <th className="py-4 px-6 font-semibold">Pinyin</th>
                                                <th className="py-4 px-6 font-semibold">Arti / Makna</th>
                                                <th className="py-4 px-6 font-semibold">Catatan</th>
                                                <th className="py-4 px-6 font-semibold text-center">Audio</th>
                                                {isUserLoggedIn && (
                                                    <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {vocabs.data.map((vocab) => (
                                                <tr
                                                    key={vocab.id}
                                                    className="hover:bg-slate-800/40 transition-colors"
                                                >
                                                    <td className="py-4 px-6 font-chinese text-2xl font-bold text-white">
                                                        {vocab.hanzi}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-rose-400">
                                                        <div>{vocab.pinyin}</div>
                                                        {showPhonetics && (
                                                            <div className="text-[11px] font-mono text-amber-300/85 mt-0.5" title="Cara baca latin">
                                                                [{vocab.dibaca?.trim() || pinyinToIndonesianReading(vocab.pinyin)}]
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-slate-200">
                                                        {vocab.meaning}
                                                    </td>
                                                    <td className="py-4 px-6 text-xs text-slate-400 max-w-xs truncate">
                                                        {vocab.notes || '-'}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => playAudio(vocab.hanzi, e)}
                                                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors inline-flex items-center justify-center"
                                                            title="Dengarkan Suara"
                                                        >
                                                            <Volume2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                    {isUserLoggedIn && (
                                                        <td className="py-4 px-6 text-right">
                                                            <div className="inline-flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleOpenEditModal(vocab)}
                                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOpenDeleteModal(vocab)}
                                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <Pagination links={vocabs.links} />
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-950/40">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4 font-chinese text-2xl font-bold">
                            空
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            {debouncedSearchQuery ? 'Tidak Ada Kosakata yang Cocok' : 'Belum Ada Kosakata Tersimpan'}
                        </h3>
                        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                            {debouncedSearchQuery
                                ? `Tidak ditemukan kosakata dengan kata kunci "${debouncedSearchQuery}". Anda dapat mencoba mencari dengan pinyin tanpa tanda nada (misal "ni hao" atau "nihao") atau artinya.`
                                : isUserLoggedIn
                                ? 'Mulai perjalanan belajar bahasa Mandarin Anda dengan mencatat kata-kata baru.'
                                : 'Belum ada kosakata tersimpan. Silakan masuk untuk menambahkan kata baru.'}
                        </p>
                        {debouncedSearchQuery ? (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Bersihkan Pencarian
                            </button>
                        ) : isUserLoggedIn ? (
                            <button
                                type="button"
                                onClick={handleOpenAddModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Kosakata Pertama
                            </button>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 text-white font-semibold text-sm transition-all"
                            >
                                <LogIn className="w-4 h-4 text-rose-500" />
                                Masuk untuk Menambahkan Kosakata
                            </Link>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
                <p>
                    HanziVocab · Dibangun dengan Laravel, Inertia.js, React, TypeScript & MySQL
                </p>
            </footer>

            {/* Modals */}
            {isUserLoggedIn && (
                <>
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
                </>
            )}

            <GuestAuthPromptModal
                isOpen={isAuthPromptOpen}
                onClose={() => setIsAuthPromptOpen(false)}
            />

            <PinyinGuideModal
                isOpen={isPinyinGuideOpen}
                onClose={() => setIsPinyinGuideOpen(false)}
            />
        </div>
    );
}
