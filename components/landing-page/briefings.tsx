"use client";

import { FileQuestion } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { NumberedCardGrid } from "@/components/ui/numbered-card-grid";
import { BriefingRequestApiResponse, BriefingRequestItem } from "@/types/briefing-requests.types";
import { getMediaUrl } from "@/utils/functions.utils";
import EmptyState from "@/components/ui/Emptystate";

interface BriefingsProps {
  data?: BriefingRequestApiResponse<BriefingRequestItem[]> | null;
}

export function Briefings({ data }: BriefingsProps) {
  const itemsList = data?.value;
  const hasItems = Array.isArray(itemsList) && itemsList.length > 0;

  const items = hasItems
    ? itemsList.map((item, index) => ({
      num: String(index + 1).padStart(2, "0"),
      title: item.title || "طلب إحاطة",
      desc: item.description || "",
      mediaUrl: getMediaUrl(item.mediaUrl),
    }))
    : [];

  return (
    <Section id="briefings">
      <SectionTitle
        title="طلبات"
        emphasis="الإحاطة"
        blurb="أهم الملفات التي يتم العمل عليها وخدمة المواطنين من خلالها."
      />

      {!hasItems ? (
        <EmptyState
          icon={FileQuestion}
          title="لا توجد طلبات إحاطة حالياً"
          description="سيتم استعراض وإضافة طلبات الإحاطة وتطوراتها أولاً بأول."
          size="large"
        />
      ) : (
        <NumberedCardGrid items={items} />
      )}
    </Section>
  );
}