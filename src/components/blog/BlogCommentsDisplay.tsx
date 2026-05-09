"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { getCurrentCustomer } from "@/lib/auth";
import { toast } from "react-toastify";

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.NEXT_PUBLIC_TENANT_SLUG ||
  "";

type ApiComment = {
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

type Props = {
  blogId: string;
  refreshKey?: number;
};

const BlogCommentsDisplay = ({ blogId, refreshKey = 0 }: Props) => {
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [repliesByCommentId, setRepliesByCommentId] = useState<
    Record<string, ApiComment[]>
  >({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    () => new Set(),
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes">("newest");
  const [likedComments, setLikedComments] = useState<Set<string>>(
    () => new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForm, setReplyForm] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
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

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getAvatarColor = useCallback((name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }, []);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_URL}/blogs/${encodeURIComponent(
        blogId,
      )}/comments?page=1&limit=50&sort=${encodeURIComponent(sortBy)}`;
      const token = (getCurrentCustomer() as any)?.token;
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

      // Auto-load and expand replies
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
      const token = (getCurrentCustomer() as any)?.token;
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
        const token = (getCurrentCustomer() as any)?.token;
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
              ? { ...c, likes: likes !== undefined ? likes : c.likes + 1 }
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
        const token = (getCurrentCustomer() as any)?.token;
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
    [replyForm, blogId, loadReplies, replySubmitting],
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
        const token = (getCurrentCustomer() as any)?.token;
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
      const token = (getCurrentCustomer() as any)?.token;
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <div className="text-center py-8 text-gray-600">
          Loading comments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <div className="text-center py-8 text-gray-600">{error}</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No comments yet
          </h3>
          <p className="text-gray-600">
            Be the first to share your thoughts on this post!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">Join the conversation</p>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "oldest" | "likes")
            }
            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="likes">Most Liked</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <article key={comment._id} className="group relative">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                {comment.avatar ? (
                  <Image
                    src={comment.avatar}
                    alt={`${comment.name}'s avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(
                      comment.name,
                    )} shadow-md`}
                  >
                    {getInitials(comment.name)}
                  </div>
                )}
              </div>

              {/* Comment content */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 group-hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-base">
                      {comment.name}
                    </h4>
                    <time className="text-xs text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  {editingCommentId === comment._id ? (
                    <form
                      onSubmit={(e) => handleUpdateSubmit(comment._id, e)}
                      className="space-y-2"
                    >
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none"
                        required
                        minLength={10}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={editSubmitting}
                          className="px-3 py-1.5 bg-pink-600 text-white text-xs font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                        >
                          {editSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-4 mt-2 ml-2">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`text-sm transition-colors duration-200 flex items-center gap-1.5 group/like ${
                      likedComments.has(comment._id)
                        ? "text-pink-600 font-medium"
                        : "text-gray-600 hover:text-pink-600"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 group-hover/like:scale-110 transition-transform duration-200 ${
                        likedComments.has(comment._id) ? "fill-pink-600" : ""
                      }`}
                      fill={
                        likedComments.has(comment._id) ? "currentColor" : "none"
                      }
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    {comment.likes > 0 && <span>({comment.likes})</span>}
                    Like
                  </button>

                  {currentCustomer?.token && (
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment._id ? null : comment._id,
                        )
                      }
                      className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      Reply
                    </button>
                  )}

                  {isCommentOwner(comment) && (
                    <>
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
                  >
                    {expandedReplies.has(comment._id)
                      ? "Hide Replies"
                      : "View Replies"}
                  </button>
                </div>

                {/* Reply form */}
                {replyingTo === comment._id && (
                  <div className="mt-4 ml-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">
                      Reply to {comment.name}
                    </h5>
                    {!currentCustomer?.token ? (
                      <div className="p-4 bg-gray-50 rounded-lg text-center space-y-2">
                        <p className="text-gray-700 text-sm font-medium">
                          Please log in to reply.
                        </p>
                        <Link
                          href="/login"
                          className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                        >
                          Log In
                        </Link>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => handleReplySubmit(comment._id, e)}
                        className="space-y-3"
                      >
                        <input
                          type="text"
                          placeholder="Your name"
                          value={replyForm.name}
                          onChange={(e) =>
                            currentCustomer?.token
                              ? undefined
                              : setReplyForm({
                                  ...replyForm,
                                  name: e.target.value,
                                })
                          }
                          readOnly={!!currentCustomer?.token}
                          disabled={replySubmitting || !!currentCustomer?.token}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          minLength={2}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Your email"
                          value={replyForm.email}
                          onChange={(e) =>
                            currentCustomer?.token
                              ? undefined
                              : setReplyForm({
                                  ...replyForm,
                                  email: e.target.value,
                                })
                          }
                          readOnly={!!currentCustomer?.token}
                          disabled={replySubmitting || !!currentCustomer?.token}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          required
                        />
                        <textarea
                          placeholder="Your reply..."
                          value={replyForm.comment}
                          onChange={(e) =>
                            setReplyForm({
                              ...replyForm,
                              comment: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none"
                          minLength={10}
                          required
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={replySubmitting}
                            className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                          >
                            {replySubmitting ? "Posting..." : "Post Reply"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelReply}
                            disabled={replySubmitting}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Display replies */}
                {expandedReplies.has(comment._id) &&
                  (repliesByCommentId[comment._id] || []).length > 0 && (
                    <div className="mt-4 ml-2 space-y-3">
                      {(repliesByCommentId[comment._id] || []).map((reply) => (
                        <div
                          key={reply._id}
                          className="flex gap-3 bg-gray-50 rounded-xl p-3"
                        >
                          <div className="shrink-0">
                            {reply.avatar ? (
                              <Image
                                src={reply.avatar}
                                alt={`${reply.name}'s avatar`}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover shadow-sm"
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(
                                  reply.name,
                                )} shadow-sm`}
                              >
                                {getInitials(reply.name)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-900">
                                  {reply.name}
                                </span>
                                <time className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </time>
                              </div>
                              {isCommentOwner(reply) && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEdit(reply)}
                                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(reply._id)
                                    }
                                    className="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                            {editingCommentId === reply._id ? (
                              <form
                                onSubmit={(e) =>
                                  handleUpdateSubmit(reply._id, e)
                                }
                                className="space-y-2"
                              >
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none"
                                  required
                                  minLength={10}
                                />
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    disabled={editSubmitting}
                                    className="px-3 py-1.5 bg-pink-600 text-white text-xs font-medium rounded-lg hover:bg-pink-700 transition-colors duration-200"
                                  >
                                    {editSubmitting ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {reply.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {expandedReplies.has(comment._id) &&
                  (repliesByCommentId[comment._id] || []).length === 0 && (
                    <div className="mt-4 ml-2 text-sm text-gray-600">
                      No replies yet.
                    </div>
                  )}
              </div>
            </div>

            {/* Divider */}
            {index < comments.length - 1 && (
              <div className="mt-6 border-b border-gray-200" />
            )}
          </article>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-1050 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Comment
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={deleteSubmitting}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteSubmitting}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {deleteSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCommentsDisplay;
