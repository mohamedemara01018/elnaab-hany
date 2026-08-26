"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/hero-management-dashboard-page/Pageheader";
import { SaveBar } from "@/components/dashboard/hero-management-dashboard-page/Savebar";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { AchievementModal } from "@/modals/AchievementModal";
import { AchievementItem, AchievementItemRow } from "@/components/dashboard/achievements-management-dashboard-page/AchievementItemRow";

const INITIAL_ITEMS: AchievementItem[] = [
    {
        id: "1",
        order: 1,
        title: "تجهيز مستشفي كفر شكر بالعلاج البيولوجي",
        description: "توفير العلاج البيولوجي إلي مستشفي كفر شكر التخصصي تضامناً مع المرضي تسهيلاً عليهم الانتقالات.",
        imageUrl: "",
    },
    {
        id: "2",
        order: 2,
        title: "تجديد خطوط الصرف الصحي بقرية المنشأة الكبرى",
        description: "الحرص علي سلامة المواطنين تم تجديد الصرف الصحي.",
        imageUrl: "",
    },
    {
        id: "3",
        order: 3,
        title: "تطوير مستشفي أطفال بنها بالأجهزة",
        description: "توفير بعض الأجهزة في مستشفي أطفال بنها (وحدة أسنان - جهاز تخدير - كشاف عمليات - جهاز تنفس صناعي).",
        imageUrl: "",
    },
];

export default function AchievementsManagementPage() {
    const [items, setItems] = useState<AchievementItem[]>(INITIAL_ITEMS);
    const [saving, setSaving] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<AchievementItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

    const openAddModal = () => {
        setActiveItem(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: AchievementItem) => {
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

    const handleModalSave = (item: Omit<AchievementItem, "order">) => {
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
                title="ما تم إنجازه"
                lastSavedLabel="آخر حفظ: منذ دقيقة"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">قائمة الإنجازات ({items.length})</h2>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold"
                        >
                            <Plus size={15} />
                            <span>إضافة إنجاز جديد</span>
                        </button>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        قم بإدارة بطاقات قسم &quot;ما تم إنجازه&quot; التي تظهر في الواجهة الرئيسية للموقع.
                    </p>

                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <AchievementItemRow
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onRemove={handleRemove}
                            />
                        ))}

                        {items.length === 0 && (
                            <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                لا توجد إنجازات مضافة بعد. ابدأ بإضافة أول إنجاز.
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

            <AchievementModal
                open={modalMode !== null}
                initialItem={activeItem}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف الإنجاز"
                description={
                    <span>
                        هل أنت تأكد من حذف <strong>&quot;{targetDeleteItem?.title}&quot;</strong>؟ لا يمكنك التراجع عن هذه الخطوة.
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