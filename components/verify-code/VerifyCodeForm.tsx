'use client';

import { ArrowLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from "motion/react";
import { authService } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyCodeForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();

    const notify = (message: string, type: IToastificationType, duration: number = DURATION) => {
        dispatch(toastify({ message, type, duration }));
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setCode(digits);
            inputRefs.current[5]?.focus();
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const fullCode = code.join("");

        if (!email.trim()) {
            notify("البريد الإلكتروني مفقود، يرجى العودة وإعادة طلب كود التحقق.", "error");
            return;
        }

        if (fullCode.length < 6) {
            notify("يرجى إدخال كود التحقق المكون من 6 أرقام كاملاً.", "warning");
            return;
        }

        setSubmitting(true);

        try {
            const response = await authService.verifyResetCode({
                email,
                code: fullCode,
            });

            if (response.isSuccess) {
                notify(response.message || "تم التحقق من الكود بنجاح.", "success");
                router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(fullCode)}`);
            } else {
                notify(response.message || "كود التحقق غير صحيح.", "error");
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

    async function handleResendCode() {
        if (!email.trim()) {
            notify("البريد الإلكتروني مفقود، تعذر إعادة إرسال الكود.", "error");
            return;
        }

        setResending(true);
        try {
            const response = await authService.forgotPassword({ email });
            if (response.isSuccess) {
                notify(response.message || "تم إعادة إرسال كود التحقق بنجاح.", "success");
            } else {
                notify(response.message || "تعذر إعادة إرسال الكود.", "error");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify(err.message, "error");
            } else {
                notify("حدث خطأ أثناء إعادة إرسال الكود.", "error");
            }
        } finally {
            setResending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
                <div className="flex items-center justify-between">
                    <span>كود التحقق</span>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resending}
                        className="font-normal text-xs text-primary bg-transparent border-none p-0 cursor-pointer hover:underline disabled:opacity-50"
                    >
                        {resending ? "جارٍ الإرسال..." : "إعادة إرسال الكود؟"}
                    </button>
                </div>

                <div className="flex justify-between gap-2 mt-1" dir="ltr" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="input-field w-11 h-12 px-0! text-center text-lg font-bold font-body text-on-surface"
                        />
                    ))}
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex items-center justify-center gap-2 py-4 font-display font-extrabold text-sm mt-2 disabled:opacity-70"
            >
                {submitting ? (
                    "جارٍ التحقق..."
                ) : (
                    <>
                        <ArrowLeft className="w-4 h-4" />
                        <span>تأكيد الكود</span>
                    </>
                )}
            </motion.button>
        </form>
    );
}

export default VerifyCodeForm;