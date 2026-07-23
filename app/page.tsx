"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Wand2, 
  Image as ImageIcon, 
  Youtube, 
  KeyRound, 
  Type,
  QrCode,
  Terminal,
  FileText,
  Sliders,
  Code,
  Palette,
  BookOpen,
  Sparkles,
  Rocket,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  PlayCircle,
  ChevronDown,
  EyeOff,
  Crop,
  Play,
  Heart,
  Video,
  Flame,
  Trophy,
  Target,
  CalendarDays,
  CheckCircle2
} from "lucide-react";

const defaultTools = [
  {
    title: "AI Image Tools",
    description: "Browser-based AI models for image manipulation.",
    items: [
      { name: "AI Background Remover", href: "/ai/bg-remover", icon: "Wand2", desc: "Remove background from image without uploading. No uploads, runs in your browser." },
      { name: "AI Image Upscaler", href: "/image/upscaler", icon: "Wand2-blue", desc: "Enhance image resolution without uploading. Upscale to 4K, make HD with AI." },
      { name: "AI OCR Image to Text", href: "/ai/ocr", icon: "Sparkles", desc: "Extract text from image without uploading. Private, runs in your browser." },
    ]
  },
  {
    title: "Image Tools",
    description: "Fast, private image utilities.",
    items: [
      { name: "Image Editor", href: "/image/editor", icon: "Sliders", desc: "Edit, crop, rotate, flip and enhance your images." },
      { name: "Format Converter", href: "/image/converter", icon: "ImageIcon", desc: "Convert images between JPG, PNG, WebP and more." },
      { name: "Compressor", href: "/image/compressor", icon: "Crop-teal", desc: "Compress image file sizes without sacrificing quality." },
      { name: "Image Blur Studio", href: "/image/blur", icon: "Sliders-purple", desc: "Apply artistic blur effects to image backgrounds." },
      { name: "Watermark Adder", href: "/image/watermark", icon: "Sparkles", desc: "Add custom text watermarks to lock your copyright safely." },
      { name: "Text on Image", href: "/image/text-on-image", icon: "Sliders", desc: "Write custom typography captions, offsets, and outlines." },
      { name: "Meme Generator", href: "/image/meme", icon: "Sliders-purple", desc: "Create classic internet memes using standard impact text." },
      { name: "Passport Photo Maker Online", href: "/image/passport", icon: "ImageIcon", desc: "Create passport photo without uploading. Private, runs in your browser." },
      { name: "ID Photo Maker Online", href: "/image/id-photo", icon: "ImageIcon", desc: "Create ID photo without uploading. Private, runs in your browser." },
      { name: "Collage Maker", href: "/image/collage", icon: "Sliders", desc: "Combine multiple pictures into grid collage sheets." },
      { name: "Image Splitter", href: "/image/splitter", icon: "Crop-teal", desc: "Slice photos into grid arrays for social media posts." },
      { name: "Aspect Ratio Converter", href: "/image/aspect-ratio", icon: "Crop-teal", desc: "Fit images into 16:9, 1:1, or 9:16 cover/contain frames." },
      { name: "Circular Image Crop", href: "/image/circular-crop", icon: "Crop-teal", desc: "Crop profile avatars into perfect transparent circles." },
      { name: "Rounded Corner Generator", href: "/image/rounded-corners", icon: "Crop-teal", desc: "Smooth image edges with radius sliders and border lines." },
    ]
  },
  {
    title: "YouTube Tools",
    description: "Extract metadata and thumbnails.",
    items: [
      { name: "YouTube Thumbnail Downloader", href: "/youtube/thumbnail", icon: "Youtube", desc: "Download YouTube thumbnail in HD, 4K, and full resolution. No signup." },
      { name: "YouTube Video ID Finder", href: "/youtube/embed", icon: "Code", desc: "Find YouTube video ID from any URL, Shorts, or youtu.be link." },
      { name: "YouTube Channel ID Finder", href: "/youtube/channel", icon: "Video", desc: "Find YouTube channel ID from any URL, handle, or video link." },
    ]
  },
  {
    title: "Web Tools",
    description: "Developer utilities, styling elements and generators.",
    items: [
      { name: "QR Code Generator", href: "/web/generators", icon: "QrCode", desc: "Generate QR codes for links, text, email and more." },
      { name: "Developer Utilities", href: "/web/dev-utils", icon: "Terminal", desc: "Format, beautify and sanitize development payloads." },
      { name: "Text Utilities", href: "/web/text-utils", icon: "FileText", desc: "Manipulate text casing, spacing, and differences." },
      { name: "Color Picker", href: "/web/color-tools", icon: "Palette", desc: "Sample eye-safe hex/rgb colors with advanced palettes." },
      { name: "Color Converter & WCAG", href: "/web/color-converter", icon: "Palette-indigo", desc: "Validate contrast and convert color formats instantly." },
      { name: "Password Generator", href: "/web/password", icon: "KeyRound", desc: "Generate cryptographically secure, random passwords." },
      { name: "Word Counter", href: "/web/word-counter", icon: "Type", desc: "Analyze reading time, sentences, words and characters." },
    ]
  },
  {
    title: "Cybro Platform Nodes",
    description: "Platform management, guides and diagnostics.",
    items: [
      { name: "Informative Blog", href: "/blog", icon: "BookOpen", desc: "Read premium design guides and browser tech insights." },
    ]
  }
];

