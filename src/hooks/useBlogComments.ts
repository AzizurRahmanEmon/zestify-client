"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import { getCurrentCustomer } from "@/lib/auth";
import { toast } from "react-toastify";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

export type ApiComment = {
  _id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  avatar?: string;
  likes: number;
  parentComment?: string | null;
  createdAt: string;
  updatedAt: string;
};

type CurrentCustomer = {
  name?: string;
  email?: string;
  token?: string;
} | null;

export const useBlogComments = (blogId: string, refreshKey = 0) => {
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [repliesByCommentId, setRepliesByCommentId] = useState<
    Record<string, ApiComment[]>
  >({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes">("newest");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForm, setReplyForm] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CurrentCustomer>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    const read = () => {
      const customer = getCurrentCustomer();
      setCurrentCustomer(customer);
      if (customer) {
        setReplyForm((prev) => ({
          ...prev,
          name: customer.name || "",
          email: customer.email || "",
        }));
      }
    };
    read();
    window.addEventListener("auth:changed", read);
    return () => window.removeEventListener("auth:changed", read);
  }, []);

  const likedStorageKey = useMemo(() => `likedComments:${blogId}`, [blogId]);

  useEffect(() => {
    const raw = localStorage.getItem(likedStorageKey);
    if (raw) {
      try {
        const arr = JSON.parse(raw) as string[];
        setLikedComments(new Set(Array.isArray(arr) ? arr : []));
      } catch {
        setLikedComments(new Set());
      }
    } else {
      setLikedComments(new Set());
    }
  }, [likedStorageKey]);

  useEffect(() => {
    localStorage.setItem(likedStorageKey, JSON.stringify([...likedComments]));
  }, [likedComments, likedStorageKey]);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_URL}/blogs/${encodeURIComponent(
        blogId,
      )}/comments?page=1&limit=50&sort=${encodeURIComponent(sortBy)}`;
      const token = (getCurrentCustomer() as Record<string, unknown>)?.token;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load comments");
      }
      const data = Array.isArray(json?.data) ? (json.data as ApiComment[]) : [];
      setComments(data);
      setRepliesByCommentId({});
      setExpandedReplies(new Set());
      setReplyingTo(null);

      if (data.length > 0) {
        const allReplies: Record<string, ApiComment[]> = {};
        const expanded = new Set<string>();
        for (const comment of data) {
          try {
            const replyUrl = `${API_URL}/blogs/${encodeURIComponent(
              blogId,
            )}/comments/${encodeURIComponent(comment._id)}/replies`;
            const replyRes = await fetch(replyUrl, {
              cache: "no-store",
              headers: {
                ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });
            const replyJson = await replyRes.json().catch(() => ({}));
            const replies = Array.isArray(replyJson?.data)
              ? (replyJson.data as ApiComment[])
              : [];
            if (replies.length > 0) {
              allReplies[comment._id] = replies;
              expanded.add(comment._id);
            }
          } catch {
            // ignore per-comment errors
          }
        }
        setRepliesByCommentId(allReplies);
        setExpandedReplies(expanded);
      }
    } catch (err: unknown) {
      setComments([]);
      setRepliesByCommentId({});
      setExpandedReplies(new Set());
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [blogId, sortBy]);

  useEffect(() => {
    if (!blogId) return;
    loadComments();
  }, [blogId, refreshKey, loadComments]);

  const loadReplies = useCallback(
    async (commentId: string) => {
      const url = `${API_URL}/blogs/${encodeURIComponent(
        blogId,
      )}/comments/${encodeURIComponent(commentId)}/replies`;
      const token = (getCurrentCustomer() as Record<string, unknown>)?.token;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load replies");
      }
      const data = Array.isArray(json?.data) ? (json.data as ApiComment[]) : [];
      setRepliesByCommentId((prev) => ({ ...prev, [commentId]: data }));
      return data;
    },
    [blogId],
  );

  const toggleReplies = useCallback(
    async (commentId: string) => {
      const next = new Set(expandedReplies);
      if (next.has(commentId)) {
        next.delete(commentId);
        setExpandedReplies(next);
        return;
      }
      if (!repliesByCommentId[commentId]) {
        try {
          await loadReplies(commentId);
        } catch {
          setRepliesByCommentId((prev) => ({ ...prev, [commentId]: [] }));
        }
      }
      next.add(commentId);
      setExpandedReplies(next);
    },
    [expandedReplies, repliesByCommentId, loadReplies],
  );

  const handleLike = useCallback(
    async (commentId: string) => {
      if (likedComments.has(commentId)) return;
      try {
        const token = (getCurrentCustomer() as Record<string, unknown>)?.token;
        const res = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(
            blogId,
          )}/comments/${encodeURIComponent(commentId)}/like`,
          {
            method: "PATCH",
            cache: "no-store",
            headers: {
              ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to like comment");
        }
        const likes =
          typeof json?.data?.likes === "number" ? json.data.likes : undefined;
        setLikedComments((prev) => new Set(prev).add(commentId));
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likes: likes !== undefined ? likes : c.likes + 1,
                }
              : c,
          ),
        );
      } catch {
        return;
      }
    },
    [blogId, likedComments],
  );

  const handleReplySubmit = useCallback(
    async (commentId: string, e: React.FormEvent) => {
      e.preventDefault();
      if (replySubmitting) return;
      const payload = {
        name: replyForm.name.trim(),
        email: replyForm.email.trim(),
        comment: replyForm.comment.trim(),
        parentComment: commentId,
      };
      if (!payload.name || !payload.email || !payload.comment) {
        toast.error("Name, email, and reply are required");
        return;
      }
      if (payload.name.length < 2) {
        toast.error("Name must be at least 2 characters long");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (payload.comment.length < 10) {
        toast.error("Reply must be at least 10 characters long");
        return;
      }
      try {
        setReplySubmitting(true);
        const token = (getCurrentCustomer() as Record<string, unknown>)?.token;
        const res = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(blogId)}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
            cache: "no-store",
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          const details =
            Array.isArray(json?.errors) && json.errors.length
              ? String(json.errors.join(", "))
              : "";
          throw new Error(details || json?.message || "Failed to post reply");
        }
        await loadReplies(commentId);
        setExpandedReplies((prev) => new Set(prev).add(commentId));
        setReplyForm({
          name: currentCustomer?.name || "",
          email: currentCustomer?.email || "",
          comment: "",
        });
        setReplyingTo(null);
        toast.success("Reply posted successfully");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to post reply";
        toast.error(message);
      } finally {
        setReplySubmitting(false);
      }
    },
    [replyForm, blogId, loadReplies, replySubmitting, currentCustomer],
  );

  const handleCancelReply = useCallback(() => {
    setReplyForm({ name: "", email: "", comment: "" });
    setReplyingTo(null);
  }, []);

  const isCommentOwner = useCallback(
    (comment: ApiComment) => {
      if (!currentCustomer) return false;
      return !!currentCustomer.email && comment.email === currentCustomer.email;
    },
    [currentCustomer],
  );

  const handleEdit = useCallback((comment: ApiComment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.comment);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditText("");
  }, []);

  const handleUpdateSubmit = useCallback(
    async (commentId: string, e: React.FormEvent) => {
      e.preventDefault();
      if (editSubmitting) return;
      const trimmed = editText.trim();
      if (!trimmed) {
        toast.error("Comment cannot be empty");
        return;
      }
      if (trimmed.length < 10) {
        toast.error("Comment must be at least 10 characters long");
        return;
      }
      try {
        setEditSubmitting(true);
        const token = (getCurrentCustomer() as Record<string, unknown>)?.token;
        const res = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(
            blogId,
          )}/comments/${encodeURIComponent(commentId)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ comment: trimmed }),
            cache: "no-store",
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to update comment");
        }
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, comment: trimmed } : c,
          ),
        );
        setRepliesByCommentId((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(next)) {
            next[key] = next[key].map((r) =>
              r._id === commentId ? { ...r, comment: trimmed } : r,
            );
          }
          return next;
        });
        setEditingCommentId(null);
        setEditText("");
        toast.success("Comment updated successfully");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update comment";
        toast.error(message);
      } finally {
        setEditSubmitting(false);
      }
    },
    [editText, blogId, editSubmitting],
  );

  const handleDeleteComment = useCallback(async (commentId: string) => {
    setDeleteConfirmId(commentId);
  }, []);

  const confirmDelete = useCallback(async () => {
    const commentId = deleteConfirmId;
    if (!commentId) return;
    try {
      setDeleteSubmitting(true);
      const token = (getCurrentCustomer() as Record<string, unknown>)?.token;
      const res = await fetch(
        `${API_URL}/blogs/${encodeURIComponent(
          blogId,
        )}/comments/${encodeURIComponent(commentId)}/owner`,
        {
          method: "DELETE",
          headers: {
            ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to delete comment");
      }
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setRepliesByCommentId((prev) => {
        const next: Record<string, ApiComment[]> = {};
        for (const key of Object.keys(prev)) {
          next[key] = prev[key].filter((r) => r._id !== commentId);
        }
        return next;
      });
      setExpandedReplies((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
      setDeleteConfirmId(null);
      toast.success("Comment deleted successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete comment";
      toast.error(message);
    } finally {
      setDeleteSubmitting(false);
    }
  }, [blogId, deleteConfirmId]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmId(null);
    setDeleteSubmitting(false);
  }, []);

  return {
    comments,
    loading,
    error,
    sortBy,
    setSortBy,
    likedComments,
    expandedReplies,
    repliesByCommentId,
    replyingTo,
    replyForm,
    replySubmitting,
    currentCustomer,
    editingCommentId,
    editText,
    editSubmitting,
    deleteConfirmId,
    deleteSubmitting,
    loadComments,
    loadReplies,
    toggleReplies,
    handleLike,
    handleReplySubmit,
    handleCancelReply,
    isCommentOwner,
    handleEdit,
    handleCancelEdit,
    handleUpdateSubmit,
    handleDeleteComment,
    confirmDelete,
    cancelDelete,
    setReplyForm,
    setEditText,
    setReplyingTo,
  };
};
