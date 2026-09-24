/**
 * Pinyin Phonetic & Indonesian Reading Utilities
 * Provides accurate phonetic approximation rules for Indonesian speakers
 * and structured datasets for the Pinyin Pronunciation Guide Chart.
 */

export interface PhoneticItem {
    letter: string;
    soundAs: string; // e.g., "dibaca 'ph'"
    ipa?: string;
    group: string;
    explanation: string;
    exampleHanzi: string;
    examplePinyin: string;
    exampleIndoReading: string;
    exampleMeaning: string;
    audioText: string;
}

export interface ToneItem {
    toneNumber: number;
    name: string;
    mark: string;
    contour: string;
    description: string;
    samplePinyin: string;
    sampleHanzi: string;
    sampleMeaning: string;
}

/**
 * Converts a Pinyin string (e.g. "nǐ hǎo", "bà ba", "píng guǒ")
 * into a practical Indonesian phonetic reading guide (e.g. "ni hao", "pa pa", "phing kwo").
 */
export function pinyinToIndonesianReading(pinyin: string): string {
    if (!pinyin) return '';

    // Remove diacritical tone marks for base syllable mapping
    const norm = pinyin
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const words = norm.trim().split(/\s+/);

    const convertedWords = words.map((syllable) => {
        let text = syllable;

        // Initials replacement (longest match first)
        if (text.startsWith('zh')) text = 'c\'' + text.slice(2);
        else if (text.startsWith('ch')) text = 'ch\'' + text.slice(2);
        else if (text.startsWith('sh')) text = 'sh\'' + text.slice(2);
        else if (text.startsWith('b')) text = 'p' + text.slice(1);
        else if (text.startsWith('p')) text = 'ph' + text.slice(1);
        else if (text.startsWith('d')) text = 't' + text.slice(1);
        else if (text.startsWith('t')) text = 'th' + text.slice(1);
        else if (text.startsWith('g')) text = 'k' + text.slice(1);
        else if (text.startsWith('k')) text = 'kh' + text.slice(1);
        else if (text.startsWith('j')) text = 'c' + text.slice(1);
        else if (text.startsWith('q')) text = 'ch' + text.slice(1);
        else if (text.startsWith('x')) text = 'sy' + text.slice(1);
        else if (text.startsWith('z')) text = 'ts' + text.slice(1);
        else if (text.startsWith('c')) text = 'tsh' + text.slice(1);

        // Common finals adjustments for natural Indonesian pronunciation
        text = text.replace(/iong$/, 'yung');
        text = text.replace(/ong$/, 'ung');
        text = text.replace(/ian$/, 'yen');
        text = text.replace(/iang$/, 'yang');
        text = text.replace(/uo$/, 'wo');
        text = text.replace(/ui$/, 'wei');
        text = text.replace(/iu$/, 'you');
        text = text.replace(/üe$/, 'yüe');

        return text;
    });

    return convertedWords.join(' ');
}

/**
 * 21 Pinyin Initials (Konsonan / 声母) with Indonesian phonetics
 */
