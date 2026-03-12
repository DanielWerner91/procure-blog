"use client"

import * as React from "react"
import { motion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

interface AnimatedShinyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  gradientColors?: string
  gradientAnimationDuration?: number
  className?: string
  textClassName?: string
}

const AnimatedShinyText = React.forwardRef<HTMLDivElement, AnimatedShinyTextProps>(
  (
    {
      text,
      gradientColors = "linear-gradient(90deg, #000, #0000fe, #000)",
      gradientAnimationDuration = 2,
      className,
      textClassName,
      ...props
    },
    ref
  ) => {
    const textVariants: Variants = {
      initial: {
        backgroundPosition: "0 0",
      },
      animate: {
        backgroundPosition: "100% 0",
        transition: {
          duration: gradientAnimationDuration,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      >
        <motion.span
          className={cn("leading-normal", textClassName)}
          style={{
            background: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          {text}
        </motion.span>
      </div>
    )
  }
)

AnimatedShinyText.displayName = "AnimatedShinyText"

export { AnimatedShinyText }
