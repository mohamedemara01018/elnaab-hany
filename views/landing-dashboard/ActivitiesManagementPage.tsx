"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ActivityItem, ActivityItemRow } from "@/components/landing-dashboard/activities-management-dashboard-page/Activityitemrow";
import { PageHeader } from "@/components/landing-dashboard/hero-management-dashboard-page/Pageheader";
import { SaveBar } from "@/components/landing-dashboard/hero-management-dashboard-page/Savebar";
import { ActivityModal } from "@/modals/Activitymodal";
import ConfirmDialog from "@/components/ui/Confirmdialog";

const INITIAL_ITEMS: ActivityItem[] = [
    {
        id: "health",
        order: 1,
        title: "الخدمات الصحية",
        description: "متابعة الملفات الصحية ودعم المواطنين في الحصول على الخدمات الطبية.",
        imageUrl: "/images/activities/health.jpg",
    },
    {
        id: "sports",
        order: 2,
        title: "الرياضة ودعم الشباب",
        description: "دعم الرياضة والمؤسسات الرياضية وتكريم الفائزين بالبطولات.",
        imageUrl: "/images/activities/sports.jpg",
    },
    {
        id: "charity",
        order: 3,
        title: "العمل الخيري",
        description: "مبادرات مجتمعية وخدمات تستهدف أبناء الدائرة والأسر الأكثر احتياجاً.",
        imageUrl: "/images/activities/charity.jpg",
    },
];

export default function ActivitiesManagementPage() {
    const [items, setItems] = useState<ActivityItem[]>(INITIAL_ITEMS);
    const [saving, setSaving] = useState(false);

    // حالة التحكم بـ ActivityModal
    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<ActivityItem | undefined>(undefined);

    // حالة التحكم بـ ConfirmDialog الخاص بالحذف
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

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

    const handleConfirmRemove = () => {
        if (!deletingItemId) return;
        setItems((prev) =>
            prev
                .filter((item) => item.id !== deletingItemId)
                .map((item, index) => ({ ...item, order: index + 1 }))
        );
        setDeletingItemId(null);
    };

    const handleModalSave = (item: Omit<ActivityItem, "order">) => {
        setItems((prev) => {
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

                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <ActivityItemRow
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onRemove={handleRemove}
                            />
                        ))}

                        {items.length === 0 && (
                            <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                لا توجد مجالات مضافة بعد. ابدأ بإضافة أول مجال عمل.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <SaveBar
                helperText="التغييرات تظهر في الموقع فور الحفظ."
                onSave={handleSave}
                onDiscard={() => setItems(INITIAL_ITEMS)}
                saving={saving}
            />

            <ActivityModal
                open={modalMode !== null}
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
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                variant="danger"
                onConfirm={handleConfirmRemove}
                onClose={() => setDeletingItemId(null)}
            />
        </>
    );
}