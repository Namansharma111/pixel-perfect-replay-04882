import {
  Search,
  Target,
  Share2,
  Mail,
  Palette,
  Code2,
  MousePointerClick,
  Megaphone,
  Newspaper,
  Camera,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSlug } from "@/data/types";

export const SERVICE_ICONS: Record<ServiceSlug, LucideIcon> = {
  "seo-services": Search,
  "google-ads-performance-marketing": Target,
  "social-media-marketing": Share2,
  "content-marketing-email-automation": Mail,
  "branding-creative-strategy": Palette,
  "website-app-development": Code2,
  "ui-ux-cro-optimization": MousePointerClick,
  "offline-local-advertising": Megaphone,
  "public-relations": Newspaper,
  "photoshoot-creative-media": Camera,
};
