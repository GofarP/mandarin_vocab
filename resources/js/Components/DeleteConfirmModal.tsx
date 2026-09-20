import React from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Vocab } from '@/types';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    vocab?: Vocab | null;
}

export default function DeleteConfirmModal({ isOpen, onClose, vocab }: DeleteConfirmModalProps) {
    const { delete: destroy, processing } = useForm();

    if (!isOpen || !vocab) return null;

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('vocabs.destroy', vocab.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                    Hapus Kosakata Ini?
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                    Apakah Anda yakin ingin menghapus kosakata{' '}
                    <span className="font-chinese font-bold text-white text-base">"{vocab.hanzi}"</span> ({vocab.pinyin})? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={processing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        {processing ? 'Menghapus...' : 'Hapus Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}
