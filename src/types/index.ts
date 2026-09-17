import type { Project, Media, Article, Like, ContactMessage } from "@prisma/client";

export type ProjectWithMedia = Project & {
  media: Media[];
};

export type ProjectWithStats = Project & {
  media: Media[];
  likes: Like[];
  _count?: {
    likes: number;
  };
};

export type ArticleWithMeta = Article;

/**
 * What a project card needs — and nothing more. The list pages used to hand
 * the client components the full records (both case-study bodies, every
 * media item, the blur placeholders), which put ~560 KB of HTML behind the
 * projects grid. Cards read these fields; the detail page reads the rest.
 */
export type ProjectCardData = Pick<
  Project,
  | "id"
  | "slug"
  | "titleEn"
  | "titleAr"
  | "descEn"
  | "descAr"
  | "category"
  | "coverImage"
  | "blurDataUrl"
  | "tools"
> & { views: number; likeCount: number };

export type ArticleCardData = Pick<
  Article,
  | "id"
  | "slug"
  | "titleEn"
  | "titleAr"
  | "excerptEn"
  | "excerptAr"
  | "coverImage"
  | "tags"
  | "readTime"
  | "publishedAt"
> & { views: number };

export type ContactMessageWithStatus = ContactMessage;

export type Locale = "en" | "ar";

export type Theme = "light" | "dark" | "system";

export type CategorySlug = "videos" | "graphic-design" | "uiux" | "websites";

export const categorySlugToEnum: Record<CategorySlug, string> = {
  videos: "VIDEOS",
  "graphic-design": "GRAPHIC_DESIGN",
  uiux: "UIUX",
  websites: "WEBSITES",
};

export const categoryEnumToSlug: Record<string, CategorySlug> = {
  VIDEOS: "videos",
  GRAPHIC_DESIGN: "graphic-design",
  UIUX: "uiux",
  WEBSITES: "websites",
};

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  /** Already-localized description (preferred — from translation files) */
  desc?: string;
  descEn?: string;
  descAr?: string;
  current?: boolean;
}

export interface Stat {
  value: number;
  suffix?: string;
  labelKey: string;
}

export interface NavLink {
  href: string;
  key: string;
}
