/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { SlidersHorizontal, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/Pageheader";
import { AvatarUpload } from "@/components/shared-dashboard/profile/Avatarupload";
import { SaveBar } from "@/components/landing-dashboard/hero-management-dashboard-page/Savebar";
import { employeeService } from "@/services/employee.service";
import { Field } from "@/components/ui/Field";
import { toastify } from "@/store/slices/toastificationSlice";

export default function EmployeeProfilePage() {
    const dispatch = useDispatch();

    // API Data & Profile Identity State
    const [employeeId, setEmployeeId] = useState<string>("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");


    // Initial state reference to track changes (isDirty)
    const [initialData, setInitialData] = useState<{
        fullname: string;
        phone: string;
        about: string;
        imageFile: File | null;
    }>({
        fullname: "",
        phone: "",
        about: "",
        imageFile: null,
    });

    // UI Auxiliary States
    const [email, setEmail] = useState("");
    const [roleTitle, setRoleTitle] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Loaders State
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoadingData(true);

                // Fetch employee profile data
                const profileRes = await employeeService.getEmployeeInfo();

                // Populate profile state from API response
                if (profileRes?.isSuccess && profileRes.value) {
                    const info = profileRes.value;
                    const fetchedId = info.userid || "";
                    const fetchedName = info.name || "";
                    const fetchedPhone = info.phone || "";
                    const fetchedAbout = info.about || "";

                    setEmployeeId(fetchedId);
                    setFullname(fetchedName);
                    setPhone(fetchedPhone);
                    setAbout(fetchedAbout);
                    setEmail(info.email || "");
                    setRoleTitle(info.role || "");
                    setImageUrl(info.imageUrl || null);

                    // Save snapshot of editable loaded data
                    setInitialData({
                        fullname: fetchedName,
                        phone: fetchedPhone,
                        about: fetchedAbout,
                        imageFile: null,
                    });
                }
            } catch (error) {
                console.error("Error fetching profile initial data:", error);
                dispatch(
                    toastify({
                        message: "حدث خطأ أثناء تحميل بيانات الملف الشخصي.",
                        type: "error",
                    })
                );
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchInitialData();
    }, [dispatch]);

    // Check if user modified remaining editable inputs
    const isDirty = useMemo(() => {
        return (
            fullname !== initialData.fullname ||
            phone !== initialData.phone ||
            about !== initialData.about ||
            imageFile !== null
        );
    }, [fullname, phone, about, imageFile, initialData]);

    // Handle avatar upload input change
    const handleImageChange = (file: File | null) => {
        setImageFile(file);
    };

    // Reset fields to last saved state
    const handleDiscard = () => {
        setFullname(initialData.fullname);
        setPhone(initialData.phone);
        setAbout(initialData.about);
        setImageFile(null);
    };

    // Save Profile Submission logic
    const handleSave = async () => {
        if (!employeeId) {
            dispatch(
                toastify({
                    message: "تعذر العثور على المعرف الخاص بالموظف.",
                    type: "error",
                })
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                EmployeeId: employeeId,
                fullname,
                Phone: phone,
                About: about,
                Image: imageFile,
            };

            const response = await employeeService.updateEmployeeProfile(payload);

            if (response.isSuccess) {
                dispatch(
                    toastify({
                        message: "تم تحديث الملف الشخصي بنجاح!",
                        type: "success",
                    })
                );
                // Sync current state with initialData snapshot
                setInitialData({
                    fullname,
                    phone,
                    about,
                    imageFile: null,
                });
                setImageFile(null);
            } else {
                dispatch(
                    toastify({
                        message: response.message || response.error || "فشل تحديث البيانات.",
                        type: "error",
                    })
                );
            }
        } catch (error: any) {
            console.error("Error saving profile:", error);
            dispatch(
                toastify({
                    message: error?.message || "حدث خطأ غير متوقع عند تحديث البيانات.",
                    type: "error",
                })
            );
        } finally {
            setSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ms-3 text-body-md text-on-surface-variant">
                    جاري تحميل بيانات الملف الشخصي...
                </span>
            </div>
        );
    }

    return (
        <>
            <PageHeader breadcrumb="شؤون الموظفين" title="الملف الشخصي للموظف" />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-24">
                {/* Identity & official photo */}
                <section className="card">
                    <AvatarUpload
                        name={fullname || "اسم الموظف"}
                        title={roleTitle || "المسمى الوظيفي"}
                        email={email}
                        currentImageUrl={imageUrl}
                        onImageChange={handleImageChange}
                    />
                    <p className="text-label-caption text-on-surface-variant/70 mt-4">
                        الصيغ المقبولة: JPG، PNG، WEBP بحد أقصى 2 ميجابايت. يُفضل استخدام صور بأبعاد
                        لا تقل عن 500×500 بكسل بطاقة رسمية.
                    </p>
                </section>

                {/* Editable Profile Fields */}
                <section className="card">
                    <div className="flex items-center gap-2 mb-1 text-primary">
                        <SlidersHorizontal size={18} />
                        <h2 className="text-title-card text-on-surface">
                            البيانات الشخصية{" "}
                            <span className="text-on-surface-variant font-normal">
                                (PUT Request Model)
                            </span>
                        </h2>
                    </div>
                    <p className="text-body-small text-on-surface-variant mb-5">
                        تحديث معلومات الملف الشخصي: الاسم الكامل، رقم الهاتف، والنبذة التعريفية.
                    </p>

                    <div className="flex flex-col gap-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <Field
                                label="الاسم الكامل للموظف (fullname)"
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-body-sm font-medium text-on-surface">
                                        رقم الهاتف الرسمي (Phone)
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-md ps-3.5 pe-11 py-2.5 text-body-md text-on-surface outline-none focus:border-primary text-end"
                                    />
                                    <span className="absolute inset-y-0 inset-e-3 flex items-center text-on-surface-variant">
                                        <Phone size={15} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-body-sm font-medium text-on-surface">
                                    نبذة عن الموظف ومسؤولياته (About)
                                </label>
                                <span className="text-label-sm text-on-surface-variant font-medium">
                                    {about.length} / 600 حرف
                                </span>
                            </div>
                            <textarea
                                rows={4}
                                maxLength={600}
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3.5 py-2.5 text-body-md text-on-surface outline-none focus:border-primary resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-outline-variant">
                        <p className="flex items-center gap-1.5 text-body-small text-on-surface-variant">
                            <ShieldCheck size={14} className="text-success-green" />
                            <span>بيانات الحقل متوافقة مع معايير الحوكمة الرقمية</span>
                        </p>
                    </div>
                </section>

                {/* Floating Save Bar */}
                <SaveBar
                    helperText="تأكد من مراجعة البيانات قبل الحفظ لتحديث الموقع فوراً."
                    onSave={handleSave}
                    onDiscard={handleDiscard}
                    saving={saving}
                    disabled={!isDirty}
                />
            </div>
        </>
    );
}