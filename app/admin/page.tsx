'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { 
  db, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp,
} from '@/lib/firebase';
import { 
  ShieldCheck, 
  ShieldAlert,
  Loader2, 
  CheckCircle, 
  Clock, 
  Trash2, 
  MessageSquare, 
  Filter, 
  AlertCircle,
  RefreshCw,
  Users,
  FileText,
  Plus,
  Edit,
  ArrowLeft,
  X,
  Eye,
  Check,
  Bell,
  Send,
  TrendingUp,
  Globe,
  Award,
  AlertTriangle,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FeedbackItem {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: string;
  text: string;
  createdAt: any; // Firestore Timestamp
  status: 'pending' | 'resolved';
}

interface UserItem {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastLogin: any; // Firestore Timestamp
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  date?: string;
}

const availableCategories = [
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  
  // API Authentication Token for Blog requests
  const [token, setToken] = useState<string>('');
  
  // Active Tab: 'feedback' | 'blogs' | 'users' | 'notifications' | 'seo'
  const [activeTab, setActiveTab] = useState<'feedback' | 'blogs' | 'users' | 'notifications' | 'seo'>('blogs');

  // Feedback State
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // SEO Audit State
  const [seoResults, setSeoResults] = useState<any | null>(null);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoError, setSeoError] = useState('');
  const [seoSearch, setSeoSearch] = useState('');
  const [seoFilter, setSeoFilter] = useState<'all' | 'passed' | 'failed' | 'errors'>('all');
  const [expandedSeoPages, setExpandedSeoPages] = useState<Record<string, boolean>>({});

  // Registered Users State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // Blogs State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState('');

  // Push Notifications State
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');

  // Push Notification Dispatch State
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyCategory, setNotifyCategory] = useState('announcement');
  const [notifyLink, setNotifyLink] = useState('');
  const [isNotifySubmitting, setIsNotifySubmitting] = useState(false);

  // Blog Editor Form State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogCategory, setBlogCategory] = useState(availableCategories[0]);
  const [blogAuthor, setBlogAuthor] = useState('Cybro Engineering Team');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogContent, setBlogContent] = useState('');
  const [isBlogSubmitting, setIsBlogSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [actioningId, setActioningId] = useState<string | null>(null);

  // Fetch admin session token on login
  useEffect(() => {
    if (isAdmin && user?.email) {
      fetch(`/api/admin/token?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            setToken(data.token);
          }
        })
        .catch(err => console.error('Error fetching API token:', err));
    }
  }, [isAdmin, user]);

  // Load Feedback
  const fetchFeedback = async () => {
    if (!isAdmin) return;
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: FeedbackItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          userId: data.userId || 'anonymous',
          userEmail: data.userEmail || 'anonymous',
          userName: data.userName || 'Anonymous User',
          category: data.category || 'other',
          text: data.text || '',
          createdAt: data.createdAt,
          status: data.status || 'pending',
        } as FeedbackItem);
      });
      setFeedback(items);
    } catch (err: any) {
      console.error('Error fetching feedback:', err);
      setFeedbackError('Could not fetch feedback entries. Check Firestore rules.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Load Registered Users
  const fetchUsers = async () => {
    if (!isAdmin) return;
    setUsersLoading(true);
    setUsersError('');
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const items: UserItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          uid: docSnap.id,
          email: data.email || 'N/A',
          displayName: data.displayName || 'Anonymous User',
          photoURL: data.photoURL || '',
          lastLogin: data.lastLogin,
        });
      });
      setUsersList(items);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setUsersError('Could not fetch registered users list. Check Firestore rules.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Load Dispatched Notifications
  const fetchNotifications = async () => {
    if (!isAdmin) return;
    setNotificationsLoading(true);
    setNotificationsError('');
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          message: data.message || '',
          category: data.category || 'announcement',
          link: data.link || '',
          createdAt: data.createdAt,
        });
      });
      setNotificationsList(items);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setNotificationsError('Could not fetch push notifications list.');
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Load Blog Posts
  const fetchBlogs = async () => {
    setBlogsLoading(true);
    setBlogsError('');
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
      setBlogsError('Failed to fetch blog posts.');
    } finally {
      setBlogsLoading(false);
    }
  };

  // Action: Run SEO Audit
  const runSeoAudit = async () => {
    setSeoLoading(true);
    setSeoError('');
    try {
      const res = await fetch('/api/admin/seo-audit');
      if (!res.ok) {
        throw new Error('Failed to run server-side SEO scan.');
      }
      const data = await res.json();
      setSeoResults(data);
    } catch (err: any) {
      console.error('Error running SEO audit:', err);
      setSeoError(err.message || 'An unexpected error occurred during the SEO scan.');
    } finally {
      setSeoLoading(false);
    }
  };

  const togglePageExpansion = (path: string) => {
    setExpandedSeoPages(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Synchronize tabs loading
  useEffect(() => {
    if (!isAdmin) return;

    const timer = setTimeout(() => {
      if (activeTab === 'feedback') {
        fetchFeedback();
      } else if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'blogs') {
        fetchBlogs();
      } else if (activeTab === 'notifications') {
        fetchNotifications();
      } else if (activeTab === 'seo' && !seoResults) {
        runSeoAudit();
      }
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, activeTab]);

  // Action: Update Feedback Status
  const handleUpdateFeedbackStatus = async (id: string, currentStatus: 'pending' | 'resolved') => {
    setActioningId(id);
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      const docRef = doc(db, 'feedback', id);
      await updateDoc(docRef, { status: newStatus });
      setFeedback((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update feedback status.');
    } finally {
      setActioningId(null);
    }
  };

  // Action: Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback entry permanently?')) return;
    setActioningId(id);
    try {
      const docRef = doc(db, 'feedback', id);
      await deleteDoc(docRef);
      setFeedback((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback entry.');
    } finally {
      setActioningId(null);
    }
  };

  // Open Blog Create Form
  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogCategory(availableCategories[0]);
    setBlogAuthor('Cybro Engineering Team');
    setBlogReadTime('5 min read');
    setBlogContent('');
    setFormError('');
    setIsBlogModalOpen(true);
  };

  // Open Blog Edit Form
  const handleOpenEditBlog = (post: BlogPost) => {
    setEditingBlog(post);
    setBlogTitle(post.title);
    setBlogExcerpt(post.excerpt);
    setBlogCategory(post.category);
    setBlogAuthor(post.author || 'Cybro Engineering Team');
    setBlogReadTime(post.readTime || '5 min read');
    setBlogContent(post.content);
    setFormError('');
    setIsBlogModalOpen(true);
  };

  // Submit Blog Form
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogExcerpt.trim() || !blogContent.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsBlogSubmitting(true);
    setFormError('');

    try {
      const payload = {
        title: blogTitle.trim(),
        excerpt: blogExcerpt.trim(),
        category: blogCategory,
        author: blogAuthor.trim(),
        readTime: blogReadTime.trim(),
        content: blogContent.trim(),
      };

      const url = '/api/admin/blog';
      const method = editingBlog ? 'PUT' : 'POST';
      const finalPayload = editingBlog ? { ...payload, id: editingBlog.id } : payload;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(finalPayload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to submit blog post');
      }

      setIsBlogModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error('Blog submission error:', err);
      setFormError(err.message || 'An error occurred while saving the post.');
    } finally {
      setIsBlogSubmitting(false);
    }
  };

  // Action: Delete Blog Post
  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post permanently?')) return;
    setActioningId(id);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((post) => post.id !== id));
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to delete blog post.');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('An error occurred while deleting the post.');
    } finally {
      setActioningId(null);
    }
  };

  // Submit Push Notification Dispatch
  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyTitle.trim() || !notifyMessage.trim()) {
      alert('Please fill in required fields.');
      return;
    }
    setIsNotifySubmitting(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        title: notifyTitle.trim(),
        message: notifyMessage.trim(),
        category: notifyCategory,
        link: notifyLink.trim(),
        createdAt: serverTimestamp(),
      });
      setNotifyTitle('');
      setNotifyMessage('');
      setNotifyLink('');
      fetchNotifications();
    } catch (err) {
      console.error('Error dispatching notification:', err);
      alert('Failed to dispatch notification.');
    } finally {
      setIsNotifySubmitting(false);
    }
  };

  // Delete Dispatched Notification
  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification permanently?')) return;
    setActioningId(id);
    try {
      await deleteDoc(doc(db, 'notifications', id));
      setNotificationsList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification.');
    } finally {
      setActioningId(null);
    }
  };

  // Safe Date Formatter helper
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }
    return 'Recently';
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500 dark:text-[#8e8ca3]">Verifying developer credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] max-w-2xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20 shadow-xl shadow-red-500/5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          Developer Restricted Access
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#8e8ca3] leading-relaxed mb-6 max-w-md">
          This portal is reserved strictly for the owner and developer of Cybro Tools. 
          Standard accounts do not have developer-level clearance.
        </p>
        <div className="p-4 rounded-2xl bg-[#0c0a21] border border-[#1f1a4e] text-[#8e8ca3] text-xs text-left w-full space-y-2 mb-8">
          <p className="font-semibold text-white">Your Current Account details:</p>
          <p className="font-mono">Email: {user?.email || 'Not logged in'}</p>
          <p className="font-mono">Status: Standard User</p>
          <p className="text-[11px] text-purple-400 mt-2 font-semibold">
            💡 Switch to the developer account (mdiismaiofficial101@gmail.com) to gain full portal access.
          </p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const totalFeedback = feedback.length;
  const pendingFeedback = feedback.filter((f) => f.status === 'pending').length;
  const resolvedFeedback = feedback.filter((f) => f.status === 'resolved').length;

  const filteredFeedback = feedback.filter((item) => {
    if (feedbackFilter === 'all') return true;
    return item.status === feedbackFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Title / Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1.5">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Dev Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Cybro Tools System Hub
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#8e8ca3] mt-1">
            Manage system services, create and publish blog posts, audit registered profiles, and review user-submitted tickets.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#eef0f6] dark:bg-[#121124] hover:bg-[#e2e5ee] dark:hover:bg-[#1b1937] border border-gray-200 dark:border-[#1f1d3c] text-gray-700 dark:text-[#8e8ca3] font-bold text-xs transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard Home
        </Link>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100/80 dark:bg-[#121124] rounded-2xl max-w-2xl border border-gray-200 dark:border-[#1f1d3c]">
        <button
          onClick={() => setActiveTab('blogs')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'blogs'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-[#8e8ca3] hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Blog Articles
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-[#8e8ca3] hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Registered Users
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-[#8e8ca3] hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          Push Notifications
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'feedback'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-[#8e8ca3] hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Feedbacks
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'seo'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-[#8e8ca3] hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          SEO Audit
        </button>
      </div>

      {/* Tab Panel: BLOG MANAGER */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] p-5 rounded-2xl shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Blog Publications Suite</h2>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] mt-0.5">Publish articles, updates, and educational guides directly onto the client-side blog reader.</p>
            </div>
            <button
              onClick={handleOpenCreateBlog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Write Article
            </button>
          </div>

          {blogsLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="text-xs font-semibold text-gray-500 dark:text-[#8e8ca3]">Loading blog catalog...</span>
            </div>
          ) : blogsError ? (
            <div className="py-12 px-6 rounded-3xl border border-red-500/20 bg-red-500/5 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-red-600">Error Fetching Blogs</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-md mx-auto">{blogsError}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-20 rounded-3xl border border-dashed border-gray-200 dark:border-[#1f1a4e] bg-white dark:bg-[#0c0a21]/50 text-center space-y-3">
              <FileText className="w-8 h-8 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Articles Yet</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-xs mx-auto">Get started by creating your very first article now.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {blogs.map((post) => (
                <div key={post.id} className="p-6 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border border-purple-500/20">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">ID: {post.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 leading-tight">{post.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-[#8e8ca3] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex gap-4 text-[10px] text-gray-400 font-medium">
                      <span>👤 {post.author || "Unknown"}</span>
                      <span>⏱️ {post.readTime || "3 min read"}</span>
                      {post.date && <span>📅 {post.date}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                    <button
                      onClick={() => handleOpenEditBlog(post)}
                      className="flex-1 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Article
                    </button>
                    <button
                      onClick={() => handleDeleteBlogPost(post.id)}
                      disabled={actioningId === post.id}
                      className="py-2 px-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-xs transition-all flex items-center justify-center"
                    >
                      {actioningId === post.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Panel: PUSH NOTIFICATIONS CENTER */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications Dispatcher</h2>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] mt-0.5">Send a system-wide announcement, update notification, or security alert directly to all online visitors.</p>
            </div>
            <button
              onClick={fetchNotifications}
              disabled={notificationsLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#eef0f6] dark:bg-[#121124] hover:bg-[#e2e5ee] dark:hover:bg-[#1b1937] border border-gray-200 dark:border-[#1f1d3c] text-gray-700 dark:text-[#8e8ca3] font-bold text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-55"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${notificationsLoading ? 'animate-spin' : ''}`} />
              Reload Catalog ({notificationsList.length})
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left side: Dispatch Form */}
            <div className="md:col-span-1 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500 animate-bounce" />
                Dispatch New Notification
              </h3>
              
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Notification Title *</label>
                  <input
                    type="text"
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    required
                    placeholder="e.g. Server Upgrade Completed"
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Target Category *</label>
                  <select
                    value={notifyCategory}
                    onChange={(e) => setNotifyCategory(e.target.value)}
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  >
                    <option value="announcement">📢 Announcement</option>
                    <option value="update">🚀 Feature Update</option>
                    <option value="security">🔒 Security Warning</option>
                    <option value="alert">⚠️ Critical Alert</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Redirect Link (Optional)</label>
                  <input
                    type="text"
                    value={notifyLink}
                    onChange={(e) => setNotifyLink(e.target.value)}
                    placeholder="e.g. /blog or /ai/bg-remover"
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Notification Message *</label>
                  <textarea
                    rows={4}
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    required
                    placeholder="Write details of the push notification..."
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isNotifySubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isNotifySubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isNotifySubmitting ? 'Dispatching...' : 'Dispatch Announcement'}
                </button>
              </form>
            </div>

            {/* Right side: Dispatched list */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                History of Dispatched Alerts
              </h3>

              {notificationsLoading ? (
                <div className="py-16 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  <span className="text-xs text-gray-500 dark:text-[#8e8ca3]">Fetching alerts catalog...</span>
                </div>
              ) : notificationsError ? (
                <div className="p-8 border border-red-500/20 bg-red-500/5 text-center rounded-3xl space-y-2">
                  <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                  <p className="text-xs font-semibold text-red-600">{notificationsError}</p>
                </div>
              ) : notificationsList.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-gray-200 dark:border-[#1f1a4e] bg-white dark:bg-[#0c0a21]/50 rounded-3xl space-y-2">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto" />
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">No Dispatched Notifications</h4>
                  <p className="text-[11px] text-gray-400 dark:text-[#8e8ca3] max-w-xs mx-auto">Dispatched alerts will appear here for audit and deletion.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {notificationsList.map((item) => (
                    <div key={item.id} className="p-5 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-2xl flex justify-between items-start gap-4 hover:border-purple-500/20 transition-all shadow-sm">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${
                            item.category === 'security'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                              : item.category === 'alert'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : item.category === 'update'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">⏱️ {formatTimestamp(item.createdAt)}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-[#8e8ca3] leading-relaxed break-words">{item.message}</p>
                        {item.link && (
                          <p className="text-[10px] text-purple-500 font-mono truncate">🔗 Link: {item.link}</p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteNotification(item.id)}
                        disabled={actioningId === item.id}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all self-center shrink-0"
                      >
                        {actioningId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel: REGISTERED USERS HUB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] p-5 rounded-2xl shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Registered Users Hub</h2>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] mt-0.5">Real-time listing of login-registered users, logged automatically through system authentication logs.</p>
            </div>
            <button
              onClick={fetchUsers}
              disabled={usersLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#eef0f6] dark:bg-[#121124] hover:bg-[#e2e5ee] dark:hover:bg-[#1b1937] border border-gray-200 dark:border-[#1f1d3c] text-gray-700 dark:text-[#8e8ca3] font-bold text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-55"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
              Reload Users ({usersList.length})
            </button>
          </div>

          {usersLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="text-xs font-semibold text-gray-500 dark:text-[#8e8ca3]">Fetching registered profiles...</span>
            </div>
          ) : usersError ? (
            <div className="py-12 px-6 rounded-3xl border border-red-500/20 bg-red-500/5 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-red-600">Error Fetching Users</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-md mx-auto">{usersError}</p>
            </div>
          ) : usersList.length === 0 ? (
            <div className="py-20 rounded-3xl border border-dashed border-gray-200 dark:border-[#1f1a4e] bg-white dark:bg-[#0c0a21]/50 text-center space-y-3">
              <Users className="w-8 h-8 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Users Detected</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-xs mx-auto">Users will populate here as soon as they register or sign-in with Google.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-150 dark:border-zinc-850 text-xs font-bold text-gray-700 dark:text-[#8e8ca3]">
                      <th className="p-4 pl-6">Profile Icon / Avatar</th>
                      <th className="p-4">Display Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">User UID Identifier</th>
                      <th className="p-4 pr-6">Last Active Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50 text-xs font-medium">
                    {usersList.map((usr) => (
                      <tr key={usr.uid} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-200 dark:border-purple-500/20 flex items-center justify-center bg-purple-500/10">
                            {usr.photoURL ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={usr.photoURL} alt={usr.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </>
                            ) : (
                              <span className="font-extrabold text-purple-600 text-[11px]">{usr.displayName[0] || usr.email[0]}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-900 dark:text-white font-bold">{usr.displayName}</td>
                        <td className="p-4 text-purple-600 dark:text-purple-400 font-mono"><a href={`mailto:${usr.email}`} className="hover:underline">{usr.email}</a></td>
                        <td className="p-4 text-gray-400 dark:text-[#525166] font-mono select-all">{usr.uid}</td>
                        <td className="p-4 pr-6 text-gray-500 dark:text-[#8e8ca3]">{formatTimestamp(usr.lastLogin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Panel: USER FEEDBACK & ISSUES */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Tickets', value: totalFeedback, color: 'border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400', desc: 'Total complaints/ideas' },
              { label: 'Unresolved / Pending', value: pendingFeedback, color: 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400', desc: 'Need active resolution' },
              { label: 'Resolved Tickets', value: resolvedFeedback, color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400', desc: 'Addressed and completed' },
              { label: 'Feedback Categories', value: 3, color: 'border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400', desc: 'Bugs, Features & Others' },
            ].map((stat, i) => (
              <div key={i} className={`p-5 rounded-3xl border ${stat.color} space-y-1 shadow-sm`}>
                <span className="text-[10px] font-bold tracking-wide uppercase opacity-85">{stat.label}</span>
                <p className="text-2xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-[9px] opacity-75">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
              <Filter className="w-4 h-4 text-purple-500" />
              Filter Tickets:
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: `All (${totalFeedback})` },
                { id: 'pending', label: `Pending (${pendingFeedback})` },
                { id: 'resolved', label: `Resolved (${resolvedFeedback})` },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFeedbackFilter(btn.id as any)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    feedbackFilter === btn.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-[#f8f9fc] dark:bg-[#121124] text-gray-600 dark:text-[#8e8ca3] border-gray-200 dark:border-[#1f1d3c] hover:bg-gray-100 dark:hover:bg-[#1b1937]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {feedbackLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="text-xs font-semibold text-gray-500 dark:text-[#8e8ca3]">Fetching tickets...</span>
            </div>
          ) : feedbackError ? (
            <div className="py-12 px-6 rounded-3xl border border-red-500/20 bg-red-500/5 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-red-600">Error</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3]">{feedbackError}</p>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="py-16 rounded-3xl border border-dashed border-gray-200 dark:border-[#1f1a4e] bg-white dark:bg-[#0c0a21]/50 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Tickets Found</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3]">No active tickets matching the filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-6 rounded-3xl bg-white dark:bg-[#0c0a21] border transition-all shadow-sm flex flex-col md:flex-row justify-between gap-6 ${
                    item.status === 'resolved' 
                      ? 'border-gray-200 dark:border-gray-900/40 opacity-80' 
                      : 'border-purple-500/20 dark:border-purple-500/10 hover:border-purple-500/40'
                  }`}
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        item.category === 'bug'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                          : item.category === 'feature'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                      }`}>
                        {item.category === 'bug' ? '🐛 Bug' : item.category === 'feature' ? '💡 Feature' : '💬 Other'}
                      </span>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse'
                      }`}>
                        {item.status === 'resolved' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </span>

                      <span className="text-[11px] text-gray-400 dark:text-[#525166] font-medium ml-auto md:ml-0">
                        ⏱️ {formatTimestamp(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-800 dark:text-white leading-relaxed font-semibold whitespace-pre-wrap">
                      {item.text}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500 dark:text-[#8e8ca3] border-t border-gray-100 dark:border-white/5">
                      <span className="font-bold text-gray-700 dark:text-gray-300">By:</span>
                      <span className="truncate">👤 {item.userName}</span>
                      <span className="truncate">📧 <a href={`mailto:${item.userEmail}`} className="hover:underline text-purple-500">{item.userEmail}</a></span>
                      <span className="truncate">🔑 ID: {item.userId}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end items-center gap-2 md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5 pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleUpdateFeedbackStatus(item.id, item.status)}
                      disabled={actioningId === item.id}
                      className={`w-full py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        item.status === 'resolved'
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-600 hover:opacity-90 text-white shadow-md'
                      }`}
                    >
                      {actioningId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : item.status === 'resolved' ? (
                        'Mark as Pending'
                      ) : (
                        'Mark Resolved'
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      disabled={actioningId === item.id}
                      className="w-full py-2 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Panel: SEO METADATA AUDIT */}
      {activeTab === 'seo' && (
        <div className="space-y-6 animate-in fade-in duration-300 text-gray-900 dark:text-gray-100">
          <div className="bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-500" />
                SEO Metadata Audit Suite
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] mt-0.5">
                Scan all public-facing application pages to check for missing HTML title headers, meta descriptions, and OpenGraph/Twitter social cards.
              </p>
            </div>
            <button
              onClick={runSeoAudit}
              disabled={seoLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/10 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seoLoading ? 'animate-spin' : ''}`} />
              {seoLoading ? "Running SEO Scan..." : "Run Complete SEO Audit"}
            </button>
          </div>

          {seoLoading ? (
            <div className="py-20 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
              <div className="text-center space-y-1.5">
                <span className="text-sm font-bold text-gray-800 dark:text-white">Analyzing platform routes...</span>
                <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-xs">
                  Crawling page head trees, matching active metadata, and checking OpenGraph specifications.
                </p>
              </div>
              <div className="w-64 bg-gray-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 animate-pulse w-[75%]" />
              </div>
            </div>
          ) : seoError ? (
            <div className="p-8 border border-red-500/20 bg-red-500/5 text-center rounded-3xl space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-red-600">Audit Trigger Failure</h3>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-md mx-auto">{seoError}</p>
            </div>
          ) : !seoResults ? (
            <div className="py-16 text-center border border-dashed border-gray-200 dark:border-[#1f1a4e] bg-white dark:bg-[#0c0a21]/50 rounded-3xl space-y-3">
              <Globe className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Run SEO Verification Scan</h4>
              <p className="text-xs text-gray-500 dark:text-[#8e8ca3] max-w-sm mx-auto">
                Trigger a scan to run a comprehensive metadata audit across all tool pages and blogs.
              </p>
              <button
                onClick={runSeoAudit}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all hover:scale-105 cursor-pointer"
              >
                Start SEO Audit
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl border border-purple-500/10 bg-purple-500/5 space-y-1.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">SEO Health Index</span>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-extrabold tracking-tight">
                      {Math.round((seoResults.summary.passed / seoResults.summary.total) * 100)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${(seoResults.summary.passed / seoResults.summary.total) * 100}%` }} 
                    />
                  </div>
                </div>

                <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#1f1a4e] bg-white dark:bg-[#0c0a21] space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Total Scanned Routes</span>
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{seoResults.summary.total}</p>
                  <p className="text-[9px] text-gray-400">All registered public tools</p>
                </div>

                <div className="p-5 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">Optimized Pages</span>
                  <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">{seoResults.summary.passed}</p>
                  <p className="text-[9px] text-emerald-500/70">Critical tags are fully healthy</p>
                </div>

                <div className="p-5 rounded-3xl border border-amber-500/10 bg-amber-500/5 space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">Deficient Pages</span>
                  <p className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">{seoResults.summary.failed}</p>
                  <p className="text-[9px] text-amber-500/70">Missing title or description</p>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 w-full md:max-w-xs">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search paths or page names..."
                    value={seoSearch}
                    onChange={(e) => setSeoSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-gray-950 dark:text-white focus:outline-none placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: `All (${seoResults.results.length})` },
                    { id: 'passed', label: `Optimized (${seoResults.summary.passed})` },
                    { id: 'failed', label: `Deficient (${seoResults.summary.failed})` },
                    { id: 'errors', label: `Scan Errors (${seoResults.summary.errorPages})` },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setSeoFilter(btn.id as any)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        seoFilter === btn.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-gray-50 dark:bg-[#121124] text-gray-600 dark:text-[#8e8ca3] border-gray-200 dark:border-[#1f1d3c] hover:bg-gray-100 dark:hover:bg-[#1b1937]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Scanned Pages */}
              <div className="space-y-3">
                {seoResults.results
                  .filter((item: any) => {
                    const matchesSearch = item.name.toLowerCase().includes(seoSearch.toLowerCase()) || item.path.toLowerCase().includes(seoSearch.toLowerCase());
                    if (!matchesSearch) return false;
                    
                    if (seoFilter === 'passed') return item.passed && item.status === 200;
                    if (seoFilter === 'failed') return !item.passed && item.status === 200;
                    if (seoFilter === 'errors') return item.status !== 200;
                    return true;
                  })
                  .map((item: any) => {
                    const isExpanded = expandedSeoPages[item.path] || false;
                    const charTitle = item.values?.title?.length || 0;
                    const charDesc = item.values?.description?.length || 0;

                    return (
                      <div 
                        key={item.path} 
                        className={`bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-2xl overflow-hidden hover:shadow-md transition-all ${
                          item.status !== 200 
                            ? 'border-red-500/20' 
                            : !item.passed 
                            ? 'border-amber-500/20' 
                            : 'hover:border-purple-500/10'
                        }`}
                      >
                        {/* Header Row */}
                        <div 
                          onClick={() => togglePageExpansion(item.path)}
                          className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                                item.status !== 200 
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                                  : item.passed 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              }`}>
                                {item.status !== 200 
                                  ? "Offline / Unreachable" 
                                  : item.passed 
                                  ? "SEO Optimized" 
                                  : "Metadata Deficient"}
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-medium">{item.path}</p>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              item.status === 200 
                                ? 'bg-gray-50 dark:bg-zinc-900 border-gray-150 dark:border-zinc-800 text-gray-500' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                              HTTP {item.status || "FAIL"}
                            </span>

                            <button className="text-xs font-semibold text-purple-500 hover:text-purple-400 flex items-center gap-1">
                              {isExpanded ? "Hide Details" : "Show Elements"}
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details Panel */}
                        {isExpanded && (
                          <div className="p-5 bg-gray-50/50 dark:bg-[#121124]/30 border-t border-gray-150 dark:border-zinc-850/80 space-y-4 text-xs">
                            {item.status !== 200 ? (
                              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 font-medium">
                                Error connecting to page route: {item.error || "The platform router failed to fetch the page tree."}
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Grid of individual tags */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  
                                  {/* Title Check */}
                                  <div className="p-4 bg-white dark:bg-[#0c0a21] border border-gray-150 dark:border-[#1f1a4e] rounded-xl space-y-2">
                                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-1.5">
                                      <span className="font-bold text-gray-700 dark:text-gray-300">HTML &lt;title&gt;</span>
                                      <span className={`flex items-center gap-1 font-bold text-[10px] ${item.metrics.hasTitle ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {item.metrics.hasTitle ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        {item.metrics.hasTitle ? "Configured" : "Missing / Too Short"}
                                      </span>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-950 p-2 rounded border border-gray-150 dark:border-zinc-850 select-all font-mono text-[11px] leading-relaxed break-words">
                                      {item.values.title}
                                    </p>
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium pt-0.5">
                                      <span>Character Count: <strong className={charTitle > 60 || charTitle < 10 ? 'text-amber-500' : 'text-emerald-500'}>{charTitle}</strong></span>
                                      <span>Recommended: 10 - 60 chars</span>
                                    </div>
                                    {charTitle > 60 && (
                                      <p className="text-[9px] text-amber-500 flex items-center gap-1 mt-1">
                                        <AlertTriangle className="w-3 h-3" /> Title is slightly too long for standard Google Search limits.
                                      </p>
                                    )}
                                  </div>

                                  {/* Description Check */}
                                  <div className="p-4 bg-white dark:bg-[#0c0a21] border border-gray-150 dark:border-[#1f1a4e] rounded-xl space-y-2">
                                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-1.5">
                                      <span className="font-bold text-gray-700 dark:text-gray-300">Meta Description</span>
                                      <span className={`flex items-center gap-1 font-bold text-[10px] ${item.metrics.hasDescription ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {item.metrics.hasDescription ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                        {item.metrics.hasDescription ? "Configured" : "Missing / Empty"}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-350 bg-gray-50 dark:bg-zinc-950 p-2 rounded border border-gray-150 dark:border-zinc-850 select-all leading-relaxed break-words text-[11px]">
                                      {item.values.description}
                                    </p>
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium pt-0.5">
                                      <span>Character Count: <strong className={charDesc > 160 || charDesc < 50 ? 'text-amber-500' : 'text-emerald-500'}>{charDesc}</strong></span>
                                      <span>Recommended: 50 - 160 chars</span>
                                    </div>
                                    {charDesc < 50 && charDesc > 0 && (
                                      <p className="text-[9px] text-amber-500 flex items-center gap-1 mt-1">
                                        <AlertTriangle className="w-3 h-3" /> Description is short. Add more context to improve search rankings.
                                      </p>
                                    )}
                                  </div>

                                  {/* OpenGraph & Socials */}
                                  <div className="p-4 bg-white dark:bg-[#0c0a21] border border-gray-150 dark:border-[#1f1a4e] rounded-xl space-y-2.5 md:col-span-2">
                                    <h4 className="font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-zinc-850 pb-1.5 flex items-center gap-1.5">
                                      <Award className="w-4 h-4 text-purple-500" />
                                      Social Graph Configurations (OpenGraph & Twitter)
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                      {[
                                        { tag: "og:title", val: item.values.ogTitle, passed: item.metrics.hasOgTitle },
                                        { tag: "og:description", val: item.values.ogDescription, passed: item.metrics.hasOgDescription },
                                        { tag: "og:type", val: item.values.ogType, passed: item.metrics.hasOgType },
                                        { tag: "twitter:card", val: item.values.twitterCard, passed: item.metrics.hasTwitterCard },
                                      ].map((sc, scIdx) => (
                                        <div key={scIdx} className="p-2.5 bg-gray-50/50 dark:bg-zinc-950/40 rounded-lg border border-gray-100 dark:border-[#1f1a4e]/45 space-y-1">
                                          <div className="flex justify-between items-center">
                                            <span className="font-mono text-[10px] font-bold text-gray-400">{sc.tag}</span>
                                            {sc.passed ? (
                                              <span className="text-[9px] text-emerald-500 font-bold">OK</span>
                                            ) : (
                                              <span className="text-[9px] text-gray-400 font-semibold">Missing</span>
                                            )}
                                          </div>
                                          <p className="font-mono text-[10px] truncate text-gray-800 dark:text-gray-300 font-semibold">{sc.val || "Not specified"}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Elegant Modal: Blog Writer & Editor */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c0a21] border border-gray-200 dark:border-[#1f1a4e] rounded-3xl shadow-2xl p-6 overflow-hidden my-8">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  {editingBlog ? 'Edit Blog Article' : 'Create Blog Article'}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-[#8e8ca3] mt-0.5">
                  Write and publish premium articles supporting standard Markdown syntax and layout elements.
                </p>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-[#8e8ca3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Article Title *</label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    required
                    placeholder="e.g. How We Optimised Our Local AI Model Running In Browser"
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category *</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Read Time *</label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    required
                    placeholder="e.g. 4 min read"
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Author *</label>
                  <input
                    type="text"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    required
                    placeholder="e.g. Cybro Engineering Team"
                    className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Short Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  required
                  placeholder="A short summary of the article shown in lists..."
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Content (Markdown) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono">Article Markdown Content *</label>
                  <span className="text-[10px] text-purple-500 font-semibold">Supports standard Markdown syntax</span>
                </div>
                <textarea
                  rows={10}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  required
                  placeholder="Write full article here. Supports heading formatting, lists, tables, links, bold, code snippets, quotes, and more..."
                  className="w-full p-3 rounded-xl text-xs bg-gray-50 dark:bg-[#121124] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f1d3c] focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {formError && (
                <p className="text-xs font-semibold text-red-500">{formError}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-[#121124] text-gray-700 dark:text-[#8e8ca3] font-bold text-xs border border-gray-200 dark:border-[#1f1d3c] hover:bg-gray-200 dark:hover:bg-[#1b1937] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBlogSubmitting}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isBlogSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {editingBlog ? 'Save Changes' : 'Publish Article'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
