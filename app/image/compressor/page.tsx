"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, Download, Settings, RefreshCw, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
      setError("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

  const handleCompress = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setError("");

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(originalFile, options);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedFile(null);
    setCompressedUrl(null);
    setError("");
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Image Compressor</h1>
          <p className="text-gray-500 dark:text-zinc-400">Reduce image file sizes directly in your browser without losing quality.</p>
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

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

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
                <Settings className="w-5 h-5" /> Compression Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-medium">Target Max Size (MB)</label>
                  <span className="font-mono">{maxSizeMB} MB</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="w-full accent-gray-900 dark:accent-white"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-medium">Max Dimensions (px)</label>
                  <span className="font-mono">{maxWidthOrHeight} px</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={maxWidthOrHeight}
                  onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                  className="w-full accent-gray-900 dark:accent-white"
                />
              </div>

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                Compress Image
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Original */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm text-gray-500">Original</h4>
                  <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                    {formatBytes(originalFile.size)}
                  </span>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center pattern-dots text-gray-300 dark:text-zinc-700" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {originalUrl && (
                    <Image src={originalUrl} alt="Original" fill className="object-contain" unoptimized />
                  )}
                </div>
              </div>

              {/* Compressed */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm text-gray-500">Compressed Output</h4>
                  {compressedFile && (
                    <span className="text-sm font-mono font-medium text-green-600 dark:text-green-400">
                      {formatBytes(compressedFile.size)} 
                      {` (-${Math.round((1 - compressedFile.size / originalFile.size) * 100)}%)`}
                    </span>
                  )}
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center pattern-dots text-gray-300 dark:text-zinc-700" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  {compressedUrl && compressedFile ? (
                    <>
                      <Image src={compressedUrl} alt="Compressed" fill className="object-contain" unoptimized />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={compressedUrl}
                          download={`compressed_${originalFile.name}`}
                          className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 dark:text-zinc-600 flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                      <span className="text-sm">Click Compress</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
      <ToolSeoSection toolId="compressor" />
    </div>
  );
}