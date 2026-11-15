import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Video,
  Film,
  Image as ImageIcon,
  Layers,
  BookOpen,
  Eye,
  ArrowRight,
} from "lucide-react";

interface DownloaderRelatedToolsProps {
  currentSlug: string;
}

const ALL_TOOLS = [
  {
    slug: "instagram-downloader",
    name: "Instagram Downloader",
    description: "All-in-one downloader for videos, reels, photos, and multi-slide albums.",
    icon: Sparkles,
  },
  {
    slug: "instagram-video-downloader",
    name: "Instagram Video Downloader",
    description: "Extract feed videos and IGTV streams in full high definition MP4.",
    icon: Video,
  },
  {
    slug: "instagram-reels-downloader",
    name: "Instagram Reels Downloader",
    description: "Save viral reels and audio in crystal-clear 1080p without any watermark.",
    icon: Film,
  },
  {
    slug: "instagram-photo-downloader",
    name: "Instagram Photo Downloader",
    description: "Grab original resolution JPEG images directly from any public post.",
    icon: ImageIcon,
  },
  {
    slug: "instagram-carousel-downloader",
    name: "Instagram Carousel Downloader",
    description: "Download multiple photos and videos from single multi-slide carousel posts.",
    icon: Layers,
  },
  {
    slug: "instagram-story-downloader",
    name: "Instagram Story Guide & Saver",
    description: "Explore safe methods to view public stories without account risk.",
    icon: BookOpen,
  },
  {
    slug: "instagram-viewer",
    name: "Instagram Anonymous Viewer",
    description: "Preview public Instagram posts, reels, and profiles without an account.",
    icon: Eye,
  },
];

export function DownloaderRelatedTools({ currentSlug }: DownloaderRelatedToolsProps) {
  const otherTools = ALL_TOOLS.filter((t) => t.slug !== currentSlug);

  return (
    <section className="py-16 md:py-20 bg-[#0B1437]/70 border-t border-white/10 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FFD84A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Explore More Instagram Media Tools
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Switch between our specialized free downloaders tailored for every type of Instagram content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                to={`/${tool.slug}` as any}
                className="p-6 rounded-3xl bg-[#0E1B5A]/40 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-[#FFD84A] flex items-center justify-center mb-4 group-hover:bg-gradient-to-tr group-hover:from-[#FF941E] group-hover:to-[#FFD84A] group-hover:text-[#080F35] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFD84A] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs font-semibold text-[#FFD84A] group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
