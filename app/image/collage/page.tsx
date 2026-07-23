"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Sliders, RefreshCw, Sparkles, Plus, Trash2, LayoutGrid } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

type CollageLayout = "side-by-side" | "stacked" | "grid-2x2";

export default function CollagePage() {
  const [images, setImages] = useState<Array<{ id: string; file: File; url: string; imgObj: HTMLImageElement | null }>>([]);
  const [layout, setLayout] = useState<CollageLayout>("side-by-side");
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const loaded = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      const imgObj = new window.Image();
      imgObj.crossOrigin = "anonymous";
      imgObj.src = url;
      
      const item = { id: Math.random().toString(), file, url, imgObj };
      imgObj.onload = () => {
        // Trigger a re-render when image actually loads to run the draw code
        setImages((prev) => prev.map((p) => p.id === item.id ? { ...p, imgObj } : p));
      };
      return item;
    });

    setImages((prev) => [...prev, ...loaded].slice(0, 4)); // max 4 images
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  });

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  useEffect(() => {
    if (images.length === 0) {
      const handle = setTimeout(() => {
        setPreviewUrl(null);
      }, 0);
      return () => clearTimeout(handle);
    }

    // Wait until all images loaded are fully constructed
    const allLoaded = images.every((img) => img.imgObj !== null);
    if (!allLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed resolution for beautiful collage output
    const outWidth = 1200;
    const outHeight = 1200;
    canvas.width = outWidth;
    canvas.height = outHeight;

    // Draw Background
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, outWidth, outHeight);

    const drawItem = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
      ctx.save();
      // Draw Clip/Border boundary
      ctx.beginPath();
      ctx.rect(x + borderWidth, y + borderWidth, w - borderWidth * 2, h - borderWidth * 2);
      ctx.clip();

      // Cover scaling calculation
      const imgRatio = img.width / img.height;
      const targetRatio = w / h;
      let drawW = w;
      let drawH = h;
      if (imgRatio > targetRatio) {
        drawW = h * imgRatio;
      } else {
        drawH = w / imgRatio;
      }

      const dx = x + (w - drawW) / 2;
      const dy = y + (h - drawH) / 2;

      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    };

    if (layout === "side-by-side" || images.length === 1) {
      // Divide horizontal slots
      const count = images.length;
      const colW = outWidth / count;
      images.forEach((item, idx) => {
        if (item.imgObj) {
          drawItem(item.imgObj, idx * colW, 0, colW, outHeight);
        }
      });
    } else if (layout === "stacked") {
      // Divide vertical slots
      const count = images.length;
      const rowH = outHeight / count;
      images.forEach((item, idx) => {
        if (item.imgObj) {
          drawItem(item.imgObj, 0, idx * rowH, outWidth, rowH);
        }
      });
    } else if (layout === "grid-2x2") {
      // 2x2 layout, up to 4 images
      const slots = [
        { x: 0, y: 0 },
        { x: outWidth / 2, y: 0 },
        { x: 0, y: outHeight / 2 },
        { x: outWidth / 2, y: outHeight / 2 },
      ];
      const slotW = outWidth / 2;
      const slotH = outHeight / 2;

      images.forEach((item, idx) => {
        const slot = slots[idx];
        if (item.imgObj && slot) {
          drawItem(item.imgObj, slot.x, slot.y, slotW, slotH);
        }
      });
    }

    const dataUrl = canvas.toDataURL("image/png");
    const handle = setTimeout(() => {
      setPreviewUrl(dataUrl);
    }, 0);
    return () => clearTimeout(handle);
  }, [images, layout, borderWidth, borderColor]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = `collage_grid_edited_by_cybrotools.png`;
    link.href = previewUrl;
    link.click();
  };

  return (
    <div id="collage-container" className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <BannerAd />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Collage Maker</h1>
          <p className="text-gray-500 dark:text-zinc-400">Combine up to 4 images into dynamic grid layout composites inside your browser.</p>
        </div>
        {images.length > 0 && (
          <button
            onClick={() => setImages([])}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls & uploads */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" /> Layout Customizer
            </h3>

            {images.length < 4 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer text-center ${
                  isDragActive ? "border-blue-500 bg-blue-50/20" : "border-gray-200 dark:border-zinc-800 hover:border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Plus className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-medium">Add Image ({images.length}/4)</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WebP supported</p>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Loaded Images</label>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-150 dark:border-zinc-800 bg-gray-50">
                      <Image
                        src={img.url}
                        alt="loaded"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Template Grid Style</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "side-by-side", label: "Vertical Strip" },
                  { id: "stacked", label: "Horizontal Stack" },
                  { id: "grid-2x2", label: "2x2 Quadrants" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l.id as any)}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      layout === l.id
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-gray-200 dark:border-zinc-800 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Gaps & Border width</span>
                <span className="font-mono">{borderWidth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Border Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-10 h-10 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-full text-xs font-mono uppercase px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={images.length === 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
            >
              <Download className="w-5 h-5" /> Export Collage Composite
            </button>
          </div>
        </div>

        {/* Live Canvas composite */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" /> Unified Composite Preview
            </h3>
            <p className="text-xs text-gray-500">Live grid composition computed fully client-side.</p>
          </div>

          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 min-h-[400px] relative overflow-hidden border border-gray-150 dark:border-zinc-850">
            <canvas ref={canvasRef} className="hidden" />
            {previewUrl ? (
              <div className="relative max-w-full max-h-[500px]">
                <Image
                  src={previewUrl}
                  alt="Collage Preview"
                  width={800}
                  height={500}
                  className="object-contain max-h-[450px] rounded-lg shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="text-center text-gray-400 p-8 space-y-2">
                <LayoutGrid className="w-12 h-12 mx-auto text-gray-300 animate-pulse" />
                <p className="text-sm font-medium">No images uploaded yet</p>
                <p className="text-xs max-w-xs">Drop or click to add up to 4 files in the sidebar settings panel to form your collage frame.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToolSeoSection toolId="collage" />
    </div>
  );
}
