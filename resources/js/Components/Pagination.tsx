import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) {
        return null; // Don't show pagination if there's only 1 page
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-8">
            {links.map((link, index) => {
                const isPrevious = link.label.includes('Previous');
                const isNext = link.label.includes('Next');
                
                let content: React.ReactNode = link.label;
                if (isPrevious) {
                    content = <ChevronLeft className="w-4 h-4" />;
                } else if (isNext) {
                    content = <ChevronRight className="w-4 h-4" />;
                }

                if (link.url === null) {
                    if (isPrevious || isNext) {
                        return (
                            <div
                                key={index}
                                className="px-3 py-2 text-sm text-slate-500 bg-slate-900/50 rounded-lg cursor-not-allowed border border-transparent flex items-center justify-center min-w-[2.5rem]"
                            >
                                {content}
                            </div>
                        );
                    }
                    return (
                        <div
                            key={index}
                            className="px-3 py-2 text-sm text-slate-500 bg-slate-900/50 rounded-lg cursor-not-allowed border border-transparent flex items-center justify-center min-w-[2.5rem]"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                if (isPrevious || isNext) {
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center min-w-[2.5rem] ${
                                link.active
                                    ? 'bg-rose-600 text-white font-bold shadow-md'
                                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                            }`}
                            preserveScroll
                        >
                            {content}
                        </Link>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center min-w-[2.5rem] ${
                            link.active
                                ? 'bg-rose-600 text-white font-bold shadow-md'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                        }`}
                        preserveScroll
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
