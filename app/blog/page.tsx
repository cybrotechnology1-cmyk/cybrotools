"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User, ArrowRight, Sparkles, Sliders, Youtube, ShieldAlert, Tag, Clock, Compass, Share2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import NativeBanner from "@/components/NativeBanner";

const blogPosts = [
  {
    id: "1",
    title: "How We Removed Image Backgrounds Instantly & Locally with cybro2.50 (Classic cybro AI)",
    excerpt: "Learn how we use advanced ONNX Runtime Web and WebGL inside Web Workers to perform AI background removal 100% in your browser safely.",
    category: "AI Image",
    date: "July 18, 2026",
    author: "Cybro Engineering Team",
    readTime: "4 min read",
    content: "Our AI background remover operates entirely on the client side. By leveraging WebAssembly and the cybro2.50 (Classic cybro AI) model loaded dynamically using transformers.js, we eliminate any server upload costs and ensure user files are never stored on external databases. This is a massive step forward for safe, private, and fast data processing."
  },
  {
    id: "2",
    title: "Deep Dive into Browser-based Image Cropping & Ratio Math",
    excerpt: "Discover the inner workings of canvas-based responsive cropping, aspect ratio math, and native clipping matrices without external libraries.",
    category: "Image Processing",
    date: "July 17, 2026",
    author: "Visual UI Group",
    readTime: "5 min read",
    content: "Many modern sites load large external canvas wrappers that frequently break on resized frames. We built a native React + percentage-based crop coordinator that transforms coordinates into canvas context draw operations using dynamic scaling parameters. This ensures pixel-perfect high-dpi results every single run."
  },
  {
    id: "3",
    title: "Why Client-Side Cryptographically Secure Generators Keep You Safe",
    excerpt: "Passwords and secrets should never touch a server. Why Web Crypto API is superior to mock randomized generators.",
    category: "Security",
    date: "July 15, 2026",
    author: "Security Team",
    readTime: "3 min read",
    content: "Our password generator utilizes window.crypto.getRandomValues for absolute entropy. Combined with offline client-side parsing, this prevents side-channel leaks, logging, and database exposure. Your security is 100% contained in your sandboxed browser tab."
  },
  {
    id: "4",
    title: "Optimizing YouTube Assets: The Mechanics of HD Thumbnails & Custom Embeds",
    excerpt: "An informational guide to extracting max-res thumbnails and configuring standard player parameters dynamically.",
    category: "Media Tools",
    date: "July 12, 2026",
    author: "Creator Lead",
    readTime: "3 min read",
    content: "YouTube provides several resolution fallbacks (maxresdefault, hqdefault, sddefault, mqdefault). We built an active handler checking and matching these resolutions to provide immediate asset downloads and dynamic player configurations for creators."
  }
];

