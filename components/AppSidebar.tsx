"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid,
  Wand2, 
  Image as ImageIcon, 
  Youtube, 
  Globe, 
  BookOpen, 
  Menu,
  X,
  Sparkles,
  Sliders,
  Crop,
  Play,
  KeyRound,
  QrCode,
  Palette,
  EyeOff,
  Video
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: <LayoutGrid className="w-4 h-4" /> },
  { name: "Blog", href: "/blog", icon: <BookOpen className="w-4 h-4" /> },
  {
    name: "AI IMAGE TOOLS",
    isHeader: true,
    children: [
      { name: "Background Remover", href: "/ai/bg-remover", icon: <Wand2 className="w-4 h-4" /> },
      { name: "Image Upscaler", href: "/image/upscaler", icon: <Sparkles className="w-4 h-4" /> },
      { name: "AI OCR Reader", href: "/ai/ocr", icon: <EyeOff className="w-4 h-4" /> },
    ],
  },
  {
    name: "IMAGE TOOLS",
    isHeader: true,
    children: [
      { name: "Image Editor", href: "/image/editor", icon: <Sliders className="w-4 h-4" /> },
      { name: "Format Converter", href: "/image/converter", icon: <ImageIcon className="w-4 h-4" /> },
      { name: "Compressor", href: "/image/compressor", icon: <Crop className="w-4 h-4" /> },
      { name: "Image Blur Studio", href: "/image/blur", icon: <Palette className="w-4 h-4" /> },
      { name: "Watermark Adder", href: "/image/watermark", icon: <Sliders className="w-4 h-4" /> },
      { name: "Text on Image", href: "/image/text-on-image", icon: <Sliders className="w-4 h-4" /> },
      { name: "Meme Generator", href: "/image/meme", icon: <Wand2 className="w-4 h-4" /> },
      { name: "Passport Photo Maker", href: "/image/passport", icon: <ImageIcon className="w-4 h-4" /> },
      { name: "ID Photo Maker", href: "/image/id-photo", icon: <ImageIcon className="w-4 h-4" /> },
      { name: "Collage Maker", href: "/image/collage", icon: <LayoutGrid className="w-4 h-4" /> },
      { name: "Image Splitter", href: "/image/splitter", icon: <Crop className="w-4 h-4" /> },
      { name: "Aspect Ratio Converter", href: "/image/aspect-ratio", icon: <Crop className="w-4 h-4" /> },
      { name: "Circular Image Crop", href: "/image/circular-crop", icon: <Crop className="w-4 h-4" /> },
      { name: "Rounded Corner Generator", href: "/image/rounded-corners", icon: <Crop className="w-4 h-4" /> },
    ],
  },
  {
    name: "YOUTUBE TOOLS",
    isHeader: true,
    children: [
      { name: "Thumbnail Downloader", href: "/youtube/thumbnail", icon: <Youtube className="w-4 h-4" /> },
      { name: "Video ID Finder", href: "/youtube/embed", icon: <Play className="w-4 h-4" /> },
      { name: "Channel ID Finder", href: "/youtube/channel", icon: <Youtube className="w-4 h-4" /> },
    ],
  },
  {
    name: "WEB TOOLS",
    isHeader: true,
    children: [
      { name: "QR Code Generator", href: "/web/generators", icon: <QrCode className="w-4 h-4" /> },
      { name: "Password Generator", href: "/web/password", icon: <KeyRound className="w-4 h-4" /> },
      { name: "Color Picker", href: "/web/color-tools", icon: <Palette className="w-4 h-4" /> },
      { name: "More Tools", href: "/web/dev-utils", icon: <Globe className="w-4 h-4" /> },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-zinc-900/90 text-white rounded-xl shadow-lg border border-zinc-800/80 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#080712] border-r border-[#151426] 
        flex flex-col justify-between transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Top Branding Section */}
        <div className="p-6 pb-2">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-purple-500/20 group-hover:border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-all duration-300 bg-[#0c0a21]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
<img
                src="/logo.png"
                alt="Cybro Tools Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-purple-300 transition-colors">
              Cybro Tools
            </span>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 custom-scrollbar">
          {navigation.map((section, idx) => {
            if (section.isHeader) {
              return (
                <div key={idx} className="space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#525166] uppercase">
                    {section.name}
                  </div>
                  <ul className="space-y-[2px]">
                    {section.children?.map((child) => {
                      const isActive = pathname === child.href;
                      return (
                        <li key={child.name}>
                          <Link 
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200
                              ${isActive 
                                ? "bg-gradient-to-r from-[#1E1A5F] to-[#12103E] border border-[#2B2685] text-white shadow-md shadow-purple-500/5" 
                                : "text-[#8e8ca3] hover:text-white hover:bg-white/5"}
                            `}
                          >
                            <span className={`transition-colors ${isActive ? "text-purple-400" : "text-[#525166]"}`}>
                              {child.icon}
                            </span>
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }

            // Simple item without children, like Dashboard
            const isActive = pathname === section.href;
            return (
              <div key={idx} className="space-y-1">
                <Link 
                  href={section.href || "/"}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200
                    ${isActive 
                      ? "bg-[#1E1A5F] border border-[#2B2685] text-white shadow-lg shadow-purple-500/10" 
                      : "text-[#8e8ca3] hover:text-white hover:bg-white/5"}
                  `}
                >
                  <span className={isActive ? "text-purple-400 animate-pulse" : "text-[#525166]"}>
                    {section.icon}
                  </span>
                  <span>{section.name}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Section with Copyright */}
        <div className="p-4 border-t border-[#151426] bg-[#06050e]/80 backdrop-blur-md flex flex-col items-center gap-1.5 justify-center">
          {/* Copyright Note */}
          <span className="text-[10px] font-medium text-[#525166] select-none tracking-tight">
            © 2026 <span className="font-semibold text-gray-300">Cybrotechnology</span>
          </span>
          <a 
            href="mailto:cybrotechnology1@gmail.com" 
            className="text-[9px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            cybrotechnology1@gmail.com
          </a>
        </div>
      </aside>
    </>
  );
}
