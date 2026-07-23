"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Play, Lock, Hash, Code, Sparkles } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function DevUtils() {
  const [activeTab, setActiveTab] = useState<"uuid" | "hash" | "base64" | "url" | "json" | "html-format" | "css-minify" | "js-beautify">("uuid");
  const [copied, setCopied] = useState(false);

  // States
  const [uuidCount, setUuidCount] = useState(5);
  const [uuidResults, setUuidResults] = useState<string[]>([]);
  
  const [hashInput, setHashInput] = useState("");
  const [hashResult, setHashResult] = useState({ sha256: "", sha1: "" });

  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [base64Error, setBase64Error] = useState("");

  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");

  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");

  const [htmlInput, setHtmlInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [htmlError, setHtmlError] = useState("");

  const [cssInput, setCssInput] = useState("");
  const [cssOutput, setCssOutput] = useState("");

  const [jsInput, setJsInput] = useState("");
  const [jsOutput, setJsOutput] = useState("");
  const [jsError, setJsError] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // UUID Generator
  const generateUUIDs = () => {
    const list = [];
    for (let i = 0; i < uuidCount; i++) {
      const uuid = crypto.randomUUID();
      list.push(uuid);
    }
    setUuidResults(list);
  };

  // Hash Generator (using native Web Crypto API)
  const calculateHashes = async () => {
    if (!hashInput) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);

    // SHA-256
    const hash256Buffer = await crypto.subtle.digest("SHA-256", data);
    const hash256Array = Array.from(new Uint8Array(hash256Buffer));
    const hash256Hex = hash256Array.map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-1
    const hash1Buffer = await crypto.subtle.digest("SHA-1", data);
    const hash1Array = Array.from(new Uint8Array(hash1Buffer));
    const hash1Hex = hash1Array.map(b => b.toString(16).padStart(2, '0')).join('');

    setHashResult({ sha256: hash256Hex, sha1: hash1Hex });
  };

  // Base64 Encode / Decode
  const handleBase64Encode = () => {
    try {
      setBase64Error("");
      const encoded = btoa(unescape(encodeURIComponent(base64Input)));
      setBase64Output(encoded);
    } catch (err: any) {
      setBase64Error("Failed to encode. Ensure valid text input.");
    }
  };

  const handleBase64Decode = () => {
    try {
      setBase64Error("");
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Output(decoded);
    } catch (err: any) {
      setBase64Error("Failed to decode. Ensure the input is valid Base64.");
    }
  };

  // URL Encode / Decode
  const handleUrlEncode = () => {
    setUrlOutput(encodeURIComponent(urlInput));
  };

  const handleUrlDecode = () => {
    setUrlOutput(decodeURIComponent(urlInput));
  };

  // JSON Formatter / Validator
  const handleJsonFormat = () => {
    try {
      setJsonError("");
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleJsonMinify = () => {
    try {
      setJsonError("");
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  };

  // HTML Formatter
  const handleHtmlFormat = () => {
    try {
      setHtmlError("");
      const safeInput = htmlInput || "";
      if (!safeInput.trim()) {
        setHtmlOutput("");
        return;
      }

      // Simple browser-only regex-based pretty printing for HTML
      let formatted = "";
      const reg = /(>)(<)(\/*)/g;
      let html = safeInput.replace(reg, "$1\r\n$2$3");
      let pad = 0;
      
      const lines = html.split("\r\n");
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (line.match(/^<\/\w/) && pad !== 0) {
          pad -= 1;
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/^<(input|link|meta|br|img|hr)/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        formatted += "  ".repeat(pad) + line + "\r\n";
        pad += indent;
      }
      setHtmlOutput(formatted.trim());
    } catch (err: any) {
      setHtmlError("Error formatting HTML: " + err.message);
    }
  };

  // CSS Minifier
  const handleCssMinify = () => {
    if (!cssInput.trim()) {
      setCssOutput("");
      return;
    }
    // Perform browser-only CSS minification
    let minified = cssInput
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s*([{}|:;,])\s*/g, "$1") // Remove spacing around punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/;\}/g, "}") // Remove last semicolon in rules
      .trim();
    setCssOutput(minified);
  };

  // JS Beautifier
  const handleJsBeautify = () => {
    try {
      setJsError("");
      const safeInput = jsInput || "";
      if (!safeInput.trim()) {
        setJsOutput("");
        return;
      }

      // Browser-only interactive JS indent/beautify algorithm
      let indent = 0;
      let result = "";
      const tokens = safeInput
        .replace(/([{}()[\];,])/g, " $1 ") // Add space around separators
        .split(/\s+/);
      
      let newline = true;
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim();
        if (!token) continue;

        if (token === "}" || token === "]" || token === ")") {
          indent = Math.max(0, indent - 1);
        }

        if (newline) {
          result += "  ".repeat(indent);
          newline = false;
        } else {
          result += " ";
        }

        result += token;

        if (token === "{" || token === "[" || token === "(") {
          indent += 1;
          result += "\n";
          newline = true;
        } else if (token === ";" || token === "}") {
          result += "\n";
          newline = true;
        }
      }

      // Format output nicely with clean line breaks
      setJsOutput(result.trim());
    } catch (err: any) {
      setJsError("Failed to beautify JS: " + err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <BannerAd />
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Developer Utilities</h1>
        <p className="text-gray-500 dark:text-zinc-400">Essential utilities for developers, formatted and run 100% locally in-browser.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-xl overflow-x-auto gap-1">
        {[
          { id: "uuid", label: "UUID v4" },
          { id: "hash", label: "Hash Calculator" },
          { id: "base64", label: "Base64 Codec" },
          { id: "url", label: "URL Encoder" },
          { id: "json", label: "JSON Formatter" },
          { id: "html-format", label: "HTML Formatter" },
          { id: "css-minify", label: "CSS Minifier" },
          { id: "js-beautify", label: "JS Beautifier" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
        
        {/* UUID TAB */}
        {activeTab === "uuid" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-medium">Number of UUIDs</label>
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={uuidCount} 
                  onChange={(e) => setUuidCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                />
              </div>
              <button 
                onClick={generateUUIDs}
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors h-[46px]"
              >
                <Terminal className="w-4 h-4" /> Generate UUIDs
              </button>
            </div>

            {uuidResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Results</span>
                  <button 
                    onClick={() => handleCopy(uuidResults.join("\n"))}
                    className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
                  >
                    {copied ? "Copied!" : "Copy All"}
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-950 p-4 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm max-h-64 overflow-y-auto space-y-2">
                  {uuidResults.map((uuid, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <span>{uuid}</span>
                      <button 
                        onClick={() => handleCopy(uuid)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HASH TAB */}
        {activeTab === "hash" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Plaintext Input</label>
              <textarea
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                onKeyUp={calculateHashes}
                className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none resize-none font-sans text-sm"
                placeholder="Type here to calculate hashes instantly..."
              />
            </div>

            {hashInput && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">SHA-256</span>
                    <button onClick={() => handleCopy(hashResult.sha256)} className="text-xs text-blue-600 hover:underline">Copy</button>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-950 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm break-all">
                    {hashResult.sha256}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">SHA-1</span>
                    <button onClick={() => handleCopy(hashResult.sha1)} className="text-xs text-blue-600 hover:underline">Copy</button>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-950 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm break-all">
                    {hashResult.sha1}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BASE64 TAB */}
        {activeTab === "base64" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Input Data</label>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none resize-none font-sans text-sm"
                  placeholder="Enter text or base64..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleBase64Encode}
                  className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Encode to Base64
                </button>
                <button
                  onClick={handleBase64Decode}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Decode to Raw
                </button>
              </div>

              {base64Error && (
                <p className="text-sm text-red-500 font-medium">{base64Error}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Output Result</label>
                <button
                  disabled={!base64Output}
                  onClick={() => handleCopy(base64Output)}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={base64Output}
                className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* URL TAB */}
        {activeTab === "url" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Input URI</label>
                <textarea
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none resize-none font-sans text-sm"
                  placeholder="Enter URL to parse..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUrlEncode}
                  className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  URL Encode
                </button>
                <button
                  onClick={handleUrlDecode}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  URL Decode
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Output Result</label>
                <button
                  disabled={!urlOutput}
                  onClick={() => handleCopy(urlOutput)}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={urlOutput}
                className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* JSON TAB */}
        {activeTab === "json" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">JSON Source</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
                  placeholder='{"key": "value"}'
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleJsonFormat}
                  className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Format JSON
                </button>
                <button
                  onClick={handleJsonMinify}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Minify JSON
                </button>
              </div>

              {jsonError && (
                <p className="text-sm text-red-500 font-medium">{jsonError}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Validated Output</label>
                <button
                  disabled={!jsonOutput}
                  onClick={() => handleCopy(jsonOutput)}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={jsonOutput}
                className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* HTML FORMATTER */}
        {activeTab === "html-format" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">HTML Raw Source</label>
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
                  placeholder="<div><p>Hello World</p></div>"
                />
              </div>

              <button
                onClick={handleHtmlFormat}
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Beautify & Format HTML
              </button>

              {htmlError && (
                <p className="text-sm text-red-500 font-medium">{htmlError}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Formatted HTML</label>
                <button
                  disabled={!htmlOutput}
                  onClick={() => handleCopy(htmlOutput)}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={htmlOutput}
                className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* CSS MINIFIER */}
        {activeTab === "css-minify" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CSS Raw Source</label>
                <textarea
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
                  placeholder=".card { margin: 20px; padding: 10px; }"
                />
              </div>

              <button
                onClick={handleCssMinify}
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Minify CSS
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Minified CSS Result</label>
                <button
                  disabled={!cssOutput}
                  onClick={() => handleCopy(cssOutput)}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={cssOutput}
                className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* JS BEAUTIFIER */}
        {activeTab === "js-beautify" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">JavaScript Raw Source</label>
                <textarea
                  value={jsInput}
                  onChange={(e) => setJsInput(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
                  placeholder="function hello(){console.log('world');}"
                />
              </div>

              <button
                onClick={handleJsBeautify}
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Beautify JavaScript
              </button>

              {jsError && (
                <p className="text-sm text-red-500 font-medium">{jsError}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Beautified JS Result</label>
                <button
                  disabled={!jsOutput}
                  onClick={() => handleCopy(jsOutput)}
                  className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={jsOutput}
                className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none"
              />
            </div>
          </div>
        )}

      </div>
      <ToolSeoSection toolId="dev-utils" />
    </div>
  );
}