// Helper to resolve icon configuration, custom gradients, and shadows per tool
function getToolStyling(iconName: string) {
  switch (iconName) {
    case "Wand2":
      return {
        icon: <Wand2 className="w-5 h-5 text-white" />,
        gradient: "from-[#9C27B0] to-[#E040FB]",
        glow: "shadow-purple-500/30",
        border: "border-purple-500/20",
        textGlow: "group-hover:text-purple-400"
      };
    case "Wand2-blue":
      return {
        icon: <Wand2 className="w-5 h-5 text-white" />,
        gradient: "from-[#0288D1] to-[#26C6DA]",
        glow: "shadow-blue-500/30",
        border: "border-blue-500/20",
        textGlow: "group-hover:text-blue-400"
      };
    case "Sparkles":
      return {
        icon: <Sparkles className="w-5 h-5 text-white animate-pulse" />,
        gradient: "from-[#3F51B5] to-[#7986CB]",
        glow: "shadow-indigo-500/30",
        border: "border-indigo-500/20",
        textGlow: "group-hover:text-indigo-400"
      };
    case "Sliders":
      return {
        icon: <Sliders className="w-5 h-5 text-white" />,
        gradient: "from-[#2E7D32] to-[#66BB6A]",
        glow: "shadow-emerald-500/30",
        border: "border-emerald-500/20",
        textGlow: "group-hover:text-emerald-400"
      };
    case "Sliders-purple":
      return {
        icon: <Sliders className="w-5 h-5 text-white" />,
        gradient: "from-[#7B1FA2] to-[#BA68C8]",
        glow: "shadow-purple-500/30",
        border: "border-purple-500/20",
        textGlow: "group-hover:text-purple-400"
      };
    case "ImageIcon":
      return {
        icon: <ImageIcon className="w-5 h-5 text-white" />,
        gradient: "from-[#E64A19] to-[#FF8A65]",
        glow: "shadow-orange-500/30",
        border: "border-orange-500/20",
        textGlow: "group-hover:text-orange-400"
      };
    case "Crop-teal":
      return {
        icon: <Crop className="w-5 h-5 text-white" />,
        gradient: "from-[#00796B] to-[#4DB6AC]",
        glow: "shadow-teal-500/30",
        border: "border-teal-500/20",
        textGlow: "group-hover:text-teal-400"
      };
    case "Youtube":
      return {
        icon: <Youtube className="w-5 h-5 text-white" />,
        gradient: "from-[#D32F2F] to-[#E57373]",
        glow: "shadow-red-500/30",
        border: "border-red-500/20",
        textGlow: "group-hover:text-red-400"
      };
    case "Video":
      return {
        icon: <Video className="w-5 h-5 text-white" />,
        gradient: "from-[#6A1B9A] to-[#8E24AA]",
        glow: "shadow-purple-500/30",
        border: "border-purple-500/20",
        textGlow: "group-hover:text-purple-400"
      };
    case "Code":
      return {
        icon: <Code className="w-5 h-5 text-white" />,
        gradient: "from-[#C2185B] to-[#F06292]",
        glow: "shadow-pink-500/30",
        border: "border-pink-500/20",
        textGlow: "group-hover:text-pink-400"
      };
    case "QrCode":
      return {
        icon: <QrCode className="w-5 h-5 text-white" />,
        gradient: "from-[#0D47A1] to-[#42A5F5]",
        glow: "shadow-blue-600/30",
        border: "border-blue-600/20",
        textGlow: "group-hover:text-blue-400"
      };
    case "Terminal":
      return {
        icon: <Terminal className="w-5 h-5 text-white" />,
        gradient: "from-[#455A64] to-[#90A4AE]",
        glow: "shadow-slate-500/30",
        border: "border-slate-500/20",
        textGlow: "group-hover:text-slate-300"
      };
    case "FileText":
      return {
        icon: <FileText className="w-5 h-5 text-white" />,
        gradient: "from-[#1565C0] to-[#64B5F6]",
        glow: "shadow-[#1565C0]/30",
        border: "border-blue-500/20",
        textGlow: "group-hover:text-blue-400"
      };
    case "Palette":
      return {
        icon: <Palette className="w-5 h-5 text-white" />,
        gradient: "from-[#512DA8] to-[#9575CD]",
        glow: "shadow-deep-purple-500/30",
        border: "border-deep-purple-500/20",
        textGlow: "group-hover:text-purple-400"
      };
    case "Palette-indigo":
      return {
        icon: <Palette className="w-5 h-5 text-white" />,
        gradient: "from-[#303F9F] to-[#7986CB]",
        glow: "shadow-indigo-500/30",
        border: "border-indigo-500/20",
        textGlow: "group-hover:text-indigo-400"
      };
    case "KeyRound":
      return {
        icon: <KeyRound className="w-5 h-5 text-white" />,
        gradient: "from-[#F57C00] to-[#FFB74D]",
        glow: "shadow-amber-500/30",
        border: "border-amber-500/20",
        textGlow: "group-hover:text-amber-400"
      };
    case "Type":
      return {
        icon: <Type className="w-5 h-5 text-white" />,
        gradient: "from-[#0097A7] to-[#4DD0E1]",
        glow: "shadow-cyan-500/30",
        border: "border-cyan-500/20",
        textGlow: "group-hover:text-cyan-400"
      };
    case "BookOpen":
      return {
        icon: <BookOpen className="w-5 h-5 text-white" />,
        gradient: "from-[#5D4037] to-[#A1887F]",
        glow: "shadow-brown-500/30",
        border: "border-brown-500/20",
        textGlow: "group-hover:text-[#A1887F]"
      };
    default:
      return {
        icon: <Sliders className="w-5 h-5 text-white" />,
        gradient: "from-[#1E1A5F] to-[#2B2685]",
        glow: "shadow-indigo-500/30",
        border: "border-indigo-500/20",
        textGlow: "group-hover:text-indigo-400"
      };
  }
}

