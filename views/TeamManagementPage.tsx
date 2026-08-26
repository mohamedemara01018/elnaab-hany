"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/hero-management-dashboard-page/Pageheader";
import { SaveBar } from "@/components/dashboard/hero-management-dashboard-page/Savebar";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { TeamModal } from "@/modals/TeamModal";
import { TeamItem, TeamItemRow } from "@/components/dashboard/team-management-dashboard-page/TeamItemRow";

const INITIAL_TEAM: TeamItem[] = [
    {
        id: "1",
        order: 1,
        name: "الأستاذ رفعت",
        role: "مسؤول متابعة طلبات الوزارات والمحافظة والإدارات التابعة لها.",
        phone: "01036200117",
    },
    {
        id: "2",
        order: 2,
        name: "الأستاذة إيمان",
        role: "مسؤولة ملف الصحة بمستشفى كفر شكر، ومعهد أورام ميت غمر، وملف الكشف الطبي لبرنامج تكافل وكرامة.",
        phone: "01065932503",
    },
    {
        id: "3",
        order: 3,
        name: "الأستاذ محمود",
        role: "مسؤول ملف الصحة بمستشفيات: بنها الجامعي، التأمين الصحي، الحميات، بنها التعليمي.",
        phone: "01558844165",
    },
    {
        id: "4",
        order: 4,
        name: "الأستاذ ماهر",
        role: "مسؤول السوشيال ميديا والصفحة الرسمية، واستقبال شكاوى المواطنين عبر الصفحة.",
        phone: "01114418110",
    },
    {
        id: "5",
        order: 5,
        name: "الأستاذ أحمد",
        role: "مسؤول متابعة شكاوى الملف الصحي.",
        phone: "01010987021",
    },
    {
        id: "6",
        order: 6,
        name: "مكتب النائب",
        role: "للشكاوى والاتصالات والرسائل الخاصة بالمكتب.",
        phone: "01024949496",
        availableHours: "يومياً من 1:00 ظهراً حتى 10:00 مساءً",
    },
];

export default function TeamManagementPage() {
    const [team, setTeam] = useState<TeamItem[]>(INITIAL_TEAM);
    const [saving, setSaving] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<TeamItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

    const openAddModal = () => {
        setActiveItem(undefined);
        setModalMode("add");
    };

    const openEditModal = (item: TeamItem) => {
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
        setTeam((prev) =>
            prev
                .filter((item) => item.id !== deletingItemId)
                .map((item, index) => ({ ...item, order: index + 1 }))
        );
        setDeletingItemId(null);
    };

    const handleModalSave = (item: Omit<TeamItem, "order">) => {
        setTeam((prev) => {
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

    const targetDeleteItem = team.find((item) => item.id === deletingItemId);

    return (
        <>
            <PageHeader
                breadcrumb="إدارة الموقع"
                title="فريق مكتب النائب"
                lastSavedLabel="آخر حفظ: منذ دقيقة"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">أعضاء الفريق ({team.length})</h2>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold"
                        >
                            <Plus size={15} />
                            <span>إضافة عضو جديد</span>
                        </button>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        إدارة فريق الخدمات ومسؤولي المتابعة للتواصل مع المواطنين حسب نوع الطلب.
                    </p>

                    <div className="flex flex-col gap-3">
                        {team.map((item) => (
                            <TeamItemRow
                                key={item.id}
                                item={item}
                                onEdit={openEditModal}
                                onRemove={handleRemove}
                            />
                        ))}

                        {team.length === 0 && (
                            <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                لا يوجد أعضاء مضافين في الفريق حالياً.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <SaveBar
                helperText="التغييرات تظهر في الموقع فور الحفظ."
                onSave={handleSave}
                onDiscard={() => setTeam(INITIAL_TEAM)}
                saving={saving}
            />

            <TeamModal
                open={modalMode !== null}
                initialItem={activeItem}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف العضو"
                description={
                    <span>
                        هل أنت تأكد من حذف <strong>&quot;{targetDeleteItem?.name}&quot;</strong> من فريق العمل؟
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