export const PINYIN_INITIALS: PhoneticItem[] = [
    // Grup Bibir (Labial)
    {
        letter: 'b',
        soundAs: 'p',
        group: 'Bibir (Labial)',
        explanation: 'Dibaca seperti huruf "p" dalam bahasa Indonesia, tidak ada hembusan nafas.',
        exampleHanzi: '爸爸',
        examplePinyin: 'bàba',
        exampleIndoReading: 'pa pa',
        exampleMeaning: 'Ayah / Papa',
        audioText: '玻',
    },
    {
        letter: 'p',
        soundAs: 'ph',
        group: 'Bibir (Labial)',
        explanation: 'Dibaca "ph" (huruf p dengan hembusan angin/nafas yang kuat).',
        exampleHanzi: '苹果',
        examplePinyin: 'píngguǒ',
        exampleIndoReading: 'phing kwo',
        exampleMeaning: 'Apel',
        audioText: '坡',
    },
    {
        letter: 'm',
        soundAs: 'm',
        group: 'Bibir (Labial)',
        explanation: 'Dibaca sama persis seperti "m" biasa.',
        exampleHanzi: '妈妈',
        examplePinyin: 'māma',
        exampleIndoReading: 'ma ma',
        exampleMeaning: 'Ibu / Mama',
        audioText: '摸',
    },
    {
        letter: 'f',
        soundAs: 'f',
        group: 'Bibir (Labial)',
        explanation: 'Dibaca sama persis seperti "f" biasa (gigi atas menyentuh bibir bawah).',
        exampleHanzi: '饭',
        examplePinyin: 'fàn',
        exampleIndoReading: 'fan',
        exampleMeaning: 'Nasi / Makanan',
        audioText: '佛',
    },

    // Grup Ujung Lidah (Alveolar)
    {
        letter: 'd',
        soundAs: 't',
        group: 'Ujung Lidah',
        explanation: 'Dibaca seperti huruf "t" dalam bahasa Indonesia, tanpa hembusan nafas.',
        exampleHanzi: '弟弟',
        examplePinyin: 'dìdi',
        exampleIndoReading: 'ti ti',
        exampleMeaning: 'Adik laki-laki',
        audioText: '得',
    },
    {
        letter: 't',
        soundAs: 'th',
        group: 'Ujung Lidah',
        explanation: 'Dibaca "th" (huruf t dengan letupan hembusan nafas yang kuat).',
        exampleHanzi: '太阳',
        examplePinyin: 'tàiyáng',
        exampleIndoReading: 'thai yang',
        exampleMeaning: 'Matahari',
        audioText: '特',
    },
    {
        letter: 'n',
        soundAs: 'n',
        group: 'Ujung Lidah',
        explanation: 'Dibaca sama seperti "n" biasa.',
        exampleHanzi: '你',
        examplePinyin: 'nǐ',
        exampleIndoReading: 'ni',
        exampleMeaning: 'Kamu / Anda',
        audioText: '讷',
    },
    {
        letter: 'l',
        soundAs: 'l',
        group: 'Ujung Lidah',
        explanation: 'Dibaca sama seperti "l" biasa.',
        exampleHanzi: '老师',
        examplePinyin: 'lǎoshī',
        exampleIndoReading: 'lao she',
        exampleMeaning: 'Guru',
        audioText: '勒',
    },

    // Grup Pangkal Lidah (Velar)
    {
        letter: 'g',
        soundAs: 'k',
        group: 'Pangkal Lidah',
        explanation: 'Dibaca seperti huruf "k" dalam bahasa Indonesia, tanpa hembusan nafas.',
        exampleHanzi: '哥哥',
        examplePinyin: 'gēge',
        exampleIndoReading: 'ke ke',
        exampleMeaning: 'Kakak laki-laki',
        audioText: '哥',
    },
    {
        letter: 'k',
        soundAs: 'kh',
        group: 'Pangkal Lidah',
        explanation: 'Dibaca "kh" (huruf k dengan hembusan nafas kuat keluar dari kerongkongan).',
        exampleHanzi: '咖啡',
        examplePinyin: 'kāfēi',
        exampleIndoReading: 'kha fei',
        exampleMeaning: 'Kopi',
        audioText: '科',
    },
    {
        letter: 'h',
        soundAs: 'kh / h',
        group: 'Pangkal Lidah',
        explanation: 'Dibaca seperti "h" tebal yang bergesek di tenggorokan (mirip kh).',
        exampleHanzi: '喝',
        examplePinyin: 'hē',
        exampleIndoReading: 'khe / he',
        exampleMeaning: 'Minum',
        audioText: '喝',
    },

    // Grup Lidah Depan / Palatal
    {
        letter: 'j',
        soundAs: 'c',
        group: 'Lidah Depan',
        explanation: 'Dibaca seperti huruf "c", ujung lidah di belakang gigi bawah dan mulut tersenyum lebar.',
        exampleHanzi: '家',
        examplePinyin: 'jiā',
        exampleIndoReading: 'cya',
        exampleMeaning: 'Rumah / Keluarga',
        audioText: '基',
    },
    {
        letter: 'q',
        soundAs: 'ch',
        group: 'Lidah Depan',
        explanation: 'Dibaca seperti "ch" dengan letupan hembusan angin kuat dan mulut tersenyum.',
        exampleHanzi: '去',
        examplePinyin: 'qù',
        exampleIndoReading: 'chü',
        exampleMeaning: 'Pergi',
        audioText: '欺',
    },
    {
        letter: 'x',
        soundAs: 'sy / s',
        group: 'Lidah Depan',
        explanation: 'Dibaca antara "s" dan "sy" halus, mulut melebar seperti tersenyum.',
        exampleHanzi: '谢谢',
        examplePinyin: 'xièxie',
        exampleIndoReading: 'sye sye',
        exampleMeaning: 'Terima kasih',
        audioText: '西',
    },

    // Grup Lidah Menggulung / Ditekuk ke Atas (Retroflex)
    {
        letter: 'zh',
        soundAs: 'c (lidah ditekuk)',
        group: 'Lidah Ditekuk (Retroflex)',
        explanation: 'Dibaca seperti huruf "c" tebal dengan ujung lidah ditekuk menyentuh langit-langit mulut atas.',
        exampleHanzi: '这',
        examplePinyin: 'zhè',
        exampleIndoReading: 'ce',
        exampleMeaning: 'Ini',
        audioText: '知',
    },
    {
        letter: 'ch',
        soundAs: 'ch (lidah ditekuk)',
        group: 'Lidah Ditekuk (Retroflex)',
        explanation: 'Dibaca seperti "ch" tebal dengan ujung lidah ditekuk ke atas + hembusan nafas kuat.',
        exampleHanzi: '吃',
        examplePinyin: 'chī',
        exampleIndoReading: 'ch\'r',
        exampleMeaning: 'Makan',
        audioText: '吃',
    },
    {
        letter: 'sh',
        soundAs: 'sh (lidah ditekuk)',
        group: 'Lidah Ditekuk (Retroflex)',
        explanation: 'Dibaca seperti "sh" tebal dengan ujung lidah ditekuk ke langit-langit.',
        exampleHanzi: '什么',
        examplePinyin: 'shénme',
        exampleIndoReading: 'shen me',
        exampleMeaning: 'Apa',
        audioText: '诗',
    },
    {
        letter: 'r',
        soundAs: 'r tebal / j lembut',
        group: 'Lidah Ditekuk (Retroflex)',
        explanation: 'Dibaca seperti "r" tebal tanpa getaran lidah tajam, agak mirip "j" lembut.',
        exampleHanzi: '人',
        examplePinyin: 'rén',
        exampleIndoReading: 'ren / zen',
        exampleMeaning: 'Orang / Manusia',
        audioText: '日',
    },

    // Grup Gigi Datar (Dental Sibilant)
    {
        letter: 'z',
        soundAs: 'ts / dz',
        group: 'Gigi Datar',
        explanation: 'Dibaca seperti "ts" atau "dz" di mana ujung lidah menempel di belakang gigi seri atas.',
        exampleHanzi: '再见',
        examplePinyin: 'zàijiàn',
        exampleIndoReading: 'tsai cyen',
        exampleMeaning: 'Sampai jumpa',
        audioText: '资',
    },
    {
        letter: 'c',
        soundAs: 'tsh',
        group: 'Gigi Datar',
        explanation: 'Dibaca "tsh" (bunyi ts dengan letupan hembusan angin yang sangat jelas).',
        exampleHanzi: '菜',
        examplePinyin: 'cài',
        exampleIndoReading: 'tshai',
        exampleMeaning: 'Sayur / Masakan',
        audioText: '疵',
    },
    {
        letter: 's',
        soundAs: 's',
        group: 'Gigi Datar',
        explanation: 'Dibaca seperti "s" biasa, lidah datar di belakang gigi seri.',
        exampleHanzi: '三',
        examplePinyin: 'sān',
        exampleIndoReading: 'san',
        exampleMeaning: 'Tiga',
        audioText: '思',
    },
];

