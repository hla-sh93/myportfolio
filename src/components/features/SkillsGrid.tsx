"use client";

import { motion } from "framer-motion";
import { Heart, Languages, Monitor, Palette } from "lucide-react";
import { useTranslations } from "next-intl";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

export function SkillsGrid() {
  const t = useTranslations("about.skills");

  // Every skill below is copied verbatim from the CV — nothing invented.
  const categories: SkillCategory[] = [
    {
      title: t("design"),
      icon: <Palette className="h-7 w-7" />,
      skills: [
        "Figma",
        "Adobe XD",
        "Photoshop",
        "Illustrator",
        "After Effects",
        "Premiere Pro",
      ],
    },
    {
      title: t("frontend"),
      icon: <Monitor className="h-7 w-7" />,
      skills: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Bootstrap",
        "MUI",
        "React",
        "Next.js",
      ],
    },
    {
      title: t("soft"),
      icon: <Heart className="h-7 w-7" />,
      skills: [
        t("softSkills.leadership"),
        t("softSkills.strategic"),
        t("softSkills.problemSolving"),
        t("softSkills.communication"),
        t("softSkills.creativeVision"),
        t("softSkills.commitment"),
        t("softSkills.adaptability"),
      ],
    },
    {
      title: t("languages"),
      icon: <Languages className="h-7 w-7" />,
      skills: [t("arabicNative"), t("englishProficient")],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.97, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      {categories.map((category, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <div className="card-line relative h-full p-8 md:p-10">
            <span className="absolute end-8 top-8 text-accent md:end-10 md:top-9">
              {category.icon}
            </span>

            <h3 className="pe-12 font-display text-xl font-bold text-text-primary md:text-2xl">
              {category.title}
            </h3>

            <div className="mt-6 flex flex-wrap gap-2">
              {category.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
