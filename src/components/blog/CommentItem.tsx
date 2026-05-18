"use client";
import { ApiComment } from "@/hooks/useBlogComments";
import CommentAvatar from "./CommentAvatar";
import ReplyForm from "./ReplyForm";
import ReplyItem from "./ReplyItem";
import { formatDate } from "@/lib/date";

interface CommentItemProps {
  comment: ApiComment;
  index: number;
  total: number;
  isLiked: boolean;
  isOwner: boolean;
  hasToken: boolean;
  currentCustomer: { email?: string } | null;
  replyingTo: string | null;
  replyForm: { name: string; email: string; comment: string };
  replySubmitting: boolean;
  expandedReplies: Set<string>;
  replies: ApiComment[];
  editingCommentId: string | null;
  editText: string;
  editSubmitting: boolean;
  onLike: () => void;
  onReplyToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReplySubmit: (e: React.FormEvent) => void;
  onCancelReply: () => void;
  onReplyChange: (form: {
    name: string;
    email: string;
    comment: string;
  }) => void;
  onToggleReplies: () => void;
  onUpdateSubmit: (commentId: string, e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onReplyEdit: (reply: ApiComment) => void;
  onReplyDelete: (replyId: string) => void;
}

const CommentItem = ({
  comment,
  index,
  total,
  isLiked,
  isOwner,
  hasToken,
  currentCustomer,
  replyingTo,
  replyForm,
  replySubmitting,
  expandedReplies,
  replies,
  editingCommentId,
  editText,
  editSubmitting,
  onLike,
  onReplyToggle,
  onEdit,
  onDelete,
  onReplySubmit,
  onCancelReply,
  onReplyChange,
  onToggleReplies,
  onUpdateSubmit,
  onCancelEdit,
  onEditTextChange,
  onReplyEdit,
  onReplyDelete,
}: CommentItemProps) => {
  const isEditing = editingCommentId === comment._id;
  const showReplyForm = replyingTo === comment._id;
  const showReplies = expandedReplies.has(comment._id);

  return (
    <article className="group relative">
      <div className="flex gap-4">
        <CommentAvatar name={comment.name} avatar={comment.avatar} size="md" />
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
            {isEditing ? (
              <form
                onSubmit={(e) => onUpdateSubmit(comment._id, e)}
                className="space-y-2"
              >
                <textarea
                  value={editText}
                  onChange={(e) => onEditTextChange(e.target.value)}
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
                    onClick={onCancelEdit}
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

          <div className="flex items-center gap-4 mt-2 ml-2">
            <button
              onClick={onLike}
              className={`text-sm transition-colors duration-200 flex items-center gap-1.5 group/like ${
                isLiked
                  ? "text-pink-600 font-medium"
                  : "text-gray-600 hover:text-pink-600"
              }`}
            >
              <svg
                className={`w-4 h-4 group-hover/like:scale-110 transition-transform duration-200 ${
                  isLiked ? "fill-pink-600" : ""
                }`}
                fill={isLiked ? "currentColor" : "none"}
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

            {hasToken && (
              <button
                onClick={onReplyToggle}
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

            {isOwner && (
              <>
                <button
                  onClick={onEdit}
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
                  onClick={onDelete}
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
              onClick={onToggleReplies}
              className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              {showReplies ? "Hide Replies" : "View Replies"}
            </button>
          </div>

          {showReplyForm && (
            <ReplyForm
              replyToName={comment.name}
              hasToken={hasToken}
              replyForm={replyForm}
              replySubmitting={replySubmitting}
              onSubmit={onReplySubmit}
              onCancel={onCancelReply}
              onChange={onReplyChange}
            />
          )}

          {showReplies && replies.length > 0 && (
            <div className="mt-4 ml-2 space-y-3">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  isEditing={editingCommentId === reply._id}
                  isOwner={
                    !!currentCustomer?.email &&
                    reply.email === currentCustomer.email
                  }
                  editText={editText}
                  editSubmitting={editSubmitting}
                  onEdit={() => onReplyEdit(reply)}
                  onDelete={() => onReplyDelete(reply._id)}
                  onUpdateSubmit={(e) => onUpdateSubmit(reply._id, e)}
                  onCancelEdit={onCancelEdit}
                  onEditTextChange={onEditTextChange}
                />
              ))}
            </div>
          )}

          {showReplies && replies.length === 0 && (
            <div className="mt-4 ml-2 text-sm text-gray-600">
              No replies yet.
            </div>
          )}
        </div>
      </div>

      {index < total - 1 && <div className="mt-6 border-b border-gray-200" />}
    </article>
  );
};

export default CommentItem;
