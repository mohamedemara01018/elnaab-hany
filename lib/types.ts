/* ===========================================================
   الأنواع — Types
   =========================================================== */

export interface NavLink {
  href: string;
  label: string;
}

export interface Fact {
  icon: string;
  label: string;
  value: string;
}

export interface Stat {
  target: number;
  label: string;
}

export interface WorkItem {
  n: string;
  title: string;
  body: string;
  imageUrl?: string;
  mediaUrl?: string;
}

export interface VideoItem {
  title: string;
  url?: string;
  mediaUrl?: string;
}

export interface GalleryItem {
  tag: string;
  title: string;
  body: string;
  type: "image" | "video";
  image?: string;
  mediaUrl?: string;
}

export interface ContactCard {
  icon: string;
  title: string;
  body: string;
  link?: { label: string; href: string };
}

export interface TeamMember {
  n: string;
  name: string;
  role: string;
  phone: string;
  office?: boolean;
}
