import { blogSocials } from "@/data";
import Image from "next/image";

interface Props {
  canonicalPostUrl: string;
  encodedPostUrl: string;
}
const BlogDetailSocialSection = ({
  canonicalPostUrl,
  encodedPostUrl,
}: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-gray-900">Share:</span>
          <div className="flex items-center gap-3">
            {blogSocials.map((social) => (
              <a
                key={social.id}
                href={
                  social.icon === "fa-facebook-f"
                    ? `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl}`
                    : social.icon === "fa-twitter"
                      ? `https://twitter.com/intent/tweet?url=${encodedPostUrl}`
                      : social.icon === "fa-linkedin"
                        ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedPostUrl}`
                        : canonicalPostUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share this post on ${social.label}`}
                className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-md`}
              >
                <i className={`fa-brands ${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Image
            width={15}
            height={15}
            src="/assets/img/comments.png"
            alt="Comments"
          />
          <span className="font-medium">Comments</span>
        </div>
      </div>
    </div>
  );
};
export default BlogDetailSocialSection;
