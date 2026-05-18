"use client";
import Link from "next/link";

interface ReplyFormProps {
  replyToName: string;
  hasToken: boolean;
  replyForm: { name: string; email: string; comment: string };
  replySubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (form: { name: string; email: string; comment: string }) => void;
}

const ReplyForm = ({
  replyToName,
  hasToken,
  replyForm,
  replySubmitting,
  onSubmit,
  onCancel,
  onChange,
}: ReplyFormProps) => {
  return (
    <div className="mt-4 ml-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h5 className="text-sm font-semibold text-gray-900 mb-3">
        Reply to {replyToName}
      </h5>
      {!hasToken ? (
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
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={replyForm.name}
            onChange={
              hasToken
                ? undefined
                : (e) => onChange({ ...replyForm, name: e.target.value })
            }
            readOnly={hasToken}
            disabled={replySubmitting || hasToken}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            minLength={2}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={replyForm.email}
            onChange={
              hasToken
                ? undefined
                : (e) => onChange({ ...replyForm, email: e.target.value })
            }
            readOnly={hasToken}
            disabled={replySubmitting || hasToken}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
          <textarea
            placeholder="Your reply..."
            value={replyForm.comment}
            onChange={(e) =>
              onChange({ ...replyForm, comment: e.target.value })
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
              onClick={onCancel}
              disabled={replySubmitting}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReplyForm;
