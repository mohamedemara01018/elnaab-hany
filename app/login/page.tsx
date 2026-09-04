import LoginForm from "@/components/login/LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
    return (
        <div className="flex items-center justify-center bg-background px-4 py-24">
            <div
                className="w-full max-w-md service-container bg-surface-container-lowest p-8 sm:p-10 relative"
                style={{ boxShadow: "var(--shadow-level-2)" }}
            >
                {/* زر العودة للخلف */}
                <Link
                    href="/"
                    aria-label="العودة"
                    className="absolute top-6 inset-s-6 p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors inline-flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                </Link>

                {/* الشعار والعنوان */}
                <div className="text-center mb-8">
                    <span className="text-label-overline block mt-5">البوابة الإدارية</span>
                    <h1 className="font-display text-2xl font-bold mt-1.5 text-on-surface">تسجيل الدخول</h1>
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
                </div>

                {/* النموذج */}
                <LoginForm />

                <p className="text-body-small text-center text-on-surface-variant mt-7">
                    هذا النظام مخصص للمصرح لهم فقط. يتم تسجيل جميع الأنشطة.
                </p>
            </div>
        </div>
    );
}