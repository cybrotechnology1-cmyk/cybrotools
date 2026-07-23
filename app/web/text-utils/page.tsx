"use client";

import { useState } from "react";
import { Copy, FileText, Check, Layers, ArrowRightLeft } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { BannerAd } from "@/components/BannerAd";

export default function TextUtils() {
  const [activeTab, setActiveTab] = useState<"counter" | "diff" | "lorem">("counter");
  const [copied, setCopied] = useState(false);

  // Word Counter States
  const [counterText, setCounterText] = useState("");
  
  // Diff States
  const [diffText1, setDiffText1] = useState("Hello world this is some original content.");
  const [diffText2, setDiffText2] = useState("Hello world! This is some edited text.");
  const [diffResult, setDiffResult] = useState<{ type: "added" | "removed" | "equal"; value: string }[]>([]);

  // Lorem Ipsum States
  const [paragraphsCount, setParagraphsCount] = useState(3);
  const [loremResult, setLoremResult] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Word & Character count calculations
  const getStats = () => {
    const safeText = counterText || "";
    const chars = safeText.length;
    const words = safeText.trim() === "" ? 0 : safeText.trim().split(/\s+/).length;
    const lines = safeText === "" ? 0 : safeText.split("\n").length;
    const readingTime = Math.ceil(words / 200); // Average 200 wpm
    return { chars, words, lines, readingTime };
  };

  // Basic diff algorithm (word-based)
  const compareText = () => {
    const safeText1 = diffText1 || "";
    const safeText2 = diffText2 || "";
    const w1 = safeText1.trim().split(/\s+/);
    const w2 = safeText2.trim().split(/\s+/);
    const result: { type: "added" | "removed" | "equal"; value: string }[] = [];

    // Simple diffing helper logic
    let i = 0, j = 0;
    while (i < w1.length || j < w2.length) {
      if (i < w1.length && j < w2.length && w1[i] === w2[j]) {
        result.push({ type: "equal", value: w1[i] });
        i++;
        j++;
      } else if (j < w2.length && (i >= w1.length || !w1.slice(i).includes(w2[j]))) {
        result.push({ type: "added", value: w2[j] });
        j++;
      } else {
        result.push({ type: "removed", value: w1[i] });
        i++;
      }
    }
    setDiffResult(result);
  };

  // Lorem Ipsum standard generator
  const generateLorem = () => {
    const sentences = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Proin elementum, leo non efficitur hendrerit, augue ligula consequat magna, ac tempus nunc nisl sed leo.",
      "Integer et lectus rhoncus, accumsan tellus a, dapibus justo.",
      "Cras gravida libero sed quam lacinia lobortis.",
      "Fusce vitae urna elementum, sollicitudin elit eu, hendrerit sem.",
      "Sed quis ex eu arcu finibus congue rhoncus ut metus.",
      "Nulla nec purus at lorem elementum tempus sed non ante.",
      "Vestibulum id metus vitae diam imperdiet imperdiet eget sed ipsum.",
    ];

    let result = [];
    for (let p = 0; p < paragraphsCount; p++) {
      let para = [];
      const sentenceCount = 4 + Math.floor(Math.random() * 4);
      for (let s = 0; s < sentenceCount; s++) {
        para.push(sentences[Math.floor(Math.random() * sentences.length)]);
      }
      result.push(para.join(" "));
    }
    setLoremResult(result.join("\n\n"));
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <BannerAd />
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Text & Content Utilities</h1>
        <p className="text-gray-500 dark:text-zinc-400">Manipulate, count, compare, and generate text directly in your web browser.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("counter")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === "counter"
              ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" /> Word Counter
        </button>
        <button
          onClick={() => setActiveTab("diff")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === "diff"
              ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Text Diff
        </button>
        <button
          onClick={() => setActiveTab("lorem")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === "lorem"
              ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" /> Lorem Ipsum
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
        
        {/* WORD COUNTER TAB */}
        {activeTab === "counter" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 text-center">
                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{getStats().words}</p>
                <p className="text-xs text-gray-500 font-medium">Words</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 text-center">
                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{getStats().chars}</p>
                <p className="text-xs text-gray-500 font-medium">Characters</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 text-center">
                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{getStats().lines}</p>
                <p className="text-xs text-gray-500 font-medium">Paragraphs/Lines</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 text-center">
                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{getStats().readingTime} min</p>
                <p className="text-xs text-gray-500 font-medium">Reading Time</p>
              </div>
            </div>

            <textarea
              value={counterText}
              onChange={(e) => setCounterText(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl focus:outline-none text-sm font-sans resize-none"
              placeholder="Paste or type content here for real-time word analysis..."
            />
          </div>
        )}

        {/* TEXT DIFF TAB */}
        {activeTab === "diff" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Original Version</label>
                <textarea
                  value={diffText1}
                  onChange={(e) => setDiffText1(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none text-sm font-sans resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Modified Version</label>
                <textarea
                  value={diffText2}
                  onChange={(e) => setDiffText2(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none text-sm font-sans resize-none"
                />
              </div>
            </div>

            <button
              onClick={compareText}
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Analyze Changes
            </button>

            {diffResult.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-500">Difference Report</h4>
                <div className="p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl min-h-[100px] flex flex-wrap gap-x-1.5 gap-y-1 font-sans text-sm">
                  {diffResult.map((part, idx) => {
                    if (part.type === "added") {
                      return <span key={idx} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1 rounded line-through decoration-transparent font-medium">{part.value}</span>;
                    }
                    if (part.type === "removed") {
                      return <span key={idx} className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-1 rounded line-through">{part.value}</span>;
                    }
                    return <span key={idx} className="text-gray-700 dark:text-zinc-300">{part.value}</span>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOREM IPSUM TAB */}
        {activeTab === "lorem" && (
          <div className="space-y-6">
            <div className="flex items-end gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Paragraphs</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={paragraphsCount}
                  onChange={(e) => setParagraphsCount(Number(e.target.value))}
                  className="w-24 px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                />
              </div>

              <button
                onClick={generateLorem}
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors h-[42px]"
              >
                Generate Placeholder
              </button>
            </div>

            {loremResult && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Output</span>
                  <button
                    onClick={() => handleCopy(loremResult)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={loremResult}
                  className="w-full h-60 p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-sans text-sm focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

      </div>
      <ToolSeoSection toolId="text-utils" />
    </div>
  );
}
