export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Vocab {
    id: number;
    hanzi: string;
    pinyin: string;
    dibaca?: string | null;
    meaning: string;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Stats {
    total: number;
}

export interface Filters {
    search?: string;
}

export interface Flash {
    success?: string | null;
    error?: string | null;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash?: Flash;
};
