"use client";
import { ApiComment } from "@/hooks/useBlogComments";
import CommentAvatar from "./CommentAvatar";
import { formatDate } from "@/lib/date";

interface ReplyItemProps {
  reply: ApiComment;
  isEditing: boolean;
  isOwner: boolean;
  editText: string;
  editSubmitting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
}

const ReplyItem = ({
  reply,
  isEditing,
  isOwner,
  editText,
  editSubmitting,
  onEdit,
  onDelete,
  onUpdateSubmit,
  onCancelEdit,
  onEditTextChange,
}: ReplyItemProps) => {
  return (
    <div className="flex gap-3 bg-gray-50 rounded-xl p-3">
      <CommentAvatar name={reply.name} avatar={reply.avatar} size="sm" />
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
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={onUpdateSubmit} className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
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
                onClick={onCancelEdit}
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
  );
};

export default ReplyItem;
