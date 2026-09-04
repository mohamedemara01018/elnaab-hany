'use client';

import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import React, { useState } from 'react';
import { motion } from "motion/react";
import { authService } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { useRouter } from "next/navigation";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const notify = (message: string, type: IToastificationType, duration: number = DURATION) => {
        dispatch(toastify({ message, type, duration }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await authService.login({ email, password });

            if (response.isSuccess) {
                localStorage.setItem("accessToken", response.value.accessToken);
                notify(response.message || "تم تسجيل الدخول بنجاح", "success");

                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.href = "/";
            } else {
                notify(response.message || "فشل تسجيل الدخول، يرجى التأكد من البيانات.", "error");
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
            <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                البريد الإلكتروني
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        required
                        autoComplete="username"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field px-3.5 py-3 pe-11 text-sm font-body text-on-surface w-full"
                    />
                    <span className="absolute inset-y-0 inset-e-3.5 flex items-center text-outline pointer-events-none">
                        <Mail className="w-4 h-4" />
                    </span>
                </div>
            </label>

            <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                <div className="flex items-center justify-between">
                    <span>كلمة المرور</span>
                    <button
                        type="button"
                        onClick={() => router.push("/forgot-password")}
                        className="font-normal text-xs text-primary bg-transparent border-none p-0 cursor-pointer hover:underline"
                    >
                        نسيت كلمة المرور؟
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        {isPasswordVisible ? (
                            <Eye className="w-4 h-4" />
                        ) : (
                            <EyeOff className="w-4 h-4" />
                        )}
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
                    "جارٍ الدخول..."
                ) : (
                    <>
                        <ArrowLeft className="w-4 h-4" />
                        <span>تسجيل الدخول</span>
                    </>
                )}
            </motion.button>
        </form>
    );
}

export default LoginForm;