/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/Pageheader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
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
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<VideoItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

    const [previewVideo, setPreviewVideo] = useState<{ src: string; title: string } | null>(null);

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
        fetchVideos();
    }, [fetchVideos]);

    const openAddModal = () => {
        setActiveItem(undefined);
        setUploadProgress(0);
        setModalMode("add");
    };

    const openEditModal = (item: VideoItem) => {
        setActiveItem(item);
        setUploadProgress(0);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setActiveItem(undefined);
        setUploadProgress(0);
    };

    const handleRemove = (id: string) => {
        setDeletingItemId(Number(id));
    };

    const handlePreviewVideo = (src: string, title: string) => {
        setPreviewVideo({ src, title });
    };

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

    const handleModalSave = async (
        itemData: { title: string; media?: File | Blob },
        id?: string
    ) => {
        setIsSaving(true);
        setUploadProgress(0); // إعادة التصفير عند بدء الرفع

        try {
            if (id) {
                // حالة التعديل (Edit)
                let mediaFile: File | undefined = undefined;

                if (itemData.media) {
                    mediaFile = itemData.media instanceof File
                        ? itemData.media
                        : new File([itemData.media], "video.mp4", { type: itemData.media.type });
                }

                const response = await videoService.update(
                    Number(id),
                    {
                        Title: itemData.title,
                        ...(mediaFile ? { Media: mediaFile } : {}),
                    },
                    (progress) => setUploadProgress(progress) // <--- تحديث حالة الرفع
                );

                if (response.isSuccess) {
                    dispatch(toastify({ message: response.message || "تم تحديث الفيديو بنجاح.", type: "success" }));
                    closeModal();
                    await fetchVideos();
                } else {
                    dispatch(toastify({ message: response.message || "تعذر تحديث الفيديو.", type: "error" }));
                }
            } else {
                // حالة الإضافة (Create)
                if (!itemData.media) {
                    dispatch(toastify({ message: "يرجى تحديد ملف الفيديو.", type: "error" }));
                    setIsSaving(false);
                    return;
                }

                const mediaFile = itemData.media instanceof File
                    ? itemData.media
                    : new File([itemData.media], "video.mp4", { type: itemData.media.type });

                const response = await videoService.create(
                    { Title: itemData.title, Media: mediaFile },
                    (progress) => setUploadProgress(progress) // <--- تحديث حالة الرفع
                );

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
        } finally {
            setIsSaving(false);
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
                isSaving={isSaving}
                uploadProgress={uploadProgress}
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

            <VideoPreviewModal
                isOpen={previewVideo !== null}
                src={previewVideo?.src || ""}
                title={previewVideo?.title || "معاينة الفيديو"}
                onClose={() => setPreviewVideo(null)}
            />
        </>
    );
}