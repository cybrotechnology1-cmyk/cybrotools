"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, RefreshCw, Sparkles, Grid, Eye } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

type PhotoSpec = {
  name: string;
  widthRatio: number;
  heightRatio: number;
  widthMm: number;
  heightMm: number;
};

const PHOTO_SPECS: PhotoSpec[] = [
  { name: 'US / India (2" x 2" - 51 x 51 mm)', widthRatio: 1, heightRatio: 1, widthMm: 51, heightMm: 51 },
  { name: 'UK / EU / BD (35 x 45 mm)', widthRatio: 35, heightRatio: 45, widthMm: 35, heightMm: 45 },
  { name: 'Canada (50 x 70 mm)', widthRatio: 5, heightRatio: 7, widthMm: 50, heightMm: 70 },
  { name: 'China (33 x 48 mm)', widthRatio: 33, heightRatio: 48, widthMm: 33, heightMm: 48 },
];

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<PhotoSpec>(PHOTO_SPECS[0]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [printLayout, setPrintLayout] = useState<"single" | "grid-4x6">("single");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
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

      // Base single passport photo dimensions (600px width for high quality)
      const targetWidth = 600;
      const targetHeight = (selectedSpec.heightRatio / selectedSpec.widthRatio) * targetWidth;

      if (printLayout === "single") {
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw solid background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate fitting
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let drawW = targetWidth;
        let drawH = targetHeight;

        if (imgRatio > targetRatio) {
          drawW = targetHeight * imgRatio;
        } else {
          drawH = targetWidth / imgRatio;
        }

        // Apply scale
        drawW *= scale;
        drawH *= scale;

        // Center position + user offsets
        const x = (targetWidth - drawW) / 2 + offsetX;
        const y = (targetHeight - drawH) / 2 + offsetY;

        ctx.drawImage(img, x, y, drawW, drawH);
      } else {
        // Grid layout (e.g. 4x6 inch photo paper format)
        // Standard 4x6 photo paper aspect ratio is 1.5. Let's make canvas 1800 x 1200
        canvas.width = 1800;
        canvas.height = 1200;

        ctx.fillStyle = "#ffffff"; // Photo sheet is white
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render single passport thumbnail onto an offscreen canvas first
        const offCanvas = document.createElement("canvas");
        offCanvas.width = targetWidth;
        offCanvas.height = targetHeight;
        const offCtx = offCanvas.getContext("2d");
        if (offCtx) {
          offCtx.fillStyle = bgColor;
          offCtx.fillRect(0, 0, targetWidth, targetHeight);

          const imgRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;

          let drawW = targetWidth;
          let drawH = targetHeight;

          if (imgRatio > targetRatio) {
            drawW = targetHeight * imgRatio;
          } else {
            drawH = targetWidth / imgRatio;
          }

          drawW *= scale;
          drawH *= scale;

          const x = (targetWidth - drawW) / 2 + offsetX;
          const y = (targetHeight - drawH) / 2 + offsetY;

          offCtx.drawImage(img, x, y, drawW, drawH);
        }

        // Draw a grid of these photos onto the main canvas with light cut borders
        const cols = 4;
        const rows = 2;
        const spacingX = (canvas.width - cols * 350) / (cols + 1);
        const spacingY = (canvas.height - rows * 450) / (rows + 1);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = spacingX + c * (350 + spacingX);
            const dy = spacingY + r * (450 + spacingY);

            // Draw photo copy
            ctx.drawImage(offCanvas, dx, dy, 350, 450);

            // Draw very fine thin border line around each photo for scissor cutting
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 1;
            ctx.strokeRect(dx, dy, 350, 450);
          }
        }
      }

      setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imageUrl, selectedSpec, bgColor, scale, offsetX, offsetY, printLayout]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `passport_${printLayout}_${file?.name || "photo"}_edited_by_cybrotools.png`;
    link.href = previewUrl;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setPreviewUrl(null);
  };

  return (
    <div id="passport-maker-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <BannerAd />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Passport Photo Maker</h1>
          <p className="text-gray-500 dark:text-zinc-400">Crop, scale, color, and format any portrait into official passport layout configurations.</p>
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
              <p className="text-xl font-medium">Drag & drop your portrait here</p>
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
                <Sliders className="w-5 h-5" /> Adjustments
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Standard Passport Size</label>
                <div className="space-y-2">
                  {PHOTO_SPECS.map((spec) => (
                    <button
                      key={spec.name}
                      onClick={() => setSelectedSpec(spec)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-left transition-all text-xs ${
                        selectedSpec.name === spec.name
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                          : "border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      {spec.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Official Background</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { color: "#ffffff", name: "White" },
                    { color: "#f0f8ff", name: "Alice Blue" },
                    { color: "#357EC7", name: "Royal Blue" },
                  ].map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => setBgColor(bg.color)}
                      className={`py-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] ${
                        bgColor === bg.color
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 font-semibold text-blue-600"
                          : "border-gray-200 dark:border-zinc-800 text-gray-500"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300 shadow-inner"
                        style={{ backgroundColor: bg.color }}
                      />
                      <span>{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Portrait Scale</span>
                  <span className="font-mono">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Horizontal (X)</label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Vertical (Y)</label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Print Layout Pattern</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setPrintLayout("single")}
                    className={`py-2.5 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
                      printLayout === "single"
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Eye className="w-4 h-4" /> Single Photo
                  </button>
                  <button
                    onClick={() => setPrintLayout("grid-4x6")}
                    className={`py-2.5 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-all ${
                      printLayout === "grid-4x6"
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-4 h-4" /> 4x6 Sheet (8x)
                  </button>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download Passport Print
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Photo Canvas
              </h3>
              <p className="text-xs text-gray-500">
                {printLayout === "single"
                  ? `US single passport image. Aspect ratio: ${selectedSpec.widthRatio}:${selectedSpec.heightRatio}`
                  : `Formatted grid of 8 passport photos on a 4" x 6" layout.`}
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[350px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl ? (
                <div className="relative max-w-full max-h-[500px]">
                  <Image
                    src={previewUrl}
                    alt="Passport Preview"
                    width={800}
                    height={500}
                    className="object-contain max-h-[450px] rounded-lg shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Calculating passport dimensions...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="passport" />
    </div>
  );
}
