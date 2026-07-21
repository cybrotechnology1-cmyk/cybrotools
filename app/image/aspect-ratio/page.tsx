"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, RefreshCw, Sparkles, Crop } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";

type RatioItem = {
  name: string;
  w: number;
  h: number;
};

const RATIOS: RatioItem[] = [
  { name: "Square (1:1)", w: 1, h: 1 },
  { name: "Landscape HD (16:9)", w: 16, h: 9 },
  { name: "Portrait Story (9:16)", w: 9, h: 16 },
  { name: "Standard (4:3)", w: 4, h: 3 },
  { name: "Classic Photo (3:2)", w: 3, h: 2 },
  { name: "Cinema scope (21:9)", w: 21, h: 9 },
];

export default function AspectRatioConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<RatioItem>(RATIOS[0]);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [paddingColor, setPaddingColor] = useState("#000000");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Maintain original scale size (use max size of 1200px)
      const baseDim = 1200;
      let targetW = baseDim;
      let targetH = baseDim;

      if (selectedRatio.w >= selectedRatio.h) {
        targetH = (selectedRatio.h / selectedRatio.w) * baseDim;
      } else {
        targetW = (selectedRatio.w / selectedRatio.h) * baseDim;
      }

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);

      if (fitMode === "cover") {
        // Crop & fill completely
        const imgRatio = img.width / img.height;
        const targetRatio = targetW / targetH;

        let drawW = targetW;
        let drawH = targetH;

        if (imgRatio > targetRatio) {
          drawW = targetH * imgRatio;
        } else {
          drawH = targetW / imgRatio;
        }

        const dx = (targetW - drawW) / 2;
        const dy = (targetH - drawH) / 2;

        ctx.drawImage(img, dx, dy, drawW, drawH);
      } else {
        // Contain & add letterbox/pillarbox color bars
        ctx.fillStyle = paddingColor;
        ctx.fillRect(0, 0, targetW, targetH);

        const imgRatio = img.width / img.height;
        const targetRatio = targetW / targetH;

        let drawW = targetW;
        let drawH = targetH;

        if (imgRatio > targetRatio) {
          drawH = targetW / imgRatio;
        } else {
          drawW = targetH * imgRatio;
        }

        const dx = (targetW - drawW) / 2;
        const dy = (targetH - drawH) / 2;

        ctx.drawImage(img, dx, dy, drawW, drawH);
      }

      setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imageUrl, selectedRatio, fitMode, paddingColor]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `ratio_${selectedRatio.w}x${selectedRatio.h}_${file?.name || "image.png"}`;
    link.href = previewUrl;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setPreviewUrl(null);
  };

  return (
    <div id="aspect-ratio-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Aspect Ratio Converter</h1>
          <p className="text-gray-500 dark:text-zinc-400">Instantly convert image formats to standard aspects with fill crop or letterbox color bands.</p>
        </div>
        {file && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-sm"
          >
            Upload New
          </button>
        )}
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm text-center ${
            isDragActive ? "border-gray-900 dark:border-white scale-[1.02] shadow-md" : "border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
          }`}
        >
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
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sliders className="w-5 h-5" /> Ratio Presets
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {RATIOS.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setSelectedRatio(r)}
                      className={`py-2 px-3 rounded-xl border text-left transition-all text-xs ${
                        selectedRatio.name === r.name
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                          : "border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fitting Behavior</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setFitMode("cover")}
                    className={`py-2.5 rounded-xl border font-medium flex items-center justify-center transition-all ${
                      fitMode === "cover"
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Crop to Fill (Cover)
                  </button>
                  <button
                    onClick={() => setFitMode("contain")}
                    className={`py-2.5 rounded-xl border font-medium flex items-center justify-center transition-all ${
                      fitMode === "contain"
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Letterbox Bars (Contain)
                  </button>
                </div>
              </div>

              {fitMode === "contain" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bands Letterbox Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={paddingColor}
                      onChange={(e) => setPaddingColor(e.target.value)}
                      className="w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={paddingColor}
                      onChange={(e) => setPaddingColor(e.target.value)}
                      className="w-full text-xs font-mono uppercase px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
              >
                <Download className="w-5 h-5" /> Export Converted Image
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Remapped Preview
              </h3>
              <p className="text-xs text-gray-500">Live preview conforms accurately to the targeted format scale.</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[350px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl ? (
                <div className="relative max-w-full max-h-[500px]">
                  <Image
                    src={previewUrl}
                    alt="Aspect Ratio Preview"
                    width={800}
                    height={500}
                    className="object-contain max-h-[450px] rounded-lg shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Mapping ratio matrices...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="aspect-ratio" />
    </div>
  );
}