const CATEGORY_CHIPS = [
  { label: "All Tools", value: "all" },
  { label: "AI Image", value: "AI Image Tools" },
  { label: "Image Tools", value: "Image Tools" },
  { label: "YouTube Tools", value: "YouTube Tools" },
  { label: "Web Tools", value: "Web Tools" },
  { label: "Popular", value: "popular" }
];

function DashboardInterior() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Cybro Tools",
    siteDescription: "A collection of powerful utilities running entirely in your browser. Fast, secure, and private."
  });
  const [activeTools, setActiveTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "az" | "za">("default");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Daily Engagement & Streak Algorithm (Saves to localStorage via Lazy Initial State to prevent cascading render warnings)
  const [checkedInToday, setCheckedInToday] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const todayStr = new Date().toISOString().split("T")[0];
    const lastCheck = localStorage.getItem("cybro_streak_last_check") || "";
    return lastCheck === todayStr;
  });

  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const lastCheck = localStorage.getItem("cybro_streak_last_check") || "";
    const streakCount = parseInt(localStorage.getItem("cybro_streak_count") || "0", 10);
    if (lastCheck === todayStr || lastCheck === yesterdayStr) {
      return streakCount;
    }
    return 0; // Streak broken
  });

  const [longestStreak, setLongestStreak] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("cybro_streak_longest") || "0", 10);
  });

  const [points, setPoints] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("cybro_streak_points") || "0", 10);
  });

  const [quests, setQuests] = useState<Array<{ id: string, text: string, completed: boolean, route: string }>>(() => {
    if (typeof window === "undefined") return [];
    const todayStr = new Date().toISOString().split("T")[0];
    const storedQuestsDate = localStorage.getItem("cybro_quests_date") || "";
    const storedQuestsJson = localStorage.getItem("cybro_quests_list") || "";

    const questPool = [
      { id: "bg", text: "Remove the background of an image using AI Remover", route: "/ai/bg-remover" },
      { id: "upscale", text: "Enhance and double the dimensions of an image via AI Upscaler", route: "/image/upscaler" },
      { id: "thumbnail", text: "Fetch and download a YouTube HD Video Thumbnail", route: "/youtube/thumbnail" },
      { id: "channel", text: "Extract a UC-style channel key via YouTube Channel ID Finder", route: "/youtube/channel" },
      { id: "password", text: "Generate a custom 16-character secure development password", route: "/web/password" },
      { id: "color", text: "Analyze a color palette for WCAG contrast compliance", route: "/web/color-converter" },
      { id: "format", text: "Convert any picture to a modern WebP format", route: "/image/converter" },
      { id: "compress", text: "Compress a heavy file size to optimized speed weights", route: "/image/compressor" },
      { id: "word", text: "Analyze sentences and reading times in the Word Counter", route: "/web/word-counter" },
      { id: "watermark", text: "Add an artistic watermark text to secure a creative file", route: "/image/watermark" }
    ];

    if (storedQuestsDate === todayStr && storedQuestsJson) {
      try {
        return JSON.parse(storedQuestsJson);
      } catch (e) {
        // Fallback below
      }
    }

    // Select 3 unique random quests based on todayStr seed to keep them synchronized daily for the user
    const dateNum = todayStr.split("-").reduce((acc, part) => acc + parseInt(part, 10), 0);
    const selected: Array<{ id: string, text: string, completed: boolean, route: string }> = [];
    const poolCopy = [...questPool];
    
    for (let i = 0; i < 3; i++) {
      const idx = Math.abs((dateNum + i * 7)) % poolCopy.length;
      const item = poolCopy.splice(idx, 1)[0];
      selected.push({ ...item, completed: false });
    }

    localStorage.setItem("cybro_quests_date", todayStr);
    localStorage.setItem("cybro_quests_list", JSON.stringify(selected));
    return selected;
  });

  useEffect(() => {
    // Fetch site configurations
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSiteSettings({
            siteName: data.settings.siteName,
            siteDescription: data.settings.siteDescription
          });
        }
      })
      .catch(() => {});

    // Fetch dynamic enabled status of tools
    fetch("/api/tools")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActiveTools(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCheckIn = () => {
    if (checkedInToday) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    const lastCheck = localStorage.getItem("cybro_streak_last_check") || "";
    let newStreak = currentStreak;

    if (lastCheck === yesterdayStr) {
      newStreak += 1;
    } else if (lastCheck === "") {
      newStreak = 1;
    } else if (lastCheck !== todayStr) {
      newStreak = 1; // streak reset
    }

    const newLongest = Math.max(longestStreak, newStreak);
    const newPoints = points + 150; // check-in reward

    setCheckedInToday(true);
    setCurrentStreak(newStreak);
    setLongestStreak(newLongest);
    setPoints(newPoints);

    localStorage.setItem("cybro_streak_last_check", todayStr);
    localStorage.setItem("cybro_streak_count", newStreak.toString());
    localStorage.setItem("cybro_streak_longest", newLongest.toString());
    localStorage.setItem("cybro_streak_points", newPoints.toString());
  };

  const handleCompleteQuest = (id: string) => {
    const updated = quests.map(q => {
      if (q.id === id && !q.completed) {
        // Award points on completion
        const bonus = 100;
        const newPoints = points + bonus;
        setPoints(newPoints);
        localStorage.setItem("cybro_streak_points", newPoints.toString());
        return { ...q, completed: true };
      }
      return q;
    });

    setQuests(updated);
    localStorage.setItem("cybro_quests_list", JSON.stringify(updated));
  };

  // Map sections, evaluate DB configurations and flatten to tools array
  const processedTools = useMemo(() => {
    return defaultTools.flatMap(section => {
      return section.items.filter(item => {
        // Evaluate dynamic status
        if (activeTools.length === 0) return true;
        const dbTool = activeTools.find(t => t.href === item.href);
        return dbTool ? dbTool.enabled : true;
      }).map(item => {
        const dbTool = activeTools.find(t => t.href === item.href);
        return {
          ...item,
          name: dbTool ? dbTool.name : item.name,
          category: section.title
        };
      });
    });
  }, [activeTools]);

  // Apply tab filtering and search queries
  const filteredTools = useMemo(() => {
    let result = [...processedTools];

    // 1. Tab filter
    if (activeTab === "popular") {
      // Curate specific popular nodes
      const popularHrefs = [
        "/ai/bg-remover",
        "/image/upscaler",
        "/image/editor",
        "/image/converter",
        "/youtube/thumbnail",
        "/web/generators"
      ];
      result = result.filter(t => popularHrefs.includes(t.href));
    } else if (activeTab !== "all") {
      result = result.filter(t => t.category === activeTab);
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    if (sortBy === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [processedTools, activeTab, searchQuery, sortBy]);

  return (
    <div className="p-4 md:p-8 space-y-8 select-none max-w-7xl mx-auto">
      {/* Dynamic inline styles for 3D layout perspective and premium motion */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateY(-18deg) rotateX(12deg) rotateZ(-4deg); }
          50% { transform: translateY(-10px) rotateY(-18deg) rotateX(12deg) rotateZ(-4deg); }
        }
        @keyframes orbit-pink {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes orbit-blue {
          0% { transform: rotate(360deg) scale(1.05); }
          50% { transform: rotate(180deg) scale(0.95); }
          100% { transform: rotate(0deg) scale(1.05); }
        }
        .animate-float {
          animation: float 5.5s ease-in-out infinite;
        }
        .animate-orbit-pink {
          animation: orbit-pink 12s linear infinite;
        }
        .animate-orbit-blue {
          animation: orbit-blue 16s linear infinite;
        }
      `}</style>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0a25] via-[#09081e] to-[#04030d] border border-[#1d1b3d] shadow-2xl p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Soft neon background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none" />

        {/* Hero Left Content */}
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left max-w-xl">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121124] border border-[#232145] text-xs font-bold text-white tracking-wide">
              <span className="text-yellow-400">🔒</span> 100% Local & Private
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
<img src="/logo.png" alt="Cybro Brand Icon" className="w-4 h-4 rounded-md object-cover" referrerPolicy="no-referrer" />
              <span>Cybro Brand Active</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Private <br className="hidden md:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-[#a855f7] to-blue-400 animate-pulse-glow">
                AI Tools
              </span>{" "}
              That Run Locally
            </h1>
            <p className="text-sm md:text-base text-[#8e8ca3] leading-relaxed font-medium">
              No uploads. No servers. No privacy risk. <br />
              All tools run 100% in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => {
                const element = document.getElementById("tools-directory");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#7B1FA2] to-[#1A237E] hover:from-[#8E24AA] hover:to-[#283593] text-white text-sm font-bold shadow-lg shadow-purple-500/15 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Explore Tools <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                alert("Welcome to Cybro! Our suite executes 100% offline using your machine browser's CPU/GPU, guarding full privacy.");
              }}
              className="inline-flex items-center gap-2.5 py-3 px-5 rounded-xl bg-[#0c0a21]/95 border border-[#1f1a4e] text-white hover:bg-[#151236] text-sm font-semibold transition-all hover:scale-[1.03]"
            >
              <PlayCircle className="w-4.5 h-4.5 text-blue-400" /> How It Works
            </button>
          </div>
        </div>

        {/* Hero Right Visual: 3D Isometric Glassmorphic App Tablet with orbital glowing paths */}
        <div className="relative flex items-center justify-center w-full lg:w-[420px] h-64 md:h-80 z-10 shrink-0">
          
          {/* Neon orbital circles */}
          <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border border-purple-500/25 animate-orbit-pink [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          <div className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full border border-blue-500/20 animate-orbit-blue [mask-image:linear-gradient(to_top,white,transparent)]" />

          {/* Glowing orbital nodes */}
          <div className="absolute w-3 h-3 bg-pink-500 rounded-full blur-[2px] animate-ping" style={{ transform: "rotate(45deg) translate(140px)" }} />
          <div className="absolute w-2.5 h-2.5 bg-blue-400 rounded-full blur-[1px]" style={{ transform: "rotate(210deg) translate(160px)" }} />

          {/* Floating glassmorphic panel */}
          <div className="w-72 md:w-80 h-44 md:h-48 rounded-3xl bg-zinc-950/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10 flex items-center justify-center p-6 animate-float perspective-[1000px] rotate-y-[-18deg] rotate-x-[12deg] rotate-z-[-4deg]">
            
            {/* Grid of 4 glowing UI mini-cards */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600/25 to-purple-800/10 border border-purple-500/30 flex flex-col items-center justify-center text-center gap-1.5 shadow-md shadow-purple-500/10">
                <Wand2 className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white">AI Magic</span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600/25 to-blue-800/10 border border-blue-500/30 flex flex-col items-center justify-center text-center gap-1.5 shadow-md shadow-blue-500/10">
                <Crop className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-bold text-white">Editor</span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600/25 to-red-800/10 border border-red-500/30 flex flex-col items-center justify-center text-center gap-1.5 shadow-md shadow-red-500/10">
                <Youtube className="w-5 h-5 text-red-400" />
                <span className="text-[10px] font-bold text-white">YouTube</span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600/25 to-emerald-800/10 border border-emerald-500/30 flex flex-col items-center justify-center text-center gap-1.5 shadow-md shadow-emerald-500/10">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-bold text-white">Web Tools</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Metrics Row Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0c0a21]/50 border border-[#1f1a4e] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3.5 px-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">30+</div>
            <div className="text-[11px] text-[#8e8ca3] font-medium uppercase tracking-wider">Powerful Tools</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 px-3 py-1 border-l border-zinc-800/40 max-lg:border-l-0">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">100%</div>
            <div className="text-[11px] text-[#8e8ca3] font-medium uppercase tracking-wider">Private & Secure</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 px-3 py-1 border-l border-zinc-800/40">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">Super Fast</div>
            <div className="text-[11px] text-[#8e8ca3] font-medium uppercase tracking-wider">Instant Processing</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 px-3 py-1 border-l border-zinc-800/40">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">100%</div>
            <div className="text-[11px] text-[#8e8ca3] font-medium uppercase tracking-wider">Client-Side Processing</div>
          </div>
        </div>
      </div>

      {/* Daily Check-In & Creator Streak Engagement Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-[#0c0a25] to-[#04030d] border border-[#1f1a4e] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle accent light */}
        <div className="absolute -right-24 -bottom-24 w-60 h-60 bg-purple-600/10 rounded-full filter blur-[80px] pointer-events-none" />
        
        {/* Left Side: Streak Status & Check-In */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-500/10 text-xs font-bold text-purple-300">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              Daily Active Creator Streak
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Keep Your Creator Streak Alive!</h2>
            <p className="text-xs text-[#8e8ca3] leading-relaxed">
              Visit daily, claim your check-in bonuses, and complete tasks to rank higher in the platform algorithms. Real consistency builds real power!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#121124]/60 border border-[#232145] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#525166]">Streak 🔥</span>
              <p className="text-lg font-black text-white">{currentStreak} Days</p>
            </div>
            <div className="p-3 rounded-xl bg-[#121124]/60 border border-[#232145] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#525166]">Best Streak 🏆</span>
              <p className="text-lg font-black text-amber-400">{longestStreak} Days</p>
            </div>
            <div className="p-3 rounded-xl bg-[#121124]/60 border border-[#232145] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#525166]">Creator Pts 💎</span>
              <p className="text-lg font-black text-purple-400">{points}</p>
            </div>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={checkedInToday}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              checkedInToday
                ? "bg-[#121124] text-[#525166] border border-[#232145] cursor-default"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-purple-600/10 hover:shadow-purple-600/20"
            }`}
          >
            <CalendarDays className="w-4 h-4 text-purple-300" />
            {checkedInToday ? "Checked In For Today! Come back tomorrow" : "Claim Today's Check-In Bonus (+150 pts)"}
          </button>
        </div>

        {/* Right Side: Daily Creator Quests */}
        <div className="space-y-4 border-l border-zinc-800/40 pl-0 md:pl-6 max-md:border-l-0 max-md:pt-4 max-md:border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-400" />
                Daily Creator Quests
              </h3>
              <p className="text-[11px] text-[#8e8ca3]">Complete to earn extra points and level up</p>
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/15">
              {quests.filter(q => q.completed).length}/3 Done
            </span>
          </div>

          <div className="space-y-3">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  quest.completed 
                    ? "bg-emerald-500/5 border-emerald-500/15" 
                    : "bg-[#121124]/30 border-[#1f1a4e] hover:border-purple-500/20"
                }`}
              >
                <div className="space-y-1 max-w-[70%]">
                  <p className={`text-xs font-semibold leading-relaxed ${quest.completed ? "text-gray-400 line-through" : "text-gray-200"}`}>
                    {quest.text}
                  </p>
                  <Link 
                    href={quest.route} 
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    Launch Tool &rarr;
                  </Link>
                </div>

                <button
                  onClick={() => handleCompleteQuest(quest.id)}
                  disabled={quest.completed}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    quest.completed
                      ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                      : "bg-[#121124] text-purple-300 border border-purple-500/20 hover:bg-purple-500/10"
                  }`}
                >
                  {quest.completed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      +100 pts
                    </>
                  ) : (
                    "Complete"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Filters & Sort Header */}
      <div id="tools-directory" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-[#151426]">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {CATEGORY_CHIPS.map(chip => {
            const isActive = activeTab === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => setActiveTab(chip.value)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? "bg-[#1E1A5F] border border-[#2B2685] text-white shadow-lg shadow-purple-500/5" 
                    : "bg-[#0c0a21]/30 hover:bg-white/5 text-[#8e8ca3] hover:text-white border border-[#1f1a4e]"}
                `}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Sort Options */}
        <div className="relative w-full md:w-auto self-end md:self-auto">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center justify-between gap-2.5 px-4 py-2 w-full md:w-40 rounded-xl bg-[#0c0a21]/30 border border-[#1f1a4e] text-xs font-semibold text-[#8e8ca3] hover:text-white transition-all cursor-pointer"
          >
            <span>Sort: {sortBy === "default" ? "Standard" : sortBy === "az" ? "Name A-Z" : "Name Z-A"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? "rotate-180" : ""}`} />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0c0a21] border border-[#1f1a4e] shadow-2xl overflow-hidden z-40 animate-fade-in">
              <button
                onClick={() => { setSortBy("default"); setShowSortDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-[#8e8ca3] hover:text-white hover:bg-white/5 transition-colors"
              >
                Standard Order
              </button>
              <button
                onClick={() => { setSortBy("az"); setShowSortDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-[#8e8ca3] hover:text-white hover:bg-white/5 transition-colors"
              >
                Alphabetical (A-Z)
              </button>
              <button
                onClick={() => { setSortBy("za"); setShowSortDropdown(false); }}
                className="w-full text-left px-4 py-2 text-xs text-[#8e8ca3] hover:text-white hover:bg-white/5 transition-colors"
              >
                Reverse (Z-A)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Custom Styled Tool Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Syncing database nodes...</span>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#1f1a4e] rounded-2xl bg-[#0c0a21]/10">
          <p className="text-[#8e8ca3] text-sm">No tool components match your active search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map((tool) => {
            const style = getToolStyling(tool.icon);
            return (
              <Link 
                key={tool.href} 
                href={tool.href}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0c0a21]/60 dark:bg-[#0c0a21]/30 hover:bg-[#0c0a21]/90 border border-gray-200 dark:border-[#1d1b3d] hover:border-purple-500/40 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Background glow node on card hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    {/* Glow themed icon badge */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg ${style.glow} transition-transform group-hover:scale-105`}>
                      {style.icon}
                    </div>

                    {/* Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-[#9C27B0] dark:text-purple-300 bg-purple-500/10 border border-purple-500/15 tracking-wider uppercase">
                      New
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`font-bold text-sm text-gray-900 dark:text-gray-100 transition-colors ${style.textGlow}`}>
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-[#8e8ca3] leading-relaxed line-clamp-2">
                      {tool.desc || "Interactive browser utility node."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-white group-hover:text-purple-400 transition-colors border-t border-gray-100 dark:border-[#151426] mt-4 relative z-10">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Aesthetic credit line complying with Architectural Honesty and Anti-AI-Slop */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#525166] font-medium pt-2 select-none">
        <span>Made with</span> <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> <span>entirely in-browser for complete privacy</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-400 animate-pulse font-medium">Initializing Cybro platform components...</span>
      </div>
    }>
      <DashboardInterior />
    </Suspense>
  );
}
