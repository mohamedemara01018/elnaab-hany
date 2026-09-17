"use client";

import { useState, useEffect, forwardRef, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { UserPlus, Eye, EyeOff, Check, X, Upload, Trash2, Search } from "lucide-react";
import Image from "next/image";
import { PageHeader } from "@/components/ui/Pageheader";
import { SectionCard } from "@/components/ui/Formfield";
import { Field } from "@/components/ui/Field";
import { authService } from "@/services/auth.service";
import { organizationService } from "@/services/organization.service";
import { departmentService } from "@/services/department.service";
import { toastify } from "@/store/slices/toastificationSlice";
import { Department } from "@/types/department.types";
import { Organization } from "@/types/organization.types";

type Rule = { label: string; test: (value: string) => boolean };

type CreateEmployeeFormState = {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    departmentId: number | "";
    organizationIds: number[];
    about: string;
    image: File | null;
};

const EMPTY_FORM: CreateEmployeeFormState = {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    departmentId: "",
    organizationIds: [],
    about: "",
    image: null,
};

const ROLES = [{ id: "Employee", name: "موظف" }] as const;

const PASSWORD_RULES: Rule[] = [
    { label: "8 أحرف على الأقل", test: (v) => v.length >= 8 },
    { label: "حرف كبير وحرف صغير", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
    { label: "رقم واحد على الأقل", test: (v) => /[0-9]/.test(v) },
];

const isPasswordValid = (value: string) => PASSWORD_RULES.every((rule) => rule.test(value));
const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function PasswordRequirements({ value }: { value: string }) {
    return (
        <ul className="flex flex-col gap-1 mt-2" aria-label="متطلبات كلمة المرور">
            {PASSWORD_RULES.map((rule) => {
                const isMet = value.length > 0 && rule.test(value);
                return (
                    <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-label-caption ${isMet ? "text-success-green" : "text-on-surface-variant/70"
                            }`}
                    >
                        {isMet ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        <span>{rule.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}

type PasswordFieldProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    autoComplete?: string;
};

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    function PasswordField({ value, onChange, placeholder, error, autoComplete }, ref) {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <div>
                <div className="relative">
                    <input
                        ref={ref}
                        type={isVisible ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className={`w-full bg-surface-container-low border border-outline-variant rounded-md py-2.5 ps-3.5 pe-11 text-body-md text-on-surface outline-none focus:border-primary ${error ? "border-error" : ""
                            }`}
                    />
                    <span className="absolute inset-y-0 inset-e-3 flex items-center gap-2 text-on-surface-variant">
                        <button
                            type="button"
                            onClick={() => setIsVisible((prev) => !prev)}
                            aria-label={isVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            className="hover:text-on-surface transition-colors"
                        >
                            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </span>
                </div>
                {error && <p className="text-label-caption text-error mt-1.5">{error}</p>}
            </div>
        );
    }
);

export default function CreateEmployeePage() {
    const dispatch = useDispatch();
    const [form, setForm] = useState<CreateEmployeeFormState>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [orgSearchQuery, setOrgSearchQuery] = useState("");

    useEffect(() => {
        const fetchReferenceData = async () => {
            try {
                setIsLoadingOptions(true);
                const [orgData, deptData] = await Promise.all([
                    organizationService.getOrganizations(),
                    departmentService.getDepartments(),
                ]);

                if (Array.isArray(orgData)) setOrganizations(orgData);
                if (Array.isArray(deptData)) setDepartments(deptData);
            } catch {
                dispatch(
                    toastify({
                        message: "حدث خطأ أثناء تحميل البيانات المرجعية.",
                        type: "error",
                    })
                );
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchReferenceData();
    }, [dispatch]);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const updateField = <K extends keyof CreateEmployeeFormState>(
        key: K,
        value: CreateEmployeeFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleOrganizationToggle = (id: number) => {
        setForm((prev) => {
            const exists = prev.organizationIds.includes(id);
            const updated = exists
                ? prev.organizationIds.filter((item) => item !== id)
                : [...prev.organizationIds, id];
            return { ...prev, organizationIds: updated };
        });
    };

    const handleSelectAllOrganizations = () => {
        if (form.organizationIds.length === organizations.length) {
            updateField("organizationIds", []);
        } else {
            updateField("organizationIds", organizations.map((org) => Number(org.id)));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (imagePreview) URL.revokeObjectURL(imagePreview);

        updateField("image", file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleRemoveImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        updateField("image", null);
        setImagePreview(null);
    };

    const isFormValid =
        form.fullName.trim().length > 0 &&
        isEmailValid(form.email) &&
        isPasswordValid(form.password) &&
        form.role !== "" &&
        form.departmentId !== "" &&
        form.organizationIds.length > 0;

    const handleReset = () => {
        handleRemoveImage();
        setForm(EMPTY_FORM);
        setOrgSearchQuery("");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const payload = {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                password: form.password,
                phoneNumber: form.phoneNumber.trim(),
                role: form.role,
                departmentId: Number(form.departmentId),
                organizationIds: form.organizationIds.map((id) => Number(id)),
                about: form.about.trim(),
                image: form.image,
            };


            const response = await authService.createEmployee(payload);

            if (response.isSuccess) {
                dispatch(
                    toastify({
                        message: response.message || "تم إنشاء حساب الموظف بنجاح.",
                        type: "success",
                    })
                );
                handleReset();
            } else {
                dispatch(
                    toastify({
                        message: response.message || "حدث خطأ أثناء إنشاء حساب الموظف.",
                        type: "error",
                    })
                );
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء حساب الموظف.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredOrganizations = organizations.filter((org) =>
        org.name.toLowerCase().includes(orgSearchQuery.toLowerCase())
    );

    return (
        <>
            <PageHeader breadcrumb="إدارة الموظفين" title="إضافة موظف جديد" />

            <main className="flex-1 flex flex-col px-6 md:px-10 pb-10 justify-center items-center">
                <div className="max-w-xl w-full">
                    <SectionCard
                        icon={<UserPlus size={18} />}
                        title="بيانات الحساب الجديد"
                        description="قم بملء البيانات التالية لإنشاء حساب جديد لموظف أو عضو في الفريق."
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* صورة الملف الشخصي */}
                            <div>
                                <label className="block text-body-sm font-medium text-on-surface mb-2">
                                    الصورة الشخصية <span className="text-on-surface-variant text-label-sm font-normal">(اختياري)</span>
                                </label>

                                {imagePreview ? (
                                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm mx-auto my-2 group">
                                        <Image
                                            src={imagePreview}
                                            alt="معاينة الصورة الشخصية"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="حذف الصورة"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex items-center justify-center gap-3 cursor-pointer border border-dashed border-outline-variant bg-surface-container-low p-4 rounded-md hover:border-primary transition-colors text-center">
                                        <Upload size={18} className="text-on-surface-variant" />
                                        <span className="text-body-sm text-on-surface-variant">
                                            اختر صورة ملف شخصي...
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* الاسم الكامل */}
                            <Field
                                label="الاسم الكامل"
                                placeholder="أدخل الاسم الرباعي"
                                value={form.fullName}
                                onChange={(e) => updateField("fullName", e.target.value)}
                            />

                            {/* البريد الإلكتروني */}
                            <Field
                                label="البريد الإلكتروني"
                                type="email"
                                placeholder="example@domain.com"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                            />

                            {/* كلمة المرور */}
                            <div>
                                <label className="block text-body-sm font-medium text-on-surface mb-2">
                                    كلمة المرور
                                </label>
                                <PasswordField
                                    value={form.password}
                                    onChange={(v) => updateField("password", v)}
                                    placeholder="أدخل كلمة المرور"
                                    autoComplete="new-password"
                                />
                                <PasswordRequirements value={form.password} />
                            </div>

                            {/* رقم الهاتف */}
                            <Field
                                label="رقم الهاتف"
                                placeholder="01012345678"
                                value={form.phoneNumber}
                                onChange={(e) => updateField("phoneNumber", e.target.value)}
                            />

                            {/* الدور الوظيفي */}
                            <div>
                                <label className="block text-body-sm font-medium text-on-surface mb-2">
                                    الدور (Role)
                                </label>
                                <select
                                    value={form.role}
                                    onChange={(e) => updateField("role", e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
                                >
                                    <option value="" disabled>اختر الدور</option>
                                    {ROLES.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* القسم */}
                            <div>
                                <label className="block text-body-sm font-medium text-on-surface mb-2">
                                    القسم (Department)
                                </label>
                                <select
                                    value={form.departmentId}
                                    onChange={(e) => updateField("departmentId", e.target.value ? Number(e.target.value) : "")}
                                    disabled={isLoadingOptions}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary disabled:opacity-50"
                                >
                                    <option value="" disabled>
                                        {isLoadingOptions ? "جارِ التحميل..." : "اختر القسم"}
                                    </option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* المؤسسات */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-body-sm font-medium text-on-surface">
                                        المؤسسات (Organizations) <span className="text-error">*</span>
                                    </label>
                                    {organizations.length > 0 && !isLoadingOptions && (
                                        <button
                                            type="button"
                                            onClick={handleSelectAllOrganizations}
                                            className="text-label-caption text-primary hover:underline font-medium"
                                        >
                                            {form.organizationIds.length === organizations.length
                                                ? "إلغاء تحديد الكل"
                                                : "تحديد الكل"}
                                        </button>
                                    )}
                                </div>

                                <div className="bg-surface-container-low border border-outline-variant rounded-md p-3 space-y-3">
                                    {organizations.length > 5 && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="ابحث عن مؤسسة..."
                                                value={orgSearchQuery}
                                                onChange={(e) => setOrgSearchQuery(e.target.value)}
                                                className="w-full bg-surface border border-outline-variant rounded-md py-1.5 ps-9 pe-3 text-body-sm text-on-surface outline-none focus:border-primary"
                                            />
                                            <Search size={14} className="absolute inset-y-0 start-3 my-auto text-on-surface-variant" />
                                        </div>
                                    )}

                                    <div className="max-h-48 overflow-y-auto space-y-1 pe-1">
                                        {isLoadingOptions ? (
                                            <p className="text-body-sm text-on-surface-variant p-2">جارِ التحميل...</p>
                                        ) : filteredOrganizations.length === 0 ? (
                                            <p className="text-body-sm text-on-surface-variant p-2">
                                                {orgSearchQuery ? "لا توجد نتائج مطابقة" : "لا توجد مؤسسات متاحة"}
                                            </p>
                                        ) : (
                                            filteredOrganizations.map((org) => {
                                                const orgIdNum = Number(org.id);
                                                const isChecked = form.organizationIds.includes(orgIdNum);
                                                return (
                                                    <label
                                                        key={org.id}
                                                        className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-md transition-colors ${isChecked ? "bg-primary/10 font-medium" : "hover:bg-surface-container/50"
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleOrganizationToggle(orgIdNum)}
                                                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer"
                                                        />
                                                        <span className="text-body-md text-on-surface select-none">
                                                            {org.name}
                                                        </span>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>

                                    {form.organizationIds.length > 0 && (
                                        <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between text-label-caption text-on-surface-variant">
                                            <span>تم تحديد: {form.organizationIds.length} مؤسسة</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* نبذة عن الموظف */}
                            <div>
                                <label className="block text-body-sm font-medium text-on-surface mb-2">
                                    نبذة (About)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="أدخل نبذة تعريفيّة مختصرة"
                                    value={form.about}
                                    onChange={(e) => updateField("about", e.target.value)}
                                    className="w-full bg-surface-container-low border border-outline-variant rounded-md p-3.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                                />
                            </div>

                            {/* أزرار التحكم */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={!isFormValid || isSubmitting}
                                    className="btn-primary flex items-center gap-2 px-5 py-2.5 text-body-main font-semibold disabled:opacity-50"
                                >
                                    <UserPlus size={16} />
                                    <span>{isSubmitting ? "جارِ الإنشاء..." : "إنشاء الحساب"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn-outline px-5 py-2.5 text-body-main"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </SectionCard>
                </div>
            </main>
        </>
    );
}