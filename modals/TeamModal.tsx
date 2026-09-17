/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, User, Trash2, Loader2 } from "lucide-react";
import { departmentService } from "@/services/department.service";
import { organizationService } from "@/services/organization.service";
import { Department } from "@/types/department.types";
import { Organization } from "@/types/organization.types";
import { EmployeeItem } from "@/types/employee.types";

export interface ModalSavePayload {
    id?: string;
    fullName: string;
    about?: string;
    phone?: string;
    departmentId?: number;
    organizationIds?: number[];
    image?: File | null;
}

interface TeamModalProps {
    open: boolean;
    initialItem?: EmployeeItem;
    loading?: boolean;
    onClose: () => void;
    onSave: (payload: ModalSavePayload) => void;
}

export function TeamModal({ open, initialItem, loading = false, onClose, onSave }: TeamModalProps) {
    const [fullName, setFullName] = useState("");
    const [about, setAbout] = useState("");
    const [phone, setPhone] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
    const [selectedOrgIds, setSelectedOrgIds] = useState<number[]>([]);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isOptionsLoading, setIsOptionsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch departments and organizations when modal opens
    useEffect(() => {
        if (!open) return;

        const fetchOptions = async () => {
            try {
                setIsOptionsLoading(true);
                const [depsData, orgsData] = await Promise.all([
                    departmentService.getDepartments(),
                    organizationService.getOrganizations(),
                ]);
                setDepartments(depsData || []);
                setOrganizations(orgsData || []);
            } catch (error) {
                console.error("فشل في تحميل الأقسام والمؤسسات:", error);
            } finally {
                setIsOptionsLoading(false);
            }
        };

        fetchOptions();
    }, [open]);

    // 2. Populate form fields and pre-select department & organization IDs
    useEffect(() => {
        if (initialItem) {
            setFullName(initialItem.fullName || "");
            setAbout(initialItem.about || "");
            setPhone(initialItem.phone === "لا يوجد رقم" ? "" : initialItem.phone || "");
            setImageUrl(initialItem.imageUrl || "");
            setSelectedFile(null);

            // Pre-select department matching departmentName
            if (initialItem.departmentName && departments.length > 0) {
                const matchedDept = departments.find(
                    (d) => d.name.trim().toLowerCase() === initialItem.departmentName?.trim().toLowerCase()
                );
                setDepartmentId(matchedDept?.id);
            } else {
                setDepartmentId(undefined);
            }

            // Pre-select organization IDs matching organizations string array
            if (initialItem.organizations && initialItem.organizations.length > 0 && organizations.length > 0) {
                const matchingOrgIds = organizations
                    .filter((org) => initialItem.organizations?.includes(org.name))
                    .map((org) => org.id);
                setSelectedOrgIds(matchingOrgIds);
            } else {
                setSelectedOrgIds([]);
            }
        } else {
            setFullName("");
            setAbout("");
            setPhone("");
            setImageUrl("");
            setSelectedFile(null);
            setDepartmentId(undefined);
            setSelectedOrgIds([]);
        }
    }, [initialItem, open, departments, organizations]);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const tempUrl = URL.createObjectURL(file);
            setImageUrl(tempUrl);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOrgToggle = (orgId: number) => {
        setSelectedOrgIds((prev) =>
            prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialItem?.id,
            fullName,
            about: about.trim() || undefined,
            phone: phone.trim() || undefined,
            departmentId: departmentId ? Number(departmentId) : undefined,
            organizationIds: selectedOrgIds.length > 0 ? selectedOrgIds : undefined,
            image: selectedFile,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-card border border-outline-variant p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <h3 className="text-title-card font-semibold text-on-surface">
                        {initialItem ? "تعديل بيانات العضو" : "إضافة عضو جديد للفريق"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-2">
                            صورة العضو (اختياري)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="team-member-image-upload"
                        />

                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex items-center justify-center shrink-0">
                                {imageUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={imageUrl} alt="معاينة العضو" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-on-surface-variant/40" />
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    className="btn-outline flex items-center gap-2 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                                >
                                    <Upload size={14} />
                                    <span>{imageUrl ? "تغيير الصورة" : "رفع صورة"}</span>
                                </button>
                                {imageUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        disabled={loading}
                                        className="p-2 text-error hover:bg-error/10 rounded-interactive transition-colors disabled:opacity-50"
                                        title="إزالة الصورة"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            الاسم الكامل
                        </label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            disabled={loading}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-50"
                            placeholder="مثال: الأستاذ رفعت"
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            نبذة عن العضو / المسؤولية (About)
                        </label>
                        <textarea
                            rows={3}
                            value={about}
                            disabled={loading}
                            onChange={(e) => setAbout(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-50"
                            placeholder="مثال: مسؤول متابعة طلبات الوزارات والمحافظة والإدارات التابعة لها."
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            رقم الهاتف
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            disabled={loading}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary dir-ltr text-right disabled:opacity-50"
                            placeholder="01036200117"
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            القسم (Department)
                        </label>
                        {isOptionsLoading ? (
                            <div className="flex items-center gap-2 py-2 text-xs text-on-surface-variant">
                                <Loader2 className="animate-spin" size={14} />
                                <span>جاري تحميل الأقسام...</span>
                            </div>
                        ) : (
                            <select
                                value={departmentId ?? ""}
                                disabled={loading}
                                onChange={(e) =>
                                    setDepartmentId(e.target.value ? Number(e.target.value) : undefined)
                                }
                                className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-50"
                            >
                                <option value="">اختر القسم (اختياري)</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            المؤسسات التابعة (Organizations)
                        </label>
                        {isOptionsLoading ? (
                            <div className="flex items-center gap-2 py-2 text-xs text-on-surface-variant">
                                <Loader2 className="animate-spin" size={14} />
                                <span>جاري تحميل المؤسسات...</span>
                            </div>
                        ) : (
                            <div className="max-h-36 overflow-y-auto border border-outline-variant rounded-interactive bg-surface-container-low p-2 space-y-1.5">
                                {organizations.length === 0 ? (
                                    <p className="text-xs text-on-surface-variant p-1">لا توجد مؤسسات متاحة</p>
                                ) : (
                                    organizations.map((org) => (
                                        <label
                                            key={org.id}
                                            className="flex items-center gap-2 px-2 py-1 hover:bg-surface-container rounded cursor-pointer text-body-small text-on-surface"
                                        >
                                            <input
                                                type="checkbox"
                                                disabled={loading}
                                                checked={selectedOrgIds.includes(org.id)}
                                                onChange={() => handleOrgToggle(org.id)}
                                                className="rounded text-primary focus:ring-primary h-4 w-4"
                                            />
                                            <span>{org.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-outline-variant rounded-interactive text-body-small font-medium text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-interactive text-body-small font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            <span>حفظ</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}