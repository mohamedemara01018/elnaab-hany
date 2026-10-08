/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, LayoutGrid, List, Loader2, Video, Play, X } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import EmptyState from "@/components/ui/Emptystate";
import { videoService } from "@/services/video.service";
import { VideoItem } from "@/types/video.types";
import { getMediaUrl } from "@/utils/functions.utils";

export default function VideosLanding() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // حالة التحكم في الـ Modal الخاص بمشاهدة الفيديو
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    // جلب بيانات الفيديوهات من API
    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            const res = await videoService.getAll();
            if (res.isSuccess && Array.isArray(res.value)) {
                setVideos(res.value);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    // تصفية الفيديوهات بناءً على كلمة البحث
    const filteredVideos = useMemo(() => {
        if (!searchQuery.trim()) return videos;
        const query = searchQuery.toLowerCase().trim();
        return videos.filter((item: VideoItem) =>
            item.title?.toLowerCase().includes(query)
        );
    }, [videos, searchQuery]);

    return (
        <>
            <Section id="all-videos" className="py-12">
                <SectionTitle
                    eyebrow="المكتبة المرئية"
                    title="اللقاءات التلفزيونية"
                    emphasis="والكلمات البرلمانية"
                    blurb="استعرض كافة التسجيلات المرئية والكلمات واللقاءات الإعلامية الخاصة بالنواب والمبادرات."
                />

                {/* شريط التحكم: البحث وأزرار التبديل */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-8 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs">
                    {/* Input البحث */}
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن كلمة أو لقاء مرئي..."
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* أزرار التبديل بين العرض الشبكي والقائمة */}
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

                {/* حالة التحميل */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
                        <Loader2 className="animate-spin w-8 h-8 text-primary" aria-hidden="true" />
                        <span className="text-sm font-semibold">جاري تحميل الفيديوهات...</span>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    /* حالة عدم وجود بيانات */
                    <EmptyState
                        icon={Video}
                        title={searchQuery ? "لا توجد نتائج تطابق بحثك" : "لا توجد فيديوهات متاحة حالياً"}
                        description={
                            searchQuery
                                ? "تأكد من كتابة كلمة البحث بشكل صحيح أو جرب البحث بكلمة أخرى."
                                : "سيتم إضافة التسجيلات المرئية فور توفرها."
                        }
                        size="large"
                    />
                ) : viewMode === "grid" ? (
                    /* العرض الشبكي (Square / Grid Component) */
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filteredVideos.map((item, index) => {
                            const videoUrl = getMediaUrl(item.mediaUrl);
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

                                        {/* معاينة الفيديو مع زر تشغيل تفاعلي */}
                                        <div
                                            onClick={() => setSelectedVideo(item)}
                                            className="relative w-full h-52 rounded-xl overflow-hidden bg-black/90 border border-outline-variant/20 cursor-pointer group/video flex items-center justify-center"
                                        >
                                            {videoUrl ? (
                                                <video
                                                    src={videoUrl}
                                                    className="w-full h-full object-cover opacity-80 group-hover/video:opacity-60 transition-opacity duration-300"
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                                    <Video className="w-12 h-12 opacity-40" />
                                                </div>
                                            )}

                                            {/* زر التشغيل القابل للتفاعل */}
                                            <div className="absolute w-14 h-14 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform duration-300 border border-white/20">
                                                <Play className="w-6 h-6 fill-current ml-1" />
                                            </div>
                                        </div>

                                        <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* زر تشغيل الكلمة / الفيديو */}
                                    <div className="mt-5 pt-3 border-t border-outline-variant/20">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedVideo(item)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-all duration-200 border border-outline-variant/30"
                                        >
                                            <Play className="w-4 h-4 shrink-0 fill-current" />
                                            <span>مشاهدة الفيديو</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    /* عرض الصفوف (Row / List Component) */
                    <div className="flex flex-col gap-4">
                        {filteredVideos.map((item, index) => {
                            const videoUrl = getMediaUrl(item.mediaUrl);
                            const numberLabel = String(index + 1).padStart(2, "0");

                            return (
                                <article
                                    key={item.id}
                                    className="group bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 p-4 sm:p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 w-full">
                                        {/* حاوية معينة للفيديو بداخل الصف */}
                                        <div
                                            onClick={() => setSelectedVideo(item)}
                                            className="relative w-full sm:w-48 h-40 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-black/90 border border-outline-variant/20 cursor-pointer group/video flex items-center justify-center"
                                        >
                                            {videoUrl ? (
                                                <video
                                                    src={videoUrl}
                                                    className="w-full h-full object-cover opacity-80 group-hover/video:opacity-60 transition-opacity duration-300"
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                                                    <Video className="w-8 h-8 opacity-40" />
                                                </div>
                                            )}

                                            <div className="absolute w-10 h-10 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-md group-hover/video:scale-110 transition-transform duration-300">
                                                <Play className="w-5 h-5 fill-current ml-0.5" />
                                            </div>
                                        </div>

                                        {/* عنوان وتفاصيل الفيديو */}
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-display font-black text-xs px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                    {numberLabel}
                                                </span>
                                                <h3 className="font-display text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* زر التشغيل في العرض التسلسلي */}
                                    <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedVideo(item)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-all duration-200 border border-outline-variant/30"
                                        >
                                            <Play className="w-4 h-4 shrink-0 fill-current" />
                                            <span>مشاهدة الفيديو</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </Section>

            {/* Modal عرض تشغيل الفيديو المختار */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header الخاص بالـ Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 bg-surface-container-low/50">
                            <h3 className="font-display text-lg font-bold text-on-surface line-clamp-1">
                                {selectedVideo.title}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                                aria-label="إغلاق"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* محتوى مشغل الفيديو داخل الـ Modal */}
                        <div className="p-6 overflow-y-auto flex flex-col gap-5">
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-outline-variant/20 shadow-inner flex items-center justify-center">
                                {getMediaUrl(selectedVideo.mediaUrl) ? (
                                    <video
                                        src={getMediaUrl(selectedVideo.mediaUrl)}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <p className="text-on-surface-variant text-sm">عذراً، يتعذر تحميل مشغل الفيديو.</p>
                                )}
                            </div>
                        </div>

                        {/* Footer الخاص بالـ Modal */}
                        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
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