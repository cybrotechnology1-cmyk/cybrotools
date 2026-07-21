"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none" />
      
      <div className="relative space-y-6 max-w-md z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121124] border border-[#232145] text-xs font-bold text-white tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Error 404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-none">
            Page Not Found
          </h1>
          <p className="text-sm text-[#8e8ca3] leading-relaxed">
            The tool or page you are looking for does not exist, or has been relocated to another segment of Cybro Tools.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#7B1FA2] to-[#1A237E] hover:from-[#8E24AA] hover:to-[#283593] text-white text-sm font-bold shadow-lg shadow-purple-500/15 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-2.5 px-5 rounded-xl bg-[#0c0a21]/95 border border-[#1f1a4e] text-white hover:bg-[#151236] text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
