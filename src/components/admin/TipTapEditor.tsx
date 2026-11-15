import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Minus,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Sparkles,
  Eye,
  FileCode,
  Youtube,
  Table as TableIcon,
  HelpCircle,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  Maximize2,
  Minimize2,
  RemoveFormatting,
  Highlighter,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Bookmark,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface OutlineItem {
  id: string;
  text: string;
  level: number;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing your article here...",
}: TipTapEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(content);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSeoSidebar, setShowSeoSidebar] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline font-semibold hover:text-orange-600 transition-colors",
        },
      }),
      ImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-2xl max-w-full my-6 border border-slate-200 shadow-md",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "tiptap-content p-8 sm:p-12 focus:outline-none min-h-[520px] max-w-none text-slate-800",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceCode(html);
      onChange(html);
      updateOutline(editor);
    },
    onCreate: ({ editor }) => {
      updateOutline(editor);
    },
  });

  // Extract headings outline for the Live Table of Contents
  const updateOutline = (ed: any) => {
    if (!ed) return;
    const items: OutlineItem[] = [];
    ed.state.doc.descendants((node: any, pos: number) => {
      if (node.type.name === "heading") {
        const level = node.attrs.level;
        const text = node.textContent.trim();
        if (text) {
          items.push({
            id: `heading-pos-${pos}`,
            text,
            level,
          });
        }
      }
    });
    setOutline(items);
  };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // update when external content changes significantly
      if (Math.abs(content.length - editor.getHTML().length) > 5) {
        editor.commands.setContent(content, { emitUpdate: false });
        updateOutline(editor);
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  // SEO & Content Metrics Analysis
  const currentHtml = editor.getHTML();
  const rawText = editor.getText();
  const words = rawText.trim() ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = rawText.length;
  const readingTime = Math.ceil(words / 200) || 1;

  // Headings count
  const h1Count = (currentHtml.match(/<h1\b[^>]*>/gi) || []).length;
  const h2Count = (currentHtml.match(/<h2\b[^>]*>/gi) || []).length;
  const h3Count = (currentHtml.match(/<h3\b[^>]*>/gi) || []).length;
  const h4Count = (currentHtml.match(/<h4\b[^>]*>/gi) || []).length;

  // Link counts
  const allLinks = (currentHtml.match(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi) || []).map((match) => {
    const hrefMatch = match.match(/href=["']([^"']*)["']/i);
    return hrefMatch && hrefMatch[1] ? hrefMatch[1] : "";
  });
  const internalLinks = allLinks.filter(
    (l) => typeof l === "string" && (l.startsWith("/") || l.includes("socialwaale.com") || l.startsWith("#")),
  ).length;
  const externalLinks = allLinks.filter(
    (l) => typeof l === "string" && l.startsWith("http") && !l.includes("socialwaale.com"),
  ).length;

  // Images count & Missing Alt text detection
  const imgMatches = currentHtml.match(/<img\b[^>]*>/gi) || [];
  const totalImages = imgMatches.length;
  const missingAltCount = imgMatches.filter((img) => {
    const hasAlt = /alt=["']([^"']+)["']/i.test(img);
    return !hasAlt;
  }).length;

  // Actions
  const handleOpenLinkModal = () => {
    const attrs = editor?.getAttributes("link") as Record<string, any> | undefined;
    const previousUrl = (attrs && attrs["href"]) || "";
    setLinkUrl(previousUrl);
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    if (!editor) return;
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    }
    setShowLinkModal(false);
  };

  const handleOpenImageModal = () => {
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(true);
  };

  const handleApplyImage = () => {
    if (!editor) return;
    if (imageUrl.trim()) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || "Article illustration" })
        .run();
    }
    setShowImageModal(false);
  };

  const handleInsertYoutube = () => {
    if (!editor) return;
    const url = window.prompt("Enter YouTube Video URL (e.g. https://www.youtube.com/watch?v=...):");
    if (!url) return;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      const embedUrl = `https://www.youtube.com/embed/${match[2]}`;
      const iframeHtml = `<div class="aspect-video my-6 rounded-2xl overflow-hidden shadow-lg border border-slate-300"><iframe src="${embedUrl}" class="w-full h-full" allowfullscreen></iframe></div>`;
      editor.commands.insertContent(iframeHtml);
    } else {
      alert("Please enter a valid YouTube URL.");
    }
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleInsertCallout = () => {
    const quote = window.prompt("Enter key takeaway or callout quote:");
    if (!quote) return;
    const calloutHtml = `
      <div class="callout-box">
        <p><strong>💡 Key Strategic Takeaway:</strong> ${quote}</p>
      </div>
    `;
    editor.commands.insertContent(calloutHtml);
  };

  const handleInsertCta = () => {
    const text = window.prompt("Enter CTA Button Text:", "Discuss Your Strategy");
    const link = window.prompt("Enter CTA Button Link:", "/contact");
    if (!text || !link) return;
    const ctaHtml = `
      <div class="cta-box">
        <h3 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">Ready to Scale Your Brand with Social Waale?</h3>
        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 20px;">Partner with Chandigarh’s premier performance marketing agency.</p>
        <a href="${link}" style="display: inline-block; padding: 10px 24px; border-radius: 9999px; background: linear-gradient(135deg, #FF941E, #FFD84A); color: #080F35; font-weight: 800; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">${text}</a>
      </div>
    `;
    editor.commands.insertContent(ctaHtml);
  };

  const handleInsertFaqBlock = () => {
    const q = window.prompt("Enter Frequently Asked Question:", "How do you measure ROI?");
    const a = window.prompt(
      "Enter the detailed Answer:",
      "We track cost-per-acquisition, conversion rate, and revenue attribution across Google Analytics and custom weekly reports.",
    );
    if (!q || !a) return;
    const faqHtml = `
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 18px 0; background-color: #f8fafc;">
        <h4 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">❓ ${q}</h4>
        <p style="font-size: 15px; color: #475569; margin: 0; line-height: 1.6;">${a}</p>
      </div>
    `;
    editor.commands.insertContent(faqHtml);
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      editor.commands.setContent(sourceCode);
      onChange(sourceCode);
      updateOutline(editor);
    } else {
      setSourceCode(editor.getHTML());
    }
    setIsSourceMode(!isSourceMode);
  };

  const scrollToHeading = (targetText: string) => {
    if (!editorContainerRef.current) return;
    const domHeadings = editorContainerRef.current.querySelectorAll("h1, h2, h3, h4");
    for (let i = 0; i < domHeadings.length; i++) {
      const el = domHeadings[i];
      if (el && el.textContent?.trim() === targetText.trim()) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-yellow-100");
        setTimeout(() => {
          el.classList.remove("bg-yellow-100");
        }, 1200);
        break;
      }
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "relative"
      }`}
    >
      {/* ============================================================== */}
      {/* 1. TOP STATUS & TOOLBAR HEADER                                 */}
      {/* ============================================================== */}
      <div className="bg-[#080F35] border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Left: Quick Format Bar & Type Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Paragraph / Heading Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={
                editor.isActive("heading", { level: 1 })
                  ? "h1"
                  : editor.isActive("heading", { level: 2 })
                    ? "h2"
                    : editor.isActive("heading", { level: 3 })
                      ? "h3"
                      : editor.isActive("heading", { level: 4 })
                        ? "h4"
                        : "p"
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === "p") editor.chain().focus().setParagraph().run();
                else if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
                else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
                else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
                else if (val === "h4") editor.chain().focus().toggleHeading({ level: 4 }).run();
              }}
              title="Select Text Hierarchy Level"
              aria-label="Text Style Hierarchy"
              className="bg-[#0B1437] text-white border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF941E] cursor-pointer"
            >
              <option value="p">¶ Paragraph (16px)</option>
              <option value="h1">H1 Main Heading (32px)</option>
              <option value="h2">H2 Section Heading (26px)</option>
              <option value="h3">H3 Subsection (21px)</option>
              <option value="h4">H4 Small Heading (18px)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* Quick Headings Buttons */}
          <div className="flex items-center gap-1 bg-[#0B1437] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-[#FF941E] text-[#080F35] shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Heading 1 (32px Bold Prominent)"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-[#FF941E] text-[#080F35] shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Heading 2 (26px Section Title)"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-[#FF941E] text-[#080F35] shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Heading 3 (21px Subsection)"
            >
              H3
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* Group 2: Inline Styles (Bold, Italic, Underline, Strike, Highlight) */}
          <div className="flex items-center gap-1 bg-[#0B1437] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("bold")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("italic")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("underline")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("strike")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("highlight")
                  ? "bg-[#FFD84A] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Highlight Text Marker"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
              title="Clear Formatting"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden md:block" />

          {/* Group 3: Alignment */}
          <div className="flex items-center gap-1 bg-[#0B1437] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "justify" })
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Justify Text"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden lg:block" />

          {/* Group 4: Lists & Quotes */}
          <div className="flex items-center gap-1 bg-[#0B1437] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("bulletList")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("orderedList")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("blockquote")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Blockquote (Accent Left Border)"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Toolbar: Elements, Special Blocks, Outlines & View Toggles */}
        <div className="flex items-center gap-2">
          {/* Insert Link & Media */}
          <div className="flex items-center gap-1 bg-[#0B1437] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={handleOpenLinkModal}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("link")
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Insert / Edit Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            {editor.isActive("link") && (
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Remove Link"
              >
                <Unlink className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenImageModal}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Insert Image (URL + Alt text)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleInsertYoutube}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Embed YouTube Video"
            >
              <Youtube className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleInsertTable}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Insert Table (3x3 grid)"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Special Elements Dropdown / Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleInsertCallout}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Insert Key Takeaway Callout Box"
            >
              <Sparkles className="w-3.5 h-3.5" /> Callout
            </button>
            <button
              type="button"
              onClick={handleInsertCta}
              className="px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FF941E] hover:bg-orange-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Insert Conversion CTA Box"
            >
              <Megaphone className="w-3.5 h-3.5" /> CTA Box
            </button>
            <button
              type="button"
              onClick={handleInsertFaqBlock}
              className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Insert FAQ Accordion Block"
            >
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* SEO Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setShowSeoSidebar(!showSeoSidebar)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showSeoSidebar
                ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] shadow-md shadow-orange-500/20"
                : "bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            }`}
            title="Toggle Live SEO Writing Assistant & Heading Outline"
          >
            <Compass className="w-3.5 h-3.5" /> SEO Outline
          </button>

          {/* Undo / Redo / Code */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleSourceMode}
              className={`p-1.5 rounded-lg transition-all ${
                isSourceMode
                  ? "bg-[#FF941E] text-[#080F35]"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="Toggle HTML Source Code View"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. WRITING CANVAS + SEO ASSISTANT SPLIT LAYOUT                 */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row flex-grow min-h-0 bg-[#080F35] p-3 sm:p-5 gap-5">
        {/* Left / Center: Clean White Writing Canvas (Notion / Gutenberg Style) */}
        <div className="flex-grow flex flex-col min-w-0">
          <div className="w-full mx-auto max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col transition-all">
            {/* Visual Canvas Subheader Banner */}
            <div className="px-8 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF941E]" /> Visual Writing Canvas (Gutenberg / Notion mode)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {words} words • {readingTime} min read
              </span>
            </div>

            {/* Editor Content Area */}
            <div className="flex-grow relative overflow-y-auto" ref={editorContainerRef}>
              {isSourceMode ? (
                <textarea
                  value={sourceCode}
                  onChange={(e) => {
                    setSourceCode(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="w-full h-[520px] p-8 font-mono text-xs text-emerald-400 bg-slate-950 focus:outline-none resize-y"
                  placeholder="Paste or write raw HTML code here..."
                />
              ) : (
                <EditorContent editor={editor} />
              )}
            </div>
          </div>
        </div>

        {/* Right: SEO Writing Assistance Sidebar */}
        {showSeoSidebar && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4">
            {/* Live Metrics Card */}
            <div className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#FF941E]" /> SEO Writing Metrics
                </h3>
                <span className="text-[11px] font-mono text-slate-400">{words} words</span>
              </div>

              {/* Progress towards 1000 words target */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Target Length (1,000 words)</span>
                  <span className="font-bold text-[#FFD84A]">
                    {Math.min(100, Math.round((words / 1000) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] transition-all duration-300"
                    style={{ width: `${Math.min(100, (words / 1000) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Detailed Counter Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#080F35] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Words</span>
                  <p className="text-lg font-black text-white mt-0.5">{words}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080F35] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Characters</span>
                  <p className="text-lg font-black text-white mt-0.5">{chars}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080F35] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Internal Links</span>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">{internalLinks}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080F35] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">External Links</span>
                  <p className="text-lg font-black text-blue-400 mt-0.5">{externalLinks}</p>
                </div>
              </div>

              {/* Media & Alt Warnings */}
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF941E]" /> Images Embedded
                  </span>
                  <span className="font-bold text-white">{totalImages}</span>
                </div>

                {missingAltCount > 0 ? (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>
                      <strong>{missingAltCount} image(s)</strong> are missing SEO Alt text!
                    </span>
                  </div>
                ) : totalImages > 0 ? (
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All embedded images have Alt text.</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Heading Structure & Live Outline Card */}
            <div className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-[#FF941E]" /> Article Heading Outline
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{outline.length} sections</span>
              </div>

              {/* Heading Counts Summary */}
              <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-[#080F35] border border-white/5 text-center text-xs">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400">H1</span>
                  <p
                    className={`font-black text-sm ${
                      h1Count === 1 ? "text-emerald-400" : h1Count === 0 ? "text-amber-400" : "text-rose-400"
                    }`}
                  >
                    {h1Count}
                  </p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400">H2</span>
                  <p className="font-black text-sm text-[#FFD84A]">{h2Count}</p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400">H3</span>
                  <p className="font-black text-sm text-slate-200">{h3Count}</p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400">H4</span>
                  <p className="font-black text-sm text-slate-400">{h4Count}</p>
                </div>
              </div>

              {h1Count > 1 && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                  ⚠️ Best SEO practice: use only 1 H1 per article.
                </div>
              )}

              {/* Interactive Table of Contents List */}
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {outline.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">
                    Add H2 or H3 headings to populate your article outline automatically.
                  </p>
                ) : (
                  outline.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToHeading(item.text)}
                      className={`w-full text-left p-2 rounded-xl text-xs transition-colors truncate flex items-center gap-2 group hover:bg-white/5 ${
                        item.level === 1
                          ? "font-extrabold text-white pl-2"
                          : item.level === 2
                            ? "font-bold text-[#FFD84A] pl-4"
                            : item.level === 3
                              ? "font-medium text-slate-300 pl-6"
                              : "text-slate-400 pl-8"
                      }`}
                      title={`Jump to: ${item.text}`}
                    >
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-[#FF941E]">
                        H{item.level}
                      </span>
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. MODALS: INSERT LINK & INSERT IMAGE                          */}
      {/* ============================================================== */}
      {/* Link Dialog */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B1437] rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#FF941E]" /> Insert / Edit Hyperlink
            </h3>
            <p className="text-xs text-slate-300">
              Enter an internal URL (e.g. <code>/services/seo-services</code>) or an external web address (e.g. <code>https://example.com</code>).
            </p>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com or /services"
              className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0B1437] rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FF941E]" /> Insert Image
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/src/assets/blog-seo.jpg or https://..."
                  className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Image ALT Text (Critical for SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Chandigarh SEO Campaign Strategy Diagram"
                  className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyImage}
                disabled={!imageUrl.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
