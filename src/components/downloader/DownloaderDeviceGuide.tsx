import React, { useState } from "react";
import { Smartphone, Apple, Monitor, CheckCircle, Sparkles } from "lucide-react";

export function DownloaderDeviceGuide() {
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">("android");

  const deviceGuides = {
    android: {
      title: "How to Download on Android Devices",
      subtitle: "Compatible with Google Chrome, Samsung Internet, Firefox & Opera Mobile",
      steps: [
        {
          num: 1,
          text: "Open the Instagram app on your Android smartphone and find the reel, video, or photo you want to save.",
        },
        {
          num: 2,
          text: "Tap the Share icon (paper airplane) below the post and select 'Copy Link'.",
        },
        {
          num: 3,
          text: "Open your browser (e.g. Chrome), paste the link into the Social Waale Downloader box, and tap 'Download'.",
        },
        {
          num: 4,
          text: "Click 'Download MP4' or 'Download JPG'. The file will download immediately and appear in your Android Gallery or Downloads folder.",
        },
      ],
    },
    ios: {
      title: "How to Download on iPhone & iPad (iOS)",
      subtitle: "Compatible with iOS Safari, Chrome for iOS & the built-in Apple Files app",
      steps: [
        {
          num: 1,
          text: "Launch the Instagram app on your iPhone or iPad and navigate to the post, reel, or photo.",
        },
        {
          num: 2,
          text: "Tap the three dots (•••) or the Share button and select 'Copy Link'.",
        },
        {
          num: 3,
          text: "Open Safari, visit this page, paste the link into the download bar, and tap 'Download'.",
        },
        {
          num: 4,
          text: "When prompted by Safari, tap 'Download'. You can view the file from Safari's download manager (blue downward arrow) or save it directly to your Photos Camera Roll.",
        },
      ],
    },
    desktop: {
      title: "How to Download on PC, Mac & Laptop",
      subtitle: "Works seamlessly on Windows, macOS, ChromeOS & Linux across all modern browsers",
      steps: [
        {
          num: 1,
          text: "Open Instagram in your desktop web browser (Chrome, Edge, Firefox, or Safari).",
        },
        {
          num: 2,
          text: "Click on the post, reel, or video, and copy the full URL from the browser's top address bar (or click ••• > Copy link).",
        },
        {
          num: 3,
          text: "Paste the URL into our downloader search box above and click the 'Download' button.",
        },
        {
          num: 4,
          text: "Click 'Download MP4' or 'Download JPG'. Your browser will immediately save the original file to your default Downloads directory.",
        },
      ],
    },
  };

  const current = deviceGuides[activeTab];

  return (
    <section className="py-16 md:py-20 bg-[#0B1437]/80 border-t border-white/10 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FFD84A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Guides</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Step-by-Step Guide for Any Device
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Select your operating system below to see specific instructions for saving media:
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("android")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "android"
                  ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ios")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "ios"
                  ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>iPhone (iOS)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "desktop"
                  ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>PC & Mac</span>
            </button>
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="p-8 rounded-3xl bg-[#0E1B5A]/60 border border-white/15 backdrop-blur-xl shadow-xl">
          <div className="mb-6 pb-4 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">{current.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{current.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.steps.map((st) => (
              <div
                key={st.num}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {st.num}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {st.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
