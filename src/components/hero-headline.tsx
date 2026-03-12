'use client';

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { SITE_NAME } from '@/lib/constants';

export function HeroHeadline() {
  return (
    <AnimatedShinyText
      text={SITE_NAME}
      gradientColors="linear-gradient(90deg, #000000, #0000fe, #000000)"
      gradientAnimationDuration={3}
      textClassName="text-3xl sm:text-4xl font-bold tracking-tight"
    />
  );
}
