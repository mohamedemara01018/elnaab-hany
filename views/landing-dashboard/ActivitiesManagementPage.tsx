"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ActivityItem, ActivityItemRow } from "@/components/landing-dashboard/activities-management-dashboard-page/Activityitemrow";
import { PageHeader } from "@/components/landing-dashboard/hero-management-dashboard-page/Pageheader";
import { SaveBar } from "@/components/landing-dashboard/hero-management-dashboard-page/Savebar";
import { ActivityModal } from "@/modals/Activitymodal";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { activitiesService } from "@/services/activities.service";
import { Activity } from "@/types/activities.types";
import ImageModal from "@/components/ui/ImageModal";

export default function ActivitiesManagementPage() {
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [modalSubmitting, setModalSubmitting] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    // حالة التحكم بـ ActivityModal
    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<ActivityItem | undefined>(undefined);

    // حالة التحكم بـ ConfirmDialog الخاص بالحذف
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

    // حالة التحكم بـ ImageModal لمعاينة الصور
    const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

    // Fetch data from API
    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await activitiesService.getAll();
            if (res.isSuccess && Array.isArray(res.value)) {
                const mappedItems: ActivityItem[] = res.value.map((item: Activity, index: number) => ({
                    id: String(item.id),
                    order: index + 1,
                    title: item.title,
                    description: item.description,
                    imageUrl: item.mediaUrl,
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchActivities();
    }, []);

    const openAddModal = () => {
        setActiveItem(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: ActivityItem) => {
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

    const handleConfirmRemove = async () => {
        if (!deletingItemId) return;
        try {
            setDeleting(true);
            await activitiesService.delete(Number(deletingItemId));
            await fetchActivities();
        } catch (error) {
            console.error("Error deleting activity:", error);
        } finally {
            setDeleting(false);
            setDeletingItemId(null);
        }
    };

    const handleModalSave = async (data: Omit<ActivityItem, "order">, imageFile?: File) => {
        try {
            setModalSubmitting(true);
            if (modalMode === "add") {
                await activitiesService.create({
                    Title: data.title,
                    Description: data.description,
                    Image: imageFile,
                });
            } else if (modalMode === "edit") {
                await activitiesService.update(Number(data.id), {
                    Title: data.title,
                    Description: data.description,
                    Image: imageFile,
                });
            }
            await fetchActivities();
            closeModal();
        } catch (error) {
            console.error("Error saving activity:", error);
        } finally {
            setModalSubmitting(false);
        }
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 900);
    };

    const targetDeleteItem = items.find((item) => item.id === deletingItemId);

    return (
        <>
            <PageHeader
                breadcrumb="إدارة الموقع"
                title="الأنشطة والفعاليات"
                lastSavedLabel="آخر حفظ: منذ دقيقة"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">قائمة مجالات العمل والأنشطة ({items.length})</h2>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold"
                        >
                            <Plus size={15} />
                            <span>إضافة مجال جديد</span>
                        </button>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        قم بإدارة بطاقات مجالات العمل والأنشطة التي تظهر في الواجهة الرئيسية للموقع.
                    </p>

                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-on-surface-variant gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            <span>جاري تحميل البيانات...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <ActivityItemRow
                                    key={item.id}
                                    item={item}
                                    onEdit={openEditModal}
                                    onRemove={handleRemove}
                                    onPreviewImage={handlePreviewImage}
                                />
                            ))}

                            {items.length === 0 && (
                                <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                    لا توجد مجالات مضافة بعد. ابدأ بإضافة أول مجال عمل.
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <ActivityModal
                open={modalMode !== null}
                loading={modalSubmitting}
                initialItem={activeItem}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف مجال العمل"
                description={
                    <span>
                        هل أنت تأكد من حذف مجال <strong>&quot;{targetDeleteItem?.title}&quot;</strong>؟ لا يمكنك التراجع عن هذه الخطوة.
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