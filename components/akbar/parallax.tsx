"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useCalmMotion } from "@/lib/calm-motion";

/**
 * Фотография, которая движется медленнее страницы: рамка стоит, снимок в ней
 * смещается на `depth` процентов своей высоты за время прохода через экран.
 * Снимок на столько же выше рамки — края никогда не открываются.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  depth = 14,
  priority,
  className = "",
  imageClassName = "object-cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  depth?: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const calm = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  // Сдвиг считается от высоты самого снимка, а запас — от рамки: пересчитываем,
  // чтобы на крайних точках снимок вставал ровно в край.
  const shift = depth / 2 / (1 + depth / 100);
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`]);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={calm ? { top: 0, bottom: 0 } : { y, top: `-${depth / 2}%`, bottom: `-${depth / 2}%` }}
        className="absolute inset-x-0"
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imageClassName} />
      </motion.div>
    </div>
  );
}
