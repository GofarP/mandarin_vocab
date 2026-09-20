import React from 'react';
import { Link } from '@inertiajs/react';
import { LogIn, X, ShieldAlert } from 'lucide-react';

interface GuestAuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuestAuthPromptModal({ isOpen, onClose }: GuestAuthPromptModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                    Masuk Diperlukan
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Mode saat ini adalah <span className="text-rose-400 font-semibold">Hanya Baca (Read-Only)</span>. Untuk dapat menambahkan kosakata baru, mengedit, ataupun menghapus kosakata, Anda perlu masuk ke akun terlebih dahulu.
                </p>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors text-center"
                    >
                        Batal
                    </button>
                    <Link
                        href={route('login')}
                        className="w-2/3 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 transition-all text-center"
                    >
                        <LogIn className="w-4 h-4" />
                        Masuk (Login)
                    </Link>
                </div>
            </div>
        </div>
    );
}
