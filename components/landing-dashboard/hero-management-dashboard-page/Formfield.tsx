import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type FieldProps = {
    label: string;
    hint?: string;
    children: ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <label className="text-body-small font-semibold text-on-surface-variant">{label}</label>
                {hint && <span className="text-label-caption text-on-surface-variant/70">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    defaultValue?: string;
    placeholder?: string;
    icon?: ReactNode;
    type?: string;
};

export function InputWithIcon({ defaultValue, placeholder, icon, type = "text", ...probs }: InputProps) {
    return (
        <div className="relative">
            <input
                {...probs}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="input-field w-full py-3 ps-4 pe-11 text-body-main text-on-surface"
            />
            {icon && (
                <span className="absolute inset-y-0 end-3 flex items-center text-on-surface-variant">
                    {icon}
                </span>
            )}
        </div>
    );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    defaultValue?: string;
    rows?: number;
    charCount?: string;
};

export function TextareaField({ defaultValue, rows = 3, charCount, ...probs }: TextareaProps) {
    return (
        <div>
            <textarea
                {...probs}
                defaultValue={defaultValue}
                rows={rows}
                className="input-field w-full py-3 px-4 text-body-main text-on-surface resize-none"
            />
            {charCount && (
                <p className="text-label-caption text-on-surface-variant/70 mt-1">{charCount}</p>
            )}
        </div>
    );
}

type SectionCardProps = {
    icon: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
};

export function SectionCard({ icon, title, description, children }: SectionCardProps) {
    return (
        <section className="card">
            <div className="flex items-center gap-2 mb-1 text-primary">
                {icon}
                <h2 className="text-title-card text-on-surface">{title}</h2>
            </div>
            {description && (
                <p className="text-body-small text-on-surface-variant mb-5">{description}</p>
            )}
            <div className="flex flex-col gap-5 mt-5">{children}</div>
        </section>
    );
}