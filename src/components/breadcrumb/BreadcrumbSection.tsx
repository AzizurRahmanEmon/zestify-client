import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string; // fa-solid class, e.g. "fa-solid fa-house"
}

interface Props {
  title: string;
  items?: BreadcrumbItem[];
}

const BreadcrumbSection = ({ title, items }: Props) => {
  const breadcrumbs: BreadcrumbItem[] =
    items && items.length > 0
      ? items
      : [{ label: "Home", href: "/", icon: "fa-solid fa-house" }, { label: title }];

  return (
    <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.05]"
        style={{ backgroundImage: `url(/assets/img/breadcrumb-bg.png)` }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/60 to-black/40" />

      <div className="relative z-10 ar-container py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-serif tracking-tight leading-[1.1]">
            {title}
          </h1>

          {/* Separator */}
          <div className="flex items-center justify-center gap-3 mt-5 mb-8">
            <span className="h-px w-12 bg-white/30" />
            <i className="fa-solid fa-utensils text-zPink text-sm" />
            <span className="h-px w-12 bg-white/30" />
          </div>

          {/* Breadcrumb pill */}
          <nav className="inline-flex items-center">
            <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <div key={idx} className="flex items-center gap-1 sm:gap-2">
                    {idx > 0 && (
                      <i className="fa-solid fa-chevron-right text-white/40 text-[10px]" />
                    )}
                    {isLast ? (
                      <span className="inline-flex items-center gap-2 bg-zPink text-white text-sm font-semibold px-4 py-2 rounded-full">
                        {crumb.icon && (
                          <i className={`${crumb.icon} text-xs`} />
                        )}
                        {crumb.label}
                      </span>
                    ) : crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
                      >
                        {crumb.icon && (
                          <i className={`${crumb.icon} text-xs`} />
                        )}
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-white/80 text-sm font-medium">
                        {crumb.icon && (
                          <i className={`${crumb.icon} text-xs`} />
                        )}
                        {crumb.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default BreadcrumbSection;
