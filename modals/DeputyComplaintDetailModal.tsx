"use client";

import React, { useState } from "react";
import {
    X,
    Calendar,
    Phone,
    User,
    ExternalLink,
    AlertCircle,
    Loader2,
    Trash2,
    MessageSquare,
    Users,
    Building2,
} from "lucide-react";
import { StatusBadge } from "@/components/employee-dashboard/complaints-management-page/Statusbadge";
import { ComplaintRow, ComplaintPriority, RequestStatus } from "@/types/deputy.types";
import ConfirmDialog from "@/components/ui/Confirmdialog";

type DeputyComplaintDetailModalProps = {
    complaint: ComplaintRow | null;
    onClose: () => void;
    onUpdateStatus?: (id: number, newStatus: number, priority: number, comment?: string) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
};

export function DeputyComplaintDetailModal({
    complaint,
    onClose,
    onUpdateStatus,
    onDelete,
}: DeputyComplaintDetailModalProps) {
    if (!complaint) return null;

    return (
        <DeputyComplaintDetailModalContent
            key={complaint.id}
            complaint={complaint}
            onClose={onClose}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
        />
    );
}

function DeputyComplaintDetailModalContent({
    complaint,
    onClose,
    onUpdateStatus,
    onDelete,
}: DeputyComplaintDetailModalProps & { complaint: ComplaintRow }) {
    const [status, setStatus] = useState<number>(complaint.rawStatus ?? RequestStatus.New);
    const [priority, setPriority] = useState<number>(complaint.priority ?? ComplaintPriority.Low);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const employees = complaint.employees ?? [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onUpdateStatus) return;

        setSubmitting(true);
        try {
            await onUpdateStatus(Number(complaint.id), status, priority, comment);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) return;

        setDeleting(true);
        try {
            await onDelete(complaint.id);
            setShowDeleteConfirm(false);
            onClose();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-lg bg-surface rounded-card border border-outline-variant p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                        <h3 className="text-title-card font-semibold text-on-surface">
                            تفاصيل الشكوى #{complaint.id}
                        </h3>
                        <div className="flex items-center gap-2">
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    disabled={submitting || deleting}
                                    className="p-1.5 text-error hover:bg-error-container/20 rounded-interactive transition-colors disabled:opacity-50"
                                    title="حذف الشكوى"
                                >
                                    {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting || deleting}
                                className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-interactive border border-outline-variant">
                            <span className="text-body-small font-medium text-on-surface">الحالة الحالية:</span>
                            <StatusBadge status={complaint.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-small">
                            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low p-2.5 rounded-interactive">
                                <User size={16} className="text-primary shrink-0" />
                                <span className="font-medium text-on-surface">المواطن:</span>
                                <span className="truncate">{complaint.citizenName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low p-2.5 rounded-interactive">
                                <Phone size={16} className="text-primary shrink-0" />
                                <span className="font-medium text-on-surface">الهاتف:</span>
                                <span dir="ltr">{complaint.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low p-2.5 rounded-interactive">
                                <Building2 size={16} className="text-primary shrink-0" />
                                <span className="font-medium text-on-surface">الجهة:</span>
                                <span className="truncate">
                                    {complaint.departmentName || complaint.organizationName || "-"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low p-2.5 rounded-interactive">
                                <Calendar size={16} className="text-primary shrink-0" />
                                <span className="font-medium text-on-surface">التاريخ:</span>
                                <span>{complaint.date}</span>
                            </div>
                        </div>

                        {/* Full list of assigned employees, not just the first one */}
                        <div>
                            <label className="text-body-small font-medium text-on-surface-variant mb-1.5 flex items-center gap-1.5">
                                <Users size={16} className="text-primary" />
                                <span>الموظفون المسؤولون ({employees.length})</span>
                            </label>
                            {employees.length === 0 ? (
                                <p className="text-body-small text-on-surface-variant bg-surface-container-low border border-outline-variant rounded-interactive px-3 py-2">
                                    لم يتم تعيين موظف بعد.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {employees.map((emp, idx) => (
                                        <div
                                            key={`${complaint.id}-emp-${emp.employeeId ?? idx}`}
                                            className="flex items-center justify-between gap-3 bg-surface-container-low border border-outline-variant rounded-interactive px-3 py-2 text-body-small"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-semibold text-on-surface truncate">
                                                    {emp.fullName || "-"}
                                                </p>
                                                <p className="text-on-surface-variant text-[11px] truncate">
                                                    {emp.departmentName || emp.organizationName || "-"}
                                                </p>
                                            </div>
                                            {emp.phone && (
                                                <span className="text-on-surface-variant shrink-0" dir="ltr">
                                                    {emp.phone}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {complaint.title && (
                            <div>
                                <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                                    عنوان الطلب
                                </label>
                                <div className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface text-body-small">
                                    {complaint.title}
                                </div>
                            </div>
                        )}

                        {complaint.description && (
                            <div>
                                <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                                    الوصف والتفاصيل
                                </label>
                                <div className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface text-body-small leading-relaxed whitespace-pre-wrap">
                                    {complaint.description}
                                </div>
                            </div>
                        )}

                        {complaint.mediaUrl && (
                            <div>
                                <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                                    المرفقات
                                </label>
                                <a
                                    href={complaint.mediaUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 border border-dashed border-outline-variant rounded-interactive bg-surface-container-low text-primary hover:bg-surface-container transition-colors text-body-small font-medium"
                                >
                                    <ExternalLink size={16} />
                                    <span>عرض المستند / المرفق</span>
                                </a>
                            </div>
                        )}

                        {complaint.comments && complaint.comments.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-outline-variant">
                                <label className="text-body-small font-medium text-on-surface-variant flex items-center gap-1.5">
                                    <MessageSquare size={16} className="text-primary" />
                                    <span>سجل التعليقات ({complaint.comments.length})</span>
                                </label>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {complaint.comments.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-2.5 bg-surface-container-low border border-outline-variant rounded-interactive text-body-small space-y-1"
                                        >
                                            <div className="flex justify-between text-[11px] text-on-surface-variant">
                                                <span className="font-semibold text-on-surface">
                                                    {item.employeeName || "الموظف"}
                                                </span>
                                                <span>{new Date(item.createdAt).toLocaleString("ar-EG")}</span>
                                            </div>
                                            <p className="text-on-surface">{item.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {onUpdateStatus && (
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-outline-variant">
                            <h4 className="text-body-main font-semibold text-on-surface flex items-center gap-2">
                                <AlertCircle size={16} className="text-primary" />
                                <span>تحديث حالة الشكوى والأولوية</span>
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                                        تغيير الحالة
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(Number(e.target.value))}
                                        disabled={submitting || deleting}
                                        className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface text-body-small focus:outline-none focus:border-primary cursor-pointer disabled:opacity-60"
                                    >
                                        <option value={RequestStatus.New}>جديدة</option>
                                        <option value={RequestStatus.InProgress}>قيد المتابعة</option>
                                        <option value={RequestStatus.Resolved}>تم الإنجاز</option>
                                        <option value={RequestStatus.Rejected}>مرفوضة</option>
                                        <option value={RequestStatus.Closed}>مغلقة</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                                        الأولوية
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(Number(e.target.value))}
                                        disabled={submitting || deleting}
                                        className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface text-body-small focus:outline-none focus:border-primary cursor-pointer disabled:opacity-60"
                                    >
                                        <option value={ComplaintPriority.Low}>منخفضة</option>
                                        <option value={ComplaintPriority.Medium}>متوسطة</option>
                                        <option value={ComplaintPriority.High}>عالية</option>
                                        <option value={ComplaintPriority.Critical}>حرجة</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                                    إضافة ملاحظة / رد (اختياري)
                                </label>
                                <textarea
                                    rows={2}
                                    disabled={submitting || deleting}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface text-body-small focus:outline-none focus:border-primary disabled:opacity-60"
                                    placeholder="اكتب ملاحظاتك على الإجراء المتخذ..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={submitting || deleting}
                                    className="px-4 py-2 border border-outline-variant rounded-interactive text-body-small font-medium text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
                                >
                                    إغلاق
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || deleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-interactive text-body-small font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    <span>حفظ التحديث</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                title="حذف الشكوى"
                description="هل أنت تأكد من رغبتك في حذف هذه الشكوى؟ لا يمكن التراجع عن هذا الإجراء."
                variant="danger"
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onClose={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}