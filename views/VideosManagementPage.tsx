
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import ConfirmDialog from "@/components/ui/Confirmdialog";
import { VideoItem, VideoItemRow } from "@/components/dashboard/video-management-dashboard-page/VideoItemRow";
import { SaveBar } from "@/components/dashboard/hero-management-dashboard-page/Savebar";
import { PageHeader } from "@/components/dashboard/hero-management-dashboard-page/Pageheader";
import { VideoModal } from "@/modals/VideoModal";

const INITIAL_VIDEOS: VideoItem[] = [
    {
        id: "v1",
        order: 1,
        title: "حلف اليمين داخل البرلمان",
        videoUrl: "/videos/oath.mp4",
    },
    {
        id: "v2",
        order: 2,
        title: "كلمة داخل البرلمان عن مقترح المادة الرابعة",
        videoUrl: "/videos/speech-article-4.mp4",
    },
    {
        id: "v3",
        order: 3,
        title: "عرض مشكلة طريق بنها المنصورة",
        videoUrl: "/videos/banha-road.mp4",
    },
    {
        id: "v4",
        order: 4,
        title: "مناقشة مشكلة مركز شباب كفر شكر",
        videoUrl: "/videos/kafr-shokr.mp4",
    },
    {
        id: "v5",
        order: 5,
        title: "أزمة الضغط علي مستشفي بنها الجامعي",
        videoUrl: "/videos/banha-hospital.mp4",
    },
    {
        id: "v6",
        order: 6,
        title: "مناقشة قانون التصالح في مخالفات البناء",
        videoUrl: "/videos/reconciliation-law.mp4",
    },
];

export default function VideosManagementPage() {
    const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
    const [saving, setSaving] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeVideo, setActiveVideo] = useState<VideoItem | undefined>(undefined);
    const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

    const openAddModal = () => {
        setActiveVideo(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: VideoItem) => {
        setActiveVideo(item);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setActiveVideo(undefined);
    };

    const handleRequestRemove = (id: string) => {
        setDeletingVideoId(id);
    };

    const handleConfirmRemove = () => {
        if (!deletingVideoId) return;
        setVideos((prev) =>
            prev
                .filter((item) => item.id !== deletingVideoId)
                .map((item, index) => ({ ...item, order: index + 1 }))
        );
        setDeletingVideoId(null);
    };

    const handleModalSave = (item: Omit<VideoItem, "order">) => {
        setVideos((prev) => {
            const exists = prev.some((p) => p.id === item.id);
            if (exists) {
                return prev.map((p) => (p.id === item.id ? { ...p, ...item } : p));
            }
            return [...prev, { ...item, order: prev.length + 1 }];
        });
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 900);
    };

    const targetDeleteVideo = videos.find((item) => item.id === deletingVideoId);

    return (
        <>
            <PageHeader
                breadcrumb="إدارة الموقع"
                title="اللقاءات التلفزيونية والبرلمانية"
                lastSavedLabel="آخر حفظ: منذ ۱۰ دقائق"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">


                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">قائمة الفيديوهات والكلمات ({videos.length})</h2>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold"
                        >
                            <Plus size={15} />
                            <span>إضافة فيديو جديد</span>
                        </button>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        يتم عرض الفيديوهات داخل الصفحة الرئيسية في شبكة من البطاقات وفق الترتيب الموضح أدناه.
                    </p>

                    <div className="flex flex-col gap-3">
                        {videos.map((item) => (
                            <VideoItemRow
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onRemove={handleRequestRemove}
                            />
                        ))}

                        {videos.length === 0 && (
                            <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                لا توجد فيديوهات مضافة بعد. ابدأ بإضافة أول فيديو.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <SaveBar
                helperText="التغييرات تظهر في الموقع فور الحفظ."
                onSave={handleSave}
                onDiscard={() => setVideos(INITIAL_VIDEOS)}
                saving={saving}
            />

            <VideoModal
                open={modalMode !== null}
                initialItem={activeVideo}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingVideoId !== null}
                title="حذف الفيديو"
                description={
                    <span>
                        هل أنت تأكد من حذف كلمة <strong>&quot;{targetDeleteVideo?.title}&quot;</strong>؟ لا يمكنك التراجع عن هذه الخطوة.
                    </span>
                }
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                variant="danger"
                onConfirm={handleConfirmRemove}
                onClose={() => setDeletingVideoId(null)}
            />
        </>
    );
}