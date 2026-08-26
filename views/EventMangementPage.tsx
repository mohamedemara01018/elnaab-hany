"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { PageHeader } from "@/components/dashboard/hero-management-dashboard-page/Pageheader";
import { SaveBar } from "@/components/dashboard/hero-management-dashboard-page/Savebar";
import { EventModal } from "@/modals/EventModal";
import { EventItem, EventItemRow } from "@/components/dashboard/event-management-dashboard-page/EventsItemRow";

const INITIAL_EVENTS: EventItem[] = [
    {
        id: "1",
        order: 1,
        title: "فعالية مجتمعية",
        description: "تكريم النائب لحفاظ القرآن الكريم.",
        location: "القليوبية",
        date: "05 يوليو",
        type: "video",
        mediaUrl: "",
    },
    {
        id: "2",
        order: 2,
        title: "لقاء مع أهالي الدائرة",
        description: "لقاء مفتوح للاستماع إلى طلبات المواطنين ومناقشة أهم الملفات.",
        location: "كفر شكر",
        date: "22 يونيو",
        type: "image",
        mediaUrl: "",
    },
    {
        id: "3",
        order: 3,
        title: "جولة ميدانية لمتابعة الخدمات",
        description: "متابعة الخدمات والملفات الخاصة بالمواطنين.",
        location: "بنها",
        date: "10 يونيو",
        type: "image",
        mediaUrl: "",
    },
];

export default function EventsManagementPage() {
    const [items, setItems] = useState<EventItem[]>(INITIAL_EVENTS);
    const [saving, setSaving] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<EventItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

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

    const handleConfirmRemove = () => {
        if (!deletingItemId) return;
        setItems((prev) =>
            prev
                .filter((item) => item.id !== deletingItemId)
                .map((item, index) => ({ ...item, order: index + 1 }))
        );
        setDeletingItemId(null);
    };

    const handleModalSave = (item: Omit<EventItem, "order">) => {
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
                title="أحدث الزيارات والفعاليات"
                lastSavedLabel="آخر حفظ: منذ دقيقة"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">قائمة الزيارات والفعاليات ({items.length})</h2>
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

                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <EventItemRow
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onRemove={handleRemove}
                            />
                        ))}

                        {items.length === 0 && (
                            <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                لا توجد فعاليات مضافة بعد. ابدأ بإضافة أول فعالية.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <SaveBar
                helperText="التغييرات تظهر في الموقع فور الحفظ."
                onSave={handleSave}
                onDiscard={() => setItems(INITIAL_EVENTS)}
                saving={saving}
            />

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
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                variant="danger"
                onConfirm={handleConfirmRemove}
                onClose={() => setDeletingItemId(null)}
            />
        </>
    );
}