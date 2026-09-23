"use client";

import { ImageOff } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { ActivityVisit, GetActivitiesVisitsResponse } from "@/types/activity-visit.types";
import { getMediaUrl } from "@/utils/functions.utils";
import EmptyState from "@/components/ui/Emptystate";
import { NumberedCardGrid, CardItem } from "@/components/ui/numbered-card-grid"; // Adjust import path if needed

interface GalleryProps {
  data?: GetActivitiesVisitsResponse | ActivityVisit[] | null;
}

export function Gallery({ data }: GalleryProps) {
  // Safely extract items whether data is the full response object or an array
  const apiItems: ActivityVisit[] | null = Array.isArray(data)
    ? data
    : data && "value" in data && Array.isArray(data.value)
      ? data.value
      : null;

  const hasItems = Array.isArray(apiItems) && apiItems.length > 0;

  // Map API ActivityVisit items into CardItem structure expected by NumberedCardGrid
  const gridItems: CardItem[] = hasItems
    ? apiItems.map((item) => ({
      id: item.id,
      title: item.title || "زيارة ميدانية",
      description: item.description,
      mediaUrl: getMediaUrl(item.mediaUrl),
      location: item.location,
      date: item.date,
    }))
    : [];

  return (
    <Section id="gallery" className="bg-surface-container-low">
      <SectionTitle eyebrow="من الميدان" title="أحدث" emphasis="الزيارات والفعاليات" />

      {!hasItems ? (
        <EmptyState
          icon={ImageOff}
          title="لا توجد زيارات أو فعاليات معروضة حالياً"
          description="سيتم إضافة الصور والزيارات الميدانية الجديدة فور توفرها."
          size="large"
        />
      ) : (
        <NumberedCardGrid items={gridItems} />
      )}
    </Section>
  );
}