"use client";
import { useBlogComments } from "@/hooks/useBlogComments";
import CommentsHeader from "./CommentsHeader";
import CommentItem from "./CommentItem";
import DeleteModal from "@/components/modal/DeleteModal";

type Props = {
  blogId: string;
  refreshKey?: number;
};

const LoadingState = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
    <div className="text-center py-8 text-gray-600">Loading comments...</div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
    <div className="text-center py-8 text-gray-600">{message}</div>
  </div>
);

const EmptyState = () => (
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

const BlogCommentsDisplay = ({ blogId, refreshKey = 0 }: Props) => {
  const {
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
    handleLike,
    toggleReplies,
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
  } = useBlogComments(blogId, refreshKey);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (comments.length === 0) return <EmptyState />;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
      <CommentsHeader
        count={comments.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            index={index}
            total={comments.length}
            isLiked={likedComments.has(comment._id)}
            isOwner={isCommentOwner(comment)}
            hasToken={!!currentCustomer?.token}
            currentCustomer={currentCustomer}
            replyingTo={replyingTo}
            replyForm={replyForm}
            replySubmitting={replySubmitting}
            expandedReplies={expandedReplies}
            replies={repliesByCommentId[comment._id] || []}
            editingCommentId={editingCommentId}
            editText={editText}
            editSubmitting={editSubmitting}
            onLike={() => handleLike(comment._id)}
            onReplyToggle={() =>
              setReplyingTo(replyingTo === comment._id ? null : comment._id)
            }
            onEdit={() => handleEdit(comment)}
            onDelete={() => handleDeleteComment(comment._id)}
            onReplySubmit={(e) => handleReplySubmit(comment._id, e)}
            onCancelReply={handleCancelReply}
            onReplyChange={setReplyForm}
            onToggleReplies={() => toggleReplies(comment._id)}
            onUpdateSubmit={handleUpdateSubmit}
            onCancelEdit={handleCancelEdit}
            onEditTextChange={setEditText}
            onReplyEdit={handleEdit}
            onReplyDelete={handleDeleteComment}
          />
        ))}
      </div>
      <DeleteModal
        open={!!deleteConfirmId}
        submitting={deleteSubmitting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default BlogCommentsDisplay;
