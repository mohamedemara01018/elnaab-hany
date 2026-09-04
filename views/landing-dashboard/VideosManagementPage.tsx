"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/landing-dashboard/hero-management-dashboard-page/Pageheader";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { VideoModal as VideoFormModal } from "@/modals/VideoModal";
import VideoPreviewModal from "@/components/ui/VideoModal";
import { VideoItem, VideoItemRow } from "@/components/landing-dashboard/video-management-dashboard-page/VideoItemRow";
import { videoService } from "@/services/video.service";
import { useDispatch } from "react-redux";
import { toastify } from "@/store/slices/toastificationSlice";

export default function VideosManagementPage() {
    const dispatch = useDispatch();

    const [items, setItems] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<VideoItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

    // حالة التحكم بـ VideoPreviewModal لمشاهدة الفيديو
    const [previewVideo, setPreviewVideo] = useState<{ src: string; title: string } | null>(null);

    // Fetch videos from API
    const fetchVideos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await videoService.getAll();
            if (response.isSuccess && Array.isArray(response.value)) {
                const mappedItems: VideoItem[] = response.value.map((item, index) => ({
                    id: String(item.id),
                    order: index + 1,
                    title: item.title,
                    videoUrl: item.mediaUrl || "",
                }));
                setItems(mappedItems);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء جلب الفيديوهات.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVideos();
    }, [fetchVideos]);

    const openAddModal = () => {
        setActiveItem(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: VideoItem) => {
        setActiveItem(item);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setActiveItem(undefined);
    };

    const handleRemove = (id: string) => {
        setDeletingItemId(Number(id));
    };

    const handlePreviewVideo = (src: string, title: string) => {
        setPreviewVideo({ src, title });
    };

    // Delete video via API
    const handleConfirmRemove = async () => {
        if (!deletingItemId) return;
        setDeleting(true);
        try {
            const response = await videoService.delete(deletingItemId);
            if (response.isSuccess) {
                dispatch(toastify({ message: response.message || "تم حذف الفيديو بنجاح.", type: "success" }));
                await fetchVideos();
            } else {
                dispatch(toastify({ message: response.message || "تعذر حذف الفيديو.", type: "error" }));
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء حذف الفيديو.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setDeleting(false);
            setDeletingItemId(null);
        }
    };

    // Save/Update video via Modal and API
    const handleModalSave = async (
        itemData: { title: string; media?: File | Blob },
        id?: string
    ) => {
        try {
            if (id) {
                // Edit Mode
                let mediaFile: File | undefined = undefined;

                if (itemData.media) {
                    if (itemData.media instanceof File) {
                        mediaFile = itemData.media;
                    } else {
                        // Convert Blob to File if needed by the payload type
                        mediaFile = new File([itemData.media], "video.mp4", { type: itemData.media.type });
                    }
                }

                const response = await videoService.update(Number(id), {
                    Title: itemData.title,
                    ...(mediaFile ? { Media: mediaFile } : {}),
                });

                if (response.isSuccess) {
                    dispatch(toastify({ message: response.message || "تم تحديث الفيديو بنجاح.", type: "success" }));
                    closeModal();
                    await fetchVideos();
                } else {
                    dispatch(toastify({ message: response.message || "تعذر تحديث الفيديو.", type: "error" }));
                }
            } else {
                // Add Mode
                if (!itemData.media) {
                    dispatch(toastify({ message: "يرجى تحديد ملف الفيديو.", type: "error" }));
                    return;
                }

                const mediaFile = itemData.media instanceof File
                    ? itemData.media
                    : new File([itemData.media], "video.mp4", { type: itemData.media.type });

                const response = await videoService.create({
                    Title: itemData.title,
                    Media: mediaFile,
                });

                if (response.isSuccess) {
                    dispatch(toastify({ message: response.message || "تمت إضافة الفيديو بنجاح.", type: "success" }));
                    closeModal();
                    await fetchVideos();
                } else {
                    dispatch(toastify({ message: response.message || "تعذر إضافة الفيديو.", type: "error" }));
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ.";
            dispatch(toastify({ message, type: "error" }));
        }
    };

    const targetDeleteItem = items.find((item) => item.id === String(deletingItemId));

    return (
        <>
            <PageHeader
                breadcrumb="إدارة الموقع"
                title="اللقاءات التلفزيونية والبرلمانية"
                lastSavedLabel="يتم التحديث مباشرة عند إجراء التغييرات"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">قائمة الفيديوهات والكلمات ({items.length})</h2>
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

                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-primary">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <VideoItemRow
                                    key={item.id}
                                    item={item}
                                    onEdit={openEditModal}
                                    onRemove={handleRemove}
                                    onPreviewVideo={handlePreviewVideo}
                                />
                            ))}

                            {items.length === 0 && (
                                <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                    لا توجد فيديوهات مضافة بعد. ابدأ بإضافة أول فيديو.
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <VideoFormModal
                open={modalMode !== null}
                initialItem={activeItem}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف الفيديو"
                description={
                    <span>
                        هل أنت تأكد من حذف كلمة <strong>&quot;{targetDeleteItem?.title}&quot;</strong>؟ لا يمكنك التراجع عن هذه الخطوة.
                    </span>
                }
                confirmLabel={deleting ? "جارٍ الحذف..." : "حذف"}
                cancelLabel="إلغاء"
                variant="danger"
                onConfirm={handleConfirmRemove}
                onClose={() => setDeletingItemId(null)}
            />

            {/* Video Player Preview Modal */}
            <VideoPreviewModal
                isOpen={previewVideo !== null}
                src={previewVideo?.src || ""}
                title={previewVideo?.title || "معاينة الفيديو"}
                onClose={() => setPreviewVideo(null)}
            />
        </>
    );
}