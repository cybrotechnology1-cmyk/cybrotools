"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, Type, RefreshCw, Sparkles, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function TextOnImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("Your Caption Here");
  const [color, setColor] = useState("#ffffff");
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(64);
  const [outlineWidth, setOutlineWidth] = useState(4);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [posX, setPosX] = useState(50); // percentage 0-100
  const [posY, setPosY] = useState(80); // percentage 0-100
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

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Setup Text Options
      ctx.save();
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";

      const actualX = (posX / 100) * canvas.width;
      const actualY = (posY / 100) * canvas.height;

      // Draw Stroke Outline first
      if (outlineWidth > 0) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = "round";
        ctx.strokeText(text, actualX, actualY);
      }

      // Draw Fill Text
      ctx.fillStyle = color;
      ctx.fillText(text, actualX, actualY);

      ctx.restore();

      // Update Preview
      setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imageUrl, text, color, outlineColor, fontSize, outlineWidth, align, posX, posY]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `captioned_${file?.name || "image"}_edited_by_cybrotools.png`;
    link.href = previewUrl;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setPreviewUrl(null);
  };

  return (
    <div id="text-on-image-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <BannerAd />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Text on Image</h1>
          <p className="text-gray-500 dark:text-zinc-400">Add stylish text captions, labels, and graphic typography to your images.</p>
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
                <Sliders className="w-5 h-5" /> Text Settings
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Caption Text</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full text-xs font-mono uppercase px-2 py-1 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Outline Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={outlineColor}
                      onChange={(e) => setOutlineColor(e.target.value)}
                      className="w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-lg cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={outlineColor}
                      onChange={(e) => setOutlineColor(e.target.value)}
                      className="w-full text-xs font-mono uppercase px-2 py-1 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size (px)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Outline Width</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={outlineWidth}
                    onChange={(e) => setOutlineWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Text Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "left", label: "Left", icon: <AlignLeft className="w-4 h-4 mx-auto" /> },
                    { id: "center", label: "Center", icon: <AlignCenter className="w-4 h-4 mx-auto" /> },
                    { id: "right", label: "Right", icon: <AlignRight className="w-4 h-4 mx-auto" /> },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAlign(a.id as any)}
                      className={`py-2 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        align === a.id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                          : "border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      {a.icon}
                      <span className="text-[10px] mt-1">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Horizontal Position (X)</span>
                  <span className="font-mono">{posX}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Vertical Position (Y)</span>
                  <span className="font-mono">{posY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download Captioned Image
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Image Preview
              </h3>
              <p className="text-xs text-gray-500">Live preview matches original image resolution perfectly.</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[350px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl ? (
                <div className="relative max-w-full max-h-[500px]">
                  <Image
                    src={previewUrl}
                    alt="Text on Image Preview"
                    width={800}
                    height={500}
                    className="object-contain max-h-[450px] rounded-lg shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Generating premium render...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="text-on-image" />
    </div>
  );
}
