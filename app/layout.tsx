import type { Metadata } from "next";
import { Tajawal, Cairo, Amiri } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/provider/StoreProvider";
import ToastificationProvider from "@/provider/ToastificationProvider";
import { AuthGuardProvider } from "@/provider/AuthGuardProvider";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const imagePath = "/hanyImage.jpg?v=2"

export const metadata: Metadata = {
  title: "النائب هاني شحاتة | الموقع الرسمي - عضو مجلس النواب عن دائرة بنها وكفر شكر",
  description:
    "الموقع الرسمي للنائب هاني شحاتة، عضو مجلس النواب عن دائرة بنها وكفر شكر. تواصل مباشر مع مكتب النائب، تقديم الشكاوى والمقترحات، ومتابعة أهم الملفات والأنشطة والزيارات الميدانية.",
  keywords: [
    "هاني شحاتة",
    "النائب هاني شحاتة",
    "مجلس النواب",
    "بنها",
    "كفر شكر",
    "القليوبية",
    "شكاوى",
    "مقترحات",
    "خدمة المواطنين",
  ],
  authors: [{ name: "مكتب النائب هاني شحاتة" }],
  icons: {
    icon: imagePath,
    shortcut: imagePath,
    apple: imagePath,
  },
  openGraph: {
    title: "النائب هاني شحاتة | الموقع الرسمي",
    description:
      "منصة رسمية للتواصل مع المواطنين، تقديم الشكاوى والمقترحات، واستعراض أهم الملفات والأنشطة والزيارات.",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: imagePath,
        alt: "النائب هاني شحاتة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "النائب هاني شحاتة | الموقع الرسمي",
    description:
      "تواصل مع مكتب النائب هاني شحاتة، وقدّم شكواك أو مقترحك مباشرة.",
    images: [imagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html dir="rtl" lang="ar" suppressHydrationWarning className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme');if(m==='dark'||(!m&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${tajawal.variable} ${cairo.variable} ${amiri.variable} min-h-full flex flex-col transition-colors duration-200 antialiased`}>
        <StoreProvider>
          <ToastificationProvider>
            <AuthGuardProvider>
              {children}
            </AuthGuardProvider>
          </ToastificationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}