/**
 * Pinyin Finals (Vokal / 韵母) with Indonesian phonetics
 */
export const PINYIN_FINALS: PhoneticItem[] = [
    // Vokal Tunggal (Simple Finals)
    {
        letter: 'a',
        soundAs: 'a',
        group: 'Vokal Tunggal',
        explanation: 'Dibaca "a" bulat dan jelas seperti dalam bahasa Indonesia.',
        exampleHanzi: '爸爸',
        examplePinyin: 'bàba',
        exampleIndoReading: 'pa pa',
        exampleMeaning: 'Ayah / Papa',
        audioText: '啊',
    },
    {
        letter: 'o',
        soundAs: 'o / uo',
        group: 'Vokal Tunggal',
        explanation: 'Dibaca "o" agak membulat seperti ada bunyi "u" tipis di depannya (uo).',
        exampleHanzi: '多',
        examplePinyin: 'duō',
        exampleIndoReading: 'two',
        exampleMeaning: 'Banyak',
        audioText: '喔',
    },
    {
        letter: 'e',
        soundAs: 'e (pepet)',
        group: 'Vokal Tunggal',
        explanation: 'PENTING: Dibaca seperti "e" pada kata "teman" atau "elang", BUKAN "bebek".',
        exampleHanzi: '哥哥',
        examplePinyin: 'gēge',
        exampleIndoReading: 'ke ke',
        exampleMeaning: 'Kakak laki-laki',
        audioText: '鹅',
    },
    {
        letter: 'i',
        soundAs: 'i',
        group: 'Vokal Tunggal',
        explanation: 'Dibaca "i" biasa. Namun jika setelah zh/ch/sh/r/z/c/s, berbunyi mendengung "e/r".',
        exampleHanzi: '你',
        examplePinyin: 'nǐ',
        exampleIndoReading: 'ni',
        exampleMeaning: 'Kamu / Anda',
        audioText: '衣',
    },
    {
        letter: 'u',
        soundAs: 'u',
        group: 'Vokal Tunggal',
        explanation: 'Dibaca "u" biasa dengan bibir membulat ke depan.',
        exampleHanzi: '书',
        examplePinyin: 'shū',
        exampleIndoReading: 'shu',
        exampleMeaning: 'Buku',
        audioText: '乌',
    },
    {
        letter: 'ü',
        soundAs: 'u (bibir moncong lidah i)',
        group: 'Vokal Tunggal',
        explanation: 'Posisi lidah mengucapkan "i", tetapi bentuk bibir dimoncongkan bulat mengucapkan "u".',
        exampleHanzi: '绿',
        examplePinyin: 'lǜ',
        exampleIndoReading: 'lyu',
        exampleMeaning: 'Hijau',
        audioText: '迂',
    },

    // Vokal Majemuk (Compound Finals)
    {
        letter: 'ai',
        soundAs: 'ai',
        group: 'Vokal Majemuk',
        explanation: 'Dibaca "ai" seperti pada kata "santai".',
        exampleHanzi: '爱',
        examplePinyin: 'ài',
        exampleIndoReading: 'ai',
        exampleMeaning: 'Cinta',
        audioText: '哀',
    },
    {
        letter: 'ei',
        soundAs: 'ei',
        group: 'Vokal Majemuk',
        explanation: 'Dibaca "ei" seperti pada kata "survei".',
        exampleHanzi: '累',
        examplePinyin: 'lèi',
        exampleIndoReading: 'lei',
        exampleMeaning: 'Lelah / Capek',
        audioText: '诶',
    },
    {
        letter: 'ui (uei)',
        soundAs: 'wei',
        group: 'Vokal Majemuk',
        explanation: 'Merupakan singkatan dari uei, dibaca "wei".',
        exampleHanzi: '对',
        examplePinyin: 'duì',
        exampleIndoReading: 'twei',
        exampleMeaning: 'Benar / Tepat',
        audioText: '微',
    },
    {
        letter: 'ao',
        soundAs: 'au',
        group: 'Vokal Majemuk',
        explanation: 'Dibaca "au" seperti pada kata "danau".',
        exampleHanzi: '好',
        examplePinyin: 'hǎo',
        exampleIndoReading: 'hao',
        exampleMeaning: 'Baik / Bagus',
        audioText: '熬',
    },
    {
        letter: 'ou',
        soundAs: 'ou',
        group: 'Vokal Majemuk',
        explanation: 'Dibaca "ou" (antara o dan u seperti pada kata "toko").',
        exampleHanzi: '手',
        examplePinyin: 'shǒu',
        exampleIndoReading: 'shou',
        exampleMeaning: 'Tangan',
        audioText: '欧',
    },
    {
        letter: 'iu (iou)',
        soundAs: 'you',
        group: 'Vokal Majemuk',
        explanation: 'Merupakan singkatan dari iou, dibaca "you".',
        exampleHanzi: '六',
        examplePinyin: 'liù',
        exampleIndoReading: 'lyou',
        exampleMeaning: 'Enam',
        audioText: '优',
    },
    {
        letter: 'ie',
        soundAs: 'ye',
        group: 'Vokal Majemuk',
        explanation: 'Dibaca "ye" dengan mulut tersenyum melebar.',
        exampleHanzi: '写',
        examplePinyin: 'xiě',
        exampleIndoReading: 'sye',
        exampleMeaning: 'Menulis',
        audioText: '也',
    },
    {
        letter: 'üe',
        soundAs: 'yue',
        group: 'Vokal Majemuk',
        explanation: 'Kombinasi vokal ü dan e, dibaca "yue" dengan bibir membulat ke depan.',
        exampleHanzi: '月',
        examplePinyin: 'yuè',
        exampleIndoReading: 'ywe',
        exampleMeaning: 'Bulan',
        audioText: '约',
    },
    {
        letter: 'er',
        soundAs: 'er (lidah ditekuk)',
        group: 'Vokal Khusus',
        explanation: 'Dibaca "er" dengan e pepet dan lidah ditekuk ke atas ke langit-langit mulut.',
        exampleHanzi: '二',
        examplePinyin: 'èr',
        exampleIndoReading: 'er',
        exampleMeaning: 'Dua',
        audioText: '二',
    },

    // Vokal Sengau / Nasal (Nasal Finals)
    {
        letter: 'an',
        soundAs: 'an',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "an" jelas seperti kata "aman" dalam bahasa Indonesia.',
        exampleHanzi: '看',
        examplePinyin: 'kàn',
        exampleIndoReading: 'khan',
        exampleMeaning: 'Melihat / Menonton',
        audioText: '安',
    },
    {
        letter: 'en',
        soundAs: 'en (pepet)',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "en" dengan e pepet (seperti pada kata "semen").',
        exampleHanzi: '门',
        examplePinyin: 'mén',
        exampleIndoReading: 'men',
        exampleMeaning: 'Pintu',
        audioText: '恩',
    },
    {
        letter: 'in',
        soundAs: 'in',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "in" seperti pada kata "angin".',
        exampleHanzi: '心',
        examplePinyin: 'xīn',
        exampleIndoReading: 'sin',
        exampleMeaning: 'Hati',
        audioText: '因',
    },
    {
        letter: 'ian',
        soundAs: 'yen',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "yen" (bukan i-an terpisah).',
        exampleHanzi: '天',
        examplePinyin: 'tiān',
        exampleIndoReading: 'thyen',
        exampleMeaning: 'Hari / Langit',
        audioText: '烟',
    },
    {
        letter: 'ang',
        soundAs: 'ang',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "ang" sengau di kerongkongan seperti kata "lapang".',
        exampleHanzi: '忙',
        examplePinyin: 'máng',
        exampleIndoReading: 'mang',
        exampleMeaning: 'Sibuk',
        audioText: '昂',
    },
    {
        letter: 'eng',
        soundAs: 'eng (pepet)',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "eng" dengan e pepet seperti kata "banteng".',
        exampleHanzi: '冷',
        examplePinyin: 'lěng',
        exampleIndoReading: 'leng',
        exampleMeaning: 'Dingin',
        audioText: '鞥',
    },
    {
        letter: 'ing',
        soundAs: 'ing',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "ing" seperti kata "kuning" dalam bahasa Indonesia.',
        exampleHanzi: '星',
        examplePinyin: 'xīng',
        exampleIndoReading: 'sing',
        exampleMeaning: 'Bintang',
        audioText: '应',
    },
    {
        letter: 'ong',
        soundAs: 'ung',
        group: 'Vokal Sengau (Nasal)',
        explanation: 'Dibaca "ung" (seperti pada kata "burung").',
        exampleHanzi: '中',
        examplePinyin: 'zhōng',
        exampleIndoReading: 'cung',
        exampleMeaning: 'Tengah / Pusat',
        audioText: '翁',
    },
];

