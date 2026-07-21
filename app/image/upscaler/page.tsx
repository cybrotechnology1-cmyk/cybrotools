"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Download, Sparkles, Sliders, RefreshCw, Layers, ArrowRight, Eye } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { addHistoryLog } from "@/app/lib/history";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function ImageUpscaler() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState<1.5 | 2 | 3 | 4>(2);
  const [engine, setEngine] = useState<"super-res" | "retro" | "smooth" | "ai-upscaler">("super-res");
  const [sharpenAmount, setSharpenAmount] = useState<number>(0.3);
  const [noiseReduction, setNoiseReduction] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [upscaledDimensions, setUpscaledDimensions] = useState({ width: 0, height: 0 });
  
  // Before / After Slider Position (0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDraggingSlider = useRef(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // AI dynamic scripts and loading states
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [scriptsError, setScriptsError] = useState<string | null>(null);
  const [aiProgress, setAiProgress] = useState<number | null>(null);

  // Load AI libraries dynamically
  const loadAiScripts = () => {
    if (scriptsLoaded || scriptsLoading) return;
    setScriptsLoading(true);
    setScriptsError(null);

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    // Sequentially load TensorFlow.js, default-model UMD, and upscaler UMD
    loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js")
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/@upscalerjs/default-model@latest/dist/umd/index.js"))
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/upscaler@latest/dist/browser/umd/upscaler.min.js"))
      .then(() => {
        setScriptsLoaded(true);
        setScriptsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setScriptsError("Failed to load client-side AI library. Please check your internet connection.");
        setScriptsLoading(false);
      });
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setOriginalUrl(url);
        setUpscaledUrl(null);

        const img = new window.Image();
        img.onload = () => {
          setDimensions({ width: img.width, height: img.height });
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Sharpness Convolution Filter
  const sharpenImageData = (ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) => {
    if (amount <= 0) return;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const output = ctx.createImageData(w, h);
    const outData = output.data;

    // Convolution matrix for sharpening:
    // [  0,  -a,   0 ]
    // [ -a, 1+4a, -a ]
    // [  0,  -a,   0 ]
    const a = amount;
    const b = 1 + 4 * a;

    for (let y = 1; y < h - 1; y++) {
      const yOffset = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = (yOffset + x) * 4;
        
        for (let c = 0; c < 3; c++) { // R, G, B channels
          const val = 
            b * data[idx + c] -
            a * data[idx - 4 + c] -
            a * data[idx + 4 + c] -
            a * data[idx - w * 4 + c] -
            a * data[idx + w * 4 + c];
          outData[idx + c] = Math.max(0, Math.min(255, val));
        }
        outData[idx + 3] = data[idx + 3]; // Copy Alpha
      }
    }

    // Keep borders unchanged
    for (let x = 0; x < w; x++) {
      const topIdx = x * 4;
      const bottomIdx = ((h - 1) * w + x) * 4;
      for (let c = 0; c < 4; c++) {
        outData[topIdx + c] = data[topIdx + c];
        outData[bottomIdx + c] = data[bottomIdx + c];
      }
    }
    for (let y = 0; y < h; y++) {
      const leftIdx = y * w * 4;
      const rightIdx = (y * w + w - 1) * 4;
      for (let c = 0; c < 4; c++) {
        outData[leftIdx + c] = data[leftIdx + c];
        outData[rightIdx + c] = data[rightIdx + c];
      }
    }

    ctx.putImageData(output, 0, 0);
  };

  // Noise reduction (Box Blur approximation) helper
  const applyNoiseReduction = (ctx: CanvasRenderingContext2D, w: number, h: number, radius: number) => {
    if (radius <= 0) return;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const output = ctx.createImageData(w, h);
    const outData = output.data;

    const side = radius * 2 + 1;
    const weight = 1 / (side * side);

    for (let y = radius; y < h - radius; y++) {
      for (let x = radius; x < w - radius; x++) {
        let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
        
        for (let ky = -radius; ky <= radius; ky++) {
          const pixelY = y + ky;
          for (let kx = -radius; kx <= radius; kx++) {
            const pixelX = x + kx;
            const idx = (pixelY * w + pixelX) * 4;
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
            aSum += data[idx + 3];
          }
        }
        
        const idx = (y * w + x) * 4;
        outData[idx] = rSum * weight;
        outData[idx + 1] = gSum * weight;
        outData[idx + 2] = bSum * weight;
        outData[idx + 3] = aSum * weight;
      }
    }
    ctx.putImageData(output, 0, 0);
  };

  const processUpscale = () => {
    if (!originalUrl) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (engine === "ai-upscaler") {
        if (!scriptsLoaded) {
          loadAiScripts();
          alert("AI libraries are downloading. Please wait a few seconds for the download to complete and click Enhance again.");
          setIsProcessing(false);
          return;
        }
        
        // @ts-ignore
        if (typeof window.Upscaler === "undefined") {
          setIsProcessing(false);
          alert("AI library failed to initialize correctly. Please refresh the page.");
          return;
        }

        try {
          // Initialize upscaler
          // @ts-ignore
          const upscaler = new window.Upscaler({
            // @ts-ignore
            model: window.DefaultModel
          });

          setAiProgress(0);
          upscaler.upscale(img, {
            patchSize: 64,
            padding: 2,
            progress: (percent: number) => {
              setAiProgress(Math.round(percent * 100));
            }
          }).then((upscaledImageSrc: string) => {
            setUpscaledUrl(upscaledImageSrc);
            
            // Get dimensions of upscaled image
            const upscaledImg = new window.Image();
            upscaledImg.onload = () => {
              setUpscaledDimensions({ width: upscaledImg.width, height: upscaledImg.height });
              setIsProcessing(false);
              setAiProgress(null);
              
              // Save to History Logs
              addHistoryLog(
                "Image Upscaler",
                "AI Upscale",
                `AI Upscaled from ${img.width}x${img.height} to ${upscaledImg.width}x${upscaledImg.height} (using UpscalerJS/TensorFlow.js)`,
                "/image/upscaler"
              );
            };
            upscaledImg.src = upscaledImageSrc;
          }).catch((err: any) => {
            console.error("AI Upscale failed:", err);
            alert("AI Upscaling failed. The image might be too large for browser memory.");
            setIsProcessing(false);
            setAiProgress(null);
          });
        } catch (err) {
          console.error("AI instantiation failed:", err);
          setIsProcessing(false);
          setAiProgress(null);
        }
        return;
      }

      const targetW = Math.round(img.width * scale);
      const targetH = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // 1. Noise Reduction pre-processing if desired
      if (noiseReduction > 0) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          applyNoiseReduction(tempCtx, img.width, img.height, noiseReduction);
          // Draw resampled temp canvas instead
          ctx.drawImage(tempCanvas, 0, 0, img.width, img.height, 0, 0, targetW, targetH);
        }
      } else {
        // Direct draw
        if (engine === "retro") {
          ctx.imageSmoothingEnabled = false;
          // @ts-ignore
          ctx.mozImageSmoothingEnabled = false;
          // @ts-ignore
          ctx.webkitImageSmoothingEnabled = false;
        } else {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        }
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, targetW, targetH);
      }

      // 2. Convolution Sharpen filters
      if (engine === "super-res" && sharpenAmount > 0) {
        sharpenImageData(ctx, targetW, targetH, sharpenAmount);
      }

      const outputDataUrl = canvas.toDataURL("image/png");
      setUpscaledUrl(outputDataUrl);
      setUpscaledDimensions({ width: targetW, height: targetH });
      setIsProcessing(false);

      // Save to History Logs
      addHistoryLog(
        "Image Upscaler",
        "Upscale Image",
        `Upscaled from ${img.width}x${img.height} to ${targetW}x${targetH} (${scale}x, ${engine === "super-res" ? "Super Resolution" : engine === "retro" ? "Retro Pixel" : "Smooth Photograph"})`,
        "/image/upscaler"
      );
    };
    img.src = originalUrl;
  };

  const downloadUpscaled = () => {
    if (!upscaledUrl) return;
    const a = document.createElement("a");
    a.href = upscaledUrl;
    a.download = `cybro-upscaled-${scale}x.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSliderMove = (clientX: number) => {
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSlider.current = true;
    handleSliderMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSlider.current) return;
    handleSliderMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingSlider.current = false;
  };

  const clearImage = () => {
    setOriginalUrl(null);
    setUpscaledUrl(null);
    setDimensions({ width: 0, height: 0 });
    setUpscaledDimensions({ width: 0, height: 0 });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          Offline Image Upscaler & AI Enhancer
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-lg">
          Upscale resolution up to 400% instantly with edge reconstruction, sharpen convolution, and zero server upload costs.
        </p>
      </div>

      {!originalUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
              : "border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
          }`}
        >
          <input {...getInputProps()} />
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto text-blue-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg text-gray-900 dark:text-white">Drag & drop your image here</p>
              <p className="text-sm text-gray-400">or click to browse local files (PNG, JPG, WEBP)</p>
            </div>
            <p className="text-[11px] text-gray-400 bg-gray-50 dark:bg-zinc-950/50 inline-block px-3 py-1.5 rounded-full border border-gray-100 dark:border-zinc-800/60">
              ⚡ Safe Processing: Files never leave your browser sandbox.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-500" /> Enhancement Parameters
                </h3>
                <button onClick={clearImage} className="text-xs text-red-500 hover:underline">
                  Reset
                </button>
              </div>

              {/* Scale Factor */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Scale Multiplier</label>
                  {engine === "ai-upscaler" && (
                    <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                      Locked at 2x for AI
                    </span>
                  )}
                </div>
                {engine === "ai-upscaler" ? (
                  <div className="p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/80 rounded-xl text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-blue-500 shrink-0 animate-pulse" />
                    <span>ESRGAN Deep-Learning neural network upscales your image exactly 2x natively inside your browser.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {([1.5, 2, 3, 4] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setScale(s)}
                        className={`py-2 rounded-xl text-sm font-mono transition-all border ${
                          scale === s
                            ? "bg-gray-900 dark:bg-white text-white dark:text-zinc-900 border-transparent font-bold shadow-sm"
                            : "border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/30"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rescaling Algorithm Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Scaling Engine</label>
                <div className="space-y-2">
                  {[
                    { id: "ai-upscaler", name: "AI Deep-Learning (ESRGAN)", desc: "100% Client-side browser neural network" },
                    { id: "super-res", name: "Super-Resolution (Sharpen)", desc: "Edge reconstruction convolution" },
                    { id: "retro", name: "Retro/Pixel Art", desc: "Nearest-Neighbor crisp rendering" },
                    { id: "smooth", name: "Smooth Photography", desc: "Bilinear gradient preservation" },
                  ].map((engineItem) => (
                    <button
                      key={engineItem.id}
                      onClick={() => {
                        setEngine(engineItem.id as any);
                        if (engineItem.id === "ai-upscaler") {
                          setScale(2);
                          loadAiScripts();
                        }
                      }}
                      className={`w-full p-3.5 text-left rounded-xl border flex flex-col gap-0.5 transition-all ${
                        engine === engineItem.id
                          ? "bg-blue-500/5 border-blue-500/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500"
                          : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/30"
                      }`}
                    >
                      <span className="font-semibold text-sm">{engineItem.name}</span>
                      <span className="text-xs text-gray-400">{engineItem.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Library Status indicator */}
              {engine === "ai-upscaler" && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  {scriptsLoading && (
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                      <div className="text-xs">
                        <p className="font-semibold text-blue-700 dark:text-blue-400">Loading AI Engines...</p>
                        <p className="text-gray-400 mt-0.5">Fetching TensorFlow.js & ESRGAN models securely directly to your browser sandbox.</p>
                      </div>
                    </div>
                  )}
                  {scriptsLoaded && (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div className="text-xs">
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400">AI Model Ready Offline</p>
                        <p className="text-gray-400 mt-0.5">GPU/WASM WebGL acceleration is fully active. Zero server usage or costs.</p>
                      </div>
                    </div>
                  )}
                  {scriptsError && (
                    <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      <div className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        {scriptsError}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sharpen Slider */}
              {engine === "super-res" && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Sharpen Intensity</span>
                    <span className="font-mono text-xs text-blue-500">{Math.round(sharpenAmount * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sharpenAmount}
                    onChange={(e) => setSharpenAmount(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-gray-100 dark:bg-zinc-800 rounded-lg h-2"
                  />
                  <p className="text-[10px] text-gray-400">Controls high-pass edge-convolution intensity.</p>
                </div>
              )}

              {/* Pre-resampling Noise Denoise */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Noise Suppression</span>
                  <span className="font-mono text-xs text-blue-500">{noiseReduction}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={noiseReduction}
                  onChange={(e) => setNoiseReduction(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-gray-100 dark:bg-zinc-800 rounded-lg h-2"
                />
                <p className="text-[10px] text-gray-400">Pre-filters digital noise and compression artifacts.</p>
              </div>

              {/* Action trigger */}
              <button
                onClick={processUpscale}
                disabled={isProcessing || (engine === "ai-upscaler" && scriptsLoading)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {aiProgress !== null ? `AI Enhancing (${aiProgress}%)...` : "Enhancing Resolution..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Enhance Resolution
                  </>
                )}
              </button>
            </div>

            {/* Scale Info Specifications */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
              <h4 className="font-semibold text-sm">Target Resolution Metrics</h4>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Original Sizing</span>
                  <span className="font-mono text-gray-700 dark:text-zinc-300 font-semibold">{dimensions.width} x {dimensions.height} px</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Scale Multiplication</span>
                  <span className="font-mono text-blue-500 font-bold">{scale}x</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-gray-100 dark:border-zinc-800/80 pt-3">
                  <span className="text-gray-400">Output Sizing</span>
                  <span className="font-mono text-emerald-500 font-bold">
                    {Math.round(dimensions.width * scale)} x {Math.round(dimensions.height * scale)} px
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draggable Split Screen stage */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-500" /> Before / After Split-Screen
                </h3>
                {upscaledUrl && (
                  <button
                    onClick={downloadUpscaled}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download Enhanced PNG
                  </button>
                )}
              </div>

              {!upscaledUrl ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="font-semibold text-sm">Awaiting Enhancement</p>
                  <p className="text-xs text-gray-400 mt-1">Configure your parameters and click &quot;Enhance Resolution&quot; to compare results side-by-side.</p>
                </div>
              ) : (
                <div
                  ref={previewContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 select-none bg-gray-900 cursor-ew-resize"
                >
                  {/* Underlay / Background image (Upscaled output) */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
<img
                      src={upscaledUrl}
                      alt="Upscaled View"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                    <div className="absolute bottom-4 right-4 bg-emerald-600/90 text-white backdrop-blur-sm text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm z-10">
                      Enhanced ({upscaledDimensions.width}x{upscaledDimensions.height})
                    </div>
                  </div>

                  {/* Clip Overlay (Original image) */}
                  <div
                    className="absolute inset-0 z-0 bg-gray-950"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
<img
                      src={originalUrl}
                      alt="Original View"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                    <div className="absolute bottom-4 left-4 bg-gray-800/90 text-white backdrop-blur-sm text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm z-10">
                      Original ({dimensions.width}x{dimensions.height})
                    </div>
                  </div>

                  {/* Drag Slider Divider line */}
                  <div
                    onMouseDown={handleMouseDown}
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center z-10 hover:w-1.5 transition-all"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center shadow-md select-none">
                      <div className="flex gap-1">
                        <div className="w-1 h-3 bg-gray-400 dark:bg-zinc-600 rounded-full" />
                        <div className="w-1 h-3 bg-gray-400 dark:bg-zinc-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-center text-gray-400">
                {upscaledUrl && "👈 Drag the slider left and right to compare the difference in visual clarity."}
              </div>
            </div>
          </div>

        </div>
      )}
      <ToolSeoSection toolId="upscaler" />
    </div>
  );
}
