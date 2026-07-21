"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, RefreshCw, Sparkles, HelpCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function CircularCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [transparent, setTransparent] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
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

      // Circular crop is square base (600x600px standard for avatars)
      const size = 600;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);

      if (!transparent) {
        // Draw standard solid backing color for corners
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // Clip mask into perfect circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // Cover scaling calculations inside circle
      const imgRatio = img.width / img.height;
      let drawW = size;
      let drawH = size;

      if (imgRatio > 1) {
        drawW = size * imgRatio;
      } else {
        drawH = size / imgRatio;
      }

      // Apply zoom slider
      drawW *= scale;
      drawH *= scale;

      // Center layout + user slider offsets
      const x = (size - drawW) / 2 + offsetX;
      const y = (size - drawH) / 2 + offsetY;

      ctx.drawImage(img, x, y, drawW, drawH);
      ctx.restore();

      // Optional: Draw fine subtle circle border to look professional
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();

      setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imageUrl, scale, offsetX, offsetY, transparent, bgColor]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `circular_avatar_${file?.name || "avatar.png"}`;
    link.href = previewUrl;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setPreviewUrl(null);
  };

  return (
    <div id="circular-crop-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Circular Image Crop</h1>
          <p className="text-gray-500 dark:text-zinc-400">Crop photos into transparent circular shapes perfect for avatars, stickers, and profile images.</p>
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
                <Sliders className="w-5 h-5" /> Alignment & Zoom
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Zoom / Scale</span>
                  <span className="font-mono">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Offset X</label>
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
                  <label className="text-xs font-medium">Offset Y</label>
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

              <div className="space-y-4 pt-2 border-t border-gray-150 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium cursor-pointer" htmlFor="transparent-toggle">
                    Transparent Background
                  </label>
                  <input
                    id="transparent-toggle"
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                {!transparent && (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="text-sm font-medium">Corner Solid Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full text-xs font-mono uppercase px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download Avatar PNG
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Circle Avatar Frame
              </h3>
              <p className="text-xs text-gray-500">Checkerboard grid shows transparency. Result exports with clean circles.</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[350px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl ? (
                <div className="relative max-w-full max-h-[500px]">
                  <Image
                    src={previewUrl}
                    alt="Circular Crop Preview"
                    width={400}
                    height={400}
                    className="object-contain max-h-[400px] rounded-full shadow-lg border-2 border-white dark:border-zinc-800 bg-transparent"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Rounding clip masks...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="circular-crop" />
    </div>
  );
}