/**
 * 4 Tones of Mandarin (声调 / Shēngdiào)
 */
export const PINYIN_TONES: ToneItem[] = [
    {
        toneNumber: 1,
        name: 'Nada 1 (Yīn Píng - 阴平)',
        mark: '— (mā)',
        contour: 'Tinggi & Datar (55)',
        description: 'Suara diucapkan tinggi, stabil, datar, dan tidak boleh turun atau naik.',
        samplePinyin: 'mā',
        sampleHanzi: '妈',
        sampleMeaning: 'Ibu / Mama',
    },
    {
        toneNumber: 2,
        name: 'Nada 2 (Yáng Píng - 阳平)',
        mark: 'ˊ (má)',
        contour: 'Naik (35)',
        description: 'Suara naik dari sedang ke tinggi, seperti sedang terkejut atau bertanya "Hah? / Apa?".',
        samplePinyin: 'má',
        sampleHanzi: '麻',
        sampleMeaning: 'Rami / Kebas',
    },
    {
        toneNumber: 3,
        name: 'Nada 3 (Shǎng Shēng - 上声)',
        mark: 'ˇ (mǎ)',
        contour: 'Turun lalu Naik (214)',
        description: 'Suara direndahkan ke bawah terlebih dahulu, lalu diangkat naik ke atas.',
        samplePinyin: 'mǎ',
        sampleHanzi: '马',
        sampleMeaning: 'Kuda',
    },
    {
        toneNumber: 4,
        name: 'Nada 4 (Qù Shēng - 去声)',
        mark: 'ˋ (mà)',
        contour: 'Turun Tajam & Kuat (51)',
        description: 'Suara turun tajam, tegas, dan cepat, seperti sedang menghentak atau membentak "Tidak!".',
        samplePinyin: 'mà',
        sampleHanzi: '骂',
        sampleMeaning: 'Memarahi',
    },
    {
        toneNumber: 0,
        name: 'Nada Netral / Ringan (Qīng Shēng - 轻声)',
        mark: '• (ma)',
        contour: 'Ringan & Pendek',
        description: 'Diucapkan sangat ringan, santai, dan pendek tanpa tekanan nada khusus.',
        samplePinyin: 'ma',
        sampleHanzi: '吗',
        sampleMeaning: 'Apakah (partikel tanya)',
    },
];

