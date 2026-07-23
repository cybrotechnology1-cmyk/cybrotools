"use client";
import { useEffect, useRef } from "react";

export default function NativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.dataset.loaded) {
      containerRef.current.dataset.loaded = "true";
      const script = document.createElement("script");
      script.src = "https://pl30479935.effectivecpmnetwork.com/46f4d2214a8a6f46d8152e0a5a785ace/invoke.js";
      script.async = true;
      (script as any).dataCfasync = false;
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="container-46f4d2214a8a6f46d8152e0a5a785ace"
      className="w-full my-4"
    />
  );
}
