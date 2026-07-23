"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, Download, Sliders, RefreshCw, Eye, Move, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { addHistoryLog } from "@/app/lib/history";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function ImageBlur() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [blurRadius, setBlurRadius] = useState<number>(20);
  const [blurType, setBlurType] = useState<"full" | "radial" | "linear">("radial");
  const [focusSize, setFocusSize] = useState<number>(35); // Focus zone percentage
  
  // Interactive Focal Point percentages (0 to 100)
  const [focusX, setFocusX] = useState<number>(50);
  const [focusY, setFocusY] = useState<number>(50);
  const [isDraggingFocus, setIsDraggingFocus] = useState(false);

  const [blurredUrl, setBlurredUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setOriginalUrl(url);
        setBlurredUrl(null);

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

  const applyBlurEffect = useCallback(() => {
    if (!originalUrl) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // 1. Create a blurred layer offscreen
      const blurCanvas = document.createElement("canvas");
      blurCanvas.width = img.width;
      blurCanvas.height = img.height;
      const blurCtx = blurCanvas.getContext("2d");
      if (!blurCtx) {
        setIsProcessing(false);
        return;
      }
      
      // Draw standard image and blur
      blurCtx.drawImage(img, 0, 0);
      if (blurRadius > 0) {
        blurCtx.filter = `blur(${blurRadius}px)`;
        blurCtx.drawImage(blurCanvas, 0, 0);
      }

      // Clear main canvas and draw the SHARP original image first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // If full blur, just draw the blurred image on top and finish
      if (blurType === "full") {
        ctx.drawImage(blurCanvas, 0, 0);
      } else if (blurType === "radial") {
        // RADIAL FOCUS MASK (TILT-SHIFT RADIAL)
        // Draw the blurred image on top, masking out the focus point
        ctx.save();
        
        // Define gradient mask
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        const maskCtx = maskCanvas.getContext("2d");
        if (maskCtx) {
          const cx = (focusX / 100) * img.width;
          const cy = (focusY / 100) * img.height;
          // Outer radius where blur is 100% opacity
          const outerR = Math.max(img.width, img.height) * (focusSize / 100);
          const innerR = outerR * 0.4; // Gradient feather starting region

          const grad = maskCtx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
          grad.addColorStop(0, "rgba(0,0,0,0)"); // Inside focus zone: totally transparent (shows sharp underneath)
          grad.addColorStop(0.5, "rgba(0,0,0,0.4)");
          grad.addColorStop(1, "rgba(0,0,0,1)"); // Outside focus zone: fully opaque (renders blurred layer)

          maskCtx.fillStyle = grad;
          maskCtx.fillRect(0, 0, img.width, img.height);

          // Apply mask composition onto main canvas
          ctx.drawImage(blurCanvas, 0, 0);
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(maskCanvas, 0, 0);
        }
        ctx.restore();
      } else if (blurType === "linear") {
        // LINEAR FOCUS MASK (TILT-SHIFT HORIZONTAL BAND)
        ctx.save();
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        const maskCtx = maskCanvas.getContext("2d");
        if (maskCtx) {
          const cy = (focusY / 100) * img.height;
          const focusH = img.height * (focusSize / 100);

          const grad = maskCtx.createLinearGradient(0, 0, 0, img.height);
          // Define a soft horizontal strip
          grad.addColorStop(0, "rgba(0,0,0,1)"); // Blurred top
          grad.addColorStop(Math.max(0, (cy - focusH) / img.height), "rgba(0,0,0,1)");
          grad.addColorStop(Math.max(0, (cy - focusH * 0.4) / img.height), "rgba(0,0,0,0)"); // Focus center transparent
          grad.addColorStop(Math.min(1, (cy + focusH * 0.4) / img.height), "rgba(0,0,0,0)");
          grad.addColorStop(Math.min(1, (cy + focusH) / img.height), "rgba(0,0,0,1)");
          grad.addColorStop(1, "rgba(0,0,0,1)"); // Blurred bottom

          maskCtx.fillStyle = grad;
          maskCtx.fillRect(0, 0, img.width, img.height);

          ctx.drawImage(blurCanvas, 0, 0);
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(maskCanvas, 0, 0);
        }
        ctx.restore();
      }

      setBlurredUrl(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
    img.src = originalUrl;
  }, [originalUrl, blurRadius, blurType, focusSize, focusX, focusY]);

  // Re-run blur logic when parameters change
  useEffect(() => {
    if (originalUrl) {
      const timer = setTimeout(() => {
        applyBlurEffect();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [originalUrl, applyBlurEffect]);

  const handleDownload = () => {
    if (!blurredUrl) return;
    
    // Save to History Logs before triggering download
    addHistoryLog(
      "Image Blur Tool",
      "Apply Blur Effect",
      `Blurred image with ${blurType === "full" ? "Full Gaussian" : blurType === "radial" ? "Radial Tilt-Shift" : "Linear Tilt-Shift"} (Radius: ${blurRadius}px, Focus Size: ${focusSize}%)`,
      "/image/blur"
    );

    const a = document.createElement("a");
    a.href = blurredUrl;
    a.download = `cybro-blurred-${blurType}_edited_by_cybrotools.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (blurType === "full") return;
    setIsDraggingFocus(true);
    updateFocalPoint(e.clientX, e.clientY);
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingFocus) return;
    updateFocalPoint(e.clientX, e.clientY);
  };

  const handleContainerMouseUp = () => {
    setIsDraggingFocus(false);
  };

  const updateFocalPoint = (clientX: number, clientY: number) => {
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setFocusX(Math.max(0, Math.min(100, x)));
    setFocusY(Math.max(0, Math.min(100, y)));
  };

  const clearImage = () => {
    setOriginalUrl(null);
    setBlurredUrl(null);
    setDimensions({ width: 0, height: 0 });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <BannerAd />
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Eye className="w-8 h-8 text-purple-500 animate-pulse" />
          Offline Image Blur & Tilt-Shift Studio
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-lg">
          Add beautiful focal blur, Gaussian depth-of-field, and professional tilt-shift lens effects 100% locally.
        </p>
      </div>

      {!originalUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20"
              : "border-gray-200 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
          }`}
        >
          <input {...getInputProps()} />
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-purple-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto text-purple-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg text-gray-900 dark:text-white">Drag & drop your image here</p>
              <p className="text-sm text-gray-400">or click to browse local files (PNG, JPG, WEBP)</p>
            </div>
            <p className="text-[11px] text-gray-400 bg-gray-50 dark:bg-zinc-950/50 inline-block px-3 py-1.5 rounded-full border border-gray-100 dark:border-zinc-800/60">
              🔒 Private Tool: No files are ever sent to any servers. Runs completely in memory.
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
                  <Sliders className="w-5 h-5 text-purple-500" /> Lens Parameters
                </h3>
                <button onClick={clearImage} className="text-xs text-red-500 hover:underline">
                  Reset
                </button>
              </div>

              {/* Blur Type Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Blur / Focus Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "full", label: "Full Blur" },
                    { id: "radial", label: "Radial Tilt" },
                    { id: "linear", label: "Linear Tilt" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setBlurType(item.id as any)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        blurType === item.id
                          ? "bg-purple-600 border-transparent text-white shadow-sm"
                          : "border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/30"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blur Radius Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Blur Intensity (Radius)</span>
                  <span className="font-mono text-xs text-purple-500">{blurRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-gray-100 dark:bg-zinc-800 rounded-lg h-2"
                />
              </div>

              {/* Focus Sizing Slider */}
              {blurType !== "full" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Focus Diameter (Clear region)</span>
                    <span className="font-mono text-xs text-purple-500">{focusSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="1"
                    value={focusSize}
                    onChange={(e) => setFocusSize(Number(e.target.value))}
                    className="w-full accent-purple-500 bg-gray-100 dark:bg-zinc-800 rounded-lg h-2"
                  />
                  <p className="text-[10px] text-gray-400">Controls the size of the sharp focal zone.</p>
                </div>
              )}

              {/* Focal Point Indicator Coordinates */}
              {blurType !== "full" && (
                <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-medium text-gray-500 block">Focus Coordinates</span>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-gray-400">X Position:</span>{" "}
                      <span className="font-semibold text-gray-700 dark:text-zinc-300">{Math.round(focusX)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Y Position:</span>{" "}
                      <span className="font-semibold text-gray-700 dark:text-zinc-300">{Math.round(focusY)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Trigger */}
              <button
                onClick={handleDownload}
                disabled={isProcessing || !blurredUrl}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Rendering...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Export Blurred Image
                  </>
                )}
              </button>
            </div>

            {/* Tilt Shift Interactive Guide */}
            {blurType !== "full" && (
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 flex gap-3 text-xs text-blue-700 dark:text-blue-300">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Focal Drag Active:</strong> You can click and drag directly on the preview image on the right to position your custom camera focus lens dynamically!
                </p>
              </div>
            )}
          </div>

          {/* Interactive Preview Canvas Window */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-400" /> Dynamic Live Canvas
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  {dimensions.width} x {dimensions.height} px
                </span>
              </div>

              <div
                ref={previewContainerRef}
                onMouseDown={handleContainerMouseDown}
                onMouseMove={handleContainerMouseMove}
                onMouseUp={handleContainerMouseUp}
                onMouseLeave={handleContainerMouseUp}
                className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 select-none bg-gray-900 cursor-crosshair flex items-center justify-center"
              >
                {/* Rendered Blurred Canvas Result or Preview image */}
                {blurredUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blurredUrl}
                      alt="Blurred View"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </>
                ) : (
                  originalUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={originalUrl}
                        alt="Original Pre-Blur View"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </>
                  )
                )}

                {/* Focal Point Indicator Overlay (Visual Ring / Line) */}
                {blurType !== "full" && originalUrl && (
                  <div
                    className="absolute pointer-events-none select-none flex items-center justify-center"
                    style={{
                      left: `${focusX}%`,
                      top: `${focusY}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {blurType === "radial" && (
                      <div
                        className="border-2 border-dashed border-white/60 rounded-full shadow-lg flex items-center justify-center transition-all animate-pulse"
                        style={{
                          width: `${focusSize * 4}px`,
                          height: `${focusSize * 4}px`,
                          backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 border border-white flex items-center justify-center">
                          <Move className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {blurType === "linear" && (
                      <div className="relative flex flex-col items-center justify-center w-[1200px]">
                        <div
                          className="w-full border-t border-b border-dashed border-white/60 shadow-lg transition-all flex items-center justify-center"
                          style={{
                            height: `${focusSize * 4}px`,
                            backgroundColor: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 border border-white flex items-center justify-center">
                            <Move className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {blurType !== "full" && (
                <div className="text-[11px] text-center text-gray-400">
                  👆 Drag the visual target inside the image above to move the focus mask in real-time.
                </div>
              )}
            </div>
          </div>

          {/* Hidden Canvas used for offscreen processing */}
          <canvas ref={canvasRef} className="hidden" />

        </div>
      )}
      <ToolSeoSection toolId="blur" />
    </div>
  );
}
