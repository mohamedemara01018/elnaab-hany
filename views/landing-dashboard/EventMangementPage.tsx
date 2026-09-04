"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { PageHeader } from "@/components/landing-dashboard/hero-management-dashboard-page/Pageheader";
import { EventModal } from "@/modals/EventModal";
import { EventItem, EventItemRow } from "@/components/landing-dashboard/event-management-dashboard-page/EventsItemRow";
import { ActivityVisit } from "@/types/activity-visit.types";
import { activityVisitService } from "@/services/activities-visits.service";
import ImageModal from "@/components/ui/ImageModal";

export default function EventsManagementPage() {
    const [items, setItems] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<EventItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // حالة التحكم بـ ImageModal لمعاينة الصور
    const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

    // تحويل بيانات الـ API إلى الهيكل المستعمل في الواجهة
    const mapToEventItem = (item: ActivityVisit, index: number): EventItem => ({
        id: item.id.toString(),
        order: index + 1,
        title: item.title,
        description: item.description,
        location: item.location,
        date: item.date ? item.date.split("T")[0] : "",
        type: item.contentType?.includes("video") ? "video" : "image",
        mediaUrl: item.mediaUrl,
    });

    // جلب البيانات من الـ API
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await activityVisitService.getAll();
            if (res.isSuccess && Array.isArray(res.value)) {
                const mapped = res.value.map((item, index) => mapToEventItem(item, index));
                setItems(mapped);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء جلب البيانات";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchActivities();
    }, [fetchActivities]);

    const openAddModal = () => {
        setActiveItem(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: EventItem) => {
        setActiveItem(item);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setActiveItem(undefined);
    };

    const handleRemove = (id: string) => {
        setDeletingItemId(id);
    };

    const handlePreviewImage = (src: string, title: string) => {
        setPreviewImage({ src, title });
    };

    // تأكيد الحذف واستدعاء API الحذف
    const handleConfirmRemove = async () => {
        if (!deletingItemId) return;
        setDeleting(true);
        try {
            await activityVisitService.delete(Number(deletingItemId));
            await fetchActivities();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "فشل حذف الفعالية";
            alert(message);
        } finally {
            setDeleting(false);
            setDeletingItemId(null);
        }
    };

    // حفظ البيانات (إضافة أو تعديل) عند إرسال النموذج من الـ Modal
    const handleModalSave = async (data: {
        title: string;
        description: string;
        location: string;
        date?: string;
        media?: File;
    }) => {
        if (modalMode === "edit" && activeItem) {
            await activityVisitService.update(Number(activeItem.id), {
                Title: data.title,
                Description: data.description,
                Location: data.location,
                Date: data.date,
                Media: data.media,
            });
        } else {
            await activityVisitService.create({
                Title: data.title,
                Description: data.description,
                Location: data.location,
                Date: data.date,
                Media: data.media,
            });
        }
        await fetchActivities();
    };

    const targetDeleteItem = items.find((item) => item.id === deletingItemId);

    return (
        <>
            <PageHeader
                breadcrumb="إدارة الموقع"
                title="أحدث الزيارات والفعاليات"
                lastSavedLabel="تم التحديث التلقائي"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">
                            قائمة الزيارات والفعاليات ({items.length})
                        </h2>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold"
                        >
                            <Plus size={15} />
                            <span>إضافة فعالية جديدة</span>
                        </button>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        قم بإدارة بطاقات الفعاليات والزيارات الميدانية التي تظهر في الواجهة الرئيسية للموقع.
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-on-surface-variant gap-2">
                            <Loader2 size={24} className="animate-spin text-primary" />
                            <span>جاري تحميل الفعاليات...</span>
                        </div>
                    ) : error ? (
                        <div className="rounded-card border border-error/20 bg-error-container/10 p-6 text-center text-error text-body-small">
                            {error}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <EventItemRow
                                    key={item.id}
                                    item={item}
                                    onEdit={openEditModal}
                                    onRemove={handleRemove}
                                    onPreviewImage={handlePreviewImage}
                                />
                            ))}

                            {items.length === 0 && (
                                <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                    لا توجد فعاليات مضافة بعد. ابدأ بإضافة أول فعالية.
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <EventModal
                open={modalMode !== null}
                initialItem={activeItem}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف الفعالية"
                description={
                    <span>
                        هل أنت تأكد من حذف <strong>&quot;{targetDeleteItem?.title}&quot;</strong>؟ لا يمكنك التراجع عن هذه الخطوة.
                    </span>
                }
                confirmLabel={deleting ? "جاري الحذف..." : "حذف"}
                cancelLabel="إلغاء"
                variant="danger"
                onConfirm={handleConfirmRemove}
                onClose={() => setDeletingItemId(null)}
            />

            {/* Image Preview Modal */}
            <ImageModal
                isOpen={previewImage !== null}
                src={previewImage?.src || ""}
                alt={previewImage?.title || "معاينة الصورة"}
                onClose={() => setPreviewImage(null)}
            />
        </>
    );
}