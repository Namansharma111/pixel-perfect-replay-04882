import { Instagram, Facebook, Linkedin } from "lucide-react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const items = [
  { href: SITE.socials.instagram, label: "Social Waale on Instagram", Icon: Instagram },
  { href: SITE.socials.facebook, label: "Social Waale on Facebook", Icon: Facebook },
  { href: SITE.socials.linkedin, label: "Social Waale on LinkedIn", Icon: Linkedin },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
