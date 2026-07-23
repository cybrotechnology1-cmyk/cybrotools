"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { Copy, Download, QrCode, Barcode, Check } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function Generators() {
  const [activeTab, setActiveTab] = useState<"qr" | "barcode">("qr");

  // QR Code States
  const [qrText, setQrText] = useState("https://cybrotools.example.com");
  const [qrSize, setQrSize] = useState(256);
  const [qrColorDark, setQrColorDark] = useState("#000000");
  const [qrColorLight, setQrColorLight] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");

  // Barcode States
  const [barcodeText, setBarcodeText] = useState("1234567890");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");
  const [barcodeLineColor, setBarcodeLineColor] = useState("#000000");
  const [barcodeBgColor, setBarcodeBgColor] = useState("#ffffff");
  
  const [copied, setCopied] = useState(false);
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  // Generate QR Code URL
  useEffect(() => {
    if (activeTab === "qr") {
      QRCode.toDataURL(qrText, {
        width: qrSize,
        color: {
          dark: qrColorDark,
          light: qrColorLight,
        },
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error(err));
    }
  }, [qrText, qrSize, qrColorDark, qrColorLight, activeTab]);

  // Generate Barcode on Canvas
  useEffect(() => {
    if (activeTab === "barcode" && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcodeText, {
          format: barcodeFormat,
          lineColor: barcodeLineColor,
          background: barcodeBgColor,
          width: 2,
          height: 100,
          displayValue: true,
        });
      } catch (err) {
        console.error("Barcode generation error: ", err);
      }
    }
  }, [barcodeText, barcodeFormat, barcodeLineColor, barcodeBgColor, activeTab]);

  const downloadBarcode = () => {
    const canvas = barcodeRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${barcodeText}_edited_by_cybrotools.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <BannerAd />
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">QR & Barcode Generator</h1>
        <p className="text-gray-500 dark:text-zinc-400">Generate high-quality, customizable QR codes and Barcodes on the fly.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === "qr"
              ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <QrCode className="w-4 h-4" /> QR Code
        </button>
        <button
          onClick={() => setActiveTab("barcode")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === "barcode"
              ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Barcode className="w-4 h-4" /> Barcode
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
        {activeTab === "qr" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* QR Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">QR Code Content / URL</label>
                <textarea
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none resize-none font-sans text-sm"
                  placeholder="Enter text or paste URL..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Foreground Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrColorDark}
                      onChange={(e) => setQrColorDark(e.target.value)}
                      className="w-10 h-10 border-0 cursor-pointer rounded-lg overflow-hidden"
                    />
                    <input
                      type="text"
                      value={qrColorDark}
                      onChange={(e) => setQrColorDark(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrColorLight}
                      onChange={(e) => setQrColorLight(e.target.value)}
                      className="w-10 h-10 border-0 cursor-pointer rounded-lg overflow-hidden"
                    />
                    <input
                      type="text"
                      value={qrColorLight}
                      onChange={(e) => setQrColorLight(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Image Resolution</label>
                  <span className="font-mono text-sm">{qrSize}x{qrSize}px</span>
                </div>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full accent-gray-900 dark:accent-white"
                />
              </div>
            </div>

            {/* QR Preview */}
            <div className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 rounded-2xl relative min-h-[300px]">
              {qrUrl ? (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="relative border border-gray-200 p-4 bg-white rounded-xl shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="QR Code" className="max-w-[200px]" />
                  </div>
                  <a
                    href={qrUrl}
                    download="qrcode_edited_by_cybrotools.png"
                    className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all text-sm"
                  >
                    <Download className="w-4 h-4" /> Download QR Code
                  </a>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Loading Preview...</span>
              )}
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Barcode Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Barcode Text</label>
                <input
                  type="text"
                  value={barcodeText}
                  onChange={(e) => setBarcodeText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                  placeholder="Enter values (numbers/text)..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format Standard</label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none text-sm font-medium"
                >
                  <option value="CODE128">Code 128 (General Purpose)</option>
                  <option value="EAN13">EAN-13 (Retail Standard)</option>
                  <option value="UPC">UPC-A (Universal Product Code)</option>
                  <option value="CODE39">Code 39</option>
                  <option value="ITF14">ITF-14</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Line Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={barcodeLineColor}
                      onChange={(e) => setBarcodeLineColor(e.target.value)}
                      className="w-10 h-10 border-0 cursor-pointer rounded-lg overflow-hidden"
                    />
                    <input
                      type="text"
                      value={barcodeLineColor}
                      onChange={(e) => setBarcodeLineColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={barcodeBgColor}
                      onChange={(e) => setBarcodeBgColor(e.target.value)}
                      className="w-10 h-10 border-0 cursor-pointer rounded-lg overflow-hidden"
                    />
                    <input
                      type="text"
                      value={barcodeBgColor}
                      onChange={(e) => setBarcodeBgColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode Preview */}
            <div className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 rounded-2xl relative min-h-[300px]">
              <div className="space-y-6 flex flex-col items-center w-full">
                <div className="bg-white p-4 border border-gray-200 rounded-xl w-full flex justify-center max-w-sm">
                  <canvas ref={barcodeRef} className="max-w-full" />
                </div>
                <button
                  onClick={downloadBarcode}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all text-sm"
                >
                  <Download className="w-4 h-4" /> Download Barcode
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
      <ToolSeoSection toolId="generators" />
    </div>
  );
}
