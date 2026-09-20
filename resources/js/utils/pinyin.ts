/**
 * Pinyin and Search Normalization Utilities
 */

/**
 * Remove diacritics / tone marks from pinyin and normalize special characters.
 * E.g., "nǐ hǎo" -> "ni hao", "lǚ xíng" -> "lu xing"
 */
export function normalizePinyin(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove combining diacritical marks (tone marks)
        .replace(/ü/g, 'u')
        .replace(/v/g, 'u');
}

/**
 * Check whether a vocabulary item matches the search query.
 * Supports:
 * - Hanzi substring (e.g., "你好", "你")
 * - Pinyin with tone marks (e.g., "nǐ hǎo")
 * - Pinyin without tone marks (e.g., "ni hao")
 * - Pinyin without spaces or separators (e.g., "nihao", "xiexie", "haopengyou")
 * - Indonesian / English meaning (e.g., "halo", "terima kasih")
 * - Optional notes / catatan
 */
export function matchesVocab(
    vocab: { hanzi: string; pinyin: string; dibaca?: string | null; meaning: string; notes?: string | null },
    query: string
): boolean {
    const trimmed = query.trim();
    if (!trimmed) return true;

    const lowerQuery = trimmed.toLowerCase();
    const normQuery = normalizePinyin(trimmed);
    const queryNoSpaces = normQuery.replace(/[\s\-_]/g, '');

    // 1. Hanzi match
    if (vocab.hanzi.toLowerCase().includes(lowerQuery)) {
        return true;
    }

    // 2. Meaning / Arti match
    if (vocab.meaning.toLowerCase().includes(lowerQuery)) {
        return true;
    }

    // 3. Dibaca (Cara Baca Latin) match
    if (vocab.dibaca && vocab.dibaca.toLowerCase().includes(lowerQuery)) {
        return true;
    }

    // 4. Notes / Catatan match
    if (vocab.notes && vocab.notes.toLowerCase().includes(lowerQuery)) {
        return true;
    }

    // 5. Raw lowercase pinyin match
    if (vocab.pinyin.toLowerCase().includes(lowerQuery)) {
        return true;
    }

    // 5. Normalized pinyin match (tone marks removed)
    const normPinyin = normalizePinyin(vocab.pinyin);
    if (normPinyin.includes(normQuery)) {
        return true;
    }

    // 6. Normalized pinyin match ignoring spaces/hyphens (e.g. "nihao" matching "nǐ hǎo")
    const pinyinNoSpaces = normPinyin.replace(/[\s\-_]/g, '');
    if (queryNoSpaces && pinyinNoSpaces.includes(queryNoSpaces)) {
        return true;
    }

    return false;
}
