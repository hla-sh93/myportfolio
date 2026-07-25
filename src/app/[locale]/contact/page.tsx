import { ContactForm } from "@/components/features/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Globe, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");
  const isArabic = locale === "ar";

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: t("info.email"),
      value: "hla.shindeah@gmail.com",
      href: "mailto:hla.shindeah@gmail.com",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: t("info.location"),
      value: isArabic ? "اللاذقية، سوريا" : "Lattakia, Syria",
      href: null,
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "LinkedIn",
      value: "hla-shindeah",
      href: "https://www.linkedin.com/in/hla-shindeah/",
    },
  ];

  return (
    <>
      <PageHeader
        label={t("subtitle")}
        title={t("title")}
        description={t("description")}
        backdrop="HELLO"
      />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12">
          {/* Contact channels — editorial index rows */}
          <div className="lg:col-span-4">
            <ul>
              {contactInfo.map((info, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-5 border-b border-border py-6 first:border-t"
                >
                  <span className="icon-ring !h-12 !w-12 shrink-0 !text-accent">
                    {info.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-tertiary">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block truncate text-lg font-semibold text-text-primary transition-colors hover:text-accent"
                        dir="ltr"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-text-primary">
                        {info.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form — Drake line panel */}
          <div className="lg:col-span-8">
            <div className="card-line card-line-static p-8 md:p-12">
              <h2 className="title-display mb-10 font-display text-2xl md:text-3xl">
                {t("form.send")}
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
