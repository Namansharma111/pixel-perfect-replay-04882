import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/social-waale-logo.jpg";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Social Waale logo"
      width={size}
      height={size}
      className={cn("rounded-full object-contain ring-1 ring-primary/30", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Social Waale home"
    >
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Social <span className="text-primary">Waale</span>
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Digital Marketing
        </span>
      </span>
    </Link>
  );
}
