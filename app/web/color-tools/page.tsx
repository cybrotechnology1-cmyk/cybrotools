"use client";

import { useState, useEffect } from "react";
import { Copy, Eye, Shuffle, RefreshCw } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function ColorTools() {
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState("#6366f1"); // Indigo primary

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper: Hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Helper: RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Helper: HSL to HEX
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const colorVal = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * colorVal).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Deriving values from state on the fly
  const rgbVal = hexToRgb(color);
  const rgb = rgbVal ? `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})` : "";
  const hslVal = rgbVal ? rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b) : null;
  const hsl = hslVal ? `hsl(${hslVal.h}°, ${hslVal.s}%, ${hslVal.l}%)` : "";

  // Dynamic palette scheme
  const palette: string[] = [];
  if (hslVal) {
    const steps = [-40, -20, 0, 20, 40];
    steps.forEach((step) => {
      const newL = Math.max(15, Math.min(90, hslVal.l + step));
      palette.push(hslToHex(hslVal.h, hslVal.s, newL));
    });
  }

  const generateRandomColor = () => {
    const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    setColor(randomHex);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <BannerAd />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Color Tools & Palette Generator</h1>
          <p className="text-gray-500 dark:text-zinc-400">Select, convert, and discover beautiful cohesive color schemes instantly.</p>
        </div>
        <button
          onClick={generateRandomColor}
          className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
        >
          <Shuffle className="w-4 h-4" /> Random Color
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Picker and Conversions */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-semibold text-lg">Picker & Conversions</h3>

          <div className="flex items-center gap-6">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-24 h-24 border-0 cursor-pointer rounded-2xl overflow-hidden p-0 shadow-sm"
            />
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Selected Hex</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(color)}
                  className="p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">RGB Format</span>
                <button onClick={() => handleCopy(rgb)} className="text-xs text-blue-600 hover:underline">Copy</button>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-950 px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm">
                {rgb}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">HSL Format</span>
                <button onClick={() => handleCopy(hsl)} className="text-xs text-blue-600 hover:underline">Copy</button>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-950 px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm">
                {hsl}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Palette */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2">Monochromatic Scheme</h3>
            <p className="text-sm text-gray-500 mb-6">Generated color harmony derived from lightness steps.</p>
          </div>

          <div className="grid grid-cols-5 gap-2 h-36">
            {palette.map((palColor, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(palColor)}
                style={{ backgroundColor: palColor }}
                className="rounded-xl relative cursor-pointer group flex flex-col justify-end p-2 border border-black/5 hover:scale-[1.03] transition-all shadow-sm"
              >
                <div className="bg-black/50 backdrop-blur-sm px-1.5 py-1 rounded text-[10px] text-white font-mono text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {palColor}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-400 text-center mt-4">
            Click on any color block above to copy its HEX value.
          </div>
        </div>

      </div>
      <ToolSeoSection toolId="color-tools" />
    </div>
  );
}
