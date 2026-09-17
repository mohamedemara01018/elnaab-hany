"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export type OrgOption = { id: number; label: string };

type OrganizationChipsProps = {
    selected: OrgOption[];
    options: OrgOption[];
    onChange: (next: OrgOption[]) => void;
};

export function OrganizationChips({ selected, options, onChange }: OrganizationChipsProps) {
    const [adding, setAdding] = useState(false);

    const available = options.filter((o) => !selected.some((s) => s.id === o.id));

    const remove = (id: number) => onChange(selected.filter((s) => s.id !== id));
    const add = (option: OrgOption) => {
        onChange([...selected, option]);
        setAdding(false);
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                {selected.map((org) => (
                    <span
                        key={org.id}
                        className="inline-flex items-center gap-2 rounded-full bg-secondary-container text-on-secondary-container ps-3 pe-2 py-1.5 text-body-small font-semibold"
                    >
                        <span>{org.label}</span>
                        <span className="text-label-caption font-normal opacity-70">#{org.id}</span>
                        <button
                            type="button"
                            onClick={() => remove(org.id)}
                            aria-label={`إزالة ${org.label}`}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                <button
                    type="button"
                    onClick={() => setAdding((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-outline px-3 py-1.5 text-body-small text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                >
                    <Plus size={13} />
                    <span>إضافة</span>
                </button>
            </div>

            {adding && (
                <div className="mt-3">
                    {available.length === 0 ? (
                        <p className="text-body-small text-on-surface-variant">
                            لا توجد جهات إضافية متاحة للربط.
                        </p>
                    ) : (
                        <select
                            autoFocus
                            defaultValue=""
                            onChange={(e) => {
                                const opt = available.find((o) => o.id === Number(e.target.value));
                                if (opt) add(opt);
                            }}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant"
                        >
                            <option value="" disabled>
                                اختر جهة إضافية لربطها بملف الموظف...
                            </option>
                            {available.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.label} #{o.id}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </div>
    );
}