"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CitizenRequestForm } from "@/components/landing-page/citizen-request-form";
import { departmentService } from "@/services/department.service";
import { organizationService } from "@/services/organization.service";
import { Department } from "@/types/department.types";
import { Organization } from "@/types/organization.types";

interface CreateComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function CreateComplaintModal({
    isOpen,
    onClose,
}: CreateComplaintModalProps) {
    const [formTab, setFormTab] = useState<"complaint" | "proposal">("complaint");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [deptData, orgData] = await Promise.all([
                    departmentService.getDepartments(),
                    organizationService.getOrganizations(),
                ]);
                setDepartments(deptData || []);
                setOrganizations(orgData || []);
            } catch (error) {
                console.error("Failed to load departments or organizations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-surface-container-lowest rounded-none border border-outline-variant shadow-xl overflow-hidden my-8"
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
                        <h2 className="text-title-medium font-bold text-on-surface">
                            إضافة شكوى / طلب جديد
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-none hover:bg-surface-container-high transition-colors text-on-surface-variant"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <div
                            role="tablist"
                            aria-label="اختيار نوع الخدمة"
                            className="flex gap-2.5 bg-surface-container p-1.5 rounded-none mb-6 border border-outline-variant"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={formTab === "complaint"}
                                onClick={() => setFormTab("complaint")}
                                className={`relative flex-1 border-none py-2.5 rounded-none cursor-pointer font-display font-bold text-sm transition-colors ${formTab === "complaint"
                                        ? "text-gold-highlight bg-surface-container-highest"
                                        : "bg-transparent text-on-surface-variant hover:bg-surface-container-high"
                                    }`}
                            >
                                تقديم شكوى أو طلب
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={formTab === "proposal"}
                                onClick={() => setFormTab("proposal")}
                                className={`relative flex-1 border-none py-2.5 rounded-none cursor-pointer font-display font-bold text-sm transition-colors ${formTab === "proposal"
                                        ? "text-gold-highlight bg-surface-container-highest"
                                        : "bg-transparent text-on-surface-variant hover:bg-surface-container-high"
                                    }`}
                            >
                                تقديم مقترح
                            </button>
                        </div>

                        <CitizenRequestForm
                            variant={formTab}
                            departments={departments}
                            organizations={organizations}
                            loading={loading}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}