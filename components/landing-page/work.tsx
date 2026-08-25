import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { NumberedCardGrid } from "@/components/ui/numbered-card-grid";
import { WORK_ITEMS } from "@/lib/data";

export function Work() {
  return (
    <Section id="work">
      <SectionTitle
        eyebrow="ما نقدمه"
        title="مجالات"
        emphasis="العمل والأنشطة"
        blurb="أهم الملفات التي يتم العمل عليها وخدمة المواطنين من خلالها."
      />
      <NumberedCardGrid items={WORK_ITEMS} />
    </Section>
  );
}
