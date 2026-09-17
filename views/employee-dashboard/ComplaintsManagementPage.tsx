"use client";

import { useState, useEffect, useCallback, SetStateAction } from "react";
import { CheckCircle2, Hourglass, FileText, Bell, Search, Plus } from "lucide-react";

import { PageHeader } from "@/components/ui/Pageheader";
import { StatCard } from "@/components/employee-dashboard/complaints-management-page/Statcard";
import { ComplaintsTable } from "@/components/employee-dashboard/complaints-management-page/ComplaintsTable";
import { employeeService } from "@/services/employee.service";
import { complaintService } from "@/services/complaint.service";
import { ComplaintStatus } from "@/components/employee-dashboard/complaints-management-page/Statusbadge";
import { ComplaintDetailModal, ComplaintRow } from "@/modals/ComplaintDetailModal";
import { CreateComplaintModal } from "@/modals/CreateComplaintModal";
import { Pagination } from "@/components/ui/Pagination";

import {
    EmployeeRequestItem,
    EmployeeRequestsQueryParams,
    EmployeeRequestsResponse,
    EmployeeStatisticsResponse,
    CommentInfo,
} from "@/types/employee.types";

const PAGE_SIZE = 10;

const mapStatusToUI = (statusNum?: number): ComplaintStatus => {
    switch (statusNum) {
        case 1:
            return "new";
        case 2:
            return "in_progress";
        case 3:
        case 4:
        case 5:
            return "done";
        default:
            return "new";
    }
};

const mapRequestTypeLabel = (typeNum?: number): string => {
    switch (typeNum) {
        case 1:
            return "شكوى";
        case 2:
            return "اقتراح";
        default:
            return "طلب";
    }
};

