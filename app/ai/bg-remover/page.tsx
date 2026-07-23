"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Eye, 
  Palette, 
  Sliders, 
  Upload, 
  Check 
} from "lucide-react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { addHistoryLog } from "@/app/lib/history";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

type UIState = "idle" | "loading_model" | "processing" | "success" | "error";

export default function Home() {
  const [uiState, setUiState] = useState<UIState>("idle");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("briaai/RMBG-1.4");
  
  // Storage for real-time compositing
  const [rawPixels, setRawPixels] = useState<Uint8ClampedArray | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [originalImgElement, setOriginalImgElement] = useState<HTMLImageElement | null>(null);

  // Background and Edge controls
  const [bgMode, setBgMode] = useState<"transparent" | "color" | "gradient" | "image" | "blur">("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgGradient, setBgGradient] = useState("sunset");
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [customBgImgElement, setCustomBgImgElement] = useState<HTMLImageElement | null>(null);
  const [blurAmount, setBlurAmount] = useState(15);
  const [edgeSmoothness, setEdgeSmoothness] = useState(0);
  const [edgeShift, setEdgeShift] = useState(0);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL("@/lib/bg-remove.worker.ts", import.meta.url));

    workerRef.current.onmessage = (e) => {
      const { type, data, resultData, error } = e.data;

      if (type === "progress") {
        if (data.status === "init") {
          setUiState("loading_model");
          setProgressText("Initializing cybrotools engine...");
        } else if (data.status === "downloading" || data.status === "progress") {
          setUiState("loading_model");
          const fileInfo = data.file || data.name || "";
          setProgressText(`Loading cybrotools engine... ${fileInfo}`);
          if (typeof data.progress === "number") {
            setProgress(data.progress > 1 ? data.progress : data.progress * 100);
          }
        } else if (data.status === "ready") {
          setProgressText("Engine ready.");
        }
      } else if (type === "ready") {
        setUiState("idle");
      } else if (type === "processing") {
        setUiState("processing");
        setProgressText("Removing background...");
      } else if (type === "complete") {
        try {
          const { data: pixels, width, height } = resultData;
          
          setRawPixels(new Uint8ClampedArray(pixels));
          setDimensions({ width, height });
          setUiState("success");

          addHistoryLog(
            "Background Remover",
            "Remove Background",
            `Successfully removed background from ${width}x${height} image`,
            "/ai/bg-remover"
          );
        } catch (err: any) {
          setErrorMsg(err.message || "Failed to process result image.");
          setUiState("error");
        }
      } else if (type === "error") {
        setErrorMsg(error || "An unknown error occurred.");
        setUiState("error");
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Perform compositing
  const handleRecomposite = useCallback(() => {
    if (!rawPixels || !dimensions || !originalImgElement) return;

    const { width, height } = dimensions;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw Background
    if (bgMode === "color") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (bgGradient === "sunset") {
        grad.addColorStop(0, "#f97316");
        grad.addColorStop(1, "#ec4899");
      } else if (bgGradient === "ocean") {
        grad.addColorStop(0, "#06b6d4");
        grad.addColorStop(1, "#3b82f6");
      } else if (bgGradient === "emerald") {
        grad.addColorStop(0, "#10b981");
        grad.addColorStop(1, "#06b6d4");
      } else if (bgGradient === "cosmic") {
        grad.addColorStop(0, "#8b5cf6");
        grad.addColorStop(1, "#ec4899");
      } else if (bgGradient === "candy") {
        grad.addColorStop(0, "#ff007f");
        grad.addColorStop(1, "#7f00ff");
      } else if (bgGradient === "sunshine") {
        grad.addColorStop(0, "#fde047");
        grad.addColorStop(1, "#f97316");
      } else {
        grad.addColorStop(0, "#e2e8f0");
        grad.addColorStop(1, "#94a3b8");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === "blur") {
      ctx.save();
      ctx.filter = `blur(${blurAmount}px)`;
      // Draw background-blurred original image aspect-fill
      ctx.drawImage(originalImgElement, -blurAmount * 2, -blurAmount * 2, width + blurAmount * 4, height + blurAmount * 4);
      ctx.restore();
    } else if (bgMode === "image" && customBgImgElement) {
      // Draw custom background using aspect-fill
      const imgW = customBgImgElement.width;
      const imgH = customBgImgElement.height;
      const r = imgW / imgH;
      const targetR = width / height;
      let cx, cy, cw, ch;
      if (r > targetR) {
        cw = imgH * targetR;
        ch = imgH;
        cx = (imgW - cw) / 2;
        cy = 0;
      } else {
        cw = imgW;
        ch = imgW / targetR;
        cx = 0;
        cy = (imgH - ch) / 2;
      }
      ctx.drawImage(customBgImgElement, cx, cy, cw, ch, 0, 0, width, height);
    }

    // 2. Create Mask Canvas
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    const maskImgData = maskCtx.createImageData(width, height);
    for (let i = 0; i < maskImgData.data.length; i += 4) {
      maskImgData.data[i] = 255;
      maskImgData.data[i + 1] = 255;
      maskImgData.data[i + 2] = 255;
      maskImgData.data[i + 3] = rawPixels[i + 3]; // Alpha channel has the mask
    }
    maskCtx.putImageData(maskImgData, 0, 0);

    // 3. Create Refined Mask (Erode/Dilate)
    const refinedMaskCanvas = document.createElement("canvas");
    refinedMaskCanvas.width = width;
    refinedMaskCanvas.height = height;
    const refinedMaskCtx = refinedMaskCanvas.getContext("2d");
    if (!refinedMaskCtx) return;

    if (edgeShift > 0) {
      refinedMaskCtx.drawImage(maskCanvas, 0, 0);
      refinedMaskCtx.globalCompositeOperation = "source-over";
      refinedMaskCtx.drawImage(maskCanvas, -edgeShift, 0);
      refinedMaskCtx.drawImage(maskCanvas, edgeShift, 0);
      refinedMaskCtx.drawImage(maskCanvas, 0, -edgeShift);
      refinedMaskCtx.drawImage(maskCanvas, 0, edgeShift);
    } else if (edgeShift < 0) {
      const shift = Math.abs(edgeShift);
      refinedMaskCtx.drawImage(maskCanvas, 0, 0);
      refinedMaskCtx.globalCompositeOperation = "destination-in";
      refinedMaskCtx.drawImage(maskCanvas, -shift, 0);
      refinedMaskCtx.drawImage(maskCanvas, shift, 0);
      refinedMaskCtx.drawImage(maskCanvas, 0, -shift);
      refinedMaskCtx.drawImage(maskCanvas, 0, shift);
    } else {
      refinedMaskCtx.drawImage(maskCanvas, 0, 0);
    }

    // 4. Smooth Mask (Feather)
    const finalMaskCanvas = document.createElement("canvas");
    finalMaskCanvas.width = width;
    finalMaskCanvas.height = height;
    const finalMaskCtx = finalMaskCanvas.getContext("2d");
    if (!finalMaskCtx) return;

    if (edgeSmoothness > 0) {
      finalMaskCtx.filter = `blur(${edgeSmoothness}px)`;
    }
    finalMaskCtx.drawImage(refinedMaskCanvas, 0, 0);

    // 5. Draw Foreground
    const fgCanvas = document.createElement("canvas");
    fgCanvas.width = width;
    fgCanvas.height = height;
    const fgCtx = fgCanvas.getContext("2d");
    if (!fgCtx) return;

    fgCtx.drawImage(originalImgElement, 0, 0);
    fgCtx.globalCompositeOperation = "destination-in";
    fgCtx.drawImage(finalMaskCanvas, 0, 0);

    // 6. Layer Foreground over Background
    ctx.drawImage(fgCanvas, 0, 0);

    // Set result
    setResultImage(canvas.toDataURL("image/png"));
  }, [
    rawPixels,
    dimensions,
    originalImgElement,
    bgMode,
    bgColor,
    bgGradient,
    customBgImgElement,
    blurAmount,
    edgeSmoothness,
    edgeShift,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRecomposite();
    }, 0);
    return () => clearTimeout(timer);
  }, [handleRecomposite]);

  const processImage = useCallback((file: File) => {
    if (!workerRef.current) return;
    
    setUiState("processing");
    setProgressText("Preparing image...");
    
    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);

    // Load original image HTML element
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setOriginalImgElement(img);
    };
    img.src = objectUrl;
    
    workerRef.current.postMessage({
      action: "remove_bg",
      id: Date.now(),
      imageURL: objectUrl,
      modelId: selectedModel,
    });
  }, [selectedModel]);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgImage(url);
      const img = new window.Image();
      img.onload = () => {
        setCustomBgImgElement(img);
        setBgMode("image");
      };
      img.src = url;
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (uiState !== "idle") return;
      
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              processImage(file);
              break;
            }
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [uiState, processImage]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processImage(acceptedFiles[0]);
    }
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const reset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setRawPixels(null);
    setDimensions(null);
    setOriginalImgElement(null);
    setCustomBgImage(null);
    setCustomBgImgElement(null);
    setBgMode("transparent");
    setEdgeSmoothness(0);
    setEdgeShift(0);
    setUiState("idle");
    setProgress(0);
    setProgressText("");
    setErrorMsg("");
  };

  const downloadResult = () => {
    if (resultImage) {
      const filename = bgMode === "transparent" ? "background-removed_edited_by_cybrotools.png" : "background-replaced_edited_by_cybrotools.png";
      const a = document.createElement("a");
      a.href = resultImage;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="flex flex-col relative overflow-hidden h-full p-4 md:p-8">
      <BannerAd />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        
        {/* Upload State */}
        {uiState === "idle" && !originalImage && (
          <div className="w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Professional AI Background Remover <br className="hidden md:block" /> 
              <span className="text-blue-500">Local, Offline & Absolute Privacy</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Remove and replace image backgrounds instantly using client-side AI. Zero uploads, zero lag.
            </p>

            {/* Model Selector badge/info */}
            <div className="max-w-md mx-auto bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 shadow-xs animate-in fade-in duration-300">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left block">
                AI Model (Runs locally in browser)
              </label>
              <div className="text-sm font-semibold text-gray-950 dark:text-zinc-50 text-left flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                cybro2.50 (Classic cybro AI)
              </div>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 text-left leading-normal">
                🔹 Classic, fast background remover. Excellent for general objects. (~170MB download, runs offline)
              </p>
            </div>
            
            <div 
              {...getRootProps()} 
              className={`mt-10 border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm ${
                isDragActive ? "border-blue-500 scale-[1.01] shadow-md bg-blue-50/5" : "border-gray-300 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-zinc-700"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center border border-blue-100 dark:border-zinc-700">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-medium">Drag & drop an image here</p>
                  <p className="text-gray-500 mt-1">or click to browse, or paste an image</p>
                </div>
                <div className="text-xs text-gray-400 mt-4">
                  Supports PNG, JPG, WEBP up to 15MB.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Processing State */}
        {(uiState === "loading_model" || uiState === "processing") && (
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 relative flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-medium">{uiState === "loading_model" ? "Loading AI Model" : "Processing Image"}</h3>
              <p className="text-gray-500 mt-2">{progressText}</p>
            </div>
            
            {uiState === "loading_model" && (
              <div className="w-full space-y-2">
                <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-right">{progress.toFixed(0)}%</p>
                <p className="text-xs text-gray-400 text-center mt-2 text-balance leading-normal">
                  First run requires downloading a ~170MB AI model. This is stored securely in your browser cache.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {uiState === "error" && (
          <div className="w-full max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="text-xl font-medium">Something went wrong</h3>
            <p className="text-red-500">{errorMsg}</p>
            <button 
              onClick={reset}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {uiState === "success" && originalImage && resultImage && (
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 items-start">
            
            {/* Left: Preview Slider */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Before / After Preview
                </span>
                <span className="text-xs text-gray-500">Drag center handle to compare</span>
              </div>
              <BeforeAfterSlider beforeImage={originalImage} afterImage={resultImage} />
            </div>

            {/* Right: Studio Controls */}
            <div className="lg:col-span-5 space-y-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" /> Background Studio
                </h3>
                <button 
                  onClick={reset}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              {/* SECTION: BACKGROUND MODES */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 1. Replace Background
                </label>
                
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { mode: "transparent", label: "Clear" },
                    { mode: "color", label: "Color" },
                    { mode: "gradient", label: "Gradient" },
                    { mode: "image", label: "Backdrop" },
                    { mode: "blur", label: "Blur" }
                  ].map((btn) => (
                    <button
                      key={btn.mode}
                      onClick={() => setBgMode(btn.mode as any)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        bgMode === btn.mode
                          ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Sub-panels based on Mode */}
                {bgMode === "color" && (
                  <div className="p-4 bg-gray-50/50 dark:bg-zinc-950/30 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 border border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-sm uppercase">{bgColor}</span>
                    </div>
                    {/* Presets */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        "#ffffff", "#000000", "#f3f4f6", "#fef3c7", "#fee2e2", 
                        "#ecfdf5", "#eff6ff", "#f5f3ff", "#fdf2f8", "#ffedd5"
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setBgColor(color)}
                          className="w-8 h-8 rounded-lg border border-gray-300 dark:border-zinc-700 relative flex items-center justify-center transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                        >
                          {bgColor.toLowerCase() === color.toLowerCase() && (
                            <Check className={`w-4 h-4 ${color === "#ffffff" ? "text-black" : "text-white"}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bgMode === "gradient" && (
                  <div className="p-4 bg-gray-50/50 dark:bg-zinc-950/30 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "sunset", name: "Sunset", style: "linear-gradient(to right, #f97316, #ec4899)" },
                        { id: "ocean", name: "Ocean", style: "linear-gradient(to right, #06b6d4, #3b82f6)" },
                        { id: "emerald", name: "Emerald", style: "linear-gradient(to right, #10b981, #06b6d4)" },
                        { id: "cosmic", name: "Cosmic", style: "linear-gradient(to right, #8b5cf6, #ec4899)" },
                        { id: "candy", name: "Candy", style: "linear-gradient(to right, #ff007f, #7f00ff)" },
                        { id: "sunshine", name: "Sunshine", style: "linear-gradient(to right, #fde047, #f97316)" }
                      ].map((grad) => (
                        <button
                          key={grad.id}
                          onClick={() => setBgGradient(grad.id)}
                          className={`h-12 rounded-xl relative flex items-center justify-center text-xs font-bold text-white overflow-hidden transition-all border ${
                            bgGradient === grad.id ? "border-blue-500 scale-102 ring-2 ring-blue-500/20" : "border-transparent"
                          }`}
                          style={{ backgroundImage: grad.style }}
                        >
                          <span className="bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs">{grad.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bgMode === "blur" && (
                  <div className="p-4 bg-gray-50/50 dark:bg-zinc-950/30 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold">Blur Intensity</span>
                      <span className="font-mono text-xs">{blurAmount}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="40" 
                      value={blurAmount}
                      onChange={(e) => setBlurAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg cursor-pointer accent-blue-500"
                    />
                  </div>
                )}

                {bgMode === "image" && (
                  <div className="p-4 bg-gray-50/50 dark:bg-zinc-950/30 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-zinc-800 border-dashed rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-zinc-900/50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-6 h-6 text-gray-500 mb-1" />
                          <p className="text-xs font-medium text-gray-500">Upload background image</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCustomBgUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    {customBgImage && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
<img src={customBgImage} alt="Custom bg preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-gray-400">Background loaded successfully</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION: EDGE REFINEMENT */}
              <div className="space-y-4 border-t border-gray-100 dark:border-zinc-800 pt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" /> 2. Edge Refinement
                </label>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Smoothness (Feather)</span>
                      <span className="font-mono text-xs">{edgeSmoothness}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="15" 
                      value={edgeSmoothness}
                      onChange={(e) => setEdgeSmoothness(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Shift Contour (Shrink / Grow)</span>
                      <span className="font-mono text-xs">{edgeShift > 0 ? `+${edgeShift}` : edgeShift}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="-10" 
                      max="10" 
                      value={edgeShift}
                      onChange={(e) => setEdgeShift(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS: DOWNLOAD */}
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 flex gap-4">
                <button 
                  onClick={downloadResult}
                  className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
                >
                  <Download className="w-5 h-5" /> Download Studio Result
                </button>
              </div>
            </div>

          </div>
        )}
        <ToolSeoSection toolId="bg-remover" />
      </div>
    </div>
  );
}
