"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, Type, RefreshCw, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function MemePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [topText, setTopText] = useState("WHEN THE SYSTEM");
  const [bottomText, setBottomText] = useState("BUILDS ON THE FIRST RUN");
  const [fontSize, setFontSize] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [uppercase, setUppercase] = useState(true);
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

      // Draw Base Image
      ctx.drawImage(img, 0, 0);

      // Setup Text Properties (Impact style font matches standard memes)
      ctx.save();
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = color;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = fontSize / 6;
      ctx.lineJoin = "round";

      // Format Text
      const processText = (txt: string) => (uppercase ? txt.toUpperCase() : txt);
      const top = processText(topText);
      const bottom = processText(bottomText);

      // Top Text Positioning
      if (top) {
        ctx.textBaseline = "top";
        ctx.strokeText(top, canvas.width / 2, fontSize / 2);
        ctx.fillText(top, canvas.width / 2, fontSize / 2);
      }

      // Bottom Text Positioning
      if (bottom) {
        ctx.textBaseline = "bottom";
        ctx.strokeText(bottom, canvas.width / 2, canvas.height - fontSize / 2);
        ctx.fillText(bottom, canvas.width / 2, canvas.height - fontSize / 2);
      }

      ctx.restore();

      // Set Preview
      setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imageUrl, topText, bottomText, fontSize, color, strokeColor, uppercase]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `meme_${file?.name || "image.png"}`;
    link.href = previewUrl;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setPreviewUrl(null);
  };

  return (
    <div id="meme-generator-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Meme Generator</h1>
          <p className="text-gray-500 dark:text-zinc-400">Create classic internet memes with your own templates or custom blank uploads.</p>
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
              <p className="text-xl font-medium">Drag & drop a template here</p>
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
                <Sliders className="w-5 h-5" /> Meme Config
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Top Caption</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="TOP TEXT"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bottom Caption</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="BOTTOM TEXT"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Font Size (px)</label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Outline Color</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-full h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-150 dark:border-zinc-800/80 rounded-xl bg-gray-50 dark:bg-zinc-950">
                <label className="text-sm font-medium cursor-pointer" htmlFor="uppercase-toggle">
                  Auto Uppercase
                </label>
                <input
                  id="uppercase-toggle"
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download Meme
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Meme Canvas
              </h3>
              <p className="text-xs text-gray-500">Live preview rendered on an Impact-ready canvas layer.</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[350px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl ? (
                <div className="relative max-w-full max-h-[500px]">
                  <Image
                    src={previewUrl}
                    alt="Meme Preview"
                    width={800}
                    height={500}
                    className="object-contain max-h-[450px] rounded-lg shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm">Rendering meme preview...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="meme" />
    </div>
  );
}
