"use client";

import { useState, forwardRef } from "react";
import { useDispatch } from "react-redux";
import { ShieldCheck, KeyRound, Eye, EyeOff, Check, X } from "lucide-react";
import { PageHeader } from "@/components/landing-dashboard/hero-management-dashboard-page/Pageheader";
import { Field, SectionCard } from "@/components/landing-dashboard/hero-management-dashboard-page/Formfield";
import { authService } from "@/services/auth.service";
import { toastify } from "@/store/slices/toastificationSlice";

// --- Validation Rules & Helpers ---
type Rule = { label: string; test: (value: string) => boolean };

const RULES: Rule[] = [
    { label: "8 أحرف على الأقل", test: (v) => v.length >= 8 },
    { label: "حرف كبير وحرف صغير", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
    { label: "رقم واحد على الأقل", test: (v) => /[0-9]/.test(v) },
];

function isPasswordValid(value: string) {
    return RULES.every((rule) => rule.test(value));
}

function PasswordRequirements({ value }: { value: string }) {
    return (
        <ul className="flex flex-col gap-1 mt-2">
            {RULES.map((rule) => {
                const met = value.length > 0 && rule.test(value);
                return (
                    <li
                        key={rule.label}
                        className={[
                            "flex items-center gap-1.5 text-label-caption",
                            met ? "text-success-green" : "text-on-surface-variant/70",
                        ].join(" ")}
                    >
                        {met ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        <span>{rule.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}

// --- Password Input Component ---
type PasswordFieldProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    autoComplete?: string;
};

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    function PasswordField({ value, onChange, placeholder, error, autoComplete }, ref) {
        const [visible, setVisible] = useState(false);

        return (
            <div>
                <div className="relative">
                    <input
                        ref={ref}
                        type={visible ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className={[
                            "input-field w-full py-3 ps-4 pe-11 text-body-main text-on-surface",
                            error ? "border border-error!" : "",
                        ].join(" ")}
                    />
                    <span className="absolute inset-y-0 inset-e-3 flex items-center gap-2 text-on-surface-variant">
                        <button
                            type="button"
                            onClick={() => setVisible((v) => !v)}
                            aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            className="hover:text-on-surface transition-colors"
                        >
                            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </span>
                </div>
                {error && <p className="text-label-caption text-error mt-1.5">{error}</p>}
            </div>
        );
    }
);

// --- Form State Types ---
type ChangePasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const EMPTY_FORM: ChangePasswordForm = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

// --- Main Page Component ---
export default function ChangePasswordPage() {
    const dispatch = useDispatch();
    const [form, setForm] = useState<ChangePasswordForm>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const setField = (key: keyof ChangePasswordForm, value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const newPasswordValid = isPasswordValid(form.newPassword);
    const passwordsMatch =
        form.confirmNewPassword.length === 0 || form.newPassword === form.confirmNewPassword;

    const sameAsCurrentError =
        form.newPassword.length > 0 &&
            form.currentPassword.length > 0 &&
            form.newPassword === form.currentPassword
            ? "يجب أن تختلف كلمة المرور الجديدة عن الحالية"
            : undefined;

    const mismatchError =
        form.confirmNewPassword.length > 0 && !passwordsMatch
            ? "كلمتا المرور غير متطابقتين"
            : undefined;

    const canSubmit =
        form.currentPassword.length > 0 &&
        newPasswordValid &&
        form.newPassword === form.confirmNewPassword &&
        !sameAsCurrentError;

    const handleSubmit = async () => {
        if (!canSubmit || submitting) return;

        setSubmitting(true);

        try {
            const response = await authService.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                confirmNewPassword: form.confirmNewPassword,
            });

            if (response.isSuccess) {
                dispatch(
                    toastify({
                        message: response.message || "تم تحديث كلمة المرور بنجاح.",
                        type: "success",
                    })
                );
                setForm(EMPTY_FORM);
            } else {
                dispatch(
                    toastify({
                        message: response.message || "حدث خطأ أثناء تغيير كلمة المرور.",
                        type: "error",
                    })
                );
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "حدث خطأ أثناء تغيير كلمة المرور.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader breadcrumb="الإعدادات" title="تغيير كلمة المرور" />

            <div className="flex-1 flex flex-col px-6 md:px-10 pb-10 justify-center items-center">
                <div className="max-w-xl w-full">
                    <SectionCard
                        icon={<ShieldCheck size={18} />}
                        title="أمان الحساب"
                        description="لحماية حسابك، اختر كلمة مرور قوية ولا تشاركها مع أي شخص."
                    >
                        <Field label="كلمة المرور الحالية">
                            <PasswordField
                                value={form.currentPassword}
                                onChange={(v) => setField("currentPassword", v)}
                                placeholder="أدخل كلمة المرور الحالية"
                                autoComplete="current-password"
                            />
                        </Field>

                        <Field label="كلمة المرور الجديدة">
                            <PasswordField
                                value={form.newPassword}
                                onChange={(v) => setField("newPassword", v)}
                                placeholder="أدخل كلمة مرور جديدة"
                                autoComplete="new-password"
                                error={sameAsCurrentError}
                            />
                            <PasswordRequirements value={form.newPassword} />
                        </Field>

                        <Field label="تأكيد كلمة المرور الجديدة">
                            <PasswordField
                                value={form.confirmNewPassword}
                                onChange={(v) => setField("confirmNewPassword", v)}
                                placeholder="أعد إدخال كلمة المرور الجديدة"
                                autoComplete="new-password"
                                error={mismatchError}
                            />
                        </Field>

                        <div className="flex items-center gap-3 pt-1">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canSubmit || submitting}
                                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-body-main font-semibold disabled:opacity-50"
                            >
                                <KeyRound size={16} />
                                <span>{submitting ? "جارِ التحديث..." : "تحديث كلمة المرور"}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(EMPTY_FORM)}
                                className="btn-outline px-5 py-2.5 text-body-main"
                            >
                                إلغاء
                            </button>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </>
    );
}