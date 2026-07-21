"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, RefreshCw, Sparkles, Grid, Eye } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function ImageSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [slices, setSlices] = useState<Array<{ id: string; url: string; row: number; col: number }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setSlices([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleSplit = () => {
    if (!imageUrl) return;
    
    // Set processing safely
    setTimeout(() => {
      setIsProcessing(true);
    }, 0);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const parts: Array<{ id: string; url: string; row: number; col: number }> = [];
      const sliceW = img.width / cols;
      const sliceH = img.height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offCanvas = document.createElement("canvas");
          offCanvas.width = sliceW;
          offCanvas.height = sliceH;
          const offCtx = offCanvas.getContext("2d");
          if (offCtx) {
            // Draw cropped segment
            offCtx.drawImage(
              img,
              c * sliceW,
              r * sliceH,
              sliceW,
              sliceH,
              0,
              0,
              sliceW,
              sliceH
            );
            parts.push({
              id: `${r}_${c}`,
              url: offCanvas.toDataURL("image/png"),
              row: r + 1,
              col: c + 1,
            });
          }
        }
      }

      setTimeout(() => {
        setSlices(parts);
        setIsProcessing(false);
      }, 0);
    };
  };

  useEffect(() => {
    if (imageUrl) {
      handleSplit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, rows, cols]);

  const handleDownloadSingle = (url: string, row: number, col: number) => {
    const link = document.createElement("a");
    link.download = `slice_r${row}_c${col}_${file?.name || "image.png"}`;
    link.href = url;
    link.click();
  };

  const handleDownloadAll = () => {
    slices.forEach((slice) => {
      handleDownloadSingle(slice.url, slice.row, slice.col);
    });
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl(null);
    setSlices([]);
  };

  return (
    <div id="splitter-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Image Splitter</h1>
          <p className="text-gray-500 dark:text-zinc-400">Slice images into grid grids or strips for social feeds, collages, or multi-post segments.</p>
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
                <Sliders className="w-5 h-5" /> Split Configuration
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Columns (Vertical Splits)</span>
                    <span className="font-mono">{cols}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Rows (Horizontal Splits)</span>
                    <span className="font-mono">{rows}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 border border-gray-150 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950/50 space-y-1.5 text-xs text-gray-500">
                <p className="font-medium text-gray-700 dark:text-zinc-300">Total Slices Generated:</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">{rows * cols} pieces</p>
              </div>

              <button
                onClick={handleDownloadAll}
                disabled={slices.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-5 h-5" /> Download All Pieces
              </button>
            </div>
          </div>

          {/* Slices Grid Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue-500" /> Sliced Output Matrix
                </h3>
                <p className="text-xs text-gray-500">Click on any piece thumbnail below to download it separately.</p>
              </div>
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-[350px] text-gray-400 gap-2">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                <p>Generating slices...</p>
              </div>
            ) : (
              <div
                className="grid gap-3 p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl max-h-[500px] overflow-y-auto"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {slices.map((slice) => (
                  <div
                    key={slice.id}
                    className="group relative border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 cursor-pointer shadow-sm hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => handleDownloadSingle(slice.url, slice.row, slice.col)}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={slice.url}
                        alt={`slice R${slice.row} C${slice.col}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-[2px] py-1 text-center text-[10px] text-white font-mono opacity-80 group-hover:opacity-100 transition-opacity">
                      R{slice.row}-C{slice.col}
                    </div>
                    <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <ToolSeoSection toolId="splitter" />
    </div>
  );
}
