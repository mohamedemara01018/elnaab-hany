import { Check } from "lucide-react";

type PageHeaderProps = {
    breadcrumb: string;
    title: string;
    lastSavedLabel?: string;
};

export function PageHeader({ breadcrumb, title, lastSavedLabel }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between px-6 md:px-10 pt-8 pb-6">
            <div>
                <p className="text-label-overline mb-2">{breadcrumb}</p>
                <h1 className="text-headline-section text-on-surface" style={{ fontSize: 32 }}>
                    {title}
                </h1>
                <div className="w-16 h-[3px] bg-primary mt-3" />
            </div>

            {lastSavedLabel && (
                <div className="flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-body-small text-on-surface-variant">
                    <span>{lastSavedLabel}</span>
                    <span className="w-5 h-5 rounded-full bg-success-green/15 text-success-green flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                    </span>
                </div>
            )}
        </div>
    );
}