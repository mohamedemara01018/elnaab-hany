export function Footer() {
  return (
    <footer className="bg-surface-container-high text-inverse-on-surface py-14 pb-6">
      <div className="wrapper grid md:grid-cols-[2fr_1fr_1fr] gap-8">
        <div>
          <h2 className="font-display text-xl text-gold-highlight">هاني شحاتة</h2>
          <p className="text-sm text-on-surface-variant mt-2.5">منصة إلكترونية لخدمة المواطنين والتواصل المباشر مع مكتب النائب.</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-sm text-gold-highlight mb-1">روابط سريعة</h3>
          <a href="#about" className="text-sm text-on-surface-variant">السيرة الذاتية</a>
          <a href="#work" className="text-sm text-on-surface-variant">مجالات العمل</a>
          <a href="#videos" className="text-sm text-on-surface-variant">اللقاءات التلفزيونية والبرلمانية</a>
          <a href="#gallery" className="text-sm text-on-surface-variant">الفعاليات</a>
          <a href="#complaints" className="text-sm text-on-surface-variant">المكتب الرقمي</a>
        </div>

        <div className="flex flex-col gap-2 text-gold-highlight">
          <h3 className="font-display text-sm mb-1">تواصل معنا</h3>
          <div className="flex gap-3.5">
            <a
              href="https://web.facebook.com/profile.php?id=61560394937903"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="صفحة الفيسبوك الرسمية للنائب هاني شحاتة"
              className="text-sm text-on-surface-variant"
            >
              Facebook
            </a>
            <a
              href="https://wa.me/201114418110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="التواصل عبر الواتساب مع مكتب النائب"
              className="text-sm text-on-surface-variant"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <a href="#" className="text-gold-highlight text-sm" aria-label="دخول الإدارة">
          دخول الإدارة ←
        </a>
      </div>

      <div className="wrapper text-center mt-6 pt-5 border-t border-white/10 text-xs text-on-surface-variant">
        © 2026 جميع الحقوق محفوظة | الموقع الرسمي للنائب هاني شحاتة
      </div>
    </footer>
  );
}
