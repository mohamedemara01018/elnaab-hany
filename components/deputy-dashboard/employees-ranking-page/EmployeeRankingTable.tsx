import { Inbox } from "lucide-react";
import type { EmployeeRankingItem } from "@/types/deputy.types";
import { UserImage } from "@/components/ui/UserImage";
import { ContributionBar } from "./ContributionBar";
import { RankBadge } from "./RankBadge";

type EmployeeRankingTableProps = {
    employees: EmployeeRankingItem[];
    loading?: boolean;
};

export function EmployeeRankingTable({ employees, loading }: EmployeeRankingTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-14 text-on-surface-variant text-body-main">
                جاري تحميل الترتيب...
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-14 text-on-surface-variant">
                <Inbox size={40} className="mb-2 opacity-50" />
                <p className="text-body-main font-semibold">لا يوجد موظفون لعرض ترتيبهم بعد</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-card border border-outline-variant">
            <table className="w-full text-start text-body-small">
                <thead className="bg-surface-container-low text-on-surface-variant font-semibold">
                    <tr>
                        <th className="px-5 py-4 text-start whitespace-nowrap">الموظف</th>
                        <th className="px-5 py-4 text-start whitespace-nowrap">مجال المسؤولية والاختصاص</th>
                        <th className="px-5 py-4 text-start whitespace-nowrap">إجمالي الحالات المسجلة</th>
                        <th className="px-5 py-4 text-start whitespace-nowrap">نسبة المساهمة بالمكتب</th>
                        <th className="px-5 py-4 text-start whitespace-nowrap">المركز التنافسي</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                    {employees.map((emp) => (
                        <tr key={emp.employeeId} className="hover:bg-surface-container-low/60 transition-colors">
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <UserImage
                                        fullName={emp.employeeName}
                                        avatarUrl={emp.imageUrl}
                                        className="w-9 h-9"
                                    />
                                    <span className="font-bold text-on-surface whitespace-nowrap">
                                        أ/ {emp.employeeName}
                                    </span>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-on-surface-variant whitespace-nowrap">
                                {emp.department || "-"}
                            </td>
                            <td className="px-5 py-4 font-semibold text-on-surface whitespace-nowrap">
                                {emp.requestsCount} معاملة
                            </td>
                            <td className="px-5 py-4 min-w-40">
                                <ContributionBar percentage={emp.contributionPercentage} />
                            </td>
                            <td className="px-5 py-4">
                                <RankBadge rank={emp.rank} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}