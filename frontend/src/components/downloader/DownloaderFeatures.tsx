import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  FileCheck,
  Video,
  Download,
  Infinity as InfinityIcon,
  Globe,
} from "lucide-react";
import type { CMSDownloaderFeature } from "@/lib/cms/types";

interface DownloaderFeaturesProps {
  features: CMSDownloaderFeature[];
  toolName: string;
}

const ICON_MAP: Record<string, any> = {
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  FileCheck,
  Video,
  Download,
  Infinity: InfinityIcon,
  Globe,
};

export function DownloaderFeatures({ features, toolName }: DownloaderFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-16 md:py-20 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FFD84A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Key Features of Our {toolName}
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Engineered for speed, privacy, and full visual fidelity with zero watermarks or subscription walls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = (feat.icon && ICON_MAP[feat.icon]) || Sparkles;
            return (
              <div
                key={feat.title || idx}
                className="p-6 rounded-3xl bg-[#0E1B5A]/50 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#FFD84A] flex items-center justify-center mb-5 group-hover:bg-gradient-to-tr group-hover:from-[#FF941E] group-hover:to-[#FFD84A] group-hover:text-[#080F35] transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFD84A] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