export default function ComplaintsManagementPage() {
    const [rows, setRows] = useState<ComplaintRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRow | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [stats, setStats] = useState({
        done: 0,
        inProgress: 0,
        newCount: 0,
        total: 0,
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams: EmployeeRequestsQueryParams = {
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
            };

            if (statusFilter !== "all") queryParams.Status = Number(statusFilter);
            if (typeFilter !== "all") queryParams.Type = Number(typeFilter);

            const [requestsRes, statsRes]: [EmployeeRequestsResponse, EmployeeStatisticsResponse] =
                await Promise.all([
                    employeeService.getEmployeeRequests(queryParams),
                    employeeService.getEmployeeStatistics(),
                ]);

            if (requestsRes?.value?.items) {
                const mappedRows: ComplaintRow[] = requestsRes.value.items.map(
                    (item: EmployeeRequestItem) => {
                        const latestComment: CommentInfo | undefined = item.comments?.[0];

                        return {
                            id: item.id.toString(),
                            citizenName: item.citizen?.fullName || "غير محدد",
                            phone: item.citizen?.phone || "-",
                            nationalId: item.citizen?.nationalId || "-",
                            requestType: mapRequestTypeLabel(item.request?.type),
                            jurisdiction: item.request?.departmentName ?? item.request?.organizationName ?? "-",
                            departmentName: item.request?.departmentName ?? "-",
                            organizationName: item.request?.organizationName ?? "-",
                            date: item.request?.createdAt
                                ? new Date(item.request.createdAt).toLocaleDateString("ar-EG")
                                : "-",
                            employee:
                                latestComment?.employeeName && latestComment.employeeName !== "string"
                                    ? latestComment.employeeName
                                    : "-",
                            status: mapStatusToUI(item.request?.status),
                            rawStatus: item.request?.status,
                            priority: item.request?.priority,
                            title: item.request?.title,
                            description: item.request?.description,
                            mediaUrl: item.media?.mediaUrl ?? undefined,
                            comments: item.comments || [],
                        };
                    }
                );

                setRows(mappedRows);
            }

            if (statsRes?.value) {
                setStats({
                    done: statsRes.value.completed || 0,
                    inProgress: statsRes.value.inProgress || 0,
                    newCount: statsRes.value.new || 0,
                    total: statsRes.value.total || 0,
                });
            }
        } catch (error) {
            console.error("فشل في جلب بيانات الشكاوى والطلبات:", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, typeFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const handleTypeFilterChange = (val: string) => {
        setTypeFilter(val);
        setCurrentPage(1);
    };

    const handleUpdateStatus = async (
        id: number,
        newStatus: number,
        priority: number,
        comment?: string
    ) => {
        try {
            await complaintService.updateRequest({
                citizinRequiermentId: id,
                status: newStatus,
                priority: priority,
                comment: comment || "",
            });
            await fetchData();
        } catch (error) {
            console.error("فشل في تحديث حالة الشكوى:", error);
            throw error;
        }
    };

    const handleDeleteComplaint = async (id: string) => {
        try {
            await complaintService.deleteComplaint(Number(id));
            await fetchData();
        } catch (error) {
            console.error("فشل في حذف الشكوى:", error);
            throw error;
        }
    };

    const handleCreateSuccess = async () => {
        setIsCreateModalOpen(false);
        await fetchData();
    };

    const filteredRows = rows.filter((row) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            row.citizenName.toLowerCase().includes(q) ||
            row.phone.includes(q) ||
            row.nationalId.includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(stats.total / PAGE_SIZE));

    return (
        <>
            <PageHeader breadcrumb="إدارة الموقع" title="الشكاوى والطلبات" />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="تم الإنجاز"
                        value={stats.done}
                        tone="success"
                        icon={<CheckCircle2 size={18} />}
                    />
                    <StatCard
                        label="قيد المتابعة"
                        value={stats.inProgress}
                        tone="warning"
                        icon={<Hourglass size={18} />}
                    />
                    <StatCard
                        label="شكاوى جديدة"
                        value={stats.newCount}
                        tone="info"
                        icon={<Bell size={18} />}
                    />
                    <StatCard
                        label="إجمالي الشكاوى"
                        value={stats.total}
                        tone="neutral"
                        icon={<FileText size={18} />}
                    />
                </div>

                {stats.newCount > 0 && (
                    <div className="flex items-center justify-between gap-4 rounded-card border border-primary/30 bg-primary-container/15 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-primary-container/60 text-on-primary-container flex items-center justify-center shrink-0">
                                <Bell size={17} />
                            </span>
                            <div>
                                <p className="text-body-main font-semibold text-on-surface">متابعة الشكاوى الجديدة</p>
                                <p className="text-body-small text-on-surface-variant">
                                    يوجد {stats.newCount} شكاوى جديدة تحتاج إلى توزيع ومراجعة.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange("1")}
                            className="btn-primary px-4 py-2 text-body-small font-semibold whitespace-nowrap"
                        >
                            عرض الجديدة
                        </button>
                    </div>
                )}

                <section className="card space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                        <div>
                            <h2 className="text-title-card text-on-surface" style={{ fontSize: 20 }}>
                                إدارة ومتابعة شكاوى المواطنين
                            </h2>
                            <p className="text-body-small text-on-surface-variant mt-1">
                                جميع الشكاوى والطلبات المقدَّمة من المواطنين عبر نموذج الموقع.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="btn-primary flex items-center gap-2 px-4 py-2.5 text-body-small font-bold shrink-0 cursor-pointer"
                        >
                            <Plus size={18} />
                            إضافة شكوى جديدة
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <select
                            value={typeFilter}
                            onChange={(e) => handleTypeFilterChange(e.target.value)}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant appearance-none cursor-pointer"
                        >
                            <option value="all">كل الأنواع</option>
                            <option value="1">شكوى</option>
                            <option value="2">اقتراح</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant appearance-none cursor-pointer"
                        >
                            <option value="all">كل الحالات</option>
                            <option value="1">جديدة</option>
                            <option value="2">قيد المتابعة</option>
                            <option value="3">تم الإنجاز</option>
                            <option value="4">مرفوضة</option>
                            <option value="5">مغلقة</option>
                        </select>

                        <div className="relative col-span-2 md:col-span-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="ابحث باسم المواطن أو الهاتف أو الرقم القومي..."
                                className="input-field w-full py-2.5 ps-3 pe-9 text-body-small text-on-surface"
                            />
                            <span className="absolute inset-y-0 inset-e-3 flex items-center text-on-surface-variant">
                                <Search size={15} />
                            </span>
                        </div>
                    </div>

                    <ComplaintsTable
                        rows={filteredRows}
                        loading={loading}
                        onView={(row) => setSelectedComplaint(row)}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: SetStateAction<number>) => setCurrentPage(page)}
                        pageSize={PAGE_SIZE}
                        totalItems={stats.total}
                    />
                </section>
            </div>

            <ComplaintDetailModal
                complaint={selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteComplaint}
            />

            <CreateComplaintModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </>
    );
}