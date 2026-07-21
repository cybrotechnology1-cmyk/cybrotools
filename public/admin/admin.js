// Shared Admin JavaScript Core

// Token check & redirect on load
const token = localStorage.getItem("cybro_admin_token");
const isLoginPage = window.location.pathname.includes("login.html");

if (!token && !isLoginPage) {
  window.location.href = "/admin/login.html";
} else if (token && !isLoginPage) {
  // Verify token on the fly
  fetch("/api/admin/auth", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => {
    if (!res.ok) {
      localStorage.removeItem("cybro_admin_token");
      window.location.href = "/admin/login.html";
    }
  }).catch(() => {
    // If offline or transient network issue, proceed but log
    console.warn("Authentication check skipped due to network status.");
  });
}

// Secure API request helper
export async function adminFetch(url, options = {}) {
  const token = localStorage.getItem("cybro_admin_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem("cybro_admin_token");
    window.location.href = "/admin/login.html";
    throw new Error("Unauthorized");
  }
  return response;
}

// Dynamic Toast Notification helper
export function showToast(message, type = "success") {
  const container = document.getElementById("toast-container") || (() => {
    const el = document.createElement("div");
    el.id = "toast-container";
    el.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement("div");
  toast.className = `p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 transform translate-y-2 opacity-0 transition-all duration-300 pointer-events-auto max-w-sm ${
    type === "success" 
      ? "bg-emerald-50 dark:bg-zinc-900 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400" 
      : "bg-red-50 dark:bg-zinc-900 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-400"
  }`;

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full ${type === "success" ? "bg-emerald-500" : "bg-red-500"}"></span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Dynamic injection of standard sidebar and header
export function renderSidebar(activePage) {
  const container = document.getElementById("admin-layout-container");
  if (!container) return;

  const navItems = [
    { name: "Dashboard", icon: "layout-dashboard", href: "dashboard.html", id: "dashboard" },
    { name: "Blog Posts", icon: "book-open", href: "posts.html", id: "posts" },
    { name: "Categories", icon: "tags", href: "categories.html", id: "categories" },
    { name: "Media Library", icon: "image", href: "media.html", id: "media" },
    { name: "SEO Management", icon: "globe", href: "seo.html", id: "seo" },
    { name: "Tool Control", icon: "sliders", href: "tools.html", id: "tools" },
    { name: "Settings", icon: "settings", href: "settings.html", id: "settings" }
  ];

  const sidebarHtml = `
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-800 text-zinc-400 h-screen sticky top-0">
      <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
        <a href="/admin/dashboard.html" class="flex items-center gap-2.5 font-bold text-white tracking-tight text-lg">
          <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">C</div>
          <span>Cybro Admin</span>
        </a>
      </div>
      
      <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
        ${navItems.map(item => `
          <a href="${item.href}" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            activePage === item.id 
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 font-semibold" 
              : "hover:bg-zinc-900 hover:text-zinc-200"
          }">
            <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            <span>${item.name}</span>
          </a>
        `).join("")}
      </nav>

      <div class="p-4 border-t border-zinc-800">
        <a href="/" target="_blank" class="flex items-center gap-3 px-4 py-2 rounded-xl text-xs hover:bg-zinc-900 hover:text-zinc-200 transition-colors mb-3">
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          <span>View Public Website</span>
        </a>
        <button id="logout-btn-desktop" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-950/40 hover:text-red-400 transition-all duration-150 text-left">
          <i data-lucide="log-out" class="w-4 h-4 text-red-500"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Sidebar Drawer -->
    <div id="mobile-sidebar-drawer" class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm hidden md:hidden transition-all duration-300 opacity-0">
      <div class="w-64 bg-zinc-950 border-r border-zinc-800 h-full flex flex-col transform -translate-x-full transition-transform duration-300">
        <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
          <span class="flex items-center gap-2.5 font-bold text-white tracking-tight text-lg">
            <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">C</div>
            <span>Cybro Admin</span>
          </span>
          <button id="close-mobile-menu" class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        
        <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
          ${navItems.map(item => `
            <a href="${item.href}" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              activePage === item.id 
                ? "bg-blue-600 text-white font-semibold shadow-md" 
                : "hover:bg-zinc-900 hover:text-zinc-200"
            }">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              <span>${item.name}</span>
            </a>
          `).join("")}
        </nav>

        <div class="p-4 border-t border-zinc-800">
          <a href="/" target="_blank" class="flex items-center gap-3 px-4 py-2 rounded-xl text-xs hover:bg-zinc-900 hover:text-zinc-200 transition-colors mb-3">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            <span>View Public Website</span>
          </a>
          <button id="logout-btn-mobile" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-950/40 hover:text-red-400 transition-all duration-150 text-left">
            <i data-lucide="log-out" class="w-4 h-4 text-red-500"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Stage Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 overflow-x-hidden">
      <!-- Admin Top Navbar Header -->
      <header class="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div class="flex items-center gap-3">
          <button id="open-mobile-menu" class="p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 md:hidden">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
          <h1 class="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
            ${activePage.replace("-", " ")}
          </h1>
        </div>
        
        <div class="flex items-center gap-4">
          <a href="/" target="_blank" class="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-gray-600 dark:text-zinc-400">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            <span>Preview Site</span>
          </a>
          
          <div class="flex items-center gap-2.5 border-l border-gray-200 dark:border-zinc-800 pl-4">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-xs font-semibold text-gray-900 dark:text-white">Admin Account</p>
              <p class="text-[10px] text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Stage -->
      <main id="admin-main-stage" class="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
        <!-- Inner page html content gets loaded here -->
      </main>
    </div>
  `;

  // Inject into container
  container.innerHTML = sidebarHtml;

  // Render icons inside layout
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Bind Sidebar events
  const logoutHandler = () => {
    localStorage.removeItem("cybro_admin_token");
    window.location.href = "/admin/login.html";
  };

  document.getElementById("logout-btn-desktop")?.addEventListener("click", logoutHandler);
  document.getElementById("logout-btn-mobile")?.addEventListener("click", logoutHandler);

  // Drawer Toggle controls
  const openBtn = document.getElementById("open-mobile-menu");
  const closeBtn = document.getElementById("close-mobile-menu");
  const drawer = document.getElementById("mobile-sidebar-drawer");
  const innerDrawer = drawer?.firstElementChild;

  const showDrawer = () => {
    if (!drawer || !innerDrawer) return;
    drawer.classList.remove("hidden");
    setTimeout(() => {
      drawer.classList.remove("opacity-0");
      drawer.classList.add("opacity-100");
      innerDrawer.classList.remove("-translate-x-full");
      innerDrawer.classList.add("translate-x-0");
    }, 10);
  };

  const hideDrawer = () => {
    if (!drawer || !innerDrawer) return;
    innerDrawer.classList.remove("translate-x-0");
    innerDrawer.classList.add("-translate-x-full");
    drawer.classList.remove("opacity-100");
    drawer.classList.add("opacity-0");
    setTimeout(() => {
      drawer.classList.add("hidden");
    }, 300);
  };

  openBtn?.addEventListener("click", showDrawer);
  closeBtn?.addEventListener("click", hideDrawer);
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) hideDrawer();
  });
}
