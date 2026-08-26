"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { BriefingRequestModal } from "@/modals/BriefingRequestModal";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { BriefingRequestItem, BriefingRequestItemRow } from "@/components/dashboard/briefing-requests-dashboard-page/BriefingRequestItemRow";
import { Field, InputWithIcon, SectionCard, TextareaField } from "@/components/dashboard/hero-management-dashboard-page/Formfield";
import { PageHeader } from "@/components/dashboard/hero-management-dashboard-page/Pageheader";
import { SaveBar } from "@/components/dashboard/hero-management-dashboard-page/Savebar";

const INITIAL_ITEMS: BriefingRequestItem[] = [
    {
        id: "1",
        order: 1,
        title: "خطة توصيل الغاز الطبيعي للمنازل",
        description: "طلب توصيل الغاز الطبيعي للمنازل للتسهيل على أهالي الدائرة",
        imageUrl: "/images/requests/gas.jpg",
    },
    {
        id: "2",
        order: 2,
        title: "طلب تطوير كافة الطرق (بنها - ميت غمر)",
        description: "الحرص على سلامة المواطنين ومعاينة كوبري المنشأة الكبرى وصيانته.",
        imageUrl: "/images/requests/roads.jpg",
    },
    {
        id: "3",
        order: 3,
        title: "طلبات تجهيز المستشفيات",
        description: "توفير العلاج البيولوجي إلي مستشفى كفر شكر التخصصي تضامنا مع المرضي تسهيلا عليهم الانتقالات",
        imageUrl: "/images/requests/health.jpg",
    },
];

export default function BriefingRequestsPage() {
    const [items, setItems] = useState<BriefingRequestItem[]>(INITIAL_ITEMS);
    const [saving, setSaving] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<BriefingRequestItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

    const openAddModal = () => {
        setActiveItem(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: BriefingRequestItem) => {
        setActiveItem(item);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setActiveItem(undefined);
    };

    const handleRequestRemove = (id: string) => {
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

    const handleModalSave = (item: Omit<BriefingRequestItem, "order">) => {
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
                title="طلبات الإحاطة"
                lastSavedLabel="آخر حفظ: منذ دقيقة"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">

                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">طلبات الإحاطة ({items.length})</h2>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold"
                        >
                            <Plus size={15} />
                            <span>إضافة طلب جديد</span>
                        </button>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        يتم عرض الترقيم التلقائي (01، 02، إلخ) على بطاقات طلبات الإحاطة في الموقع حسب الترتيب أدناه.
                    </p>

                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <BriefingRequestItemRow
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onRemove={handleRequestRemove}
                            />
                        ))}

                        {items.length === 0 && (
                            <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                لا توجد طلبات إحاطة مضافة بعد. ابدأ بإضافة أول طلب.
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

            <BriefingRequestModal
                open={modalMode !== null}
                initialItem={activeItem}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف طلب الإحاطة"
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