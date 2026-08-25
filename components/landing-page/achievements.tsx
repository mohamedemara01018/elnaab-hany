import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { NumberedCardGrid } from "@/components/ui/numbered-card-grid";
import { ACHIEVEMENTS } from "@/lib/data";

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionTitle title="ما تم" emphasis="انجازه" />
      <NumberedCardGrid items={ACHIEVEMENTS} />
    </Section>
  );
}
