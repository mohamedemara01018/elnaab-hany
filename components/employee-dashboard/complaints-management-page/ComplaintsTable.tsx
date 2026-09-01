import { Eye } from "lucide-react";
import { ComplaintStatus, StatusBadge } from "./Statusbadge";

export type ComplaintRow = {
    id: string;
    citizenName: string;
    phone: string;
    nationalId: string;
    requestType: string;
    jurisdiction: string;
    date: string;
    employee: string;
    status: ComplaintStatus;
};

const COLUMNS = [
    "المواطن",
    "الهاتف",
    "الرقم القومي",
    "نوع الطلب",
    "الجهة",
    "التاريخ",
    "الموظف",
    "الحالة",
    "الإجراء",
];

type ComplaintsTableProps = {
    rows: ComplaintRow[];
    onView?: (row: ComplaintRow) => void;
};

export function ComplaintsTable({ rows, onView }: ComplaintsTableProps) {
    return (
        <div className="rounded-card border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-start">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                            {COLUMNS.map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-3 text-body-small font-semibold text-on-surface-variant whitespace-nowrap text-start"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMNS.length} className="py-14 text-center text-body-main text-on-surface-variant">
                                    لا توجد شكاوى
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/60">
                                    <td className="px-4 py-3 text-body-small text-on-surface font-semibold whitespace-nowrap">
                                        {row.citizenName}
                                    </td>
                                    <td className="px-4 py-3 text-body-small text-on-surface-variant whitespace-nowrap" dir="ltr">
                                        {row.phone}
                                    </td>
                                    <td className="px-4 py-3 text-body-small text-on-surface-variant whitespace-nowrap" dir="ltr">
                                        {row.nationalId}
                                    </td>
                                    <td className="px-4 py-3 text-body-small text-on-surface-variant whitespace-nowrap">
                                        {row.requestType}
                                    </td>
                                    <td className="px-4 py-3 text-body-small text-on-surface-variant whitespace-nowrap">
                                        {row.jurisdiction}
                                    </td>
                                    <td className="px-4 py-3 text-body-small text-on-surface-variant whitespace-nowrap">
                                        {row.date}
                                    </td>
                                    <td className="px-4 py-3 text-body-small text-on-surface-variant whitespace-nowrap">
                                        {row.employee}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => onView?.(row)}
                                            aria-label="عرض التفاصيل"
                                            className="text-on-surface-variant hover:bg-surface-container-high rounded-interactive p-2 transition-colors"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}