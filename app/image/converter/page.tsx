"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Download, Settings, RefreshCw } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";

type ImageFormat = "image/png" | "image/jpeg" | "image/webp";

export default function ImageConverter() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("image/png");
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setConvertedUrl(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif", ".bmp"],
    },
    maxFiles: 1,
  });

  const handleConvert = () => {
    if (!originalUrl) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill with white for PNG to JPEG conversion to avoid black background
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL(targetFormat, quality / 100);
      setConvertedUrl(dataUrl);
      setIsProcessing(false);
    };
    img.src = originalUrl;
  };

  const getFormatExt = (format: string | undefined | null) => {
    if (!format || typeof format !== "string") return "png";
    const parts = format.split("/");
    return parts[1] || "png";
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setConvertedUrl(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Image Format Converter</h1>
          <p className="text-gray-500 dark:text-zinc-400">Convert images instantly in your browser (PNG, JPG, WEBP).</p>
        </div>
        {originalFile && (
          <button 
            onClick={reset}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-sm"
          >
            Upload New
          </button>
        )}
      </div>

      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {!originalFile ? (
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
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" /> Conversion Settings
              </h3>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium">Target Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "PNG", value: "image/png" },
                    { label: "JPG", value: "image/jpeg" },
                    { label: "WEBP", value: "image/webp" }
                  ].map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setTargetFormat(format.value as ImageFormat)}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                        targetFormat === format.value
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {(targetFormat === "image/jpeg" || targetFormat === "image/webp") && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-medium">Quality</label>
                    <span className="font-mono">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-gray-900 dark:accent-white"
                  />
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                Convert Image
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Original */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Original</h4>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center pattern-dots text-gray-300 dark:text-zinc-700" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {originalUrl && (
                    <Image src={originalUrl} alt="Original" fill className="object-contain" unoptimized />
                  )}
                </div>
              </div>

              {/* Converted */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Converted Output</h4>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center pattern-dots text-gray-300 dark:text-zinc-700" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {convertedUrl ? (
                    <>
                      <Image src={convertedUrl} alt="Converted" fill className="object-contain" unoptimized />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={convertedUrl}
                          download={`converted.${getFormatExt(targetFormat)}`}
                          className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          <Download className="w-5 h-5" />
                          Download {getFormatExt(targetFormat).toUpperCase()}
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 dark:text-zinc-600 flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                      <span className="text-sm">Click Convert</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
      <ToolSeoSection toolId="converter" />
    </div>
  );
}