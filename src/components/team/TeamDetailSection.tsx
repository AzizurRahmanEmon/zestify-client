// components/team/TeamDetailSection.tsx
import Image from "next/image";
import type { Chef } from "@/services/chefs";
import Link from "next/link";

const SOCIAL_META: Record<string, { icon: string; bg: string }> = {
  linkedin: { icon: "fa-brands fa-linkedin-in", bg: "bg-[#0077B5]" },
  facebook: { icon: "fa-brands fa-facebook-f", bg: "bg-[#1877F2]" },
  twitter:  { icon: "fa-brands fa-twitter",     bg: "bg-[#1DA1F2]" },
};

const TeamDetailSection = ({ chef }: { chef: Chef }) => {
  const socials = (
    [
      chef.socialLinks?.linkedin && { key: "linkedin", label: "LinkedIn",  href: chef.socialLinks.linkedin },
      chef.socialLinks?.facebook && { key: "facebook", label: "Facebook",  href: chef.socialLinks.facebook },
      chef.socialLinks?.twitter  && { key: "twitter",  label: "Twitter",   href: chef.socialLinks.twitter  },
    ] as ({ key: string; label: string; href: string } | false)[]
  ).filter(Boolean) as { key: string; label: string; href: string }[];

  const statsRow = [
    { icon: "fa-solid fa-calendar-days", label: "Experience",  value: "10+ Years"         },
    { icon: "fa-solid fa-utensils",      label: "Specialty",  value: chef.specialty      },
    { icon: "fa-solid fa-bowl-food",     label: "Focus",      value: "Fine Dining"        },
    { icon: "fa-solid fa-star",          label: "Philosophy", value: "Flavor. Art. Passion." },
  ];

  return (
    <section className="py-20 lg:py-30"   
        style={{
          backgroundImage: `url(/assets/img/hex-shapes.png)`,
        }}>
      <div className="ar-container">

        {/* ── Main card ── */}
        <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">

            {/* ── Left: portrait ── */}
            <div className="relative min-h-[480px] lg:min-h-0">
              <Image
                src={chef.imgSrc}
                alt={chef.altText || chef.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
              {/* subtle gradient at bottom for mobile overlap */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
            </div>

            {/* ── Right: info ── */}
            <div className="px-8 py-10 lg:px-12 lg:py-12 flex flex-col gap-6">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start border border-zPink/40 text-zPink rounded-full px-4 py-1.5">
                <i className="fa-solid fa-utensils text-base" />
                <span className="text-xs font-bold tracking-[0.18em] uppercase">
                  {chef.label || "Chef Profile"}
                </span>
              </div>

              {/* Name */}
              <div>
                <h1 className="font-serif text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.06] tracking-tight">
                  {chef.name}
                </h1>
                {/* Ornamental divider */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex-1 h-px bg-zPink/30" />
                  <i className="fa-solid fa-star text-zPink text-lg" />
                  <span className="flex-1 h-px bg-zPink/30" />
                </div>
              </div>

              {/* Title / role */}
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-zPink block" />
                <span className="text-zPink font-semibold text-lg italic">{chef.title}</span>
                <span className="h-px w-7 bg-zPink block" />
              </div>

              {/* Specialty */}
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <i className="fa-solid fa-utensils text-xl text-zPink/70" />
                <span>{chef.specialty}</span>
              </div>

              {/* Bio */}
              <p className="text-stone-500 text-[15px] leading-relaxed max-w-prose">
                With years of experience in fine dining and a passion for authentic
                flavors, {chef.name} brings refined expertise in{" "}
                {chef.specialty.toLowerCase()} to every plate — blending classical
                technique with Zestify&apos;s signature warmth and hospitality.
              </p>

              {/* Divider */}
              <div className="h-px bg-stone-100" />

              {/* Socials + View Profile */}
              <div className="flex flex-wrap items-center justify-between gap-5">
                {socials.length > 0 && (
                  <div className="flex items-end gap-5">
                    {socials.map((s) => {
                      const meta = SOCIAL_META[s.key];
                      return (
                        <Link
                          key={s.key}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 group"
                        >
                          <span
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl ${meta.bg} shadow-md group-hover:scale-110 transition-transform duration-200`}
                          >
                            <i className={`ti ${meta.icon}`} />
                          </span>
                          <span className="text-[11px] text-stone-400 group-hover:text-zPink transition-colors">
                            {s.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                <Link
                  href={`/chef/${chef.profileLink}`}
                  className="inline-flex items-center gap-2.5 border border-zPink/50 text-stone-700 hover:bg-zPink hover:text-white hover:border-zPink rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200"
                >
                  <i className="fa-solid fa-user text-base" />
                  View Profile
                </Link>
              </div>

            </div>
          </div>

          {/* ── Bottom stats strip ── */}
          <div className="border-t border-stone-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-100">
            {statsRow.map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5">
                <i className={`${icon} text-2xl text-zPink/60 shrink-0`} />
                <div>
                  <p className="text-[11px] text-stone-400 font-medium uppercase tracking-widest">
                    {label}
                  </p>
                  <p className="text-stone-800 font-bold text-[15px] leading-snug mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TeamDetailSection;