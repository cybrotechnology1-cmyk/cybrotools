"use client";

import { useState } from "react";
import { Search, Copy, Check, Youtube, Info, AlertCircle, RefreshCw } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function ChannelIdFinder() {
  const [url, setUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFind = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube Channel URL, Handle, or Video Link.");
      setChannelId("");
      return;
    }

    setLoading(true);
    setError("");
    setChannelId("");

    try {
      const res = await fetch("/api/youtube/channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to find Channel ID");
      }

      setChannelId(data.channelId);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!channelId) return;
    navigator.clipboard.writeText(channelId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <BannerAd />
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Youtube className="w-7 h-7 text-red-500" /> YouTube Channel ID Finder
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">
          Extract the unique 24-character YouTube Channel ID instantly using a channel URL, custom handle, or video link.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="e.g. https://youtube.com/@mrbeast or UCxxx"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 text-gray-900 dark:text-gray-100"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFind();
            }}
          />
          <button 
            onClick={handleFind}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white disabled:bg-purple-700 disabled:opacity-75 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Resolving...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" /> Find Channel ID
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {channelId && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-4">
              <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400 flex items-center gap-2">
                Extraction Successful
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3 text-sm font-semibold text-gray-500 dark:text-zinc-400">
                  Channel ID:
                </div>
                <div className="md:col-span-9 flex items-center gap-3">
                  <div className="flex-1 p-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold text-gray-900 dark:text-white overflow-x-auto select-all">
                    {channelId}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-purple-500 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm shrink-0 cursor-pointer"
                    title="Copy Channel ID"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500 dark:text-zinc-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/80 rounded-xl space-y-1.5">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Example RSS Feed URL</h4>
                <div className="font-mono text-xs text-gray-500 dark:text-zinc-400 break-all select-all bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-gray-200/50 dark:border-zinc-800">
                  https://www.youtube.com/feeds/videos.xml?channel_id={channelId}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/80 rounded-xl space-y-1.5">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">YouTube API Resource Link</h4>
                <div className="font-mono text-xs text-gray-500 dark:text-zinc-400 break-all select-all bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-gray-200/50 dark:border-zinc-800">
                  https://www.googleapis.com/youtube/v3/channels?id={channelId}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border border-blue-500/10 dark:border-blue-500/20 bg-blue-500/5 rounded-2xl flex items-start gap-3.5 text-xs text-gray-500 dark:text-zinc-400">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-bold text-gray-900 dark:text-zinc-300">Supported Formats:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>YouTube user handle urls (e.g. <code className="font-mono font-bold">@mrbeast</code> or <code className="font-mono font-bold">https://youtube.com/@mrbeast</code>)</li>
              <li>Standard channel link paths (e.g. <code className="font-mono font-bold">https://youtube.com/channel/UCxxx</code>)</li>
              <li>Legacy usernames or custom names (e.g. <code className="font-mono font-bold">https://youtube.com/c/creatorname</code> or <code className="font-mono font-bold">https://youtube.com/user/creatorname</code>)</li>
              <li>Or directly paste the 24-character channel ID starting with <code className="font-mono font-bold text-purple-500">UC</code>.</li>
            </ul>
          </div>
        </div>
      </div>

      <ToolSeoSection toolId="channel-id" />
    </div>
  );
}
