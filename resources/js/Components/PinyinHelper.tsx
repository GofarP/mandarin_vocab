import React from 'react';

interface ToneGroup {
    base: string;
    chars: string[];
}

const TONES: ToneGroup[] = [
    { base: 'a', chars: ['ā', 'á', 'ǎ', 'à'] },
    { base: 'e', chars: ['ē', 'é', 'ě', 'è'] },
    { base: 'i', chars: ['ī', 'í', 'ǐ', 'ì'] },
    { base: 'o', chars: ['ō', 'ó', 'ǒ', 'ò'] },
    { base: 'u', chars: ['ū', 'ú', 'ǔ', 'ù'] },
    { base: 'ü', chars: ['ǖ', 'ǘ', 'ǚ', 'ǜ'] },
];

interface PinyinHelperProps {
    onInsert: (char: string) => void;
}

export default function PinyinHelper({ onInsert }: PinyinHelperProps) {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-inner">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Bantuan Nada Pinyin (Klik untuk menyisipkan):
                </span>
                <span className="text-[11px] text-slate-500">
                    1 (—) · 2 (ˊ) · 3 (ˇ) · 4 (ˋ)
                </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {TONES.map((group) => (
                    <div key={group.base} className="inline-flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60">
                        {group.chars.map((char) => (
                            <button
                                key={char}
                                type="button"
                                onClick={() => onInsert(char)}
                                className="px-2 py-1 text-sm font-medium text-slate-200 hover:text-white hover:bg-rose-600 rounded transition-colors"
                                title={`Sisipkan ${char}`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
