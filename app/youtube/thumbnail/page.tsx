"use client";

import { useState } from "react";
import { Download, Search, AlertCircle, Eye, RefreshCw, Layers } from "lucide-react";
import Image from "next/image";
import { addHistoryLog } from "@/app/lib/history";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function YouTubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedQuality, setSelectedQuality] = useState<"maxres" | "hq" | "sd" | "mq">("maxres");

  const extractVideoId = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSearch = () => {
    if (!url.trim()) {
      setError("Please enter a valid YouTube URL");
      return;
    }
    const extractedId = extractVideoId(url);
    if (extractedId) {
      setError("");
      setVideoId(extractedId);
      addHistoryLog(
        "YouTube Thumbnail",
        "Extract Thumbnail",
        `Extracted thumbnail from video ID: ${extractedId}`,
        "/youtube/thumbnail"
      );
    } else {
      setError("Could not extract video ID. Please check the URL.");
      setVideoId(null);
    }
  };

  const getThumbnailUrl = (quality: "maxres" | "hq" | "sd" | "mq") => {
    if (!videoId) return "";
    switch (quality) {
      case "maxres": return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case "hq": return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      case "sd": return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
      case "mq": return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
  };

  const downloadImage = async (quality: "maxres" | "hq" | "sd" | "mq") => {
    const targetUrl = getThumbnailUrl(quality);
    if (!targetUrl) return;
    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `youtube-thumbnail-${quality}_edited_by_cybrotools.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      addHistoryLog(
        "YouTube Thumbnail",
        "Download Thumbnail",
        `Downloaded ${quality === "maxres" ? "Ultra HD" : quality === "hq" ? "High Res" : "Standard"} thumbnail for video: ${videoId}`,
        "/youtube/thumbnail"
      );
    } catch (err) {
      console.error("Failed to download image", err);
      window.open(targetUrl, '_blank');
    }
  };

  const qualities = [
    { id: "maxres", label: "HD Maximum Resolution (1080p/720p)", desc: "Best for sharing, printing or desktop backgrounds." },
    { id: "hq", label: "High Quality (480p)", desc: "Standard high resolution format." },
    { id: "sd", label: "Standard Definition (640x480)", desc: "Standard video player sizing." },
    { id: "mq", label: "Medium Quality (320x180)", desc: "Compact resolution optimized for quick loads." },
  ] as const;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <BannerAd />
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">YouTube Thumbnail Studio</h1>
        <p className="text-gray-500 dark:text-zinc-400">Extract, preview, analyze and download multiple qualities of YouTube thumbnails.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-shadow text-sm"
          />
        </div>
        <button 
          onClick={handleSearch}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shrink-0"
        >
          <Search className="w-5 h-5" />
          Extract
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {videoId && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* HD Viewer & Downloader List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Layers className="w-5 h-5" /> Thumbnail Qualities
              </h3>
              
              <div className="space-y-3">
                {qualities.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedQuality(item.id)}
                    className={`w-full p-4 text-left border rounded-xl flex flex-col gap-1 transition-all ${
                      selectedQuality === item.id 
                        ? "bg-gray-50 dark:bg-zinc-800/50 border-gray-900 dark:border-white shadow-sm ring-1 ring-gray-900 dark:ring-white" 
                        : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/20"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-sm capitalize">{item.id === "maxres" ? "Ultra HD" : item.id === "hq" ? "High Res" : item.id === "sd" ? "Standard" : "Medium"}</span>
                      {selectedQuality === item.id && <span className="text-[10px] bg-gray-900 text-white dark:bg-white dark:text-zinc-900 font-bold px-2 py-0.5 rounded-full uppercase">Selected</span>}
                    </div>
                    <span className="text-xs text-gray-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Large Preview & Action Center */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Live Preview
                </h3>
                <button 
                  onClick={() => downloadImage(selectedQuality)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download This Quality
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={getThumbnailUrl(selectedQuality)} 
                  alt="YouTube Thumbnail Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault doesn't exist
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('maxresdefault')) {
                      target.src = target.src.replace('maxresdefault', 'hqdefault');
                      setSelectedQuality("hq");
                    }
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Video ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-700 dark:text-zinc-300 mt-1">{videoId}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Current URL</p>
                  <p className="text-sm font-semibold truncate text-gray-700 dark:text-zinc-300 mt-1">{getThumbnailUrl(selectedQuality)}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
      <ToolSeoSection toolId="thumbnail" />
    </div>
  );
}