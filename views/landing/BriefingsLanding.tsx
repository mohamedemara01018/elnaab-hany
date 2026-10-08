/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, LayoutGrid, List, Loader2, FolderOpen, Eye, X } from "lucide-react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import EmptyState from "@/components/ui/Emptystate";
import { briefingRequestsService } from "@/services/briefing-requests.service";
import { BriefingRequestItem } from "@/types/briefing-requests.types";
import { getMediaUrl } from "@/utils/functions.utils";
import defaultImg from "@/public/help_people.jpg";

export default function BriefingsLanding() {
    const [briefings, setBriefings] = useState<BriefingRequestItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Modal state for viewing details
    const [selectedBriefing, setSelectedBriefing] = useState<BriefingRequestItem | null>(null);

    // Fetch briefing requests from the API
    const fetchBriefings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await briefingRequestsService.getAll();
            if (res?.isSuccess && Array.isArray(res.value)) {
                setBriefings(res.value);
            }
        } catch (error) {
            console.error("Error fetching briefing requests:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBriefings();
    }, [fetchBriefings]);

    // Filter briefing requests based on search query
    const filteredBriefings = useMemo(() => {
        if (!searchQuery.trim()) return briefings;
        const query = searchQuery.toLowerCase().trim();
        return briefings.filter(
            (item: BriefingRequestItem) =>
                item.title?.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query)
        );
    }, [briefings, searchQuery]);

    return (
        <>
            <Section id="all-briefings" className="py-12">
                <SectionTitle
                    eyebrow="طلبات الإحاطة"
                    title="جميع طلبات الإحاطة"
                    emphasis="والبيانات المقدمة"
                    blurb="استعرض كافة طلبات الإحاطة والتفاصيل الخاصة بها ومتابعة مستجداتها."
                />

                {/* Search Bar and View Mode Switcher */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-8 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن طلب إحاطة..."
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Grid and List View Toggle Buttons */}
                    <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl border border-outline-variant/20 self-end sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "grid"
                                    ? "bg-primary text-on-primary shadow-xs"
                                    : "text-on-surface-variant hover:text-on-surface"
                                }`}
                            aria-label="عرض شبكي"
                        >
                            <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>مربعات</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list"
                                    ? "bg-primary text-on-primary shadow-xs"
                                    : "text-on-surface-variant hover:text-on-surface"
                                }`}
                            aria-label="عرض قائمة"
                        >
                            <List className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>صفوف</span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
                        <Loader2 className="animate-spin w-8 h-8 text-primary" aria-hidden="true" />
                        <span className="text-sm font-semibold">جاري تحميل طلبات الإحاطة...</span>
                    </div>
                ) : filteredBriefings.length === 0 ? (
                    /* Empty State */
                    <EmptyState
                        icon={FolderOpen}
                        title={searchQuery ? "لا توجد نتائج تطابق بحثك" : "لا توجد طلبات إحاطة متاحة حالياً"}
                        description={
                            searchQuery
                                ? "تأكد من كتابة كلمة البحث بشكل صحيح أو جرب البحث بكلمة أخرى."
                                : "سيتم إضافة طلبات الإحاطة فور توفرها."
                        }
                        size="large"
                    />
                ) : viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filteredBriefings.map((item, index) => {
                            const imageSrc = getMediaUrl(item.mediaUrl) || defaultImg;
                            const numberLabel = String(index + 1).padStart(2, "0");

                            return (
                                <article
                                    key={item.id}
                                    className="group bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    <div className="flex flex-col gap-3.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-display font-black text-sm px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                                                {numberLabel}
                                            </span>
                                        </div>

                                        <div className="relative w-full h-52 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
                                            <Image
                                                src={imageSrc}
                                                alt={item.title || "صورة طلب الإحاطة"}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                unoptimized={typeof imageSrc === "string"}
                                            />
                                        </div>

                                        <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {item.title}
                                        </h3>

                                        {item.description && (
                                            <p className="text-on-surface-variant/90 line-clamp-3 leading-relaxed text-sm">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Modal Trigger Button */}
                                    <div className="mt-5 pt-3 border-t border-outline-variant/20">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBriefing(item)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-all duration-200 border border-outline-variant/30"
                                        >
                                            <Eye className="w-4 h-4 shrink-0" />
                                            <span>عرض التفاصيل</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    /* List / Row View */
                    <div className="flex flex-col gap-4">
                        {filteredBriefings.map((item, index) => {
                            const imageSrc = getMediaUrl(item.mediaUrl) || defaultImg;
                            const numberLabel = String(index + 1).padStart(2, "0");

                            return (
                                <article
                                    key={item.id}
                                    className="group bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 p-4 sm:p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 w-full">
                                        <div className="relative w-full sm:w-48 h-40 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
                                            <Image
                                                src={imageSrc}
                                                alt={item.title || "صورة طلب الإحاطة"}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 192px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                unoptimized={typeof imageSrc === "string"}
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-display font-black text-xs px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                    {numberLabel}
                                                </span>
                                                <h3 className="font-display text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            {item.description && (
                                                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBriefing(item)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-all duration-200 border border-outline-variant/30"
                                        >
                                            <Eye className="w-4 h-4 shrink-0" />
                                            <span>عرض التفاصيل</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </Section>

            {/* Details Modal */}
            {selectedBriefing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setSelectedBriefing(null)}
                >
                    <div
                        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 bg-surface-container-low/50">
                            <h3 className="font-display text-lg font-bold text-on-surface">
                                تفاصيل طلب الإحاطة
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedBriefing(null)}
                                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                                aria-label="إغلاق"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex flex-col gap-5">
                            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20 shadow-inner shrink-0">
                                <Image
                                    src={getMediaUrl(selectedBriefing.mediaUrl) || defaultImg}
                                    alt={selectedBriefing.title || "صورة طلب الإحاطة"}
                                    fill
                                    className="object-cover"
                                    unoptimized={typeof (getMediaUrl(selectedBriefing.mediaUrl) || defaultImg) === "string"}
                                />
                            </div>

                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface mb-2">
                                    {selectedBriefing.title}
                                </h2>
                                <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>
                            </div>

                            <div className="bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20">
                                <h4 className="text-xs font-bold text-on-surface-variant mb-2">الوصف الكامل:</h4>
                                <p className="text-on-surface text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                    {selectedBriefing.description || "لا يوجد وصف متاح لطلب الإحاطة هذا."}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedBriefing(null)}
                                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}