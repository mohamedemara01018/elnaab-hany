"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/Pageheader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { TeamModal } from "@/modals/TeamModal";
import { TeamItemRow } from "@/components/landing-dashboard/team-management-dashboard-page/TeamItemRow";
import { employeeService } from "@/services/employee.service";
import { EmployeeItem, UpdateEmployeeProfilePayload } from "@/types/employee.types";
import { toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";

export default function TeamManagementPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [team, setTeam] = useState<EmployeeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [activeItem, setActiveItem] = useState<EmployeeItem | undefined>(undefined);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeService.getAllEmployees();
            if (response.isSuccess && Array.isArray(response.value)) {
                setTeam(response.value);
            } else {
                setError(response.message || "فشل في تحميل قائمة الموظفين");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "فشل في تحميل قائمة الموظفين";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEmployees();
    }, []);

    const openAddModal = () => {
        router.push("/register-employee");
    };

    const openEditModal = (item: EmployeeItem) => {
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

    const handleConfirmRemove = async () => {
        if (!deletingItemId) return;

        try {
            setIsActionLoading(true);
            const response = await employeeService.deleteEmployee(deletingItemId);

            if (response?.isSuccess !== false) {
                setTeam((prev) => prev.filter((item) => item.id !== deletingItemId));
                dispatch(
                    toastify({
                        message: "تم حذف الموظف بنجاح.",
                        type: "success",
                        duration: DURATION,
                    })
                );
                setDeletingItemId(null);
            } else {
                dispatch(
                    toastify({
                        message: response.message || "حدث خطأ أثناء حذف الموظف.",
                        type: "error",
                    })
                );
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء حذف الموظف.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleModalSave = async (payload: {
        id?: string;
        fullName: string;
        about?: string;
        phone?: string;
        departmentId?: number;
        organizationIds?: number[];
        image?: File | null;
    }) => {
        try {
            setIsActionLoading(true);

            if (payload.id) {
                const updatePayload: UpdateEmployeeProfilePayload = {
                    EmployeeId: payload.id,
                    fullname: payload.fullName,
                    About: payload.about,
                    Phone: payload.phone,
                    DepartmentId: payload.departmentId,
                    OrganizationIds: payload.organizationIds,
                    Image: payload.image,
                };

                const response = await employeeService.updateEmployeeProfile(updatePayload);

                if (response?.isSuccess !== false) {
                    dispatch(
                        toastify({
                            message: "تم تحديث بيانات الموظف بنجاح.",
                            type: "success",
                        })
                    );
                    await fetchEmployees();
                    closeModal();
                } else {
                    dispatch(
                        toastify({
                            message: response.message || "حدث خطأ أثناء تحديث بيانات الموظف.",
                            type: "error",
                        })
                    );
                }
            } else {
                dispatch(
                    toastify({
                        message: "إضافة موظف جديد غير مدعومة حالياً عبر Endpoint مباشر.",
                        type: "error",
                    })
                );
                closeModal();
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ بيانات الموظف.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setIsActionLoading(false);
        }
    };

    const targetDeleteItem = team.find((item) => item.id === deletingItemId);

    return (
        <>
            <PageHeader
                breadcrumb="إدارة الموقع"
                title="فريق مكتب النائب"
                lastSavedLabel="آخر تحديث: الآن"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                <section className="card">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-title-card text-on-surface">
                            أعضاء الفريق ({team.length})
                        </h2>
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

                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-on-surface-variant gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            <span>جاري تحميل قائمة الموظفين...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {team.map((item, index) => (
                                <TeamItemRow
                                    key={item.id}
                                    item={item}
                                    order={index + 1}
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
                    )}
                </section>
            </div>

            <TeamModal
                open={modalMode !== null}
                initialItem={activeItem}
                loading={isActionLoading}
                onClose={closeModal}
                onSave={handleModalSave}
            />

            <ConfirmDialog
                open={deletingItemId !== null}
                title="حذف العضو"
                description={
                    <span>
                        هل أنت تأكد من حذف <strong>&quot;{targetDeleteItem?.fullName || "هذا العضو"}&quot;</strong> من فريق العمل؟
                    </span>
                }
                confirmLabel={isActionLoading ? "جاري الحذف..." : "حذف"}
                cancelLabel="إلغاء"
                variant="danger"
                onConfirm={handleConfirmRemove}
                onClose={() => setDeletingItemId(null)}
            />
        </>
    );
}