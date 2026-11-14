import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35]",
        className,
      )}
    >
      {children}
    </div>
  );
}
