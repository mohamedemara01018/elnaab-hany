"use client";

import { FolderOpen } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { NumberedCardGrid } from "@/components/ui/numbered-card-grid";
import { getMediaUrl } from "@/utils/functions.utils";
import { Activity, ApiResponse } from "@/types/activities.types";
import EmptyState from "@/components/ui/Emptystate";

interface WorkProps {
  data: ApiResponse<Activity[]> | null;
}

export function Work({ data }: WorkProps) {
  const itemsList = data?.value;
  const hasItems = Array.isArray(itemsList) && itemsList.length > 0;

  const items = hasItems
    ? itemsList.map((item, index) => ({
      id: item.id,
      num: String(index + 1).padStart(2, "0"),
      title: item.title || "مجال عمل",
      desc: item.description || "",
      mediaUrl: getMediaUrl(item.mediaUrl),
      contentType: item.contentType,
      mediaType: item.mediaType,
    }))
    : [];

  return (
    <Section id="work">
      <SectionTitle
        eyebrow="ما نقدمه"
        title="مجالات"
        emphasis="العمل والأنشطة"
        blurb="أهم الملفات التي يتم العمل عليها وخدمة المواطنين من خلالها."
      />

      {!hasItems ? (
        <EmptyState
          icon={FolderOpen}
          title="لا توجد مجالات عمل متاحة حالياً"
          description="سيتم تحديث وإضافة مجالات العمل والأنشطة الميدانية أولاً بأول."
          size="large"
        />
      ) : (
        <NumberedCardGrid items={items} />
      )}
    </Section>
  );
}