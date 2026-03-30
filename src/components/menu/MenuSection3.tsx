import ProductCard from "@/components/shop/ProductCard";
import type { ProductDataType } from "@/types";

interface Props {
  products?: ProductDataType[];
  businessHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
}

const MenuSection3 = ({ products, businessHours }: Props) => {
  const openingTimes =
    businessHours && businessHours.length
      ? businessHours.map((d, i) => ({
          id: i + 1,
          day: d.day,
          time: d.isClosed ? "Closed" : `${d.open} to ${d.close}`,
          isOpen: !d.isClosed,
        }))
      : [
          { id: 1, day: "Mon", time: "18:00 to 23:00", isOpen: true },
          { id: 2, day: "Tue", time: "17:00 to 24:00", isOpen: true },
          { id: 3, day: "Wed", time: "13:00 to 23:00", isOpen: true },
          { id: 4, day: "Thu", time: "16:00 to 24:00", isOpen: true },
          { id: 5, day: "Fri", time: "14:00 to 22:00", isOpen: true },
          { id: 6, day: "Sat - Sun", time: "Closed", isOpen: false },
        ];
  return (
    <section className="bg-linear-to-br from-gray-50 to-white py-20 lg:py-30 overflow-hidden">
      <div className="ar-container">
        {/* Header - Enhanced but keeping original structure */}
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <span className="block w-15.25 h-0.75 bg-zPink"></span>
            <h6 className="ar-subtitle">What We Offer</h6>
          </div>
          <h3 className="ar-title text-center mt-3">Fast Food Menus</h3>
        </div>

        {/* Menu Grid - Keeping original layout structure */}
        <div>
          <ul className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:w-full md:grid-cols-2 sm:w-8/12 sm:mx-auto gap-8 mt-10 lg:mt-15">
            {(products || []).slice(0, 4).map((product: any, index: number) => (
              <li key={product.id || index}>
                <ProductCard product={product} />
              </li>
            ))}

            {/* Opening Times - Enhanced but keeping original structure */}
            <li className="md:col-span-2 col-span-1">
              <div className="xl:px-20 xl:py-12 lg:px-16 lg:py-10 px-5 py-8 bg-linear-to-br from-gray-900 via-gray-800 to-black bg-cover rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3 lg:mb-4 xl:mb-6">
                    <i className="fa-regular fa-clock text-3xl text-white"></i>
                    <h5 className="xl:text-4xl lg:text-3xl text-2xl text-white font-bold">
                      Opening Times
                    </h5>
                  </div>
                  <div className="w-32 h-1 bg-linear-to-r from-rose-500 to-orange-500 mx-auto rounded-full mb-8"></div>
                  <ul className="xl:mt-12 mt-10 flex flex-col gap-5">
                    {openingTimes.map((item, index) => (
                      <li
                        key={item.id || index}
                        className={`flex items-center justify-between font-medium lg:text-lg xl:text-xl gap-8 text-white ${
                          !item.isOpen ? "opacity-70" : ""
                        }`}
                      >
                        <h6 className="whitespace-nowrap">{item.day}</h6>
                        {item.isOpen && (
                          <span className="w-full h-px bg-linear-to-r from-white/30 to-white/10 block"></span>
                        )}
                        <h6
                          className={`whitespace-nowrap ${
                            !item.isOpen ? "text-red-400" : ""
                          }`}
                        >
                          {item.time}
                        </h6>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            {(products || []).slice(4, 6).map((product: any, index: number) => (
              <li key={product.id || index}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MenuSection3;
