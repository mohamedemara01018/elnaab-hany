'use client';

import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import React, { useState } from 'react';
import { motion } from "motion/react";
import { authService } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const code = searchParams.get("code") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const notify = (message: string, type: IToastificationType, duration: number = DURATION) => {
        dispatch(toastify({ message, type, duration }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !code) {
            notify("بيانات الطلب غير مكتملة، يرجى إعادة محاولة العملية.", "error");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            notify("كلمتا المرور غير متطابقتين.", "warning");
            return;
        }

        setSubmitting(true);

        try {
            const response = await authService.resetPassword({
                email,
                code,
                newPassword,
                confirmNewPassword,
            });

            if (response.isSuccess) {
                notify(response.message || "تم تغيير كلمة المرور بنجاح.", "success");
                router.push("/login");
            } else {
                notify(response.message || "فشل تغيير كلمة المرور.", "error");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify(err.message, "error");
            } else {
                notify("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.", "error");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* كلمة المرور الجديدة */}
            <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                كلمة المرور الجديدة
                <div className="relative">
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="newPassword"
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field px-3.5 py-3 pe-11 ps-11 text-sm font-body text-on-surface w-full"
                    />
                    <span className="absolute inset-y-0 inset-e-3.5 flex items-center text-outline pointer-events-none">
                        <Lock className="w-4 h-4" />
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible((v) => !v)}
                        aria-label={isPasswordVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        className="absolute inset-y-0 inset-s-3.5 flex items-center text-outline bg-transparent border-none cursor-pointer"
                    >
                        {isPasswordVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>
            </label>

            {/* تأكيد كلمة المرور الجديدة */}
            <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                تأكيد كلمة المرور الجديدة
                <div className="relative">
                    <input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        name="confirmNewPassword"
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="input-field px-3.5 py-3 pe-11 ps-11 text-sm font-body text-on-surface w-full"
                    />
                    <span className="absolute inset-y-0 inset-e-3.5 flex items-center text-outline pointer-events-none">
                        <Lock className="w-4 h-4" />
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsConfirmPasswordVisible((v) => !v)}
                        aria-label={isConfirmPasswordVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        className="absolute inset-y-0 inset-s-3.5 flex items-center text-outline bg-transparent border-none cursor-pointer"
                    >
                        {isConfirmPasswordVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>
            </label>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex items-center justify-center gap-2 py-4 font-display font-extrabold text-sm mt-2 disabled:opacity-70"
            >
                {submitting ? (
                    "جارٍ الحفظ..."
                ) : (
                    <>
                        <ArrowLeft className="w-4 h-4" />
                        <span>حفظ كلمة المرور</span>
                    </>
                )}
            </motion.button>
        </form>
    );
}

export default ResetPasswordForm;