"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivacyBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("privacy-accepted");
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("privacy-accepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0a0a1a] border-t border-[#2a2a4a] p-4 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-300 flex-1">
          We use cookies &amp; third-party ads (Monetag) to provide the best experience. 
          By continuing, you accept our{" "}
          <Link href="/privacy" className="text-blue-400 hover:underline font-medium">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3 shrink-0">
          <Link href="/privacy" className="text-xs text-gray-400 hover:text-white underline">Learn More</Link>
          <button onClick={accept} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition">Accept</button>
        </div>
      </div>
    </div>
  );
}
