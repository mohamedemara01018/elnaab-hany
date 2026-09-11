"use client";

import { Award } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { NumberedCardGrid } from "@/components/ui/numbered-card-grid";
import { GetAchievementsResponse, AchievementItem } from "@/types/achievement.types";
import { getMediaUrl } from "@/utils/functions.utils";
import EmptyState from "@/components/ui/Emptystate";

interface AchievementsProps {
  data?: GetAchievementsResponse | AchievementItem[] | null;
}

export function Achievements({ data }: AchievementsProps) {
  const fetchedItems = Array.isArray(data)
    ? data
    : data?.value && Array.isArray(data.value)
      ? data.value
      : null;

  const hasItems = Array.isArray(fetchedItems) && fetchedItems.length > 0;

  const items = hasItems
    ? fetchedItems.map((item, index) => ({
      num: String(index + 1).padStart(2, "0"),
      title: item.title || "إنجاز",
      desc: item.description || "",
      mediaUrl: getMediaUrl(item.mediaUrl),
    }))
    : [];

  return (
    <Section id="achievements">
      <SectionTitle title="ما تم" emphasis="انجازه" />

      {!hasItems ? (
        <EmptyState
          icon={Award}
          title="لا توجد إنجازات معروضة حالياً"
          description="يتم العمل على حصر وتوثيق أهم الإنجازات والمبادرات المجتمعية لخدمة المواطنين."
          size="large"
        />
      ) : (
        <NumberedCardGrid items={items} />
      )}
    </Section>
  );
}