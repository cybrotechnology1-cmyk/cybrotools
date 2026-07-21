"use client";

import { useState, useMemo } from "react";
import { Copy, Trash2, Check } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const safeText = text || "";
    const textTrimmed = safeText.trim();
    const words = textTrimmed === "" ? 0 : textTrimmed.split(/\s+/).length;
    const characters = safeText.length;
    const charactersNoSpaces = safeText.replace(/\s+/g, "").length;
    const sentences = textTrimmed === "" ? 0 : (safeText.match(/[.!?]+/g) || []).length;
    const paragraphs = textTrimmed === "" ? 0 : safeText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Average reading speed is ~200 words per minute
    const readingTimeMins = Math.ceil(words / 200);

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTimeMins };
  }, [text]);

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText("");
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Word & Character Counter</h1>
        <p className="text-gray-500 dark:text-zinc-400">Instantly count words, characters, sentences, and paragraphs.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.characters },
          { label: "No Spaces", value: stats.charactersNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Reading Time", value: `${stats.readingTimeMins} min` },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-[300px] flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-end p-2 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50">
          <button 
            onClick={copyToClipboard}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800"
            title="Copy all text"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button 
            onClick={clearText}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800"
            title="Clear text"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="flex-1 w-full p-6 bg-transparent resize-none focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100"
        />
      </div>
      <ToolSeoSection toolId="word-counter" />
    </div>
  );
}