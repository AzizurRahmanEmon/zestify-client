import ProductCard from "./ProductCard";

import type { ProductDataType } from "@/types";

type Props = {
  products: ProductDataType[];
};

const RelatedProductSection = ({ products }: Props) => {
  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12 xl:mt-20">
        {products.slice(0, 4).map((product) => (
          <li key={product._id || product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedProductSection;
