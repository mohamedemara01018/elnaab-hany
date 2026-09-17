/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { User, Landmark, Share2, MapPin, Phone, MessageCircle, Link as LinkIcon, Camera, Trash2, Calendar, Clock, Home, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/Pageheader";
import { Field, InputWithIcon, SectionCard, TextareaField } from "@/components/ui/Formfield";
import { SaveBar } from "@/components/landing-dashboard/hero-management-dashboard-page/Savebar";
import { heroService } from "@/services/hero.service";
import { UpdateHeroInfoPayload } from "@/types/hero.types";
import { useDispatch } from "react-redux";
import { toastify } from "@/store/slices/toastificationSlice";

export default function HeroManagementDashboardPage() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isImageRemoved, setIsImageRemoved] = useState(false);

    // Initial state container to compare changes
    const [initialState, setInitialState] = useState({
        formData: {
            fullName: "",
            title: "",
            birthOfDate: "",
            address: "",
            bio: "",
            aboutPart1: "",
            aboutPart2: "",
            circle: "",
            appointment: "",
            officeLocation: "",
            locationURL: "",
            primaryPhone: "",
            secondaryPhone: "",
            whatsApp: "",
            facebookLing: "",
        },
        profileImage: null as string | null,
    });

    const [formData, setFormData] = useState({
        fullName: "",
        title: "",
        birthOfDate: "",
        address: "",
        bio: "",
        aboutPart1: "",
        aboutPart2: "",
        circle: "",
        appointment: "",
        officeLocation: "",
        locationURL: "",
        primaryPhone: "",
        secondaryPhone: "",
        whatsApp: "",
        facebookLing: "",
    });

    // Fetch data on mount
    const fetchHeroData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await heroService.getHeroInfo();
            if (response.isSuccess && response.value) {
                const data = response.value;
                const fetchedFormData = {
                    fullName: data.fullName || "",
                    title: data.title || "",
                    birthOfDate: data.birthOfDate ? data.birthOfDate.split("T")[0] : "",
                    address: data.address || "",
                    bio: data.bio || "",
                    aboutPart1: data.aboutPart1 || "",
                    aboutPart2: data.aboutPart2 || "",
                    circle: data.circle || "",
                    appointment: data.appointment || "",
                    officeLocation: data.officeLocation || "",
                    locationURL: data.locationURL || "",
                    primaryPhone: data.primaryPhone || "",
                    secondaryPhone: data.secondaryPhone || "",
                    whatsApp: data.whatsApp || "",
                    facebookLing: data.facebookLing || "",
                };

                const mediaUrl = data.mediaUrl || null;

                setFormData(fetchedFormData);
                setProfileImage(mediaUrl);

                // Save baseline data for comparison
                setInitialState({
                    formData: fetchedFormData,
                    profileImage: mediaUrl,
                });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء جلب البيانات الشخصية.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setLoading(false);
            setIsImageRemoved(false);
            setSelectedFile(null);
        }
    }, [dispatch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchHeroData();
    }, [fetchHeroData]);

    // Check if any form fields or image state have changed
    const isDirty = useMemo(() => {
        const isFormChanged = JSON.stringify(formData) !== JSON.stringify(initialState.formData);
        const isImageChanged = selectedFile !== null || isImageRemoved;
        return isFormChanged || isImageChanged;
    }, [formData, initialState, selectedFile, isImageRemoved]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (profileImage && profileImage.startsWith("blob:")) {
                URL.revokeObjectURL(profileImage);
            }
            setSelectedFile(file);
            setIsImageRemoved(false);
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleRemoveImage = () => {
        if (profileImage && profileImage.startsWith("blob:")) {
            URL.revokeObjectURL(profileImage);
        }
        setProfileImage(null);
        setSelectedFile(null);
        setIsImageRemoved(true);
    };

    const handleSave = async () => {
        if (!isDirty) return;

        try {
            setSaving(true);
            const payload: UpdateHeroInfoPayload = {
                FullName: formData.fullName,
                Title: formData.title,
                BirthOfDate: formData.birthOfDate || undefined,
                Address: formData.address,
                Bio: formData.bio,
                AboutPart1: formData.aboutPart1,
                AboutPart2: formData.aboutPart2,
                Circle: formData.circle,
                Appointment: formData.appointment,
                OfficeLocation: formData.officeLocation,
                LocationURL: formData.locationURL,
                PrimaryPhone: formData.primaryPhone,
                SecondaryPhone: formData.secondaryPhone,
                WhatsApp: formData.whatsApp,
                FacebookLing: formData.facebookLing,
            };

            if (selectedFile) {
                payload.Media = selectedFile;
            } else if (isImageRemoved) {
                payload.Media = null as unknown as File;
            }

            const response = await heroService.updateHeroInfo(payload);
            if (response.isSuccess) {
                dispatch(toastify({ message: response.message || "تم حفظ البيانات بنجاح.", type: "success" }));
                fetchHeroData();
            } else {
                dispatch(toastify({ message: response.message || "حدث خطأ أثناء حفظ البيانات.", type: "error" }));
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ البيانات.";
            dispatch(toastify({ message, type: "error" }));
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        fetchHeroData();
        dispatch(toastify({ message: "تم إلغاء التغييرات وإعادة جلب البيانات.", type: "info" }));
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <>
            <PageHeader
                breadcrumb="إعدادات الموقع"
                title="البيانات الشخصية"
                lastSavedLabel="يتم التحديث مباشرة عند إجراء التغييرات"
            />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-6">
                {/* Personal & professional details */}
                <SectionCard
                    icon={<User size={18} />}
                    title="التفاصيل الشخصية والمهنية"
                    description='المعلومات الأساسية التي ستظهر في الصفحة الرئيسية وقسم "عن النائب".'
                >
                    {/* الصورة الشخصية */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-outline-variant bg-surface-container-low mb-2">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                            {profileImage ? (
                                <img src={profileImage} alt="الصورة الشخصية" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-on-surface-variant/50" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2 text-center sm:text-start flex-1">
                            <div>
                                <h4 className="text-body-main font-semibold text-on-surface">الصورة الشخصية</h4>
                                <p className="text-body-small text-on-surface-variant">
                                    تنسيقات الصور المسموح بها JPG أو PNG أو WEBP (الحد الأقصى 2 ميجابايت).
                                </p>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 text-body-small font-medium bg-primary text-on-primary rounded-interactive hover:opacity-90 transition-opacity">
                                    <Camera size={16} />
                                    <span>تحميل صورة جديدة</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                {profileImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="flex items-center gap-1.5 px-3 py-2 text-body-small font-medium text-error hover:bg-error/10 rounded-interactive transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        <span>حذف</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="الاسم بالكامل">
                            <InputWithIcon name="fullName" value={formData.fullName} onChange={handleChange} />
                        </Field>
                        <Field label="المسمى الوظيفي / الصفة">
                            <InputWithIcon name="title" value={formData.title} onChange={handleChange} />
                        </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="تاريخ الميلاد">
                            <InputWithIcon type="date" name="birthOfDate" value={formData.birthOfDate} onChange={handleChange} icon={<Calendar size={16} />} />
                        </Field>
                        <Field label="محل إقامة النائب">
                            <InputWithIcon name="address" value={formData.address} onChange={handleChange} icon={<Home size={16} />} />
                        </Field>
                    </div>

                    <Field label="نبذة مختصرة (تظهر في الواجهة)">
                        <TextareaField
                            name="bio"
                            rows={2}
                            value={formData.bio}
                            onChange={handleChange}
                            charCount={`${formData.bio.length} / 150 حرف`}
                        />
                    </Field>

                    <div>
                        <p className="text-body-small font-semibold text-on-surface-variant mb-2">
                            السرد الشخصي (قسم &quot;عن النائب&quot;)
                        </p>
                        <div className="grid md:grid-cols-2 gap-5">
                            <Field label="الجزء الأول (النشأة والتعليم)">
                                <TextareaField name="aboutPart1" rows={3} value={formData.aboutPart1} onChange={handleChange} />
                            </Field>
                            <Field label="الجزء الثاني (الرؤية والعمل النيابي)">
                                <TextareaField name="aboutPart2" rows={3} value={formData.aboutPart2} onChange={handleChange} />
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                {/* Official data & headquarters */}
                <SectionCard icon={<Landmark size={18} />} title="البيانات الرسمية والمقرات">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="الدائرة الانتخابية">
                            <InputWithIcon name="circle" value={formData.circle} onChange={handleChange} />
                        </Field>
                        <Field label="مواعيد واستقبال المواطنين (Work Appointment)">
                            <InputWithIcon name="appointment" value={formData.appointment} onChange={handleChange} icon={<Clock size={16} />} />
                        </Field>
                    </div>

                    <Field label="عنوان المقر الرئيسي لخدمة المواطنين">
                        <InputWithIcon name="officeLocation" value={formData.officeLocation} onChange={handleChange} />
                    </Field>

                    <Field label="رابط خرائط جوجل (Google Maps Link)">
                        <InputWithIcon
                            name="locationURL"
                            value={formData.locationURL}
                            onChange={handleChange}
                            icon={<MapPin size={16} />}
                        />
                    </Field>

                    
                </SectionCard>

                {/* Contact channels */}
                <SectionCard icon={<Share2 size={18} />} title="قنوات التواصل والشبكات الاجتماعية">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="رقم الهاتف الأساسي">
                            <InputWithIcon name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} icon={<Phone size={16} />} />
                        </Field>
                        <Field label="رقم الهاتف الثانوي">
                            <InputWithIcon name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} icon={<Phone size={16} />} />
                        </Field>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="رقم الواتساب (للشكاوى)">
                            <InputWithIcon name="whatsApp" value={formData.whatsApp} onChange={handleChange} icon={<MessageCircle size={16} />} />
                        </Field>
                        <Field label="رابط صفحة الفيسبوك الرسمية">
                            <InputWithIcon
                                name="facebookLing"
                                value={formData.facebookLing}
                                onChange={handleChange}
                                icon={<LinkIcon size={16} />}
                            />
                        </Field>
                    </div>
                </SectionCard>
            </div>

            <SaveBar
                helperText="تأكد من مراجعة البيانات قبل الحفظ لتحديث الموقع فوراً."
                onSave={handleSave}
                onDiscard={handleDiscard}
                saving={saving}
                disabled={!isDirty}
            />
        </>
    );
}