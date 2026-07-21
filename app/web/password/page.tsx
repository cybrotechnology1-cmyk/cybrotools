"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, Check, ShieldAlert, ShieldCheck } from "lucide-react";
import { ToolSeoSection } from "@/components/ToolSeoSection";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Custom manual testing state
  const [testPassword, setTestPassword] = useState("");
  const [isTestingCustom, setIsTestingCustom] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("");
      return;
    }

    let newPassword = "";
    // Ensure cryptographically strong random values
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }
    setPassword(newPassword);
    setTestPassword(newPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    if (!isTestingCustom) {
      const timer = setTimeout(() => {
        generatePassword();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [generatePassword, isTestingCustom]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, powerful password strength checker logic
  const checkStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-gray-200", textColor: "text-gray-400", feedback: [] };

    let score = 0;
    const feedback: string[] = [];

    if (pass.length >= 8) score += 1;
    else feedback.push("Make it at least 8 characters long");

    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;

    if (/[A-Z]/.test(pass)) score += 1;
    else feedback.push("Add uppercase letters");

    if (/[a-z]/.test(pass)) score += 1;
    else feedback.push("Add lowercase letters");

    if (/[0-9]/.test(pass)) score += 1;
    else feedback.push("Add numbers");

    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    else feedback.push("Add symbols/special characters");

    // Normalize score to 1-5 scale
    let normalizedScore = Math.min(5, Math.ceil(score / 1.4));
    if (pass.length < 6) {
      normalizedScore = Math.min(2, normalizedScore);
    }

    const configs = [
      { score: 0, label: "None", color: "bg-gray-200", textColor: "text-gray-400" },
      { score: 1, label: "Very Weak", color: "bg-red-500", textColor: "text-red-500" },
      { score: 2, label: "Weak", color: "bg-orange-500", textColor: "text-orange-500" },
      { score: 3, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500" },
      { score: 4, label: "Strong", color: "bg-blue-500", textColor: "text-blue-500" },
      { score: 5, label: "Very Strong", color: "bg-green-500", textColor: "text-green-500" },
    ];

    return {
      ...configs[normalizedScore],
      feedback,
    };
  };

  const strength = checkStrength(testPassword);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Password Utilities</h1>
        <p className="text-gray-500 dark:text-zinc-400">Generate secure passwords or check password strength instantly in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Generator panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8">
            
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-4">
              <h3 className="font-semibold text-lg">Generate Secure Password</h3>
              <button 
                onClick={() => {
                  setIsTestingCustom(false);
                  generatePassword();
                }}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Generator
              </button>
            </div>

            {/* Password Display */}
            <div className="relative">
              <div className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 pr-24 text-xl md:text-2xl font-mono break-all min-h-[5rem] flex items-center justify-center text-center text-gray-900 dark:text-gray-100">
                {password || "Select at least one character type"}
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-2">
                <button 
                  onClick={generatePassword}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800"
                  title="Generate new password"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => copyToClipboard(password)}
                  disabled={!password}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-50"
                  title="Copy to clipboard"
                >
                  {copied && !isTestingCustom ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="font-medium text-sm">Password Length</label>
                  <span className="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">{length}</span>
                </div>
                <input 
                  type="range" 
                  min="8" 
                  max="128" 
                  value={length} 
                  onChange={(e) => {
                    setIsTestingCustom(false);
                    setLength(Number(e.target.value));
                  }}
                  className="w-full accent-gray-900 dark:accent-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeUppercase} 
                    onChange={(e) => {
                      setIsTestingCustom(false);
                      setIncludeUppercase(e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900 dark:accent-white"
                  />
                  <span className="font-medium text-sm">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeLowercase} 
                    onChange={(e) => {
                      setIsTestingCustom(false);
                      setIncludeLowercase(e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900 dark:accent-white"
                  />
                  <span className="font-medium text-sm">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeNumbers} 
                    onChange={(e) => {
                      setIsTestingCustom(false);
                      setIncludeNumbers(e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900 dark:accent-white"
                  />
                  <span className="font-medium text-sm">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={includeSymbols} 
                    onChange={(e) => {
                      setIsTestingCustom(false);
                      setIncludeSymbols(e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:focus:ring-white accent-gray-900 dark:accent-white"
                  />
                  <span className="font-medium text-sm">Symbols (!@#$...)</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Strength Meter / Tester */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-700 dark:text-zinc-300" /> Strength Checker
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Test Any Password</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Type password to test..."
                  value={testPassword}
                  onChange={(e) => {
                    setIsTestingCustom(true);
                    setTestPassword(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-mono text-sm focus:outline-none"
                />
                {testPassword && (
                  <button 
                    onClick={() => copyToClipboard(testPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg"
                  >
                    {copied && isTestingCustom ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-500">Security Level:</span>
                <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
              </div>
              
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div 
                    key={index} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      testPassword && index <= (strength.score || 0)
                        ? strength.color 
                        : "bg-gray-100 dark:bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Improvement Feedback */}
            {testPassword && strength.feedback.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Recommendations
                </p>
                <ul className="space-y-1.5">
                  {strength.feedback.map((tip, idx) => (
                    <li key={idx} className="text-xs text-gray-500 dark:text-zinc-400 flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {testPassword && strength.feedback.length === 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl text-green-600 dark:text-green-400 text-xs font-medium">
                Excellent! This password is highly secure and meets all criteria.
              </div>
            )}
          </div>
        </div>

      </div>
      <ToolSeoSection toolId="password" />
    </div>
  );
}