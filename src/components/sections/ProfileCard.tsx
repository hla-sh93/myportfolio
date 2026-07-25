import { Link } from "@/i18n/navigation";
import { Dribbble, Linkedin, Mail, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const socials = [
  {
    icon: Dribbble,
    href: "https://dribbble.com/hla-shindeah",
    label: "Dribbble",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/hla-shindeah/",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:hla.shindeah@gmail.com", label: "Email" },
] as const;

/* Drake-style identity card: the fixed left panel that anchors the home page.
   No photo asset exists — the identity panel is typographic (wordmark on the
   blueprint grid), which also matches the brand-cover language. */
export function ProfileCard() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const year = new Date().getFullYear();

  return (
    <aside className="card-line card-line-static relative p-7 md:p-8 xl:p-6 2xl:p-8">
      {/* No header wordmark here: the navbar, the hero heading and the panel
          below already carry the name, and a fourth repeat in one viewport
          reads as a stutter. */}

      {/* Identity panel — typographic portrait window */}
      <div className="relative mb-7 overflow-hidden rounded-[22px] border border-border bg-surface xl:mb-5 2xl:mb-7">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
        <div
          className="glow-accent absolute -top-16 start-1/2 h-56 w-[130%] -translate-x-1/2 rtl:translate-x-1/2"
          aria-hidden
        />
        <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-3 xl:aspect-auto xl:h-[clamp(150px,24vh,260px)]">
          <span className="font-display text-[5rem] font-black leading-none text-text-primary md:text-[5.75rem] xl:text-[clamp(3rem,7vh,5.5rem)]">
            {isAr ? "حلا" : "Hla"}
            <span className="text-accent">.</span>
          </span>
          <span className="rounded-full border border-border-strong bg-surface-acrylic px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
            {t("hero.available")}
          </span>
        </div>
      </div>

      {/* Name + contact. A <p>, not an <h1> — the hero heading beside it is
          the page's only H1, and two of them confuses search engines. */}
      <div className="mb-7 text-center xl:mb-5 2xl:mb-7">
        <p className="mb-1 font-display text-2xl font-bold text-text-primary">
          {t("hero.name")}
        </p>
        <p className="mb-3 text-xs font-medium leading-relaxed text-text-secondary">
          {t("hero.title")}
        </p>
        <a
          href="mailto:hla.shindeah@gmail.com"
          dir="ltr"
          className="block font-mono text-sm text-text-secondary transition-colors hover:text-accent"
        >
          hla.shindeah@gmail.com
        </a>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-text-secondary">
          <MapPin size={14} className="text-accent" aria-hidden />
          {t("home.profile.location")}
        </p>
      </div>

      {/* Socials */}
      <ul className="mb-7 flex items-center justify-center gap-2.5 xl:mb-5 2xl:mb-7">
        {socials.map(({ icon: Icon, href, label }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="icon-ring"
            >
              <Icon size={19} />
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href="/contact" className="btn-pill w-full">
        <Mail size={16} aria-hidden />
        {t("home.profile.hireMe")}
      </Link>

      <p className="mt-5 text-center text-xs text-text-tertiary xl:mt-4">
        &copy; {year}
      </p>
    </aside>
  );
}
