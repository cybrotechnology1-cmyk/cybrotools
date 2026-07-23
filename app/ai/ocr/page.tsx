"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  UploadCloud, 
  Loader2, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  FileText, 
  Table, 
  FileSignature, 
  LayoutList
} from "lucide-react";
import { addHistoryLog } from "@/app/lib/history";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

type OCRMode = "standard" | "table" | "handwriting" | "structured";

export default function OCRTool() {
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<OCRMode>("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProgressText("Reading image file...");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setImage(base64Data);
      
      try {
        setProgressText("Analyzing layout with AI...");
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Data,
            mode: mode,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to extract text from image");
        }

        setProgressText("Decoding extracted characters...");
        const data = await response.json();
        setExtractedText(data.text);
        setIsLoading(false);

        addHistoryLog(
          "AI OCR",
          "Extract Text",
          `Extracted text from image using ${mode} mode`,
          "/ai/ocr"
        );
      } catch (err: any) {
        console.error("OCR Error:", err);
        setError(err.message || "An error occurred while processing the image.");
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [mode]);

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
  });

  const reset = () => {
    setImage(null);
    setExtractedText(null);
    setError(null);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadTextFile = () => {
    if (extractedText) {
      const element = document.createElement("a");
      const file = new Blob([extractedText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `extracted_text_edited_by_cybrotools.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <BannerAd />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
          <Sparkles className="w-8 h-8 text-blue-500" /> AI OCR Text Extractor
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-xl">
          Instantly convert scanned documents, screenshots, and handwritten notes into digital text with high precision.
        </p>
      </div>

      {!image && !isLoading && (
        <div className="space-y-6">
          {/* Settings / Extraction Mode Selection */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
              Select Recognition Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setMode("standard")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left transition-all ${
                  mode === "standard"
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 shadow-sm"
                    : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/30 dark:bg-zinc-950/20 text-gray-700 dark:text-zinc-300"
                }`}
              >
                <div className="p-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg mb-3 shadow-sm">
                  <FileText className={`w-5 h-5 ${mode === "standard" ? "text-blue-500" : "text-gray-500"}`} />
                </div>
                <span className="font-semibold text-sm">Standard OCR</span>
                <span className="text-xs text-gray-400 mt-1">Best for regular text documents and screenshots.</span>
              </button>

              <button
                onClick={() => setMode("table")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left transition-all ${
                  mode === "table"
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 shadow-sm"
                    : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/30 dark:bg-zinc-950/20 text-gray-700 dark:text-zinc-300"
                }`}
              >
                <div className="p-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg mb-3 shadow-sm">
                  <Table className={`w-5 h-5 ${mode === "table" ? "text-blue-500" : "text-gray-500"}`} />
                </div>
                <span className="font-semibold text-sm">Tables & Layout</span>
                <span className="text-xs text-gray-400 mt-1">Best for preserving tables in clean Markdown structure.</span>
              </button>

              <button
                onClick={() => setMode("handwriting")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left transition-all ${
                  mode === "handwriting"
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 shadow-sm"
                    : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/30 dark:bg-zinc-950/20 text-gray-700 dark:text-zinc-300"
                }`}
              >
                <div className="p-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg mb-3 shadow-sm">
                  <FileSignature className={`w-5 h-5 ${mode === "handwriting" ? "text-blue-500" : "text-gray-500"}`} />
                </div>
                <span className="font-semibold text-sm">Handwriting</span>
                <span className="text-xs text-gray-400 mt-1">Optimized for transcribing handwritten notes/scribbles.</span>
              </button>

              <button
                onClick={() => setMode("structured")}
                className={`flex flex-col items-start p-4 border rounded-xl text-left transition-all ${
                  mode === "structured"
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 shadow-sm"
                    : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/30 dark:bg-zinc-950/20 text-gray-700 dark:text-zinc-300"
                }`}
              >
                <div className="p-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg mb-3 shadow-sm">
                  <LayoutList className={`w-5 h-5 ${mode === "structured" ? "text-blue-500" : "text-gray-500"}`} />
                </div>
                <span className="font-semibold text-sm">Structured Doc</span>
                <span className="text-xs text-gray-400 mt-1">Maintains hierarchical structure, headers, and lists.</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm ${
              isDragActive ? "border-blue-500 scale-[1.01] bg-blue-50/10" : "border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-700"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700">
                <UploadCloud className="w-8 h-8 text-gray-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-xl font-medium">Drag & drop your document/image</p>
                <p className="text-gray-400 mt-1">or click to browse from files</p>
              </div>
              <div className="text-xs text-gray-400 mt-4">
                Supports PNG, JPG, and WEBP. Processing runs server-side with zero data storage.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">AI OCR Extraction</h3>
            <p className="text-gray-400 mt-2">{progressText}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30 rounded-2xl p-8 text-center max-w-md mx-auto space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-950 dark:text-white">Extraction Failed</h3>
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
          </div>
          <button 
            onClick={reset}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all text-sm"
          >
            Try Another Image
          </button>
        </div>
      )}

      {/* Result Display */}
      {image && extractedText && !isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
          {/* Image Panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Original Document</h3>
            <div className="bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-4 relative min-h-[300px] flex items-center justify-center">
              <Image 
                src={image} 
                alt="Original uploaded document" 
                className="max-h-[500px] w-auto h-auto rounded-lg object-contain shadow-sm"
                width={500}
                height={500}
                unoptimized
              />
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Upload Different Image
            </button>
          </div>

          {/* Extracted Text Panel */}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Extracted Text</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Text
                    </>
                  )}
                </button>
                <button
                  onClick={downloadTextFile}
                  className="p-2 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Download className="w-4 h-4" /> Download .TXT
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 min-h-[350px] font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto text-gray-800 dark:text-zinc-200 max-h-[500px]">
              {extractedText}
            </div>
          </div>
        </div>
      )}
      <ToolSeoSection toolId="ocr" />
    </div>
  );
}
