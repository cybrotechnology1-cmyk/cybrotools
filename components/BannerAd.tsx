"use client";

import { useEffect, useRef } from "react";

const MOBILE_KEY = "b7e5d5033452d4cf0f1982478cbede30";
const DESKTOP_KEY = "19b8a5319bc06f7fd464b674cd54e70a";

const MOBILE_OPTIONS = {
  key: MOBILE_KEY,
  format: "iframe",
  height: 50,
  width: 320,
  params: {},
};

const DESKTOP_OPTIONS = {
  key: DESKTOP_KEY,
  format: "iframe",
  height: 90,
  width: 728,
  params: {},
};

export function BannerAd() {
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAd = (container: HTMLDivElement | null, key: string, options: any) => {
      if (!container) return;
      if (container.querySelector("script")) return;

      (window as any).atOptions = options;

      const script = document.createElement("script");
      script.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
      script.async = true;
      container.appendChild(script);
    };

    if (mobileRef.current) loadAd(mobileRef.current, MOBILE_KEY, MOBILE_OPTIONS);
    if (desktopRef.current) loadAd(desktopRef.current, DESKTOP_KEY, DESKTOP_OPTIONS);
  }, []);

  return (
    <div className="w-full flex justify-center py-3 min-h-[60px] md:min-h-[100px]">
      <div ref={mobileRef} className="block md:hidden" />
      <div ref={desktopRef} className="hidden md:block" />
    </div>
  );
}
