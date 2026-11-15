import React from "react";
import { Link2, ArrowDownCircle, CheckCircle, Sparkles } from "lucide-react";
import type { CMSDownloaderHowToStep } from "@/lib/cms/types";

interface DownloaderHowToProps {
  steps: CMSDownloaderHowToStep[];
  toolName: string;
}

const STEP_ICONS: React.ElementType[] = [Link2, ArrowDownCircle, CheckCircle];

export function DownloaderHowTo({ steps, toolName }: DownloaderHowToProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[#0B1437]/70 border-y border-white/10 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FFD84A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            How to Use the {toolName}
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Follow these three quick steps to download and save your favorite Instagram content in seconds without any software installation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length] || Link2;
            return (
              <div
                key={step.step || idx}
                className="relative p-7 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-[#FF941E]/40 transition group flex flex-col justify-between"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                    0{step.step || idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#FFD84A]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFD84A] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
