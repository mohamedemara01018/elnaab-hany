"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("كلمات المرور غير متطابقة.");
            return;
        }

        if (password.length < 8) {
            setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
            return;
        }

        setSubmitting(true);
        // ضع هنا استدعاء الـ API الفعلي لتحديث كلمة المرور
        window.setTimeout(() => {
            setSubmitting(false);
            setResetComplete(true);
        }, 900);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md service-container bg-surface-container-lowest p-8 sm:p-10"
                style={{ boxShadow: "var(--shadow-level-2)" }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {!resetComplete ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {/* العنوان والوصف */}
                            <div className="text-center mb-8">
                                <span className="text-label-overline block mt-5">البوابة الإدارية</span>
                                <h1 className="font-display text-2xl font-bold mt-1.5 text-on-surface">
                                    إعادة تعيين كلمة المرور
                                </h1>
                                <i
                                    className="block mt-3"
                                    style={{
                                        width: 48,
                                        height: 2,
                                        background: "var(--color-primary)",
                                        marginInline: "auto",
                                        borderRadius: "var(--radius-full)",
                                    }}
                                />
                                <p className="text-body-small text-on-surface-variant mt-4">
                                    أنشئ كلمة مرور جديدة وقوية لحسابك.
                                </p>
                            </div>

                            {/* رسالة الخطأ إن وجدت */}
                            {error && (
                                <div className="mb-5 p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-display font-medium text-center">
                                    {error}
                                </div>
                            )}

                            {/* النموذج */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* كلمة المرور الجديدة */}
                                <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                                    كلمة المرور الجديدة
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            autoComplete="new-password"
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
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                            className="absolute inset-y-0 inset-s-3.5 flex items-center text-outline bg-transparent border-none cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <Eye className="w-4 h-4" />
                                            ) : (
                                                <EyeOff className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </label>

                                {/* تأكيد كلمة المرور */}
                                <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                                    تأكيد كلمة المرور الجديدة
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input-field px-3.5 py-3 pe-11 ps-11 text-sm font-body text-on-surface w-full"
                                        />
                                        <span className="absolute inset-y-0 inset-e-3.5 flex items-center text-outline pointer-events-none">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                            className="absolute inset-y-0 inset-s-3.5 flex items-center text-outline bg-transparent border-none cursor-pointer"
                                        >
                                            {showConfirmPassword ? (
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
                                    {submitting ? "جارٍ التحديث..." : "حفظ كلمة المرور الجديدة"}
                                </motion.button>

                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-1.5 text-sm font-display font-bold text-primary mt-1"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    <span>العودة إلى تسجيل الدخول</span>
                                </Link>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                                style={{
                                    background: "var(--color-primary-container)",
                                    color: "var(--color-on-primary-container)",
                                }}
                            >
                                <CheckCircle className="w-8 h-8" />
                            </motion.div>

                            <h1 className="font-display text-xl font-bold mt-5 text-on-surface">
                                تم تغيير كلمة المرور بنجاح
                            </h1>
                            <p className="text-body-small text-on-surface-variant mt-3">
                                يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول إلى حسابك.
                            </p>

                            <div className="mt-7">
                                <Link
                                    href="/login"
                                    className="btn-primary block w-full py-4 text-center font-display font-extrabold text-sm"
                                >
                                    تسجيل الدخول الآن
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}