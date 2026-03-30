const CtaSection3 = () => {
  return (
    <section className="lg:py-30 py-20 bg-linear-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(/assets/img/hex-shapes.png)`,
          }}
        ></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-linear-to-br from-zPink/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-linear-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating particles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce opacity-70"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-3/4 w-3 h-3 bg-zPink rounded-full animate-bounce opacity-70"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-70"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      <div className="ar-container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main content */}
          <div className="mb-8 lg:mb-12">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 animate-fade-in-up">
                <div className="w-2 h-2 bg-zPink rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Ready to taste perfection?
                </span>
              </div>
            </div>

            <h2 className="ar-title text-white font-bold leading-tight pb-6 animate-fade-in-up animation-delay-200">
              Experience Our
              <span className="block bg-linear-to-r from-zPink via-pink-400 to-yellow-400 bg-clip-text text-transparent pb-1">
                Culinary Magic
              </span>
            </h2>

            <p className="lg:text-xl w-11/12 mx-auto mb-5 lg:mb-8 opacity-90 animate-fade-in-up animation-delay-400 leading-relaxed">
              Book a table today and let our talented team create an
              unforgettable
              <br className="block" />
              dining experience crafted just for you
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 animate-fade-in-up animation-delay-600 mb-12">
            <a
              href="/reservation"
              className="group w-max relative bg-linear-to-r from-zPink to-pink-600 hover:from-pink-600 hover:to-zPink px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-3 transform hover:scale-105 hover:shadow-2xl"
            >
              <span>Make a Reservation</span>
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </a>

            <a
              href="/menu"
              className="group w-max relative border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-3 backdrop-blur-sm hover:bg-white/10 transform hover:scale-105"
            >
              <span>View Our Menu</span>
              <div className="w-5 h-5 border border-white/50 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          </div>

          {/* Features/Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-max mx-auto animate-fade-in-up animation-delay-800">
            <div className="text-center">
              <div className="w-12 h-12 bg-linear-to-br from-zPink to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h4 className="font-semibold text-sm mb-1">Premium Quality</h4>
              <p className="text-xs text-gray-300">5-star rated cuisine</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-sm mb-1">Fast Service</h4>
              <p className="text-xs text-gray-300">Quick table service</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-sm mb-1">Guaranteed</h4>
              <p className="text-xs text-gray-300">100% satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection3;
