import Link from "next/link";

interface Props {
  title: string;
}

const BreadcrumbSection = ({ title }: Props) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.1]"
        style={{
          backgroundImage: `url(/assets/img/breadcrumb-bg.png)`,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-transparent" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 ar-container py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-5 xl:mb-8">
            <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-gray-100 to-gray-300 mb-4 tracking-tight leading-tight">
              {title}
            </h1>

            <div className="relative flex justify-center">
              <div className="h-1 w-24 bg-linear-to-r from-transparent via-white to-transparent rounded-full" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 w-12 bg-linear-to-r from-orange-400 to-red-400 rounded-full animate-pulse" />
            </div>
          </div>

          <p className="text-gray-200 max-w-2xl 2xl:text-lg mx-auto leading-relaxed mb-12 font-light">
            Cras ac porttitor est, non tempor justo. Aliquam at gravida ante,
            vitae suscipit nisi. Sed turpis lectus tellus bibendum viverra.
          </p>

          <nav className="flex items-center justify-center gap-3 font-medium">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Link
                href="/"
                className="text-white hover:text-[#FFD700] transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home Main
              </Link>

              <div className="text-white/50">
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <span className="text-[#FFD700] font-semibold">{title}</span>
            </div>
          </nav>

          <div className="absolute top-1/2 left-5 transform -translate-y-1/2 opacity-30">
            <div className="w-px h-32 bg-linear-to-b from-transparent via-white to-transparent" />
          </div>
          <div className="absolute top-1/2 right-5 transform -translate-y-1/2 opacity-30">
            <div className="w-px h-32 bg-linear-to-b from-transparent via-white to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-current"
          />
        </svg>
      </div>
    </section>
  );
};

export default BreadcrumbSection;
