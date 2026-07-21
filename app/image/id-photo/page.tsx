"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, RefreshCw, Sparkles, CreditCard, Layout } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";

type IDSpec = {
  name: string;
  widthRatio: number;
  heightRatio: number;
  widthMm: number;
  heightMm: number;
};

const ID_SPECS: IDSpec[] = [
  { name: 'Standard ID Card (CR80 - 85.6 x 54 mm)', widthRatio: 54, heightRatio: 85.6, widthMm: 54, heightMm: 85.6 },
  { name: 'Corporate Badge (70 x 100 mm)', widthRatio: 70, heightRatio: 100, widthMm: 70, heightMm: 100 },
  { name: 'Student Badge (60 x 90 mm)', widthRatio: 60, heightRatio: 90, widthMm: 60, heightMm: 90 },
];

export default function IDPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<IDSpec>(ID_SPECS[0]);
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [badgeHeader, setBadgeHeader] = useState("SECURE VISITOR");
  const [headerColor, setHeaderColor] = useState("#1e293b"); // dark charcoal
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

      // Base ID card template resolution (600px width)
      const cardWidth = 600;
      const cardHeight = (selectedSpec.heightRatio / selectedSpec.widthRatio) * cardWidth;

      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // Background Card Color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Top Header bar
      ctx.fillStyle = headerColor;
      ctx.fillRect(0, 0, cardWidth, 80);

      // Header Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(badgeHeader.toUpperCase(), cardWidth / 2, 40);

      // Draw portrait image with mask inside frame bounds
      ctx.save();
      // Passport Frame dimensions: 320x400 centered below header
      const frameW = 320;
      const frameH = 400;
      const frameX = (cardWidth - frameW) / 2;
      const frameY = 120;

      // Card frame border shadow
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 4;
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      // Clip mask so the photo stays perfectly within the ID portrait block
      ctx.beginPath();
      ctx.rect(frameX, frameY, frameW, frameH);
      ctx.clip();

      // Clear clipped area with white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(frameX, frameY, frameW, frameH);

      const imgRatio = img.width / img.height;
      const frameRatio = frameW / frameH;

      let drawW = frameW;
      let drawH = frameH;

      if (imgRatio > frameRatio) {
        drawW = frameH * imgRatio;
      } else {
        drawH = frameW / imgRatio;
      }

      drawW *= scale;
      drawH *= scale;

      const x = frameX + (frameW - drawW) / 2 + offsetX;
      const y = frameY + (frameH - drawH) / 2 + offsetY;

      ctx.drawImage(img, x, y, drawW, drawH);
      ctx.restore();

      // Footer Bar/Accent
      ctx.fillStyle = headerColor;
      ctx.fillRect(0, cardHeight - 20, cardWidth, 20);

      setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imageUrl, selectedSpec, bgColor, scale, offsetX, offsetY, badgeHeader, headerColor]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `id_badge_${file?.name || "photo.png"}`;
    link.href = previewUrl;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setPreviewUrl(null);
  };

  return (
    <div id="id-photo-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">ID Photo Maker</h1>
          <p className="text-gray-500 dark:text-zinc-400">Design corporate badges, visitor passes, and standard ID photo cards using browser canvas tools.</p>
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
                <Sliders className="w-5 h-5" /> Badge Design Settings
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> Card Standard Proportion
                </label>
                <div className="space-y-2">
                  {ID_SPECS.map((spec) => (
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
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Layout className="w-4 h-4" /> Header Text
                </label>
                <input
                  type="text"
                  value={badgeHeader}
                  onChange={(e) => setBadgeHeader(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. VISITOR, CORPORATE"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Header Color</label>
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    className="w-full h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Card Background</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Photo Scale</span>
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
                  <label className="text-xs font-medium">Offset X</label>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Offset Y</label>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download ID Badge Image
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> ID Badge Preview
              </h3>
              <p className="text-xs text-gray-500">Live high-fidelity canvas simulation for identification cards.</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[350px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl ? (
                <div className="relative max-w-full max-h-[500px]">
                  <Image
                    src={previewUrl}
                    alt="ID Badge Preview"
                    width={400}
                    height={500}
                    className="object-contain max-h-[450px] rounded-lg shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Recalculating ID templates...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="id-photo" />
    </div>
  );
}
