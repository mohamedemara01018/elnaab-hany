"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const notify = (message: string, type: IToastificationType, duration: number = DURATION) => {
        dispatch(toastify({ message, type, duration }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await authService.forgotPassword({ email });

            if (response.isSuccess) {
                notify(response.message || "تم إرسال كود التحقق إلى بريدك الإلكتروني بنجاح", "success");
                setSent(true);
            } else {
                notify(response.message || "حدث خطأ، يرجى التأكد من البيانات.", "error");
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
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md service-container bg-surface-container-lowest p-8 sm:p-10"
                style={{ boxShadow: "var(--shadow-level-2)" }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {!sent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {/* الشعار والعنوان */}
                            <div className="text-center mb-8">
                                <span className="text-label-overline block mt-5">البوابة الإدارية</span>
                                <h1 className="font-display text-2xl font-bold mt-1.5 text-on-surface">
                                    نسيت كلمة المرور؟
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
                                    أدخل بريدك الإلكتروني المسجل، وسنرسل لك كود التحقق لإعادة تعيين كلمة المرور.
                                </p>
                            </div>

                            {/* النموذج */}
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
                                        <span className="absolute inset-y-0 end-3.5 flex items-center text-outline pointer-events-none">
                                            <Mail className="w-4 h-4" />
                                        </span>
                                    </div>
                                </label>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary inline-flex items-center justify-center gap-2 py-4 font-display font-extrabold text-sm mt-2 disabled:opacity-70"
                                >
                                    {submitting ? "جارٍ الإرسال..." : (
                                        <>
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>إرسال كود التحقق</span>
                                        </>
                                    )}
                                </motion.button>

                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-1.5 text-sm font-display font-bold text-primary mt-1 hover:underline"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    العودة إلى تسجيل الدخول
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
                                تم إرسال كود التحقق بنجاح
                            </h1>
                            <p className="text-body-small text-on-surface-variant mt-3">
                                تحقق من صندوق الوارد في بريدك الإلكتروني
                                <span className="font-bold text-on-surface"> {email || "المسجل"} </span>
                                للحصول على كود التحقق لإعادة تعيين كلمة المرور.
                            </p>

                            <div className="flex flex-col gap-3 mt-7">
                                {/* زر الانقال المباشر مع البريد كـ Query Param */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => router.push(`/verify-code?email=${encodeURIComponent(email)}`)}
                                    className="btn-primary py-3.5 font-display font-bold text-sm inline-flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>إدخال كود التحقق</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setSent(false)}
                                    className="btn-outline py-3.5 font-display font-bold text-sm"
                                >
                                    تغيير البريد الإلكتروني
                                </motion.button>

                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-1.5 text-sm font-display font-bold text-primary hover:underline mt-1"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    العودة إلى تسجيل الدخول
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}