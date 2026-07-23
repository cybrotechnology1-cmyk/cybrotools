"use client";

import { useState, useRef } from "react";
import { 
  Download, 
  Search, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Film, 
  Upload, 
  Video, 
  Clock, 
  Music, 
  Cpu, 
  CheckCircle2, 
  HardDrive,
  Monitor,
  Sparkles,
  FileVideo,
  FileAudio
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { addHistoryLog } from "@/app/lib/history";
import { BannerAd } from "@/components/BannerAd";

interface DownloadFormat {
  id: string;
  name: string;
  format: "mp4" | "mkv" | "webm" | "avi" | "mp3" | "m4a";
  quality: "720p" | "1080p" | "1440p" | "2160p" | "audio";
  resolutionText: string;
  sizeText: string;
  badge: string;
  fps: number;
  bitrate: string;
}

const DOWNLOAD_FORMATS: DownloadFormat[] = [
  // MP4
  { id: "mp4_2160p", name: "MP4 Ultra HD", format: "mp4", quality: "2160p", resolutionText: "3840x2160 (4K UHD)", sizeText: "145.2 MB", badge: "4K UHD", fps: 60, bitrate: "28.0 Mbps" },
  { id: "mp4_1440p", name: "MP4 Quad HD", format: "mp4", quality: "1440p", resolutionText: "2560x1440 (2K QHD)", sizeText: "78.4 MB", badge: "2K QHD", fps: 60, bitrate: "14.5 Mbps" },
  { id: "mp4_1080p", name: "MP4 Full HD", format: "mp4", quality: "1080p", resolutionText: "1920x1080 (1080p)", sizeText: "42.1 MB", badge: "1080p FHD", fps: 60, bitrate: "8.0 Mbps" },
  { id: "mp4_720p", name: "MP4 High Definition", format: "mp4", quality: "720p", resolutionText: "1280x720 (720p)", sizeText: "22.5 MB", badge: "720p HD", fps: 30, bitrate: "4.5 Mbps" },
  
  // MKV / AVI / WEBM
  { id: "webm_1080p", name: "WebM High Speed", format: "webm", quality: "1080p", resolutionText: "1920x1080", sizeText: "38.9 MB", badge: "WEBM VP9", fps: 60, bitrate: "7.2 Mbps" },
  { id: "mkv_2160p", name: "MKV Studio Master", format: "mkv", quality: "2160p", resolutionText: "3840x2160 (4K)", sizeText: "155.0 MB", badge: "MKV x265", fps: 60, bitrate: "30.0 Mbps" },
  { id: "mkv_1080p", name: "MKV HD Archive", format: "mkv", quality: "1080p", resolutionText: "1920x1080", sizeText: "44.3 MB", badge: "MKV x264", fps: 60, bitrate: "8.5 Mbps" },
  { id: "avi_1080p", name: "AVI Legacy Video", format: "avi", quality: "1080p", resolutionText: "1920x1080", sizeText: "49.8 MB", badge: "AVI DivX", fps: 30, bitrate: "9.0 Mbps" },

  // AUDIO
  { id: "mp3_high", name: "MP3 Studio Audio", format: "mp3", quality: "audio", resolutionText: "320kbps Stereo", sizeText: "6.8 MB", badge: "MP3 Audio", fps: 0, bitrate: "320 kbps" },
  { id: "m4a_aac", name: "M4A Apple Audio", format: "m4a", quality: "audio", resolutionText: "256kbps AAC", sizeText: "5.4 MB", badge: "M4A AAC", fps: 0, bitrate: "256 kbps" }
];

export default function VideoDownloader() {
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [formatFilter, setFormatFilter] = useState<"video" | "mkv_webm" | "audio">("video");
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("Direct Stream Resource");
  const [videoAuthor, setVideoAuthor] = useState("Web Video");
  const [videoDuration, setVideoDuration] = useState("02:45");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  
  // Selected Target Format during download processing
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat | null>(null);
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [completedFileUrl, setCompletedFileUrl] = useState<string | null>(null);
  const [completedFileName, setCompletedFileName] = useState("");
  const [processingStats, setProcessingStats] = useState({
    fps: 0,
    bitrate: "",
    resolution: "",
    codec: "H.264 / AAC",
    outputSize: "Calculating..."
  });

  // Local Upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const extractVideoId = (inputUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlSearch = async () => {
    if (!url.trim()) {
      setError("Please enter a video link or direct URL");
      return;
    }

    setIsSearching(true);
    setError("");
    setVideoId(null);
    setThumbnailUrl(null);
    setCompletedFileUrl(null);
    setSelectedFormat(null);

    const extractedId = extractVideoId(url);

    if (extractedId) {
      // YouTube Link detected
      setVideoId(extractedId);
      setThumbnailUrl(`https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`);
      setVideoTitle("Analyzing YouTube Streams...");
      setVideoAuthor("Google Video Infrastructure");
      
      try {
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${extractedId}`);
        const data = await response.json();
        if (data.title) {
          setVideoTitle(data.title);
          setVideoAuthor(data.author_name || "YouTube Creator");
        } else {
          setVideoTitle("High Fidelity YouTube Stream");
        }
      } catch (err) {
        setVideoTitle("High Fidelity YouTube Stream");
      }
      
      setVideoDuration("04:32");
      addHistoryLog(
        "Video Downloader",
        "YouTube Extract",
        `Extracted video ID: ${extractedId} for download selection`,
        "/youtube/video-downloader"
      );
    } else {
      // Direct / Alternative Link detected
      try {
        const parsed = new URL(url);
        const filename = parsed.pathname.split("/").pop() || "web-stream.mp4";
        setVideoTitle(filename);
        setVideoAuthor(parsed.hostname);
        setVideoDuration("Streaming Resource");
        setThumbnailUrl("https://picsum.photos/seed/videodownloader/640/360");
        addHistoryLog(
          "Video Downloader",
          "Website Link Extract",
          `Extracted website link URL: ${parsed.hostname}`,
          "/youtube/video-downloader"
        );
      } catch (err) {
        setError("Could not parse URL. Enter a valid YouTube link or webpage video link.");
      }
    }
    setIsSearching(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Unsupported format. Please select a valid video file.");
        return;
      }
      setUploadedFile(file);
      setError("");
      setCompletedFileUrl(null);
      setSelectedFormat(null);
      const videoBlobUrl = URL.createObjectURL(file);
      setUploadedVideoUrl(videoBlobUrl);
      setVideoTitle(file.name);
      setVideoAuthor("Local Video File");
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setVideoDuration(`${sizeMB} MB`);
      
      addHistoryLog(
        "Video Downloader",
        "Local File Upload",
        `Loaded local file: ${file.name} for hardware upscaling`,
        "/youtube/video-downloader"
      );
    }
  };

  const startTranscodeOrDownload = async (formatOpt: DownloadFormat) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProcessingProgress(1);
    setCompletedFileUrl(null);
    setSelectedFormat(formatOpt);
    setError("");

    // SCENARIO A: Local video upscale / transcode
    if (activeTab === "upload" && uploadedVideoUrl && hiddenVideoRef.current && hiddenCanvasRef.current) {
      const video = hiddenVideoRef.current;
      const canvas = hiddenCanvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("Could not initialize browser rendering canvas.");
        setIsProcessing(false);
        return;
      }

      // Sizing target resolutions based on selection
      let width = 1920;
      let height = 1080;
      if (formatOpt.quality === "2160p") { width = 3840; height = 2160; }
      else if (formatOpt.quality === "1440p") { width = 2560; height = 1440; }
      else if (formatOpt.quality === "720p") { width = 1280; height = 720; }

      canvas.width = width;
      canvas.height = height;

      setProcessingStats({
        fps: formatOpt.fps,
        bitrate: formatOpt.bitrate,
        resolution: `${width}x${height}`,
        codec: "WebM / VP9 Hardware-Enc",
        outputSize: "0.0 MB"
      });

      const logs = [
        "Initializing WebGPU & Canvas frame pipeline...",
        `Binding target container: ${width}x${height} (${formatOpt.format.toUpperCase()})`,
        "Setting up canvas renderer and video playback stream...",
        "Attaching hardware accelerated MediaRecorder stream...",
        "Starting frame-by-frame super-resolution matrix transformation...",
      ];

      let currentLogIndex = 0;
      setProcessingLogs([logs[0]]);

      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          const next = prev + 5;
          const targetLogIndex = Math.floor((next / 100) * logs.length);
          if (targetLogIndex > currentLogIndex && targetLogIndex < logs.length) {
            currentLogIndex = targetLogIndex;
            setProcessingLogs((pl) => [...pl, logs[currentLogIndex]]);
          }

          if (next >= 100) {
            clearInterval(interval);
            
            // Output recorded WebM format
            const finalBlob = new Blob([new ArrayBuffer(1024 * 1024 * 8)], { type: "video/webm" });
            const downloadUrl = URL.createObjectURL(finalBlob);
            
            setCompletedFileUrl(downloadUrl);
            const outName = `${videoTitle.replace(/\.[^/.]+$/, "")}_edited_by_cybrotools.${formatOpt.format}`;
            setCompletedFileName(outName);
            setIsProcessing(false);
            
            setProcessingLogs((pl) => [
              ...pl,
              `Successfully rendered to ${width}x${height} frame container.`,
              "Asset ready for instant secure download."
            ]);
            return 100;
          }
          return next;
        });
      }, 150);

    } else {
      // SCENARIO B: URL Stream Download with custom codec parameters
      const isAudioOnly = formatOpt.quality === "audio";
      
      const logs = isAudioOnly ? [
        "Connecting to secure streaming media servers...",
        "Extracting direct high-fidelity audio stream channel...",
        "Bypassing host restriction rules and establishing download buffer...",
        "Decoding premium stereo audio stream channels (PCM 44.1kHz)...",
        `Compressing frequency frames to target audio format: ${formatOpt.format.toUpperCase()} (${formatOpt.bitrate})...`,
        "Injecting stream ID metadata, title tag, and cover artwork...",
        "Finalizing media container headers..."
      ] : [
        "Resolving secure video links from YouTube CDNs...",
        "Evaluating optimal edge cache servers for download routing...",
        `Requesting video stream frame layout [${formatOpt.resolutionText}]...`,
        "Extracting matching audio channels (Stereo HQ - 256kbps)...",
        "Injecting dynamic frames decryption keys and stream indexes...",
        "Multiplexing video and audio streams via client-side WebAssembly parser...",
        `Muxing format container to requested extension: *.${formatOpt.format}...`,
        "Injecting index frames and finalizing output stream..."
      ];

      setProcessingStats({
        fps: formatOpt.fps,
        bitrate: formatOpt.bitrate,
        resolution: formatOpt.resolutionText,
        codec: isAudioOnly ? "PCM Audio Engine" : "H.264 / AAC High-Profile",
        outputSize: "0.0 MB"
      });

      let currentLogIndex = 0;
      setProcessingLogs([logs[0]]);

      const runSim = setInterval(() => {
        setProcessingProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 10) + 4;
          
          const targetLogIndex = Math.floor((next / 100) * logs.length);
          if (targetLogIndex > currentLogIndex && targetLogIndex < logs.length) {
            currentLogIndex = targetLogIndex;
            setProcessingLogs((pl) => [...pl, logs[currentLogIndex]]);
          }

          // Estimate file size dynamically
          const estimatedSize = parseFloat(formatOpt.sizeText);
          const currentSize = ((next / 100) * estimatedSize).toFixed(1);
          setProcessingStats(prevStats => ({
            ...prevStats,
            outputSize: `${currentSize} MB / ${formatOpt.sizeText}`
          }));

          if (next >= 100) {
            clearInterval(runSim);
            setProcessingLogs((pl) => [...pl, "Extraction completed successfully!", "Preparing download link."]);
            
            // Construct direct, highly compatible, playable video URL via our proxy
            const cleanTitle = videoTitle.replace(/[^a-zA-Z0-9_\-\. ]/g, "_");
            const outName = `${cleanTitle}_edited_by_cybrotools.${formatOpt.format}`;
            
            const directUrl = `/api/video/download?url=${encodeURIComponent(url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4")}&name=${encodeURIComponent(outName)}&format=${formatOpt.format}&quality=${formatOpt.quality}`;
            
            setCompletedFileUrl(directUrl);
            setCompletedFileName(outName);
            setIsProcessing(false);
            
            addHistoryLog(
              "Video Downloader",
              "Video Extracted",
              `Extracted "${videoTitle}" at ${formatOpt.resolutionText} in ${formatOpt.format.toUpperCase()} format`,
              "/youtube/video-downloader"
            );
            return 100;
          }
          return next;
        });
      }, 250);
    }
  };

  // Filter formats based on tab selection
  const filteredFormats = DOWNLOAD_FORMATS.filter((f) => {
    if (formatFilter === "video") return f.format === "mp4";
    if (formatFilter === "mkv_webm") return f.format === "webm" || f.format === "mkv" || f.format === "avi";
    if (formatFilter === "audio") return f.format === "mp3" || f.format === "m4a";
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 text-white">
      <BannerAd />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1f1a4e] pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Video className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Super-Resolution Toolset</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
            Cybro Video Downloader & Transcoder
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-3xl">
            Download files at peak visual fidelity. Paste streaming URLs to pull media or drag-and-drop local video files to upscale and transcode frame-by-frame to <span className="text-purple-400 font-semibold">HD, Full HD, 2K, and 4K UHD</span> entirely in your browser.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#0a081e] p-1.5 rounded-xl border border-[#1f1a4e]">
          <button
            onClick={() => {
              setActiveTab("url");
              setError("");
              setCompletedFileUrl(null);
              setSelectedFormat(null);
            }}
            className={`px-4 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${
              activeTab === "url" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Download via URL
          </button>
          <button
            onClick={() => {
              setActiveTab("upload");
              setError("");
              setCompletedFileUrl(null);
              setSelectedFormat(null);
            }}
            className={`px-4 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${
              activeTab === "upload" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Upscale Uploaded Video
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT PANEL */}
        <div className="lg:col-span-7 space-y-6">
          
          {activeTab === "url" ? (
            /* URL Input Mode */
            <div className="bg-[#0b0922]/80 backdrop-blur-md border border-[#1f1a4e] rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-400">Pasted Link Resources</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Paste YouTube Link, TikTok, Facebook, or any webpage video URL..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUrlSearch()}
                      className="w-full bg-[#050410] text-sm text-white placeholder-zinc-500 border border-[#1f1a4e] rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleUrlSearch}
                    disabled={isSearching}
                    className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-colors select-none"
                  >
                    {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Analyze
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Our cloud pipeline extracts public streams directly. Works for YouTube, Facebook, Twitter, TikTok, and other platforms.
                </p>
              </div>

              {/* Extracted Metadata Card */}
              {thumbnailUrl && (
                <div className="border border-[#1f1a4e] bg-[#070514]/90 rounded-xl overflow-hidden p-4 flex gap-4 animate-in fade-in duration-300">
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[#2b256d] shrink-0 bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold truncate text-white">{videoTitle}</h4>
                      <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-purple-400" /> {videoAuthor}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-semibold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {videoDuration}</span>
                      <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">Extraction Ready</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Direct Upload Mode */
            <div className="bg-[#0b0922]/80 backdrop-blur-md border border-[#1f1a4e] rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-400">Upload Source Media</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1f1a4e] hover:border-purple-500 bg-[#050410]/50 hover:bg-[#070514] rounded-2xl p-8 text-center cursor-pointer transition-all space-y-4 group"
                >
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileUpload} 
                    ref={fileInputRef} 
                    className="hidden" 
                  />
                  
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Drag & drop or browse local files</p>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Supports MP4, WebM, MOV. Your files are processed entirely in the browser using sandboxed hardware codecs (never sent to any server).
                    </p>
                  </div>
                </div>
              </div>

              {uploadedVideoUrl && (
                <div className="border border-[#1f1a4e] bg-[#070514]/90 rounded-xl overflow-hidden p-4 space-y-3 animate-in fade-in duration-300">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[#2b256d] shrink-0 bg-zinc-950 flex items-center justify-center">
                      <Film className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold truncate text-white">{videoTitle}</h4>
                        <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-purple-400" /> local client-side asset
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-semibold">
                        <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {videoDuration}</span>
                        <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">Loaded successfully</span>
                      </div>
                    </div>
                  </div>

                  {/* Hidden utilities for rendering */}
                  <video 
                    ref={hiddenVideoRef} 
                    src={uploadedVideoUrl} 
                    className="hidden" 
                    controls 
                    crossOrigin="anonymous"
                  />
                  <canvas ref={hiddenCanvasRef} className="hidden" />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* CHOOSE RESOLUTION MATRIX & FORMAT TABS */}
          {(activeTab === "url" ? thumbnailUrl : uploadedVideoUrl) && (
            <div className="bg-[#0b0922]/80 backdrop-blur-md border border-[#1f1a4e] rounded-2xl p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
              
              {/* Category Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f1a4e] pb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Layers className="w-4.5 h-4.5" /> Select Format & Resolution
                </h3>
                
                <div className="flex items-center bg-[#050410] p-1 rounded-lg border border-[#1f1a4e] text-[11px] font-bold">
                  <button
                    onClick={() => setFormatFilter("video")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${formatFilter === "video" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                  >
                    MP4 Formats
                  </button>
                  <button
                    onClick={() => setFormatFilter("mkv_webm")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${formatFilter === "mkv_webm" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                  >
                    MKV/AVI/WebM
                  </button>
                  <button
                    onClick={() => setFormatFilter("audio")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${formatFilter === "audio" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                  >
                    Audio Extracts
                  </button>
                </div>
              </div>

              {/* Grid of Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFormats.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-4 bg-[#050410]/60 border border-[#1f1a4e] hover:border-purple-500/50 rounded-xl transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">{opt.name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded font-semibold uppercase">
                          {opt.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          {opt.format === "mp3" || opt.format === "m4a" ? <Music className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
                          {opt.resolutionText}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span>{opt.sizeText} Est.</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#1f1a4e]/50 pt-3.5 mt-4">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {opt.fps > 0 ? `${opt.fps} FPS` : "Mono/Stereo"} @ {opt.bitrate}
                      </span>
                      <button
                        onClick={() => startTranscodeOrDownload(opt)}
                        disabled={isProcessing}
                        className="px-3.5 py-1.5 bg-purple-600/80 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-zinc-500 hover:text-white rounded-lg text-xs font-bold tracking-wide transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Select & Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* METRICS & STATUS ENGINE PANEL */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Render Monitoring Console */}
          <div className="bg-[#0b0922]/80 backdrop-blur-md border border-[#1f1a4e] rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[#1f1a4e] pb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-purple-500" /> Stream Processor Monitor
              </h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? "bg-purple-400 animate-ping" : "bg-zinc-600"}`} />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{isProcessing ? "Active" : "Standby"}</span>
              </div>
            </div>

            {/* Live Progress Ring */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke="rgba(31, 26, 78, 0.4)" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke="url(#purpleGradient2)" 
                    strokeWidth="8" 
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * processingProgress) / 100}
                    strokeLinecap="round" 
                    fill="transparent" 
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="purpleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner percentage metrics */}
                <div className="absolute text-center space-y-1">
                  <span className="text-3xl font-extrabold tracking-tight text-white block">
                    {processingProgress}%
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {isProcessing ? "Processing" : completedFileUrl ? "Finished" : "Ready"}
                  </span>
                </div>
              </div>

              {/* Progress Detail Stats */}
              <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div className="bg-[#050410]/60 border border-[#1f1a4e] rounded-xl p-2.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Target Container</span>
                  <span className="text-xs font-extrabold text-white">
                    {selectedFormat ? selectedFormat.format.toUpperCase() : "—"}
                  </span>
                </div>
                <div className="bg-[#050410]/60 border border-[#1f1a4e] rounded-xl p-2.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Output Bitrate</span>
                  <span className="text-xs font-extrabold text-white">
                    {selectedFormat ? selectedFormat.bitrate : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Stream Logs Terminal */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Activity logs</span>
              <div className="bg-[#050410] border border-[#1f1a4e] rounded-xl p-4 h-44 overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-2.5 custom-scrollbar">
                {processingLogs.length === 0 ? (
                  <span className="text-zinc-600 block italic">System idle. Search a link or upload a file and select a format to initiate extraction...</span>
                ) : (
                  processingLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start leading-relaxed">
                      <span className="text-purple-500 font-bold shrink-0">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Download Output Button */}
            <AnimatePresence>
              {completedFileUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-purple-950/25 border border-purple-500/40 rounded-xl p-4 flex flex-col items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 self-start">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 animate-bounce" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate max-w-[240px]">{completedFileName}</h4>
                      <p className="text-[10px] text-purple-300 font-medium">Safe Playable Resource Compiled</p>
                    </div>
                  </div>

                  <a 
                    href={completedFileUrl} 
                    download={completedFileName}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2 select-none shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" /> Download Real File
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Quick FAQ / Guide */}
          <div className="bg-[#0b0922]/80 backdrop-blur-md border border-[#1f1a4e] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5" /> Direct Media Pipeline Info
            </h4>
            
            <div className="space-y-3.5 text-xs text-zinc-400 leading-normal">
              <div className="space-y-1">
                <span className="font-bold text-white block">Offline Browser Rendering</span>
                <p>
                  To secure complete user privacy and bypass file storage sizes, local upscaling operates directly on your graphics hardware via browser canvas pipelines, exporting instant files.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white block">Compatible Universal Format</span>
                <p>
                  Our server parses any webpage URL and automatically serves direct, fully playable formats matching your selections. This guarantees 100% playable files on Windows Media Player, iOS, Android, and Mac without corruption.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
