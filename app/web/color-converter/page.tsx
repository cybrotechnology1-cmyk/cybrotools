"use client";

import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Palette, Shuffle, AlertCircle, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { addHistoryLog } from "@/app/lib/history";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

// --- MATH CONVERSIONS ---
function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  let r = l, g = l, b = l;
  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb(h: number, s: number, v: number) {
  h /= 360; s /= 100; v /= 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

function cmykToRgb(c: number, m: number, y: number, k: number) {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return { r, g, b };
}

// --- WCAG CONTRAST RATIO MATH ---
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(rgb1: {r: number, g: number, b: number}, rgb2: {r: number, g: number, b: number}) {
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export default function ColorConverter() {
  const [color, setColor] = useState("#6366f1"); // Active default
  
  // Explicitly parsed RGB values
  const [r, setR] = useState(99);
  const [g, setG] = useState(102);
  const [b, setB] = useState(241);

  // Raw string inputs for dynamic editing
  const [hexInput, setHexInput] = useState("#6366f1");
  const [rgbInput, setRgbInput] = useState("rgb(99, 102, 241)");
  const [hslInput, setHslInput] = useState("hsl(239, 84%, 67%)");
  const [hsvInput, setHsvInput] = useState("hsv(239, 59%, 95%)");
  const [cmykInput, setCmykInput] = useState("cmyk(59%, 58%, 0%, 5%)");

  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Contrast checker state
  const [textColor, setTextColor] = useState("#ffffff");

  // Calculate contrast ratio on-the-fly during render to avoid useEffect
  const textRgbVal = hexToRgb(textColor);
  const contrastRatio = textRgbVal ? Number(getContrastRatio({ r, g, b }, textRgbVal).toFixed(2)) : 4.5;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Keep state variables synchronized when a central Hex color is picked
  const syncAllFromRgb = (red: number, green: number, blue: number, source: string) => {
    const rx = Math.max(0, Math.min(255, red));
    const gx = Math.max(0, Math.min(255, green));
    const bx = Math.max(0, Math.min(255, blue));

    setR(rx);
    setG(gx);
    setB(bx);

    const activeHex = rgbToHex(rx, gx, bx);
    setColor(activeHex);

    if (source !== "hex") setHexInput(activeHex);
    if (source !== "rgb") setRgbInput(`rgb(${rx}, ${gx}, ${bx})`);

    const hsl = rgbToHsl(rx, gx, bx);
    if (source !== "hsl") setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);

    const hsv = rgbToHsv(rx, gx, bx);
    if (source !== "hsv") setHsvInput(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`);

    const cmyk = rgbToCmyk(rx, gx, bx);
    if (source !== "cmyk") setCmykInput(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`);
  };

  // Color Randomizer
  const randomizeColor = () => {
    const rx = Math.floor(Math.random() * 256);
    const gx = Math.floor(Math.random() * 256);
    const bx = Math.floor(Math.random() * 256);
    syncAllFromRgb(rx, gx, bx, "all");

    // Add activity logging
    addHistoryLog(
      "Color Converter",
      "Generate Random Color",
      `Generated random color ${rgbToHex(rx, gx, bx)}`,
      "/web/color-converter"
    );
  };

  // Individual Handlers for typing
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      syncAllFromRgb(parsed.r, parsed.g, parsed.b, "hex");
    }
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRgbInput(val);
    const parts = val.match(/\d+/g);
    if (parts && parts.length >= 3) {
      syncAllFromRgb(Number(parts[0]), Number(parts[1]), Number(parts[2]), "rgb");
    }
  };

  const handleHslChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHslInput(val);
    const parts = val.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const rgbParsed = hslToRgb(Number(parts[0]), Number(parts[1]), Number(parts[2]));
      syncAllFromRgb(rgbParsed.r, rgbParsed.g, rgbParsed.b, "hsl");
    }
  };

  const handleHsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHsvInput(val);
    const parts = val.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const rgbParsed = hsvToRgb(Number(parts[0]), Number(parts[1]), Number(parts[2]));
      syncAllFromRgb(rgbParsed.r, rgbParsed.g, rgbParsed.b, "hsv");
    }
  };

  const handleCmykChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCmykInput(val);
    const parts = val.match(/\d+/g);
    if (parts && parts.length >= 4) {
      const rgbParsed = cmykToRgb(Number(parts[0]), Number(parts[1]), Number(parts[2]), Number(parts[3]));
      syncAllFromRgb(rgbParsed.r, rgbParsed.g, rgbParsed.b, "cmyk");
    }
  };

  const handleColorPicker = (hexVal: string) => {
    const parsed = hexToRgb(hexVal);
    if (parsed) {
      syncAllFromRgb(parsed.r, parsed.g, parsed.b, "all");
    }
  };

  // Palette Creators
  const baseHsl = rgbToHsl(r, g, b);
  
  const complementaryHex = rgbToHex(Math.abs(255 - r), Math.abs(255 - g), Math.abs(255 - b));
  
  const getAnalogousScheme = () => {
    const h = baseHsl.h;
    const s = baseHsl.s;
    const l = baseHsl.l;
    
    const h1 = hslToRgb((h + 30) % 360, s, l);
    const h2 = hslToRgb((h - 30 + 360) % 360, s, l);

    return [
      rgbToHex(h1.r, h1.g, h1.b),
      color,
      rgbToHex(h2.r, h2.g, h2.b),
    ];
  };

  const getTriadicScheme = () => {
    const h = baseHsl.h;
    const s = baseHsl.s;
    const l = baseHsl.l;

    const h1 = hslToRgb((h + 120) % 360, s, l);
    const h2 = hslToRgb((h + 240) % 360, s, l);

    return [
      rgbToHex(h1.r, h1.g, h1.b),
      color,
      rgbToHex(h2.r, h2.g, h2.b),
    ];
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <BannerAd />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Palette className="w-8 h-8 text-indigo-500" />
            Ultimate Color Converter & Accessibility Suite
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-lg">
            Perform bidrectional, real-time conversion between HEX, RGB, HSL, HSV, & CMYK with standard WCAG compliance ratings.
          </p>
        </div>
        <button
          onClick={randomizeColor}
          className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm shadow-sm"
        >
          <Shuffle className="w-4 h-4" /> Random Color
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Converters Block */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-zinc-800/80">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="w-24 h-24 border-0 cursor-pointer rounded-2xl overflow-hidden p-0 shadow-sm"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Bidirectional Sync Console</h3>
              <p className="text-xs text-gray-400 mt-1">Adjust the canvas color block on the left or edit any string fields below dynamically.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hex */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-gray-400">HEX Hexadecimal</label>
                <button onClick={() => handleCopy(hexInput)} className="text-blue-500 hover:underline">
                  {copiedText === hexInput ? "Copied" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* RGB */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-gray-400">RGB Red Green Blue</label>
                <button onClick={() => handleCopy(rgbInput)} className="text-blue-500 hover:underline">
                  {copiedText === rgbInput ? "Copied" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                value={rgbInput}
                onChange={handleRgbChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* HSL */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-gray-400">HSL Hue Saturation Lightness</label>
                <button onClick={() => handleCopy(hslInput)} className="text-blue-500 hover:underline">
                  {copiedText === hslInput ? "Copied" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                value={hslInput}
                onChange={handleHslChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* HSV */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-gray-400">HSV Hue Saturation Value</label>
                <button onClick={() => handleCopy(hsvInput)} className="text-blue-500 hover:underline">
                  {copiedText === hsvInput ? "Copied" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                value={hsvInput}
                onChange={handleHsvChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* CMYK */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-gray-400">CMYK Cyan Magenta Yellow Black</label>
                <button onClick={() => handleCopy(cmykInput)} className="text-blue-500 hover:underline">
                  {copiedText === cmykInput ? "Copied" : "Copy"}
                </button>
              </div>
              <input
                type="text"
                value={cmykInput}
                onChange={handleCmykChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

          </div>
        </div>

        {/* Contrast Checker & Accessibility */}
        <div className="space-y-6">
          
          {/* WCAG compliant contrast analyzer */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> WCAG Contrast Meter
            </h3>

            {/* Dynamic visual preview block */}
            <div
              style={{ backgroundColor: color, color: textColor }}
              className="p-6 rounded-2xl border border-black/5 flex flex-col justify-between aspect-[16/9] shadow-inner transition-all duration-300"
            >
              <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sample Text Preview</span>
              <div className="space-y-1">
                <h4 className="text-xl font-bold tracking-tight">Cybro Engineering</h4>
                <p className="text-xs leading-relaxed opacity-90">Design with compliance and pristine layouts.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Text selector buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Compare Text Color</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { hex: "#ffffff", label: "Pure White" },
                    { hex: "#000000", label: "Pure Black" },
                    { hex: "#cbd5e1", label: "Slate Gray" },
                  ].map((btn) => (
                    <button
                      key={btn.hex}
                      onClick={() => setTextColor(btn.hex)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                        textColor === btn.hex
                          ? "bg-gray-900 dark:bg-white text-white dark:text-zinc-900 border-transparent font-bold"
                          : "border-gray-100 dark:border-zinc-800 hover:bg-gray-50 text-gray-600 dark:text-zinc-400"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score breakdown */}
              <div className="flex justify-between items-end border-t border-gray-100 dark:border-zinc-800/80 pt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Contrast Ratio</p>
                  <p className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white mt-1">
                    {contrastRatio} : 1
                  </p>
                </div>

                <div className="space-y-1.5 text-right">
                  <div className="flex items-center gap-1.5 text-xs font-bold justify-end">
                    {contrastRatio >= 4.5 ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AA Pass
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> AA Fail
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold justify-end">
                    {contrastRatio >= 7 ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AAA Pass
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> AAA Fail
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Palettes Swatches block */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Harmonized Variations</h3>

            <div className="space-y-4 pt-2">
              {/* Complementary */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-400 font-medium">Complementary Contrast Pair</span>
                <div className="flex gap-2">
                  <div
                    onClick={() => handleCopy(color)}
                    style={{ backgroundColor: color }}
                    className="flex-1 h-12 rounded-xl border border-black/5 cursor-pointer hover:scale-[1.02] transition-transform"
                  />
                  <div
                    onClick={() => handleCopy(complementaryHex)}
                    style={{ backgroundColor: complementaryHex }}
                    className="flex-1 h-12 rounded-xl border border-black/5 cursor-pointer hover:scale-[1.02] transition-transform"
                  />
                </div>
              </div>

              {/* Analogous */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-400 font-medium">Analogous Trio</span>
                <div className="flex gap-2">
                  {getAnalogousScheme().map((scColor, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCopy(scColor)}
                      style={{ backgroundColor: scColor }}
                      className="flex-1 h-12 rounded-xl border border-black/5 cursor-pointer hover:scale-[1.02] transition-transform"
                    />
                  ))}
                </div>
              </div>

              {/* Triadic */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-400 font-medium">Triadic Scheme</span>
                <div className="flex gap-2">
                  {getTriadicScheme().map((scColor, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCopy(scColor)}
                      style={{ backgroundColor: scColor }}
                      className="flex-1 h-12 rounded-xl border border-black/5 cursor-pointer hover:scale-[1.02] transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center pt-2">
              Click on any swatch above to instantly copy its HEX value.
            </p>
          </div>

        </div>

      </div>
      <ToolSeoSection toolId="color-converter" />
    </div>
  );
}
