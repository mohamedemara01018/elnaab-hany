"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/Pageheader";
import ConfirmDialog from "@/components/ui/Confirmdialog";
import { BriefingRequestModal } from "@/modals/BriefingRequestModal";
import { BriefingRequestItem, BriefingRequestItemRow } from "@/components/landing-dashboard/briefing-requests-dashboard-page/BriefingRequestItemRow";
import { briefingRequestsService } from "@/services/briefing-requests.service";
import { useDispatch } from "react-redux";
import { toastify } from "@/store/slices/toastificationSlice";
import ImageModal from "@/components/ui/ImageModal";

export default function BriefingRequestsPage() {
    const dispatch = useDispatch();

    const [items, setItems] = useState<BriefingRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<BriefingRequestItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

    // State for image preview modal
    const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

    // Fetch briefing requests from API
    const fetchBriefingRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await briefingRequestsService.getAll();
            if (response.isSuccess && Array.isArray(response.value)) {
                const mappedItems: BriefingRequestItem[] = response.value.map((item, index) => ({
                    id: String(item.id),
                    order: index + 1,
                    title: item.title,
                    description: item.description,
                    imageUrl: item.mediaUrl || "",
                }));
                setItems(mappedItems);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء جلب طلبات الإحاطة.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBriefingRequests();
    }, [fetchBriefingRequests]);

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

    const handleRemove = (id: string) => {
        setDeletingItemId(Number(id));
    };

    const handlePreviewImage = (src: string, title: string) => {
        setPreviewImage({ src, title });
    };

    // Delete briefing request via API
    const handleConfirmRemove = async () => {
        if (!deletingItemId) return;
        setDeleting(true);
        try {
            const response = await briefingRequestsService.delete(deletingItemId);
            if (response.isSuccess) {
                dispatch(toastify({ message: response.message || "تم حذف طلب الإحاطة بنجاح.", type: "success" }));
                await fetchBriefingRequests();
            } else {
                dispatch(toastify({ message: response.message || "تعذر حذف طلب الإحاطة.", type: "error" }));
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء حذف طلب الإحاطة.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setDeleting(false);
            setDeletingItemId(null);
        }
    };

    // Save/Update briefing request via Modal and API
    const handleModalSave = async (
        itemData: { title: string; description: string; media?: File | Blob },
        id?: string
    ) => {
        try {
            if (id) {
                // Edit
                const response = await briefingRequestsService.update(Number(id), {
                    Title: itemData.title,
                    Description: itemData.description,
                    Media: itemData.media,
                });
                if (response.isSuccess) {
                    dispatch(toastify({ message: response.message || "تم تحديث طلب الإحاطة بنجاح.", type: "success" }));
                    fetchBriefingRequests();
                }
            } else {
                // Create
                const response = await briefingRequestsService.create({
                    Title: itemData.title,
                    Description: itemData.description,
                    Media: itemData.media!,
                });
                if (response.isSuccess) {
                    dispatch(toastify({ message: response.message || "تمت إضافة طلب الإحاطة بنجاح.", type: "success" }));
                    fetchBriefingRequests();
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
                title="طلبات الإحاطة"
                lastSavedLabel="يتم التحديث مباشرة عند إجراء التغييرات"
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

                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-primary">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <BriefingRequestItemRow
                                    key={item.id}
                                    item={item}
                                    onEdit={openEditModal}
                                    onRemove={handleRemove}
                                    onPreviewImage={handlePreviewImage}
                                />
                            ))}

                            {items.length === 0 && (
                                <div className="rounded-card border border-dashed border-outline-variant py-10 text-center text-body-small text-on-surface-variant">
                                    لا توجد طلبات إحاطة مضافة بعد. ابدأ بإضافة أول طلب.
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

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
                confirmLabel={deleting ? "جارٍ الحذف..." : "حذف"}
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