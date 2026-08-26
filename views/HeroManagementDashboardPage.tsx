/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { User, Landmark, Share2, MapPin, Phone, MessageCircle, Link as LinkIcon, Camera, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/hero-management-dashboard-page/Pageheader";
import { Field, InputWithIcon, SectionCard, TextareaField } from "@/components/dashboard/hero-management-dashboard-page/Formfield";
import { SaveBar } from "@/components/dashboard/hero-management-dashboard-page/Savebar";



export default function HeroManagementDashboardPage() {
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 900);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    return (
        <>
            <PageHeader
                breadcrumb="إعدادات الموقع"
                title="البيانات الشخصية"
                lastSavedLabel="آخر حفظ: منذ دقيقتين"
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
                                        onClick={() => setProfileImage(null)}
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
                            <InputWithIcon defaultValue="هاني شحاتة" />
                        </Field>
                        <Field label="المسمى الوظيفي / الصفة">
                            <InputWithIcon defaultValue="عضو مجلس النواب المصري" />
                        </Field>
                    </div>

                    <Field label="نبذة مختصرة (تظهر في الواجهة)">
                        <TextareaField
                            rows={2}
                            defaultValue="نعمل من أجل بناء مستقبل أفضل لدائرتنا، مستندين إلى الشفافية والمسؤولية المجتمعية."
                            charCount="112 / 150 حرف"
                        />
                    </Field>

                    <div>
                        <p className="text-body-small font-semibold text-on-surface-variant mb-2">
                            السرد الشخصي (قسم &quot;عن النائب&quot;)
                        </p>
                        <div className="grid md:grid-cols-2 gap-5">
                            <Field label="الجزء الأول (النشأة والتعليم)">
                                <TextareaField rows={3} defaultValue="ولدت ونشأت في قلب دائرتي الانتخابية..." />
                            </Field>
                            <Field label="الجزء الثاني (الرؤية والعمل النيابي)">
                                <TextareaField
                                    rows={3}
                                    defaultValue="أؤمن بأن العمل البرلماني الحقيقي يبدأ من الاستماع للمواطن..."
                                />
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                {/* Official data & headquarters */}
                <SectionCard icon={<Landmark size={18} />} title="البيانات الرسمية والمقرات">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="الدائرة الانتخابية">
                            <InputWithIcon defaultValue="الدائرة الأولى - محافظة الجيزة" />
                        </Field>
                        <Field label="تاريخ بدء الدورة البرلمانية">
                            <InputWithIcon type="date" defaultValue="2021-10-01" />
                        </Field>
                    </div>

                    <Field label="عنوان المقر الرئيسي لخدمة المواطنين">
                        <InputWithIcon defaultValue="شارع الهرم الرئيسي، بجوار مبنى المحافظة القديم، الجيزة" />
                    </Field>

                    <Field label="رابط خرائط جوجل (Google Maps Link)">
                        <InputWithIcon
                            defaultValue="https://maps.google.com/..."
                            icon={<MapPin size={16} />}
                        />
                    </Field>

                    <div className="rounded-service-container overflow-hidden border border-outline-variant h-52 bg-surface-container-high flex items-center justify-center text-on-surface-variant text-body-small">
                        معاينة الخريطة
                    </div>
                </SectionCard>

                {/* Contact channels */}
                <SectionCard icon={<Share2 size={18} />} title="قنوات التواصل والشبكات الاجتماعية">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="رقم الهاتف الأساسي">
                            <InputWithIcon defaultValue="01012345678" icon={<Phone size={16} />} />
                        </Field>
                        <Field label="رقم الواتساب (للشكاوى)">
                            <InputWithIcon defaultValue="01112345678" icon={<MessageCircle size={16} />} />
                        </Field>
                    </div>
                    <Field label="رابط صفحة الفيسبوك الرسمية">
                        <InputWithIcon
                            defaultValue="https://facebook.com/HanyShehataMP"
                            icon={<LinkIcon size={16} />}
                        />
                    </Field>
                </SectionCard>
            </div>

            <SaveBar
                helperText="تأكد من مراجعة البيانات قبل الحفظ لتحديث الموقع فوراً."
                onSave={handleSave}
                onDiscard={() => { }}
                saving={saving}
            />
        </>

    );
}