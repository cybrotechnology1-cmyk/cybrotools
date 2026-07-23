"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Download, RotateCw, FlipHorizontal, FlipVertical, Sliders, RefreshCw, Layers, Crop as CropIcon, Loader2, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function ImageEditor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [blur, setBlur] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [shadow, setShadow] = useState(0);
  const [bgBlur, setBgBlur] = useState(0);
  const [bgBlurProcessing, setBgBlurProcessing] = useState(false);

  const [cropMode, setCropMode] = useState(false);
  const [cropRatio, setCropRatio] = useState<"free" | "1:1" | "4:3" | "16:9">("free");
  
  const [cropX, setCropX] = useState(10);
  const [cropY, setCropY] = useState(10);
  const [cropW, setCropW] = useState(80);
  const [cropH, setCropH] = useState(80);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingCrop = useRef<{ active: boolean; type: string; startX: number; startY: number } | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL("@/lib/bg-remove.worker.ts", import.meta.url));
    workerRef.current.onmessage = () => {};
    return () => { workerRef.current?.terminate(); };
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setEditedUrl(null);
      
      const img = new window.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepAspectRatio && originalWidth > 0) {
      setHeight(Math.round(val * (originalHeight / originalWidth)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepAspectRatio && originalHeight > 0) {
      setWidth(Math.round(val * (originalWidth / originalHeight)));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cropRatio === "1:1") setCropH(cropW);
      else if (cropRatio === "4:3") setCropH(cropW * (3 / 4));
      else if (cropRatio === "16:9") setCropH(cropW * (9 / 16));
    }, 0);
    return () => clearTimeout(timer);
  }, [cropRatio, cropW]);

  const handleCropMouseDown = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    isDraggingCrop.current = { active: true, type, startX: e.clientX, startY: e.clientY };
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCrop.current?.active) return;
    const drag = isDraggingCrop.current;
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const deltaX = ((e.clientX - drag.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - drag.startY) / rect.height) * 100;
    drag.startX = e.clientX;
    drag.startY = e.clientY;

    if (drag.type === "move") {
      setCropX((p) => Math.max(0, Math.min(100 - cropW, p + deltaX)));
      setCropY((p) => Math.max(0, Math.min(100 - cropH, p + deltaY)));
    } else if (drag.type === "se") {
      setCropW(Math.max(10, Math.min(100 - cropX, cropW + deltaX)));
      if (cropRatio === "free") setCropH((p) => Math.max(10, Math.min(100 - cropY, p + deltaY)));
    } else if (drag.type === "nw") {
      const newX = Math.max(0, Math.min(cropX + cropW - 10, cropX + deltaX));
      setCropW(cropW - (newX - cropX));
      setCropX(newX);
      if (cropRatio === "free") {
        const newY = Math.max(0, Math.min(cropY + cropH - 10, cropY + deltaY));
        setCropH(cropH - (newY - cropY));
        setCropY(newY);
      }
    }
  };

  const handleCropMouseUp = () => { isDraggingCrop.current = null; };

  const applyBackgroundBlur = (img: HTMLImageElement, finalWidth: number, finalHeight: number, sx: number, sy: number, sWidth: number, sHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve(canvasRef.current?.toDataURL("image/png") || "");
        return;
      }

      const worker = workerRef.current;

      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = finalWidth;
      srcCanvas.height = finalHeight;
      const srcCtx = srcCanvas.getContext("2d");
      if (!srcCtx) { resolve(""); return; }
      srcCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, finalWidth, finalHeight);

      const onMessage = (e: MessageEvent) => {
        if (e.data.type === "complete" && e.data.resultData) {
          worker.removeEventListener("message", onMessage);

          const { data: rgbaData, width: maskW, height: maskH } = e.data.resultData;

          const blurCanvas = document.createElement("canvas");
          blurCanvas.width = finalWidth;
          blurCanvas.height = finalHeight;
          const blurCtx = blurCanvas.getContext("2d")!;
          blurCtx.filter = `blur(${bgBlur}px)`;
          blurCtx.drawImage(srcCanvas, 0, 0);

          const subjectCanvas = document.createElement("canvas");
          subjectCanvas.width = maskW;
          subjectCanvas.height = maskH;
          const subjectCtx = subjectCanvas.getContext("2d")!;
          const subjectImgData = subjectCtx.createImageData(maskW, maskH);
          subjectImgData.data.set(rgbaData);
          subjectCtx.putImageData(subjectImgData, 0, 0);

          const resultCanvas = document.createElement("canvas");
          resultCanvas.width = finalWidth;
          resultCanvas.height = finalHeight;
          const rCtx = resultCanvas.getContext("2d")!;
          rCtx.drawImage(blurCanvas, 0, 0);
          rCtx.drawImage(subjectCanvas, 0, 0, maskW, maskH, 0, 0, finalWidth, finalHeight);
          resolve(resultCanvas.toDataURL("image/png"));
        } else if (e.data.type === "error") {
          worker.removeEventListener("message", onMessage);
          resolve("");
        }
      };

      worker.addEventListener("message", onMessage);
      worker.postMessage({ action: "remove_bg", id: "bgblur", imageURL: srcCanvas.toDataURL("image/png") });
    });
  };

  const applyEdits = async () => {
    if (!originalUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (bgBlur > 0) {
      setBgBlurProcessing(true);
    }

    const img = new window.Image();
    img.onload = async () => {
      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
      if (cropMode) {
        sx = (cropX / 100) * img.width;
        sy = (cropY / 100) * img.height;
        sWidth = (cropW / 100) * img.width;
        sHeight = (cropH / 100) * img.height;
      }

      const is90or270 = rotation % 180 !== 0;
      const targetWidth = cropMode ? Math.round((cropW / 100) * width) : width;
      const targetHeight = cropMode ? Math.round((cropH / 100) * height) : height;
      const finalWidth = is90or270 ? targetHeight : targetWidth;
      const finalHeight = is90or270 ? targetWidth : targetHeight;

      canvas.width = finalWidth;
      canvas.height = finalHeight;
      ctx.clearRect(0, 0, finalWidth, finalHeight);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, finalWidth, finalHeight);
      ctx.save();
      ctx.translate(finalWidth / 2, finalHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      if (bgBlur > 0) {
        const bgBlurResult = await applyBackgroundBlur(img, finalWidth, finalHeight, sx, sy, sWidth, sHeight);
        if (bgBlurResult) {
          const blurImg = new window.Image();
          blurImg.onload = () => {
            ctx.filter = "none";
            ctx.drawImage(blurImg, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
            ctx.restore();
            finishEdits(canvas, finalWidth, finalHeight);
            setBgBlurProcessing(false);
          };
          blurImg.src = bgBlurResult;
          return;
        }
      }

      if (blur > 0) ctx.filter = `blur(${blur}px)`;
      else ctx.filter = "none";

      ctx.drawImage(img, sx, sy, sWidth, sHeight, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
      ctx.restore();
      finishEdits(canvas, finalWidth, finalHeight);
      setBgBlurProcessing(false);
    };
    img.src = originalUrl;
  };

  const finishEdits = (canvas: HTMLCanvasElement, finalWidth: number, finalHeight: number) => {
    if (shadow > 0) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = finalWidth + shadow * 2;
      tempCanvas.height = finalHeight + shadow * 2;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.shadowColor = "rgba(0,0,0,0.3)";
        tempCtx.shadowBlur = shadow;
        tempCtx.shadowOffsetX = 0;
        tempCtx.shadowOffsetY = shadow / 2;
        tempCtx.drawImage(canvas, shadow, shadow);
        setEditedUrl(tempCanvas.toDataURL("image/png"));
        return;
      }
    }
    setEditedUrl(canvas.toDataURL("image/png"));
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setEditedUrl(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBlur(0);
    setBgColor("#ffffff");
    setShadow(0);
    setBgBlur(0);
    setCropMode(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <BannerAd />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Image Editor</h1>
          <p className="text-gray-500 dark:text-zinc-400">Crop, resize, rotate, flip, add filters, adjust brightness and contrast, draw, add text, shapes, and more. All processing happens client-side.</p>
        </div>
        {originalFile && (
          <button onClick={reset} className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-sm">
            Upload New
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!originalFile ? (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm text-center ${isDragActive ? "border-gray-900 dark:border-white scale-[1.02] shadow-md" : "border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-gray-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-xl font-medium">Drag & drop an image here</p>
              <p className="text-gray-500 mt-1">or click to browse from your device</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sliders className="w-5 h-5" /> Adjustments
              </h3>

              <div className="space-y-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CropIcon className="w-4 h-4 text-blue-500" /> Crop Mode
                  </label>
                  <button onClick={() => setCropMode((p) => !p)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${cropMode ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"}`}>
                    {cropMode ? "Enabled" : "Disabled"}
                  </button>
                </div>
                {cropMode && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs text-gray-400">Aspect Ratio</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["free", "1:1", "4:3", "16:9"] as const).map((ratio) => (
                        <button key={ratio} onClick={() => setCropRatio(ratio)} className={`py-1 px-2 text-xs font-mono rounded-md border transition-colors ${cropRatio === ratio ? "bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-bold border-transparent" : "border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400"}`}>
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">Dimensions</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400">Width (px)</span>
                    <input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400">Height (px)</span>
                    <input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-500">
                  <input type="checkbox" checked={keepAspectRatio} onChange={(e) => setKeepAspectRatio(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 accent-gray-900" />
                  Keep Aspect Ratio
                </label>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">Transform</label>
                <div className="flex gap-2">
                  <button onClick={() => setRotation((p) => (p + 90) % 360)} className="flex-1 py-2 px-3 bg-gray-100 dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                    <RotateCw className="w-4 h-4" /> Rotate 90°
                  </button>
                  <button onClick={() => setFlipH((p) => !p)} className={`p-2 rounded-lg border transition-colors ${flipH ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "border-gray-200 dark:border-zinc-800"}`}>
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                  <button onClick={() => setFlipV((p) => !p)} className={`p-2 rounded-lg border transition-colors ${flipV ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "border-gray-200 dark:border-zinc-800"}`}>
                    <FlipVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium">Stylize Filters</label>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Blur</span>
                    <span className="font-mono">{blur}px</span>
                  </div>
                  <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-gray-900 dark:accent-white" />
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-500">AI Background Blur</span>
                    </div>
                    <span className="font-mono text-xs">{bgBlur}px</span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">AI detects subject and blurs only the background</p>
                  <input type="range" min="0" max="30" value={bgBlur} onChange={(e) => setBgBlur(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Shadow Blur</span>
                    <span className="font-mono">{shadow}px</span>
                  </div>
                  <input type="range" min="0" max="50" value={shadow} onChange={(e) => setShadow(Number(e.target.value))} className="w-full accent-gray-900 dark:accent-white" />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Canvas Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer overflow-hidden p-0" />
                    <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-mono" />
                  </div>
                </div>
              </div>

              <button onClick={applyEdits} disabled={bgBlurProcessing} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {bgBlurProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing AI Blur...
                  </>
                ) : (
                  <>
                    <Layers className="w-5 h-5" />
                    Apply Adjustments
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">{cropMode ? "Interactive Crop Area" : "Original"}</h4>
                <div ref={previewContainerRef} onMouseMove={handleCropMouseMove} onMouseUp={handleCropMouseUp} onMouseLeave={handleCropMouseUp} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center pattern-dots text-gray-300 dark:text-zinc-700 select-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {originalUrl && <Image src={originalUrl} alt="Original" fill className="object-contain pointer-events-none" unoptimized />}
                  {cropMode && originalUrl && (
                    <div className="absolute border border-blue-500 bg-blue-500/15 cursor-move" style={{ left: `${cropX}%`, top: `${cropY}%`, width: `${cropW}%`, height: `${cropH}%` }} onMouseDown={(e) => handleCropMouseDown(e, "move")}>
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                        <div className="border-r border-b border-white" /><div className="border-r border-b border-white" /><div className="border-b border-white" />
                        <div className="border-r border-b border-white" /><div className="border-r border-b border-white" /><div className="border-b border-white" />
                        <div className="border-r border-white" /><div className="border-r border-white" /><div />
                      </div>
                      <div className="absolute w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full -top-1.5 -left-1.5 cursor-nwse-resize z-10" onMouseDown={(e) => handleCropMouseDown(e, "nw")} />
                      <div className="absolute w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full -bottom-1.5 -right-1.5 cursor-nwse-resize z-10" onMouseDown={(e) => handleCropMouseDown(e, "se")} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Edited Output</h4>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center pattern-dots text-gray-300 dark:text-zinc-700" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {bgBlurProcessing && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                      <span className="text-white text-sm font-medium">AI detecting subject...</span>
                    </div>
                  )}
                  {editedUrl ? (
                    <>
                      <Image src={editedUrl} alt="Edited" fill className="object-contain" unoptimized />
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <a href={editedUrl} download={`edited_${originalFile?.name}_edited_by_cybrotools`} className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm">
                          <Download className="w-4 h-4" /> Download Image
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 dark:text-zinc-600 flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                      <span className="text-sm">Click Apply Adjustments</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="editor" />
    </div>
  );
}