function getCategoryIcon(category: string) {
  switch (category) {
    case "AI Image": return <Sparkles className="w-5 h-5 text-purple-500" />;
    case "Image Processing": return <Sliders className="w-5 h-5 text-blue-500" />;
    case "Security": return <ShieldAlert className="w-5 h-5 text-emerald-500" />;
    case "Media Tools": return <Youtube className="w-5 h-5 text-red-500" />;
    default: return <BookOpen className="w-5 h-5 text-gray-500" />;
  }
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const relatedPosts = selectedPost
    ? posts.filter(p => p.id !== selectedPost.id && p.category === selectedPost.category).slice(0, 3)
    : [];

  const availableCategories = [
    "All",
    "AI Image Editing",
    "Image Optimization",
    "Photo Editing",
    "YouTube Creator Tips",
    "YouTube SEO",
    "Graphic Design",
    "Online Image Tools",
    "Browser AI",
    "Content Creation",
    "Product Photography",
    "Web Utilities"
  ];

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(blogPosts);
        }
      })
      .catch(() => {
        setPosts(blogPosts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post => 
    selectedCategory === "All" || post.category === selectedCategory
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          Cybro Blog
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-sm md:text-base">
          Insights, deep-dives, and guides on how we build fast, secure browser-only tools.
        </p>
      </div>

      {/* Native Ad - Blog Header High Impression Spot */}
      <NativeBanner />

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse text-sm">
          Loading articles...
        </div>
      ) : selectedPost ? (
        <div className="bg-[#0c0a21] border border-zinc-800 rounded-3xl p-6 md:p-10 space-y-8 max-w-4xl mx-auto relative shadow-sm">
          
          {/* Dynamic Structured Schema for SEO crawlers */}
          {selectedPost.structuredData && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(selectedPost.structuredData) }}
            />
          )}

          <button 
            onClick={() => {
              setSelectedPost(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 mb-4 group transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Articles
          </button>

          {selectedPost.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-auto object-cover max-h-96" />
            </div>
          )}
          
          <div className="space-y-4">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold uppercase tracking-wide">
              {selectedPost.category}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {selectedPost.title}
            </h2>
            
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400 border-b border-zinc-800 pb-4">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedPost.author || "Cybro Team"}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}</span>
            </div>
          </div>

          {/* Premium styled markdown contents */}
          <div className="prose prose-invert max-w-none pt-2">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight leading-snug">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 border-b border-zinc-800/80 pb-2 tracking-tight">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg md:text-xl font-bold text-white mt-6 mb-3 tracking-tight">{children}</h3>,
                p: ({ children }) => <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-5">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-5 text-sm md:text-base text-zinc-300">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-5 text-sm md:text-base text-zinc-300">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 py-1.5 my-5 italic text-zinc-300 bg-purple-500/5 rounded-r-xl">{children}</blockquote>,
                table: ({ children }) => <div className="overflow-x-auto my-6 rounded-xl border border-zinc-800"><table className="w-full text-left border-collapse text-xs md:text-sm">{children}</table></div>,
                thead: ({ children }) => <thead className="bg-zinc-800/50 text-zinc-300 font-bold border-b border-zinc-800">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y divide-zinc-800/50">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-zinc-800/30 transition-colors">{children}</tr>,
                th: ({ children }) => <th className="p-3.5 font-semibold text-white">{children}</th>,
                td: ({ children }) => <td className="p-3.5 text-zinc-300 font-medium">{children}</td>,
                a: ({ href, children }) => <Link href={href || "#"} className="text-purple-400 hover:underline font-bold inline-flex items-center gap-0.5">{children}</Link>,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
              }}
            >
              {selectedPost.content}
            </ReactMarkdown>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pb-6 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 flex items-center mr-2">Share:</span>
            <button
              onClick={async () => {
                const url = window.location.href;
                const title = selectedPost.title;
                if (navigator.share) {
                  try {
                    await navigator.share({ title, url });
                  } catch (err) {
                    if (err.name !== 'AbortError') {
                      await navigator.clipboard.writeText(url);
                    }
                  }
                } else {
                  await navigator.clipboard.writeText(url);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              Copy Link
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 p-6 rounded-3xl border border-purple-500/10 mt-8 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-500" /> Key Takeaway
            </h4>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              Browser-only tooling avoids server roundtrips, saves bandwidth, protects your files, and enables offline-first operation.
            </p>
          </div>

          {/* Related Blog Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Related Articles
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <div
                    key={rp.id}
                    className="bg-[#0a081e] border border-zinc-800 rounded-2xl p-4 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      setSelectedPost(rp);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {rp.coverImage && (
                      <div className="rounded-xl overflow-hidden mb-3 border border-zinc-800">
                        <img src={rp.coverImage} alt={rp.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md text-[10px] font-semibold uppercase">{rp.category}</span>
                    <h4 className="text-sm font-bold text-white mt-2 line-clamp-2 group-hover:text-purple-300 transition-colors">{rp.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{rp.excerpt}</p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rp.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rp.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Horizontal scrollable category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100 dark:border-zinc-800/50">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]"
                    : "bg-gray-100 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              No articles found in this category. More coming soon!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-[#0c0a21] border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group cursor-pointer overflow-hidden"
                  onClick={() => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {post.coverImage && (
                    <div className="rounded-2xl overflow-hidden mb-4 -mx-1 -mt-1 border border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-semibold uppercase tracking-wide">
                        {post.category}
                      </span>
                      {getCategoryIcon(post.category)}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80 mt-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1 group-hover:text-purple-400 font-bold transition-colors">
                      Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Native Ad - Blog Bottom High Impression Spot */}
      <NativeBanner />
    </div>
  );
}