/**
 * Converts numeric pinyin (e.g., "ni3 hao3") into accented pinyin (e.g., "nǐ hǎo").
 */
export function convertToneNumbersToAccents(text: string): string {
    if (!text) return text;

    const tones: Record<string, string[]> = {
        a: ['ā', 'á', 'ǎ', 'à'],
        e: ['ē', 'é', 'ě', 'è'],
        i: ['ī', 'í', 'ǐ', 'ì'],
        o: ['ō', 'ó', 'ǒ', 'ò'],
        u: ['ū', 'ú', 'ǔ', 'ù'],
        'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
        v: ['ǖ', 'ǘ', 'ǚ', 'ǜ'], // Allow v as a shorthand for ü
    };

    return text.replace(/[a-zA-ZüÜvV]+[1-5]/g, (match) => {
        const toneIndex = parseInt(match.slice(-1)) - 1; // 1-4 becomes 0-3
        let word = match.slice(0, -1);
        
        // Tone 5 is neutral (no accent)
        if (toneIndex === 4) {
            return word.replace(/v/g, 'ü').replace(/V/g, 'Ü'); 
        }

        // Convert v to ü
        word = word.replace(/v/g, 'ü').replace(/V/g, 'Ü');
        
        const lowerWord = word.toLowerCase();
        let matchVowel = '';
        
        // Pinyin tone rules precedence:
        if (lowerWord.includes('a')) matchVowel = 'a';
        else if (lowerWord.includes('o')) matchVowel = 'o';
        else if (lowerWord.includes('e')) matchVowel = 'e';
        else if (lowerWord.includes('iu')) matchVowel = 'u';
        else if (lowerWord.includes('ui')) matchVowel = 'i';
        else if (lowerWord.includes('i')) matchVowel = 'i';
        else if (lowerWord.includes('u')) matchVowel = 'u';
        else if (lowerWord.includes('ü')) matchVowel = 'ü';

        if (matchVowel) {
            const isUpper = word.indexOf(matchVowel.toUpperCase()) !== -1;
            const vowelToReplace = isUpper ? matchVowel.toUpperCase() : matchVowel;
            const replacement = isUpper 
                ? tones[matchVowel][toneIndex].toUpperCase() 
                : tones[matchVowel][toneIndex];
            
            word = word.replace(vowelToReplace, replacement);
        }
        
        return word;
    });
}

