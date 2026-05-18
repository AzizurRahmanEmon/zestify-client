"use client";

interface CommentsHeaderProps {
  count: number;
  sortBy: "newest" | "oldest" | "likes";
  onSortChange: (sort: "newest" | "oldest" | "likes") => void;
}

const CommentsHeader = ({
  count,
  sortBy,
  onSortChange,
}: CommentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Comments ({count})</h3>
        <p className="text-sm text-gray-600 mt-1">Join the conversation</p>
      </div>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as "newest" | "oldest" | "likes")
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
  );
};

export default CommentsHeader;
