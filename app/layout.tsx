import type { Metadata } from "next";
import { Tajawal, Cairo, Amiri } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/provider/StoreProvider";
import ToastificationProvider from "@/provider/ToastificationProvider";
import { Navbar } from "@/components/landing-page/navbar";
import { Footer } from "@/components/landing-page/footer";

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
    icon: "/icon.png",
  },
  openGraph: {
    title: "النائب هاني شحاتة | الموقع الرسمي",
    description:
      "منصة رسمية للتواصل مع المواطنين، تقديم الشكاوى والمقترحات، واستعراض أهم الملفات والأنشطة والزيارات.",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "النائب هاني شحاتة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "النائب هاني شحاتة | الموقع الرسمي",
    description:
      "تواصل مع مكتب النائب هاني شحاتة، وقدّم شكواك أو مقترحك مباشرة.",
    images: ["/og-image.png"],
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
        {/* Prevent dark-mode flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme');if(m==='dark'||(!m&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />

      </head>
      <body className={`${tajawal.variable} ${cairo.variable} ${amiri.variable} min-h-full flex flex-col transition-colors duration-200 antialiased`}>
        <StoreProvider>
          <ToastificationProvider>
            <Navbar />
            {children}
            <Footer />
          </ToastificationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
