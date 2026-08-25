import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { NumberedCardGrid } from "@/components/ui/numbered-card-grid";
import { BRIEFINGS } from "@/lib/data";

export function Briefings() {
  return (
    <Section id="briefings">
      <SectionTitle
        title="طلبات"
        emphasis="الإحاطة"
        blurb="أهم الملفات التي يتم العمل عليها وخدمة المواطنين من خلالها."
      />
      <NumberedCardGrid items={BRIEFINGS} />
    </Section>
  );
}
