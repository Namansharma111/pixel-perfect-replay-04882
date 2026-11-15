import React, { useState } from "react";
import {
  Download,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Video,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ShieldAlert,
  Film,
} from "lucide-react";
import type { InstagramMediaResult, ResolvedMediaItem } from "@/lib/downloader/instagram";

interface DownloaderResultsProps {
  result: InstagramMediaResult | null;
  isLoading: boolean;
  onReset: () => void;
}

export function DownloaderResults({
  result,
  isLoading,
  onReset,
}: DownloaderResultsProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mt-8 mx-auto max-w-2xl bg-[#0E1B5A]/80 border border-white/15 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] flex items-center justify-center text-[#080F35] shadow-lg mb-5 animate-spin">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Analyzing Instagram Media...
        </h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Extracting high-definition video stream and original photo assets. This typically takes 2–4 seconds.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFD84A] animate-bounce" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF941E] animate-bounce [animation-delay:0.2s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (!result) return null;

  // Handle Error State
  if (!result.ok) {
    const isStory = result.errorType === "story_restricted";
    const isPrivate = result.errorType === "private_account";

    return (
      <div className="mt-8 mx-auto max-w-2xl bg-gradient-to-b from-[#1c1836] to-[#0e1338] border border-amber-500/30 rounded-3xl p-7 text-left shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            {isStory || isPrivate ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-1">
              {isStory
                ? "Stories Require Private Authentication"
                : isPrivate
                ? "Private Instagram Account Detected"
                : "Unable to Retrieve Instagram Media"}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {result.error}
            </p>

            <div className="p-3.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-slate-300 space-y-1 mb-5">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Quick Tips for Success:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>Ensure the post is from an open, publicly visible account.</li>
                <li>Make sure you copied the individual post or reel link (not the user profile).</li>
                <li>Verify the URL format matches: <code className="text-white bg-white/10 px-1 py-0.5 rounded">instagram.com/reel/...</code> or <code className="text-white bg-white/10 px-1 py-0.5 rounded">instagram.com/p/...</code></li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition border border-white/10"
            >
              <RefreshCw className="w-4 h-4" /> Try Another Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Success State
  const isCarousel = result.items.length > 1;

  const handleDownload = (item: ResolvedMediaItem) => {
    setDownloadingId(item.id);
    // Use the streaming download proxy endpoint
    const link = document.createElement("a");
    link.href = item.downloadUrl;
    link.download = item.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 2500);
  };

  return (
    <div className="mt-8 mx-auto max-w-4xl bg-[#0B1437]/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FF941E]/20 text-[#FFD84A] border border-[#FF941E]/30">
                {result.contentType === "carousel"
                  ? `Carousel Album (${result.items.length} items)`
                  : result.contentType === "reel"
                  ? "Instagram Reel"
                  : result.contentType === "video"
                  ? "Instagram Video"
                  : "Instagram Photo"}
              </span>
              <span className="text-xs text-slate-400">Shortcode: {result.shortcode}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Media Ready for Download
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Download Another Link
        </button>
      </div>

      {/* Caption Preview (if available) */}
      {result.caption && (
        <div className="mt-4 p-3.5 bg-black/30 border border-white/5 rounded-2xl text-xs text-slate-300 leading-relaxed line-clamp-2">
          <span className="font-semibold text-slate-200">Post Caption: </span>
          {result.caption}
        </div>
      )}

      {/* Single Media Item View */}
      {!isCarousel && result.items[0] && (() => {
        const firstItem = result.items[0];
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center max-h-[460px]">
              {firstItem.type === "video" ? (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={firstItem.thumbnailUrl}
                  src={firstItem.url}
                  className="w-full max-h-[440px] object-contain rounded-2xl"
                />
              ) : (
                <img
                  src={firstItem.url}
                  alt="Instagram Media Preview"
                  className="w-full max-h-[440px] object-contain rounded-2xl"
                />
              )}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10 flex items-center gap-1.5">
                {firstItem.type === "video" ? (
                  <>
                    <Film className="w-3.5 h-3.5 text-[#FFD84A]" />
                    <span>{firstItem.resolution || "1080p Full HD"}</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-[#FFD84A]" />
                    <span>High Res JPG</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>File Format:</span>
                  <span className="font-bold text-white uppercase">
                    {firstItem.type === "video" ? "MP4 Video" : "JPG Image"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Quality / Resolution:</span>
                  <span className="font-bold text-emerald-400">
                    {firstItem.resolution || "Full HD 1080p (Original)"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Watermark:</span>
                  <span className="font-bold text-white">None (Clean Original)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>File Name:</span>
                  <span className="font-mono text-slate-400 text-[11px] truncate max-w-[180px]">
                    {firstItem.filename}
                  </span>
                </div>
              </div>

              {/* Primary Download Button */}
              <button
                type="button"
                onClick={() => handleDownload(firstItem)}
                disabled={downloadingId === firstItem.id}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-base hover:opacity-95 active:scale-[0.99] transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
              >
                <Download className="w-5 h-5" />
                {downloadingId === firstItem.id
                  ? "Downloading..."
                  : firstItem.type === "video"
                  ? "Download MP4 Video"
                  : "Download JPG Photo"}
              </button>

              {/* Secondary Direct CDN Links */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                <span className="text-[11px]">Direct link fallback:</span>
                <a
                  href={firstItem.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-[#FFD84A] hover:underline"
                >
                  Open Source CDN URL <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Multiple Items (Carousel) View */}
      {isCarousel && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FFD84A]" />
              This album contains {result.items.length} media slides. You can download each one individually below:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {result.items.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-black/40 border border-white/10 p-3.5 hover:border-white/20 transition flex flex-col justify-between"
              >
                <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-square flex items-center justify-center mb-3">
                  {item.type === "video" ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      poster={item.thumbnailUrl}
                      src={item.url}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                    {item.type === "video" ? (
                      <Video className="w-3 h-3 text-[#FFD84A]" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>Slide {index + 1}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-white/10">
                    {item.resolution || (item.type === "video" ? "1080p HD" : "High Res")}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>{item.type === "video" ? "Video (MP4)" : "Photo (JPG)"}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[#FFD84A] hover:underline inline-flex items-center gap-0.5"
                    >
                      CDN <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    disabled={downloadingId === item.id}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold text-xs hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadingId === item.id ? "Downloading..." : `Download Slide ${index + 1}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