/**
 * Converts accented pinyin (e.g., "nǐ hǎo") back into numeric pinyin (e.g., "ni3 hao3").
 */
export function convertAccentsToToneNumbers(text: string): string {
    if (!text) return text;

    // Define the tone mappings (accented char -> base char + tone number)
    const accentMap: Record<string, string> = {
        'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
        'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
        'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
        'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
        'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
        'ǖ': 'ü1', 'ǘ': 'ü2', 'ǚ': 'ü3', 'ǜ': 'ü4',
        
        'Ā': 'A1', 'Á': 'A2', 'Ǎ': 'A3', 'À': 'A4',
        'Ē': 'E1', 'É': 'E2', 'Ě': 'E3', 'È': 'E4',
        'Ī': 'I1', 'Í': 'I2', 'Ǐ': 'I3', 'Ì': 'I4',
        'Ō': 'O1', 'Ó': 'O2', 'Ǒ': 'O3', 'Ò': 'O4',
        'Ū': 'U1', 'Ú': 'U2', 'Ǔ': 'U3', 'Ù': 'U4',
        'Ǖ': 'Ü1', 'Ǘ': 'Ü2', 'Ǚ': 'Ü3', 'Ǜ': 'Ü4'
    };

    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (accentMap[char]) {
            result += accentMap[char];
        } else {
            result += char;
        }
    }
    return result;
}
