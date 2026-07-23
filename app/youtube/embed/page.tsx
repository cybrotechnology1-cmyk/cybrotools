"use client";

import { useState } from "react";
import { Search, Code, Copy, Check, Eye } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function EmbedGenerator() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [loop, setLoop] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [copied, setCopied] = useState(false);

  const extractVideoId = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGenerate = () => {
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else if (url.length === 11) {
      setVideoId(url);
    } else {
      alert("Invalid YouTube URL or Video ID");
    }
  };

  const getEmbedCode = () => {
    if (!videoId) return "";
    let src = `https://www.youtube.com/embed/${videoId}`;
    const params = [];
    if (autoplay) params.push("autoplay=1");
    if (!controls) params.push("controls=0");
    if (loop) params.push(`loop=1&playlist=${videoId}`);
    if (startTime) {
      const seconds = parseInt(startTime);
      if (!isNaN(seconds)) params.push(`start=${seconds}`);
    }
    if (params.length > 0) {
      src += `?${params.join("&")}`;
    }

    return `<iframe width="560" height="315" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  };

  const copyToClipboard = () => {
    const code = getEmbedCode();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <BannerAd />
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">YouTube Embed Generator</h1>
        <p className="text-gray-500 dark:text-zinc-400">Generate responsive iframe embed codes with custom player configurations.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Paste YouTube Video URL or ID"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          />
          <button 
            onClick={handleGenerate}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" /> Generate
          </button>
        </div>

        {videoId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Player options */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">Customizations</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={autoplay} 
                    onChange={(e) => setAutoplay(e.target.checked)}
                    className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900"
                  />
                  <div>
                    <p className="font-medium text-sm">Autoplay Video</p>
                    <p className="text-xs text-gray-400">Starts playing the video immediately on page load.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={controls} 
                    onChange={(e) => setControls(e.target.checked)}
                    className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900"
                  />
                  <div>
                    <p className="font-medium text-sm">Show Player Controls</p>
                    <p className="text-xs text-gray-400">Displays seek bar, volume control, and play/pause buttons.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={loop} 
                    onChange={(e) => setLoop(e.target.checked)}
                    className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900"
                  />
                  <div>
                    <p className="font-medium text-sm">Loop Video</p>
                    <p className="text-xs text-gray-400">Restarts video automatically when it finishes.</p>
                  </div>
                </label>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Start Time (seconds)</label>
                  <input 
                    type="number" 
                    placeholder="e.g., 30"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Embed code / Preview */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">Output Code</h3>
              
              <div className="relative">
                <textarea 
                  readOnly 
                  value={getEmbedCode()}
                  className="w-full h-32 p-4 pr-12 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-xs focus:outline-none resize-none"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Realtime Video Preview */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" /> Live Player Preview
                </h4>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}${startTime ? `&start=${startTime}` : ""}`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
      <ToolSeoSection toolId="embed" />
    </div>
  );
}
