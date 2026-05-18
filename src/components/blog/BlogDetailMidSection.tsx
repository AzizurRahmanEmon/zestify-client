import Image from "next/image";
import { BlogDataTypes } from "@/types";
import { blogFeatures } from "@/data";

interface Props {
  blog: BlogDataTypes;
}
const BlogDetailMidSection = ({ blog }: Props) => {
  return (
    <>
      {blog.content && (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 space-y-6">
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {blog.content}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <Image
              width={455}
              height={320}
              src={blog.img}
              alt={blog.title}
              className="w-full h-auto max-h-70 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-3">
            {blogFeatures.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                  <Image
                    width={12}
                    height={12}
                    src="/assets/img/checked-2.png"
                    alt="Check"
                  />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogDetailMidSection;
