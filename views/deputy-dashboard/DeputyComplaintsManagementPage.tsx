/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, SetStateAction } from "react";
import { CheckCircle2, Hourglass, FileText, Bell, Search, Plus, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/ui/Pageheader";
import { StatCard } from "@/components/employee-dashboard/complaints-management-page/Statcard";
import { deputyService } from "@/services/deputy.service";
import { complaintService } from "@/services/complaint.service";
import { DeputyComplaintDetailModal } from "@/modals/DeputyComplaintDetailModal";
import { CreateComplaintModal } from "@/modals/CreateComplaintModal";
import { Pagination } from "@/components/ui/Pagination";
import {
    DeputyFiltersModal,
    DeputyAdvancedFilters,
    EMPTY_ADVANCED_FILTERS,
} from "@/components/deputy-dashboard/deputy-complaints-management-page/DeputyFiltersModal";

import {
    ComplaintRow,
    DeputyRequestItem,
    DeputyRequestsQueryParams,
    DeputyRequestsResponse,
    DeputyStatisticsResponse,
    RequestType,
    RequestStatus,
} from "@/types/deputy.types";
import { DeputyComplaintsTable } from "@/components/deputy-dashboard/deputy-complaints-management-page/DeputyComplaintsTable";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const mapStatusToUI = (statusNum?: number) => {
    switch (statusNum) {
        case RequestStatus.New:
            return "new" as const;
        case RequestStatus.InProgress:
            return "in_progress" as const;
        case RequestStatus.Resolved:
        case RequestStatus.Rejected:
        case RequestStatus.Closed:
            return "done" as const;
        default:
            return "new" as const;
    }
};

const mapRequestTypeLabel = (typeNum?: number): string => {
    switch (typeNum) {
        case RequestType.Complaint:
            return "شكوى";
        case RequestType.Suggestion:
            return "اقتراح";
        default:
            return "طلب";
    }
};

export default function DeputyComplaintsManagementPage() {
    const [rows, setRows] = useState<ComplaintRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRow | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

    // Quick filters, always visible
    const [searchInput, setSearchInput] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    // Advanced filters, tucked behind the filters modal: Priority, DepartmentId, OrganizationId
    const [advancedFilters, setAdvancedFilters] = useState<DeputyAdvancedFilters>(
        EMPTY_ADVANCED_FILTERS
    );

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [stats, setStats] = useState({
        done: 0,
        inProgress: 0,
        newCount: 0,
        total: 0,
    });

    // Debounce the search box so we're not hitting the API on every keystroke
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams: DeputyRequestsQueryParams = {
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
            };

            if (typeFilter !== "all") queryParams.Type = Number(typeFilter);
            if (statusFilter !== "all") queryParams.Status = Number(statusFilter);
            if (advancedFilters.priority !== "all") queryParams.Priority = Number(advancedFilters.priority);
            if (advancedFilters.departmentId !== "all")
                queryParams.DepartmentId = Number(advancedFilters.departmentId);
            if (advancedFilters.organizationId !== "all")
                queryParams.OrganizationId = Number(advancedFilters.organizationId);
            if (debouncedSearch.trim()) queryParams.Search = debouncedSearch.trim();

            const [requestsRes, statsRes]: [DeputyRequestsResponse, DeputyStatisticsResponse] =
                await Promise.all([
                    deputyService.getDeputyRequests(queryParams),
                    deputyService.getDeputyStatistics(),
                ]);

            if (requestsRes?.value?.items) {
                const mappedRows: ComplaintRow[] = requestsRes.value.items.map(
                    (item: DeputyRequestItem) => {
                        const employees = item.assignedEmployees ?? [];
                        const firstEmp = employees[0];

                        return {
                            id: item.id.toString(),
                            citizenName: item.citizen?.fullName || "غير محدد",
                            phone: item.citizen?.phone || "-",
                            nationalId: item.citizen?.nationalId || "-",
                            requestType: mapRequestTypeLabel(item.request?.type),
                            jurisdiction: firstEmp?.departmentName ?? firstEmp?.organizationName ?? "-",
                            departmentName: firstEmp?.departmentName ?? "-",
                            organizationName: firstEmp?.organizationName ?? "-",
                            date: item.request?.createdAt
                                ? new Date(item.request.createdAt).toLocaleDateString("ar-EG")
                                : "-",
                            // Kept for any code still reading a single name; prefer `employees` going forward.
                            employee: firstEmp?.fullName || "-",
                            employees,
                            status: mapStatusToUI(item.request?.status),
                            rawStatus: item.request?.status,
                            priority: item.request?.priority,
                            title: item.request?.title,
                            description: item.request?.description,
                            mediaUrl: item.media?.mediaUrl ?? undefined,
                            comments: (item.request?.comments as any[]) || [],
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
            console.error("فشل في جلب بيانات الشكاوى والطلبات للنائب:", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, typeFilter, advancedFilters, debouncedSearch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleStatusFilterChange = (val: string) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const handleTypeFilterChange = (val: string) => {
        setTypeFilter(val);
        setCurrentPage(1);
    };

    const handleApplyAdvancedFilters = (filters: DeputyAdvancedFilters) => {
        setAdvancedFilters(filters);
        setCurrentPage(1);
    };

    const activeAdvancedCount = Object.values(advancedFilters).filter((v) => v !== "all").length;

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

    // Search, type and status are now applied server-side via queryParams,
    // so `rows` from the API already reflects the current filters.
    const totalPages = Math.max(1, Math.ceil(stats.total / PAGE_SIZE));

    return (
        <>
            <PageHeader breadcrumb="لوحة النائب" title="إدارة الشكاوى والطلبات" />

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
                                    يوجد {stats.newCount} شكاوى جديدة تحتاج إلى متابعة ومراجعة.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleStatusFilterChange(String(RequestStatus.New))}
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
                                جميع الشكاوى والطلبات المقدَّمة من المواطنين الموجهة إلى مكتب النائب.
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

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <select
                            value={typeFilter}
                            onChange={(e) => handleTypeFilterChange(e.target.value)}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant appearance-none cursor-pointer"
                        >
                            <option value="all">كل الأنواع</option>
                            <option value={RequestType.Complaint}>شكوى</option>
                            <option value={RequestType.Suggestion}>اقتراح</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant appearance-none cursor-pointer"
                        >
                            <option value="all">كل الحالات</option>
                            <option value={RequestStatus.New}>جديدة</option>
                            <option value={RequestStatus.InProgress}>قيد المتابعة</option>
                            <option value={RequestStatus.Resolved}>تم الإنجاز</option>
                            <option value={RequestStatus.Rejected}>مرفوضة</option>
                            <option value={RequestStatus.Closed}>مغلقة</option>
                        </select>

                        <div className="relative col-span-2 md:col-span-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="ابحث باسم المواطن أو الهاتف أو الرقم القومي..."
                                className="input-field w-full py-2.5 ps-3 pe-9 text-body-small text-on-surface"
                            />
                            <span className="absolute inset-y-0 inset-e-3 flex items-center text-on-surface-variant">
                                <Search size={15} />
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsFiltersModalOpen(true)}
                            className="btn-outline flex items-center justify-center gap-2 py-2.5 px-3 text-body-small font-semibold relative"
                        >
                            <SlidersHorizontal size={15} />
                            <span>فلاتر متقدمة</span>
                            {activeAdvancedCount > 0 && (
                                <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                                    {activeAdvancedCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <DeputyComplaintsTable
                        rows={rows}
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

            <DeputyComplaintDetailModal
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

            <DeputyFiltersModal
                open={isFiltersModalOpen}
                initialFilters={advancedFilters}
                onClose={() => setIsFiltersModalOpen(false)}
                onApply={handleApplyAdvancedFilters}
            />
        </>
    );
}