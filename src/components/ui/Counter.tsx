"use client";

import { formatNumber } from "@/lib/format";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

/**
 * A figure that counts up when it scrolls into view.
 *
 * It is rendered with its real value: it used to start at 0, so crawlers and
 * anyone without JavaScript read "0+ years". A figure already on screen when
 * the page loads stays as it is; only one scrolled to later plays the count.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(value, { stiffness: 50, damping: 20, mass: 1 });
  const display = useTransform(spring, (current) =>
    formatNumber(Math.round(current), locale)
  );
  const armed = useRef(false);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    const onScreen = !!rect && rect.top < window.innerHeight && rect.bottom > 0;
    armed.current = !onScreen;
  }, []);

  useEffect(() => {
    if (!inView || !armed.current) return;
    spring.jump(0);
    spring.set(value);
  }, [inView, spring, value]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
