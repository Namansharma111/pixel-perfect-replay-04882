/**
 * Social Waale CMS - Centralized Frontend API Client
 * Communicates with the independent Express Backend API Server.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "socialwaale_cms_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `API request failed with status ${response.status}`);
  }

  return data as T;
}

// ============================================================================
// AUTH API
// ============================================================================
export const authApi = {
  login: async (email: string, passwordPlain: string) => {
    const res = await request<{ success: boolean; token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: passwordPlain }),
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },
  verify: async (token?: string) => {
    const t = token || getStoredToken();
    if (!t) return null;
    return request<{ success: boolean; user: any }>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token: t }),
    });
  },
  me: async () => {
    return request<{ success: boolean; user: any }>("/auth/me");
  },
  logout: () => {
    removeStoredToken();
  },
  forgotPassword: async (email: string) => {
    return request<{ success: boolean; message: string; token?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  resetPassword: async (token: string, newPassword: string) => {
    return request<{ success: boolean; message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// ============================================================================
// ARTICLES API
// ============================================================================
export const articlesApi = {
  getAll: (includeUnpublished = false) =>
    request<{ success: boolean; articles: any[] }>(`/articles?includeUnpublished=${includeUnpublished}`),
  getById: (id: string) =>
    request<{ success: boolean; article: any }>(`/articles/${id}`),
  getBySlug: (slug: string) =>
    request<{ success: boolean; article: any }>(`/articles/by-slug/${slug}`),
  save: (article: any) =>
    request<{ success: boolean; article: any }>("/articles", {
      method: "POST",
      body: JSON.stringify(article),
    }),
  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/articles/${id}`, {
      method: "DELETE",
    }),
  duplicate: (id: string) =>
    request<{ success: boolean; article: any }>(`/articles/${id}/duplicate`, {
      method: "POST",
    }),
  bulk: (ids: string[], action: "publish" | "draft" | "archive" | "delete") =>
    request<{ success: boolean; message: string }>("/articles/bulk", {
      method: "POST",
      body: JSON.stringify({ ids, action }),
    }),
  categories: {
    getAll: () => request<{ success: boolean; categories: any[] }>("/articles/categories/all"),
    save: (cat: any) =>
      request<{ success: boolean; category: any }>("/articles/categories", {
        method: "POST",
        body: JSON.stringify(cat),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/articles/categories/${id}`, { method: "DELETE" }),
  },
  tags: {
    getAll: () => request<{ success: boolean; tags: any[] }>("/articles/tags/all"),
    save: (tag: any) =>
      request<{ success: boolean; tag: any }>("/articles/tags", {
        method: "POST",
        body: JSON.stringify(tag),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/articles/tags/${id}`, { method: "DELETE" }),
  },
  authors: {
    getAll: () => request<{ success: boolean; authors: any[] }>("/articles/authors/all"),
    save: (author: any) =>
      request<{ success: boolean; author: any }>("/articles/authors", {
        method: "POST",
        body: JSON.stringify(author),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/articles/authors/${id}`, { method: "DELETE" }),
  },
};

// ============================================================================
// SERVICES API
// ============================================================================
export const servicesApi = {
  getAll: (includeUnpublished = true) =>
    request<{ success: boolean; services: any[] }>(`/services?includeUnpublished=${includeUnpublished}`),
  getById: (id: string) =>
    request<{ success: boolean; service: any }>(`/services/${id}`),
  getBySlug: (slug: string) =>
    request<{ success: boolean; service: any }>(`/services/by-slug/${slug}`),
  save: (service: any) =>
    request<{ success: boolean; service: any }>("/services", {
      method: "POST",
      body: JSON.stringify(service),
    }),
  toggle: (id: string) =>
    request<{ success: boolean; service: any }>(`/services/${id}/toggle`, {
      method: "POST",
    }),
  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/services/${id}`, {
      method: "DELETE",
    }),
  reorder: (orderedIds: string[]) =>
    request<{ success: boolean; services: any[] }>("/services/reorder", {
      method: "POST",
      body: JSON.stringify({ orderedIds }),
    }),
};

// ============================================================================
// HOMEPAGE API
// ============================================================================
export const homepageApi = {
  getPublic: () =>
    request<{ success: boolean; homepage: any }>("/homepage"),
  getCms: () =>
    request<{ success: boolean; homepage: any }>("/homepage/cms"),
  saveDraft: (data: any) =>
    request<{ success: boolean; homepage: any }>("/homepage/draft", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  publish: (data: any, note?: string) =>
    request<{ success: boolean; homepage: any }>("/homepage/publish", {
      method: "POST",
      body: JSON.stringify({ data, note }),
    }),
  restoreRevision: (revisionId: string) =>
    request<{ success: boolean; homepage: any }>("/homepage/restore-revision", {
      method: "POST",
      body: JSON.stringify({ revisionId }),
    }),
};

// ============================================================================
// DOWNLOADER API
// ============================================================================
export const downloaderApi = {
  resolve: (url: string, toolType = "video") =>
    request<{ success: boolean; data: any }>("/downloader/resolve", {
      method: "POST",
      body: JSON.stringify({ url, toolType }),
    }),
  getPages: (includeDrafts = true) =>
    request<{ success: boolean; pages: any[] }>(`/downloader/pages?includeDrafts=${includeDrafts}`),
  getPageBySlug: (slug: string) =>
    request<{ success: boolean; page: any }>(`/downloader/pages/${slug}`),
  savePage: (page: any) =>
    request<{ success: boolean; page: any }>("/downloader/pages", {
      method: "POST",
      body: JSON.stringify(page),
    }),
  saveDraft: (id: string, draftData: any) =>
    request<{ success: boolean; page: any }>(`/downloader/pages/${id}/draft`, {
      method: "POST",
      body: JSON.stringify(draftData),
    }),
  publish: (id: string, updates: any, note?: string) =>
    request<{ success: boolean; page: any }>(`/downloader/pages/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ updates, note }),
    }),
  restoreRevision: (id: string, revisionId: string) =>
    request<{ success: boolean; page: any }>(`/downloader/pages/${id}/restore`, {
      method: "POST",
      body: JSON.stringify({ revisionId }),
    }),
  toggleStatus: (id: string) =>
    request<{ success: boolean; page: any }>(`/downloader/pages/${id}/toggle`, {
      method: "POST",
    }),
  deletePage: (id: string) =>
    request<{ success: boolean }>(`/downloader/pages/${id}`, {
      method: "DELETE",
    }),
  getSettings: () =>
    request<{ success: boolean; settings: any }>("/downloader/settings"),
  saveSettings: (settings: any) =>
    request<{ success: boolean; settings: any }>("/downloader/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    }),
  getStats: () =>
    request<{ success: boolean; stats: any }>("/downloader/stats"),
  getLogs: (limit = 100) =>
    request<{ success: boolean; logs: any[] }>(`/downloader/logs?limit=${limit}`),
  clearLogs: () =>
    request<{ success: boolean; message: string }>("/downloader/logs", {
      method: "DELETE",
    }),
};

// ============================================================================
// LEADS & CENTRALIZED FORM SUBMISSION API
// ============================================================================
export const leadsApi = {
  submit: (formData: {
    fullName?: string;
    name?: string;
    phone?: string;
    email?: string;
    service?: string;
    budget?: string;
    city?: string;
    businessName?: string;
    company?: string;
    message?: string;
    formName?: string;
    formType?: string;
    sourceUrl?: string;
    honeypot?: string;
    [key: string]: any;
  }) =>
    request<{ success: boolean; message: string; leadId?: string }>("/leads/submit", {
      method: "POST",
      body: JSON.stringify(formData),
    }),
  getAll: (filters?: { status?: string; formType?: string; search?: string; service?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.formType) params.append("formType", filters.formType);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.service) params.append("service", filters.service);
    return request<{ success: boolean; leads: any[] }>(`/leads?${params.toString()}`);
  },
  getStats: () =>
    request<{ success: boolean; stats: any }>("/leads/stats"),
  getById: (id: string) =>
    request<{ success: boolean; lead: any }>(`/leads/${id}`),
  updateStatus: (id: string, status: string) =>
    request<{ success: boolean; lead: any }>(`/leads/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  assign: (id: string, assignedTo: string) =>
    request<{ success: boolean; lead: any }>(`/leads/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify({ assignedTo }),
    }),
  addNote: (id: string, text: string) =>
    request<{ success: boolean; lead: any }>(`/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/leads/${id}`, {
      method: "DELETE",
    }),
  bulk: (ids: string[], action: "delete" | "mark_read" | "status" | "assign", value?: string) =>
    request<{ success: boolean; message: string }>("/leads/bulk", {
      method: "POST",
      body: JSON.stringify({ ids, action, value }),
    }),
};

// ============================================================================
// MEDIA API
// ============================================================================
export const mediaApi = {
  getAll: () =>
    request<{ success: boolean; media: any[] }>("/media"),
  upload: (file: File, meta?: { title?: string; alt?: string; category?: string }) => {
    const fd = new FormData();
    fd.append("file", file);
    if (meta?.title) fd.append("title", meta.title);
    if (meta?.alt) fd.append("alt", meta.alt);
    if (meta?.category) fd.append("category", meta.category);
    return request<{ success: boolean; media: any }>("/media/upload", {
      method: "POST",
      body: fd,
    });
  },
  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/media/${id}`, {
      method: "DELETE",
    }),
};

// ============================================================================
// SETTINGS & REDIRECTS API
// ============================================================================
export const settingsApi = {
  get: () =>
    request<{ success: boolean; settings: any }>("/settings"),
  save: (settings: any) =>
    request<{ success: boolean; settings: any }>("/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    }),
  redirects: {
    getAll: () =>
      request<{ success: boolean; redirects: any[] }>("/settings/redirects"),
    save: (redirect: any) =>
      request<{ success: boolean; redirect: any }>("/settings/redirects", {
        method: "POST",
        body: JSON.stringify(redirect),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/settings/redirects/${id}`, {
        method: "DELETE",
      }),
  },
};
