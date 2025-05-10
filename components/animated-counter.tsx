"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  delay?: number
  formatter?: (value: number) => string
}

export function AnimatedCounter({
  from,
  to,
  duration = 2000,
  delay = 0,
  formatter = (value) => `${Math.floor(value)}`,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const startTime = useRef<number | null>(null)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime.current) startTime.current = timestamp
        const progress = timestamp - startTime.current
        const percentage = Math.min(progress / duration, 1)
        const value = from + (to - from) * easeOutQuart(percentage)

        setCount(value)

        if (percentage < 1) {
          animationFrameId.current = requestAnimationFrame(animate)
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [from, to, duration, delay, isInView])

  // Easing function for smoother animation
  function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4)
  }

  return (
    <span ref={ref} aria-live="polite" aria-atomic="true">
      {formatter(count)}
    </span>
  )
}
