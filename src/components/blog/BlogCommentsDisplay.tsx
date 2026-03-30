"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";

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
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load comments");
      }
      const data = Array.isArray(json?.data) ? (json.data as ApiComment[]) : [];
      setComments(data);
      setRepliesByCommentId({});
      setExpandedReplies(new Set());
      setReplyingTo(null);
      setReplyForm({ name: "", email: "", comment: "" });
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
      const res = await fetch(url, { cache: "no-store" });
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
        const res = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(
            blogId,
          )}/comments/${encodeURIComponent(commentId)}/like`,
          { method: "PATCH", cache: "no-store" },
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
        const res = await fetch(
          `${API_URL}/blogs/${encodeURIComponent(blogId)}/comments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        setReplyForm({ name: "", email: "", comment: "" });
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
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.comment}
                  </p>
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
                    <form
                      onSubmit={(e) => handleReplySubmit(comment._id, e)}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Your name"
                        value={replyForm.name}
                        onChange={(e) =>
                          setReplyForm({ ...replyForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        minLength={2}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Your email"
                        value={replyForm.email}
                        onChange={(e) =>
                          setReplyForm({ ...replyForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
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
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900">
                                {reply.name}
                              </span>
                              <time className="text-xs text-gray-500">
                                {formatDate(reply.createdAt)}
                              </time>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {reply.comment}
                            </p>
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
    </div>
  );
};

export default BlogCommentsDisplay;
