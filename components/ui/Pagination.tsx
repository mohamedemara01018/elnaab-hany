"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    totalItems?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    totalItems,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = pageSize && totalItems ? (currentPage - 1) * pageSize + 1 : null;
    const endItem = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant text-body-small">
            {/* عرض عدد العناصر المتبقية */}
            <div className="text-on-surface-variant">
                {startItem && endItem && totalItems ? (
                    <span>
                        عرض <span className="font-semibold text-on-surface">{startItem}</span> -{" "}
                        <span className="font-semibold text-on-surface">{endItem}</span> من إجمالي{" "}
                        <span className="font-semibold text-on-surface">{totalItems}</span> عنصر
                    </span>
                ) : (
                    <span>
                        الصفحة <span className="font-semibold text-on-surface">{currentPage}</span> من{" "}
                        <span className="font-semibold text-on-surface">{totalPages}</span>
                    </span>
                )}
            </div>

            {/* أزرار التنقل */}
            <div className="flex items-center gap-1.5" dir="ltr">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-interactive border border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1.5 rounded-interactive text-body-small font-medium transition-colors ${currentPage === page
                                    ? "bg-primary text-on-primary"
                                    : "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container"
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2 text-on-surface-variant">
                            {page}
                        </span>
                    )
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-interactive border border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next Page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}