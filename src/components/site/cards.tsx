import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Briefcase } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Article, ServiceContent } from "@/data/types";
import { SERVICE_ICONS } from "./service-icons";
import { CATEGORY_IMAGES, CATEGORY_LABELS, formatDate } from "@/data/articles";

export function ServiceCard({ service, index }: { service: ServiceContent; index?: number }) {
  let Icon = SERVICE_ICONS[service.slug as keyof typeof SERVICE_ICONS];
  if (!Icon && (service as any).icon) {
    Icon = (LucideIcons as any)[(service as any).icon];
  }
  if (!Icon) {
    Icon = Briefcase;
  }
  return (
    <Link
      to={`/${service.slug}`}
      className="reveal card-premium card-hover group flex h-full flex-col overflow-hidden p-7"
    >
      <div
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/0 blur-2xl transition-all duration-500 group-hover:bg-primary/15"
        aria-hidden
      />
      <div className="flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
          <Icon className="h-6 w-6" />
        </span>
        {index !== undefined && (
          <span className="text-sm font-bold text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className="mt-6 text-xl font-bold leading-snug">{service.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{service.tagline}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Explore service
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="reveal card-premium card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-[inherit]">
        <img
          src={CATEGORY_IMAGES[article.category]}
          alt={article.imageAlt}
          loading="lazy"
          width={1200}
          height={688}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-primary">
          {CATEGORY_LABELS[article.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read article <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
