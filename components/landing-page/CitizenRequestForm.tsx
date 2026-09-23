"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Lightbulb, ArrowLeft } from "lucide-react";
import { UploadField } from "@/components/ui/upload-field";
import { Department } from "@/types/department.types";
import { Organization } from "@/types/organization.types";
import { complaintService } from "@/services/complaint.service";
import { toastify } from "@/store/slices/toastificationSlice";

interface CitizenRequestFormProps {
  variant: "complaint" | "proposal";
  departments?: Department[];
  organizations?: Organization[];
  loading?: boolean;
}

const COPY = {
  complaint: {
    icon: AlertTriangle,
    eyebrow: "خدمة المواطن",
    title: "تقديم شكوى أو طلب",
    typeLabel: "نوع الشكوى أو الطلب",
    detailsLabel: "تفاصيل الشكوى أو الطلب",
    detailsPlaceholder: "اكتب تفاصيل الشكوى أو الطلب بالتفصيل...",
    uploadLabel: "صورة مرفقة",
    uploadHint: "JPG / JPEG / PNG / WEBP — بحد أقصى 5MB",
    submitLabelText: "إرسال الشكوى أو الطلب",
  },
  proposal: {
    icon: Lightbulb,
    eyebrow: "شاركنا فكرتك",
    title: "تقديم مقترح",
    typeLabel: "مجال المقترح",
    detailsLabel: "تفاصيل المقترح",
    detailsPlaceholder: "اكتب فكرتك أو المقترح بالتفصيل...",
    uploadLabel: "صورة أو ملف مرفق",
    uploadHint: "JPG / JPEG / PNG / PDF — بحد أقصى 5MB",
    submitLabelText: "إرسال المقترح",
  },
} as const;

export function CitizenRequestForm({
  variant,
  departments = [],
  organizations = [],
  loading = false,
}: CitizenRequestFormProps) {
  const dispatch = useDispatch();
  const c = COPY[variant];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nationalId: "",
    organizationId: "",
    departmentId: "",
    title: "",
    details: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await complaintService.createComplaint({
        RequestType: variant === "complaint" ? 1 : 2,
        FullName: formData.name,
        Phone: formData.phone,
        NationalId: formData.nationalId,
        OrganizationId: Number(formData.organizationId),
        DepartmentId: Number(formData.departmentId),
        Title: formData.title || (variant === "complaint" ? "شكوى جديدة" : "مقترح جديد"),
        Description: formData.details,
        Image: selectedFile,
      });

      if (response.isSuccess) {
        dispatch(
          toastify({
            message: response.message || "تم تقديم الطلب بنجاح.",
            type: "success",
          })
        );

        setFormData({
          name: "",
          phone: "",
          nationalId: "",
          organizationId: "",
          departmentId: "",
          title: "",
          details: "",
        });
        setSelectedFile(null);
      } else {
        dispatch(
          toastify({
            message: response.message || "تعذر تقديم الطلب.",
            type: "error",
          })
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الطلب.";
      dispatch(toastify({ message, type: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={variant}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="service-container bg-surface-container-lowest p-8"
        style={{ boxShadow: "var(--shadow-level-1)" }}
      >
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
            <c.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
          </div>
          <div>
            <span className="text-primary text-xs font-bold block">{c.eyebrow}</span>
            <h3 className="font-display text-xl mt-0.5">{c.title}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          <div className="grid sm:grid-cols-2 gap-4.5">
            <label htmlFor={`${variant}-name`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
              الاسم الكامل
              <input
                id={`${variant}-name`}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="اكتب اسمك بالكامل"
                className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
              />
            </label>
            <label htmlFor={`${variant}-phone`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
              رقم الهاتف
              <input
                id={`${variant}-phone`}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={11}
                placeholder="01xxxxxxxxx"
                className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
              />
            </label>
          </div>

          <label htmlFor={`${variant}-nationalId`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
            الرقم القومي
            <input
              id={`${variant}-nationalId`}
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              required
              maxLength={14}
              placeholder="اكتب الرقم القومي المكون من 14 رقم"
              className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
            />
            <small className="font-normal text-xs text-on-surface-variant">يجب إدخال الرقم القومي المكون من 14 رقم.</small>
          </label>

          <div className="grid sm:grid-cols-2 gap-4.5">
            <label htmlFor={`${variant}-city`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
              المركز / المدينة
              <select
                id={`${variant}-city`}
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
              >
                <option value="" disabled>
                  {loading ? "جاري التحميل..." : "اختر المركز أو المدينة"}
                </option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor={`${variant}-type`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
              {c.typeLabel}
              <select
                id={`${variant}-type`}
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
              >
                <option value="" disabled>
                  {loading ? "جاري التحميل..." : "اختر"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label htmlFor={`${variant}-title`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
            العنوان
            <input
              id={`${variant}-title`}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="عنوان الشكوى أو المقترح"
              className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
            />
          </label>

          <label htmlFor={`${variant}-details`} className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
            {c.detailsLabel}
            <textarea
              id={`${variant}-details`}
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={5}
              required
              minLength={10}
              placeholder={c.detailsPlaceholder}
              className="input-field px-3.5 py-3 text-sm font-body text-on-surface w-full"
            />
          </label>

          <UploadField
            label={c.uploadLabel}
            optional
            hint={c.uploadHint}
            onChange={(file) => setSelectedFile(file)}
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="btn-primary py-4 font-display font-extrabold text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "جاري الإرسال..."
            ) : (
              <>
                <span>{c.submitLabelText}</span>
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}