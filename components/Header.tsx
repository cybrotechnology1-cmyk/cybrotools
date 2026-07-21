"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  X,
  Send,
  Loader2
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  limit
} from "@/lib/firebase";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentQuery = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(currentQuery);
  const [showNotifications, setShowNotifications] = useState(false);

  // Authentication states
  const { user, loading, isAdmin, loginWithGoogle, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Real-time Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [adminAlerts, setAdminAlerts] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("read_notification_ids");
      if (stored) {
        const timer = setTimeout(() => {
          setReadIds(JSON.parse(stored));
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Failed to parse read notification IDs", e);
    }
  }, []);

  // Listen to standard push announcements
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          title: data.title || "",
          message: data.message || "",
          category: data.category || "announcement",
          link: data.link || "",
          createdAt: data.createdAt,
        });
      });
      setNotifications(list);
    }, (error) => {
      console.error("Firestore announcements listen error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Listen to feedback entries if current user is admin
  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => {
        setAdminAlerts([]);
      }, 0);
      return () => clearTimeout(timer);
    }
    const q = query(
      collection(db, "feedback"),
      orderBy("createdAt", "desc"),
      limit(15)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alerts: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === "pending") {
          alerts.push({
            id: `feedback-${docSnap.id}`,
            title: `New Ticket: ${data.category === 'bug' ? '🐛 Bug' : data.category === 'feature' ? '💡 Feature' : '💬 feedback'}`,
            message: `${data.userName}: "${data.text?.substring(0, 50)}${data.text?.length > 50 ? '...' : ''}"`,
            category: "feedback",
            link: "/admin",
            createdAt: data.createdAt,
            isAdminAlert: true
          });
        }
      });
      setAdminAlerts(alerts);
    }, (error) => {
      console.error("Firestore feedback admin listen error:", error);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  // Combine notifications
  const allNotifications = [...adminAlerts, ...notifications].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  // Calculate unread count
  const unreadCount = allNotifications.filter(
    (item) => !readIds.includes(item.id)
  ).length;

  const handleNotificationClick = (item: any) => {
    if (!readIds.includes(item.id)) {
      const newRead = [...readIds, item.id];
      setReadIds(newRead);
      try {
        localStorage.setItem("read_notification_ids", JSON.stringify(newRead));
      } catch (e) {
        console.error("Failed to save read notification IDs", e);
      }
    }
    setShowNotifications(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAllAsRead = () => {
    const allIds = allNotifications.map((item) => item.id);
    setReadIds(allIds);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(allIds));
    } catch (e) {
      console.error("Failed to save read notification IDs", e);
    }
  };

  // Feedback Modal states
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("bug");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Keep search input in sync with URL search params
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchValue(currentQuery);
    }, 0);
    return () => clearTimeout(handle);
  }, [currentQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    
    // Smooth navigation update without scroll-to-top
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await addDoc(collection(db, "feedback"), {
        userId: user?.uid || "anonymous",
        userEmail: user?.email || "anonymous",
        userName: user?.displayName || "Anonymous User",
        category: feedbackCategory,
        text: feedbackText.trim(),
        createdAt: serverTimestamp(),
        status: "pending"
      });
      
      setSubmitSuccess(true);
      setFeedbackText("");
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFeedbackOpen(false);
      }, 4000);
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setSubmitError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-150 dark:border-[#151426] bg-[#f8f9fc]/80 dark:bg-[#080712]/90 backdrop-blur-md sticky top-0 z-30 w-full transition-all">
        {/* Spacer to align or mobile branding offset */}
        <div className="md:hidden w-12" />

        {/* Interactive Search Bar */}
        <div className="flex-1 max-w-lg mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 dark:text-[#525166] group-focus-within:text-purple-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search any tool you need..."
            className="w-full py-2 pl-11 pr-4 rounded-xl text-sm bg-[#eef0f6] dark:bg-[#121124] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#525166] border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-4 relative">
          
          {/* User Feedback Trigger Button */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="p-2.5 rounded-xl bg-[#eef0f6] hover:bg-[#e2e5ee] dark:bg-[#121124] dark:hover:bg-[#1b1937] border border-gray-200 dark:border-[#1f1d3c] text-gray-600 dark:text-[#8e8ca3] hover:text-purple-500 dark:hover:text-purple-400 transition-all hover:scale-105 active:scale-95 shrink-0"
            aria-label="Submit feedback"
          >
            <MessageSquare className="w-4.5 h-4.5" />
          </button>

          {/* Bell / Notification Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
              className="p-2.5 rounded-xl bg-[#eef0f6] hover:bg-[#e2e5ee] dark:bg-[#121124] dark:hover:bg-[#1b1937] border border-gray-200 dark:border-[#1f1d3c] text-gray-600 dark:text-[#8e8ca3] hover:text-purple-500 dark:hover:text-purple-400 transition-all hover:scale-105 active:scale-95 relative animate-in fade-in"
              aria-label="View notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {mounted && unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Modal */}
            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-2xl shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1f1a4e] pb-2">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {allNotifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 dark:text-[#8e8ca3] text-[10px] font-medium">
                    No new alerts or notifications.
                  </div>
                ) : (
                  <ul className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {allNotifications.map((item) => {
                      const isUnread = !readIds.includes(item.id);
                      
                      // Choose matching icon based on category
                      let iconBg = "bg-purple-500/10 text-purple-500";
                      let icon = <Sparkles className="w-3.5 h-3.5" />;
                      
                      if (item.category === "security") {
                        iconBg = "bg-red-500/10 text-red-500";
                        icon = <ShieldCheck className="w-3.5 h-3.5" />;
                      } else if (item.category === "alert" || item.category === "bug") {
                        iconBg = "bg-amber-500/10 text-amber-500";
                        icon = <X className="w-3.5 h-3.5" />;
                      } else if (item.category === "update" || item.category === "feature") {
                        iconBg = "bg-blue-500/10 text-blue-500";
                        icon = <CheckCircle2 className="w-3.5 h-3.5" />;
                      } else if (item.isAdminAlert) {
                        iconBg = "bg-amber-500/10 text-amber-500 animate-pulse";
                        icon = <MessageSquare className="w-3.5 h-3.5" />;
                      }

                      return (
                        <li 
                          key={item.id} 
                          onClick={() => handleNotificationClick(item)}
                          className={`flex gap-2.5 p-2 rounded-xl transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent ${
                            isUnread 
                              ? "bg-purple-500/5 dark:bg-purple-500/5 border-l-2 border-l-purple-500 dark:border-l-purple-500" 
                              : "opacity-80"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                            {icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-[11px] font-bold text-gray-800 dark:text-white truncate">
                              {item.title}
                            </h5>
                            <p className="text-[10px] text-gray-500 dark:text-[#8e8ca3] line-clamp-2 leading-tight">
                              {item.message}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Authentication & User Dropdown Section */}
          {!mounted || loading ? (
            <div className="w-9 h-9 flex items-center justify-center text-purple-500">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 focus:outline-none"
              >
                <div className="relative group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-300 dark:border-purple-500/30 group-hover:border-purple-500 transition-all">
                    {user.photoURL ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User profile"}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.displayName?.[0] || user.email?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4ade80] rounded-full border-2 border-[#f8f9fc] dark:border-[#080712] shadow-sm animate-pulse" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-2xl shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                  <div className="border-b border-gray-100 dark:border-[#1f1a4e] pb-3">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user.displayName || "Anonymous User"}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-[#8e8ca3] truncate mt-0.5">
                      {user.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Developer Admin
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    {/* Feedback mobile link */}
                    <li className="sm:hidden">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setIsFeedbackOpen(true);
                        }}
                        className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-purple-600 dark:text-purple-400 font-medium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Submit Feedback
                      </button>
                    </li>

                    {isAdmin && (
                      <li>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/admin");
                          }}
                          className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/20 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Developer Admin Panel
                        </button>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          await logout();
                          router.push("/");
                        }}
                        className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#080712] hover:bg-[#121124] text-white font-bold text-xs border border-purple-500/30 hover:border-purple-500 transition-all shadow-md hover:shadow-purple-500/10"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-400" />
              Sign In
            </button>
          )}

        </div>
      </header>

      {/* Elegant Feedback Modal Overlay */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-[#ffffff] dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl shadow-2xl p-6 overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  Submit Feedback / Issue
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-[#8e8ca3]">
                  Have an issue or idea? Let us know so we can fix it!
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFeedbackOpen(false);
                  setSubmitSuccess(false);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-[#8e8ca3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="text-center space-y-2 max-w-xs">
                  <h4 className="text-lg font-extrabold text-gray-900 dark:text-white">Thank You!</h4>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                    Your valuable feedback has been received with great appreciation.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    We are deeply grateful to you for helping us improve CybroTools.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* User info note */}
                {!user && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] leading-relaxed font-semibold">
                    ⚠️ You are submitting anonymously. Sign in with Google to tie this feedback to your account for direct support!
                  </div>
                )}

                {/* Category selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "bug", label: "Bug / Issue" },
                      { id: "feature", label: "Feature Idea" },
                      { id: "other", label: "Other" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFeedbackCategory(cat.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          feedbackCategory === cat.id
                            ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/10"
                            : "bg-[#f8f9fc] dark:bg-[#121124] text-gray-600 dark:text-[#8e8ca3] border-gray-200 dark:border-[#1f1d3c] hover:bg-gray-50 dark:hover:bg-[#1b1937]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Feedback Details
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    placeholder="Describe the bug you found, what tool it happened in, or a feature you want..."
                    className="w-full p-3 rounded-xl text-xs bg-[#f8f9fc] dark:bg-[#121124] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#525166] border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none shadow-inner"
                  />
                </div>

                {submitError && (
                  <p className="text-[11px] font-semibold text-red-500">
                    {submitError}
                  </p>
                )}

                {/* Submit button */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackOpen(false)}
                    className="py-2 px-4 rounded-xl bg-gray-100 dark:bg-[#121124] text-gray-700 dark:text-[#8e8ca3] font-bold text-xs border border-gray-200 dark:border-[#1f1d3c] hover:bg-gray-200 dark:hover:bg-[#1b1937] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !feedbackText.trim()}
                    className="flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
